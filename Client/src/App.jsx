// src/App.jsx

import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";
// import './css/style.css'; // includes Tailwind + additional styles
import "./css/style.css"; // Tailwind CSS

// Pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  const location = useLocation();

  // Initialize AOS (scroll animation lib)
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <>
      {/* <h1 className="text-3xl font-bold text-red-500 red">Tailwind is working!</h1> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/admin"
          element={<ProtectedRoute element={<AdminDashboard />} role="Admin" />}
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute element={<ManagerDashboard />} role="Manager" />
          }
        />

        <Route
          path="/member"
          element={
            <ProtectedRoute element={<MemberDashboard />} role="Member" />
          }
        />
      </Routes>
    </>
  );
}

export default App;
