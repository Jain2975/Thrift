import React, { useState } from "react";
import { updateProduct } from "../../services/productServices";
import { toast } from "react-toastify";
import { X } from "lucide-react";

type EditProductModalProps = {
  product: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditProductModal({ product, onClose, onSuccess }: EditProductModalProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [category, setCategory] = useState(product.category || "");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());
      formData.append("category", category);
      if (image) {
        formData.append("image", image);
      }

      await updateProduct(product.id, formData);
      toast.success("Product updated successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800">Edit Product</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Product Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Update Image (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) setImage(e.target.files[0]) }} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition" />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-md shadow-blue-200 disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
