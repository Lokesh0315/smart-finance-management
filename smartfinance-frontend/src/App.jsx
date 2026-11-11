
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./component/LandingPage";
import Layout from "./component/Layout";
import Dashboard from "./pages/Dashboard";
import CustomerManagement from "./component/CustomerManagement";
import LoanManagement from "./component/LoanManagement";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/customers" element={<CustomerManagement />}/>
//         <Route path="/loans" element={<LoanManagement />} />  
//         <Route path="/payments" element={<PaymentManagement />} />
//         <Route path="/reports" element={<Reports />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/loans" element={<LoanManagement />} />
       
       
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
