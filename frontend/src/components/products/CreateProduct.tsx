import { useState } from "react";
import {
  createProduct,
  ImportProductZip,
} from "../../services/productServices";

type FormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: File | null;
  zip: File | null;
  category: string;
};

const CreateProduct = () => {
  const [step, setStep] = useState<"choose" | "single" | "multiple">("choose");

  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    zip: null,
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files ? e.target.files[0] : null;

      if (name === "image") setForm({ ...form, image: file });
      if (name === "zip") setForm({ ...form, zip: file });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (!form.image) {
        setError("Image is required");
        return;
      }

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock || "0");
      formData.append("category", form.category);
      formData.append("image", form.image);

      await createProduct(formData);

      setSuccess(true);
    } catch {
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (!form.zip) {
        setError("ZIP file required");
        return;
      }

      await ImportProductZip(form.zip);

      setSuccess(true);
    } catch {
      setError("Failed to upload zip");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        {step === "choose" && (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Choose Upload Type</h2>

            <button
              onClick={() => setStep("single")}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Single Product
            </button>

            <button
              onClick={() => setStep("multiple")}
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              Multiple Products (ZIP)
            </button>
          </div>
        )}

        {step === "single" && (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-center">Single Upload</h2>

            <input
              name="name"
              placeholder="Product Name"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <input
              name="category"
              placeholder="Category"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <button className="w-full bg-blue-600 text-white p-2 rounded">
              {loading ? "Uploading..." : "Upload"}
            </button>
          </form>
        )}

        {step === "multiple" && (
          <form onSubmit={handleMultipleSubmit} className="space-y-4">
            <h1 className="text-xl font-bold text-center">
              {" "}
              Please follow the instructions to upload a ZIP file containing
              multiple products.
            </h1>
            <p className="text-lg font-bold text-center">
              {" "}
              The ZIP file should have the following structure:
            </p>
            <pre className="bg-gray-200 p-4 rounded text-sm text-center">
              products.zip ├── products.csv └── images/ ├── product1.jpg ├──
              product2.jpg └── ...
            </pre>
            <p className="text-center">
              {" "}
              The products.csv file should have the following columns: name,
              description, price, stock, image, category.
            </p>
            <p className="text-center">
              {" "}
              The image column should contain the filename of the corresponding
              product image in the images folder.
            </p>
            <h2 className="text-xl font-bold text-center">Upload ZIP</h2>

            <input
              type="file"
              name="zip"
              accept=".zip"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />

            <button className="w-full bg-green-600 text-white p-2 rounded">
              {loading ? "Uploading..." : "Upload ZIP"}
            </button>
          </form>
        )}

        {error && (
          <div className="text-red-500 mt-2">
            {" "}
            Sorry Could Not Upload Products{" "}
          </div>
        )}
        {success && <div className="text-green-500 mt-2">Success!</div>}
      </div>
    </div>
  );
};

export default CreateProduct;
