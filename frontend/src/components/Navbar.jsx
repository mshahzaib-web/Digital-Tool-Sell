import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import AdminLoginModal from "./AdminLoginModal";
import {
  FiSun,
  FiMoon,
  FiLock,
  FiUnlock,
  FiMenu,
  FiX,
  FiPlus,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";

const Navbar = () => {
  const { isAdmin, logout, adminUser } = useAdmin();
  const [dark, setDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle dark mode side effects
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";

    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !dark;
    setDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSellToolClick = (e) => {
    e.preventDefault();
    if (isAdmin) {
      navigate("/add-tool");
      setMobileMenuOpen(false);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    navigate("/add-tool");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-500 text-white shadow-md shadow-brand-500/20">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <span className="text-xl font-bold font-sans tracking-tight bg-gradient-to-r from-brand-600 to-purple-500 dark:from-brand-400 dark:to-purple-400 bg-clip-text text-transparent">
              VaultX
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors duration-200 hover:text-brand-500 ${isActive ? "text-brand-500 dark:text-brand-400" : "text-slate-600 dark:text-slate-300"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/tools"
              className={({ isActive }) =>
                `transition-colors duration-200 hover:text-brand-500 ${isActive ? "text-brand-500 dark:text-brand-400" : "text-slate-600 dark:text-slate-300"}`
              }
            >
              Browse Tools
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `transition-colors duration-200 hover:text-brand-500 ${isActive ? "text-brand-500 dark:text-brand-400" : "text-slate-600 dark:text-slate-300"}`
              }
            >
              Categories
            </NavLink>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Toggle Theme"
            >
              {dark ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>

            {/* Admin Controls */}
            {isAdmin ? (
              <div className="relative">
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100/50 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <FiUnlock className="w-4 h-4" />
                  <span>Admin Mode</span>
                </button>

                {adminMenuOpen && (
                  <div className="flex absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 text-slate-700 dark:text-slate-300 text-sm">
                    <div className="mt-5">
                      <Link
                        to="/add-tool"
                        onClick={() => setAdminMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>Add Tool</span>
                      </Link>
                      <Link
                        to="/change-password"
                        onClick={() => setAdminMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <FiSettings className="w-4 h-4" />
                        <span>Change Password</span>
                      </Link>
                      <hr className="my-1 border-slate-200 dark:border-slate-800" />
                      <button
                        onClick={() => {
                          logout();
                          setAdminMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                    <div className="">
                      <button
                        onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                        className="rotate-45 font-bold text-2xl hover:cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                title="Admin Login"
              >
                <FiLock className="w-5 h-5" />
              </button>
            )}

            {/* Sell Tool Button */}
            <button
              onClick={handleSellToolClick}
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-600/30 transition-all duration-200"
            >
              Add Tool
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {dark ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Home
          </NavLink>
          <NavLink
            to="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Browse Tools
          </NavLink>
          <NavLink
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Categories
          </NavLink>
          {isAdmin && (
            <>
              <Link
                to="/add-tool"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
              >
                Add New Tool
              </Link>
              <Link
                to="/change-password"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
              >
                Change Password
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 font-semibold"
              >
                Log Out
              </button>
            </>
          )}
          <button
            onClick={handleSellToolClick}
            className="w-full py-2.5 text-center bg-brand-500 text-white font-semibold rounded-xl shadow-md"
          >
            Add Tool
          </button>
        </div>
      )}

      {/* Admin Login Modal overlay */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </nav>
  );
};

export default Navbar;
