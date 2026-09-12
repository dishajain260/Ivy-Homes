import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authStorage, logout, DEMO_USERS, login, DEMO_PASSWORD } from "../api/client";
import { Building2, Home, KeyRound, Bookmark, BarChart3, LogOut, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

export default function Navbar({ onUserChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authStorage.getUser();

  const handleLogout = async () => {
    await logout();
    if (onUserChange) onUserChange();
    navigate("/login");
  };

  const handleQuickSwitch = async (email) => {
    if (user?.email === email) return;
    try {
      await login(email, DEMO_PASSWORD);
      if (onUserChange) onUserChange();
      window.location.reload();
    } catch (err) {
      console.error("Failed to switch user", err);
    }
  };

  const navLinks = [
    { name: "Listings", path: "/", icon: Home },
    { name: "Rentals", path: "/rentals", icon: KeyRound },
    { name: "Projects", path: "/projects", icon: Building2 },
    { name: "Saved", path: "/saved", icon: Bookmark },
    { name: "Insights & Audit", path: "/insights", icon: BarChart3, badge: "New" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & City */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ivy-600 to-ivy-800 flex items-center justify-center text-white shadow-md shadow-ivy-600/20 group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5 text-ivy-200" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Ivy Homes
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-ivy-100 text-ivy-800 uppercase tracking-wider">
                    Chennai
                  </span>
                </span>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">Intelligent Property Discovery</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-ivy-50 text-ivy-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-ivy-600" : "text-slate-400"}`} />
                  {link.name}
                  {link.badge && (
                    <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-ivy-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Demo Switcher */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Account Switcher Pills */}
                <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                  {DEMO_USERS.map((email) => {
                    const isCurrent = user.email === email;
                    const label = email.split("@")[0];
                    return (
                      <button
                        key={email}
                        onClick={() => handleQuickSwitch(email)}
                        className={`px-2 py-1 rounded font-medium transition ${
                          isCurrent
                            ? "bg-white text-slate-900 shadow-sm font-bold"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                        title={`Switch to ${email}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {user.email.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{user.email}</p>
                    <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Session Active
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ivy-600 hover:bg-ivy-700 text-white text-sm font-semibold shadow-sm transition"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
      
      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 py-2 bg-white px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 text-[11px] font-medium p-1.5 ${
                isActive ? "text-ivy-600 font-bold" : "text-slate-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}