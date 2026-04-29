import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaChevronRight,
  FaChevronLeft,
  FaHome,
  FaWallet,
  FaChartPie,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import logo from "../assets/logo-white.png";

function Sidebar() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNavClick = () => {
    if (isMobile) setCollapsed(true);
  };

  const navClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-slate-700 transition";

  const activeClass = "bg-blue-500 text-white";

  return (
    <>
      {/* Toggle Button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed top-5 left-5 z-[60] bg-slate-1000 text-white p-2 rounded-lg shadow-lg"
        >
          <FaChevronRight />
        </button>
      )}

      {/* Overlay */}
      {!collapsed && isMobile && (
        <div
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      {!collapsed && (
        <div className="fixed top-0 left-0 z-50 w-56 h-screen bg-[#020617] text-white p-4 flex flex-col shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-9 h-9" />
              <h1 className="text-lg font-bold text-blue-400">Xenofin</h1>
            </div>

            <button
              onClick={() => setCollapsed(true)}
              className="bg-slate-700 p-2 rounded-lg"
            >
              <FaChevronLeft />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2">

            <NavLink to="/dashboard" onClick={handleNavClick}
              className={({ isActive }) =>
                `${navClass} ${isActive ? activeClass : ""}`
              }>
              <FaHome /> Dashboard
            </NavLink>

            <NavLink to="/transactions" onClick={handleNavClick}
              className={({ isActive }) =>
                `${navClass} ${isActive ? activeClass : ""}`
              }>
              <FaWallet /> Transactions
            </NavLink>

            <NavLink to="/budgets" onClick={handleNavClick}
              className={({ isActive }) =>
                `${navClass} ${isActive ? activeClass : ""}`
              }>
              <FaChartPie /> Budgets
            </NavLink>

            <NavLink to="/reports" onClick={handleNavClick}
              className={({ isActive }) =>
                `${navClass} ${isActive ? activeClass : ""}`
              }>
              <FaChartBar /> Reports
            </NavLink>

            <NavLink to="/profile" onClick={handleNavClick}
              className={({ isActive }) =>
                `${navClass} ${isActive ? activeClass : ""}`
              }>
              <FaUser /> Profile
            </NavLink>

          </nav>

          {/* Bottom */}
          <div className="mt-auto">

            <button
              onClick={() => {
                handleLogout();
                handleNavClick();
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 text-sm rounded-lg mb-4"
            >
              <FaSignOutAlt /> Logout
            </button>

            <p className="text-xs text-gray-400 text-center">
              © 2026 All Rights Reserved Developed by{" "}
              <span className="text-blue-400 font-semibold">AlienXoft</span>
            </p>

          </div>

        </div>
      )}
    </>
  );
}

export default Sidebar;