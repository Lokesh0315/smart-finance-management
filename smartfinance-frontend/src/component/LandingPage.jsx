
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const features = [
  {
    icon: "👥",
    title: "Customer Management",
    description:
      "Manage customer profiles, contact details and financial records in one place.",
    color: "bg-blue-50",
    path: "/customers",
  },
  {
    icon: "💳",
    title: "Loan Management",
    description:
      "Create loan records, track applications and manage approval status.",
    color: "bg-purple-50",
    path: "/loans",
  },
  {
    icon: "🧮",
    title: "EMI Calculator",
    description:
      "Calculate monthly installments and view detailed repayment schedules.",
    color: "bg-amber-50",
    path: "/loans",
  },

 
  {
    icon: "📈",
    title: "Smart Dashboard",
    description:
      "Get a clear overview of customers, loans and collected payments.",
    color: "bg-cyan-50",
    path: "/dashboard",
  },
];


function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const goToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({
      behavior: "smooth",
    });
    setMenuOpen(false);
  };
  
const [stats, setStats] = useState(null);

useEffect(() => {
  fetch("http://localhost:8086/api/dashboard/summary")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      return response.json();
    })
    .then((data) => setStats(data))
    .catch((error) => console.error(error));
}, []);


  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-xl text-white">
              ₹
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Smart Finance
              </h1>
              <p className="text-xs text-slate-500">
                Manage money smarter
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm font-medium hover:text-emerald-700">
              Home
            </a>
            <a
              href="#features"
              className="text-sm font-medium hover:text-emerald-700"
            >
              Features
            </a>
       
            <button onClick={() => navigate("/dashboard")}>
              Get Started
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xl md:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {menuOpen && (
          <div className="space-y-1 border-t border-slate-100 bg-white p-4 md:hidden">
            <a
              href="#home"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg p-3 hover:bg-slate-50"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg p-3 hover:bg-slate-50"
            >
              Features
            </a>
          
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 md:py-28 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Your finances, simplified
              </div>

              <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Take control of your{" "}
                <span className="text-emerald-700">
                  financial future.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Manage customers, track loans, calculate EMIs and monitor
                payments with one simple finance management system.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  onClick={goToFeatures}
                  className="rounded-xl bg-emerald-700 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
                >
                  Explore Features →
                </button>
               
               
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                <span>✓ Centralized records</span>
                <span>✓ Easy EMI calculations</span>
                <span>✓ Clear reports</span>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] bg-emerald-200/30 blur-2xl" />

              <div className="relative rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl shadow-emerald-900/10 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Finance overview
                    </p>
                    <h3 className="mt-1 text-xl font-bold">
                      Dashboard preview
                    </h3>
                  </div>
                  <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  Live Data
                  </span>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm text-slate-600">Customers</p>
                    <p className="mt-3 text-3xl font-bold text-emerald-800">
                      {stats ? stats.totalCustomers : "..."}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Customer records
                    </p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-sm text-slate-600">Total loans</p>
                    <p className="mt-3 text-3xl font-bold text-blue-800">
                      {stats ? stats.totalLoans : "..."}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Loan records
                    </p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-4">
                    <p className="text-sm text-slate-600">Pending loans</p>
                    <p className="mt-3 text-3xl font-bold text-amber-800">
                      {stats ? stats.pendingLoans : "..."}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Awaiting review
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-24 px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                Our Features
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need in one place
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Organize everyday finance operations with dedicated tools for
                customer records, loan processing and payment tracking.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                  
                  <button
                    onClick={() => navigate(feature.path)}
                    className="mt-5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                    Explore feature →
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white px-5 py-7 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-bold text-slate-800">
            ₹ Smart Finance
          </p>
          <p className="text-sm text-slate-500">
            Smart Finance Management System · Academic project
          </p>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
