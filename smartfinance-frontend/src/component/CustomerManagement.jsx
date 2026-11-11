
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8086/api/customers";

const emptyForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
};

function CustomerManagement() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  async function fetchCustomers() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(
        "Customer data load aagala. Backend and CORS settings check pannu."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const isEditing = editingId !== null;
    const url = isEditing
      ? `${API_URL}/${editingId}`
      : API_URL;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Unable to save customer");
      }

      setForm(emptyForm);
      setEditingId(null);
      setMessage(
        isEditing
          ? "Customer updated successfully!"
          : "Customer added successfully!"
      );

      await fetchCustomers();
    } catch (err) {
      setError(
        "Customer save aagala. Backend endpoint and CORS check pannu."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(customer) {
    setForm({
      fullName: customer.fullName ?? "",
      phone: customer.phone ?? "",
      email: customer.email ?? "",
      address: customer.address ?? "",
    });

    setEditingId(customer.id);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure want to delete this customer?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete customer");
      }

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      setMessage("Customer deleted successfully!");
      await fetchCustomers();
    } catch (err) {
      setError("Customer delete aagala. Backend and CORS check pannu.");
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return [
      customer.fullName,
      customer.phone,
      customer.email,
      customer.address,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(searchText)
    );
  });

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-4 shadow-sm sm:px-8">
        <h1 className="text-xl font-bold text-emerald-700">
          SmartFinance
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          ← Dashboard
        </button>
      </nav>

      <main className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Customer module
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Customer Management
          </h2>

          <p className="mt-2 text-slate-500">
            Add, view, update and manage customer records.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700">
            {message}
          </div>
        )}

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <h3 className="text-xl font-bold text-slate-800">
            {editingId !== null ? "Edit Customer" : "Add New Customer"}
          </h3>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Address
                </label>

                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  placeholder="Enter address"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Customer"
                    : "Add Customer"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Customer List
              </h3>

             
            </div>

            
          </div>

          {loading ? (
            <p className="py-10 text-center text-slate-500">
              Loading customers...
            </p>
          ) : filteredCustomers.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              No customers found.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">Full Name</th>
                    <th className="px-4 py-4">Phone</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Address</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">{customer.id}</td>
                      <td className="px-4 py-4 font-medium text-slate-800">
                        {customer.fullName}
                      </td>
                      <td className="px-4 py-4">{customer.phone}</td>
                      <td className="px-4 py-4">{customer.email}</td>
                      <td className="max-w-xs whitespace-normal px-4 py-4">
                        {customer.address}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="rounded-lg bg-red-50 px-3 py-2 font-medium text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CustomerManagement;
