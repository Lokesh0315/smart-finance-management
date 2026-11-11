
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Customers", path: "/customers", icon: "👥" },
    { name: "Loans", path: "/loans", icon: "💰" },

   
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h1 className="text-2xl font-bold mb-2">
          Smart Finance
        </h1>

        <p className="text-sm text-gray-400 mb-8">
          Management System
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-slate-800"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6">
        <header className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Smart Finance Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Manage customers, loans and payments in one place.
          </p>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
