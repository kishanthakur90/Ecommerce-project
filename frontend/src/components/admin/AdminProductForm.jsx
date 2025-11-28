import React, { useState } from "react";
import api from "../../services/api";

const AdminProductForm = () => {
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    if (image) data.append("image", image);

    try {
      await api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Product added successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-product-form">
      <input type="text" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <textarea placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} />
      <input type="number" placeholder="Price" onChange={e => setForm({ ...form, price: e.target.value })} />
      <input type="text" placeholder="Category" onChange={e => setForm({ ...form, category: e.target.value })} />
      <input type="number" placeholder="Stock" onChange={e => setForm({ ...form, stock: e.target.value })} />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AdminProductForm;
