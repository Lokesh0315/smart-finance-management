import React, { useEffect, useState } from "react";

const LOAN_API = "http://localhost:8086/api/loans";
const CUSTOMER_API = "http://localhost:8086/api/customers";

function LoanManagement() {
  const [loans, setLoans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerId: "",
    principalAmount: "",
    annualInterestRate: "",
    tenureMonths: "",
  });

  const [emi, setEmi] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [loanResponse, customerResponse] = await Promise.all([
        fetch(LOAN_API),
        fetch(CUSTOMER_API),
      ]);

      if (!loanResponse.ok || !customerResponse.ok) {
        throw new Error("Data load panna mudiyala.");
      }

      const loanData = await loanResponse.json();
      const customerData = await customerResponse.json();

      setLoans(loanData);
      setCustomers(customerData);
    } catch (err) {
      setError(err.message || "Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateEMI = async () => {
    if (
      !form.principalAmount ||
      !form.annualInterestRate ||
      !form.tenureMonths
    ) {
      setError("Loan amount, interest rate, tenure enter pannu.");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${LOAN_API}/calculate-emi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          principalAmount: Number(form.principalAmount),
          annualInterestRate: Number(form.annualInterestRate),
          tenureMonths: Number(form.tenureMonths),
        }),
      });

      if (!response.ok) {
        throw new Error("EMI calculation failed.");
      }

      const result = await response.json();

      setEmi(
        typeof result === "number"
          ? result
          : result.emi ?? result.monthlyEmi ?? result.EMI ?? null
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.customerId) {
      setError("Customer select pannu.");
      return;
    }

    try {
      const response = await fetch(LOAN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { id: Number(form.customerId) },
          principalAmount: Number(form.principalAmount),
          annualInterestRate: Number(form.annualInterestRate),
          tenureMonths: Number(form.tenureMonths),
          ...(emi !== null ? { emi: Number(emi) } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error("Loan create panna mudiyala. Backend endpoint check pannu.");
      }

      setForm({
        customerId: "",
        principalAmount: "",
        annualInterestRate: "",
        tenureMonths: "",
      });
      setEmi(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    setError("");

    try {
      const response = await fetch(`${LOAN_API}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Status update failed. Backend endpoint check pannu.");
      }

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const money = (value) =>
    value == null
      ? "-"
      : Number(value).toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Loan Management
          </h1>
          <p className="mt-2 text-slate-500">
            Create loans, calculate EMI and manage loan status.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-xl font-semibold text-slate-800">
            Create New Loan
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Select Customer
              </label>
              <select
                name="customerId"
                value={form.customerId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              >
                <option value="">Choose customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.fullname} {customer.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                name="principalAmount"
                value={form.principalAmount}
                onChange={handleChange}
                min="1"
                step="0.01"
                required
                placeholder="Enter amount"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                name="annualInterestRate"
                value={form.annualInterestRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                placeholder="e.g. 10.5"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tenure (Months)
              </label>
              <input
                type="number"
                name="tenureMonths"
                value={form.tenureMonths}
                onChange={handleChange}
                min="1"
                required
                placeholder="e.g. 24"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={calculateEMI}
              className="rounded-lg border border-blue-600 px-5 py-3 font-medium text-blue-600 hover:bg-blue-50"
            >
              Calculate EMI
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Create Loan
            </button>

            {emi !== null && (
              <p className="font-semibold text-green-700">
                Monthly EMI: {money(emi)}
              </p>
            )}
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Loan List
            </h2>
            
          </div>

          {loading ? (
            <p className="p-6 text-slate-500">Loading loans...</p>
          ) : loans.length === 0 ? (
            <p className="p-6 text-slate-500">No loans found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4">Loan ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Interest</th>
                    <th className="p-4">Tenure</th>
                    <th className="p-4">Monthly EMI</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Update Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id} className="border-t border-slate-100">
                      <td className="p-4 font-medium">{loan.id}</td>
                      <td className="p-4">
                        {loan.customer?.fullName ?? `{loan.customer?.fullname || "Unknown Customer" ?? "-"}`}
                      </td>
                      <td className="p-4">
                        {money(loan.principalAmount)}
                      </td>
                      <td className="p-4">
                        {loan.annualInterestRate}%
                      </td>
                      <td className="p-4">
                        {loan.tenureMonths} months
                      </td>
                      <td className="p-4">{money(loan.emi)}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {loan.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={loan.status ?? "PENDING"}
                          onChange={(e) =>
                            updateStatus(loan.id, e.target.value)
                          }
                          className="rounded-lg border border-slate-300 p-2"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoanManagement;