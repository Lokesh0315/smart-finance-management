
import React, { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/dashboard/summary`;
function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch dashboard data");
        }
        return response.json();
      })
      .then((data) => {
        setSummary(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const stats = summary
    ? [
        {
          title: "Total Customers",
          value: summary.totalCustomers ?? 0,
          icon: "👥",
        },
        {
          title: "Total Loans",
          value: summary.totalLoans ?? 0,
          icon: "💰",
        },
      {
  title: "Total Loan Amount",
  value: `₹${Number(
    summary.totalLoanAmount ?? 0
  ).toLocaleString("en-IN")}`,
  icon: "💵",
},
        
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-emerald-700">
          SmartFinance
        </h1>

        <button
          onClick={() => (window.location.href = "/")}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-100"
        >
          Home
        </button>
      </nav>

      <main className="mx-auto max-w-7xl p-6">
        <h2 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="mt-2 text-slate-500">
          Welcome to your Smart Finance Management System.
        </p>

        {loading && (
          <p className="mt-8 text-blue-600">
            Loading dashboard data...
          </p>
        )}

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}. Check whether your Spring Boot backend is running.
          </div>
        )}

        {!loading && !error && summary && (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">
                      {item.title}
                    </p>
                    <span className="text-2xl">{item.icon}</span>
                  </div>

                  <h3 className="mt-4 break-words text-2xl font-bold text-slate-800">
                    {item.value}
                  </h3>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800">
                Loan Overview
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm text-slate-600">
                    Approved Loans
                  </p>
                  <p className="mt-2 text-2xl font-bold text-emerald-700">
                    {summary.approvedLoans ?? 0}
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-sm text-slate-600">
                    Rejected Loans
                  </p>
                  <p className="mt-2 text-2xl font-bold text-red-700">
                    {summary.rejectedLoans ?? 0}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
  <p className="text-sm text-slate-600">
    Pending Loans
  </p>
  <p className="mt-2 text-2xl font-bold text-amber-700">
    {summary.pendingLoans ?? 0}
  </p>
</div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
