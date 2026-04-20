import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports/admin");
      setReports(res.data.reports || []);
    } catch (error) {
      toast.error("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await api.post(`/reports/admin/${id}/dismiss`);
      toast.success("Report dismissed");
      fetchReports();
    } catch (error) {
      toast.error("Failed to dismiss report");
    }
  };

  const handleSuspend = async (id: string) => {
    if (!window.confirm("Are you sure you want to suspend this product?")) return;
    try {
      await api.post(`/reports/admin/${id}/suspend`);
      toast.success("Product suspended");
      fetchReports();
    } catch (error) {
      toast.error("Failed to suspend product");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading reports...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Reports</h1>
      
      {reports.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
          <p className="text-gray-500">No reports have been submitted yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.product?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.reporter?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                    {report.reason.replace(/_/g, " ")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={report.details}>
                    {report.details || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      report.status === "REVIEWED" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {report.status === "PENDING" && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDismiss(report.id)}
                          className="text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg transition"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleSuspend(report.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                        >
                          Suspend
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
