import { useState } from "react";
import { createProduct } from "../../services/productServices";

type FormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: File | null;
  category: string;
};

const CreateProduct = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
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
      setForm({
        ...form,
        image: e.target.files ? e.target.files[0] : null,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
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

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
      });
    } catch (err) {
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Upload Product</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded">{error}</div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-2 rounded">
            Product uploaded successfully!
          </div>
        )}

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
