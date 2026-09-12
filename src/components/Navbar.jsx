import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authStorage, logout } from "../api/client";
import { Building2, Home, KeyRound, Bookmark, BarChart3, LogOut, Sparkles } from "lucide-react";

export default function Navbar({ onUserChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authStorage.getUser();

  const handleLogout = async () => {
    await logout();
    if (onUserChange) onUserChange();
    navigate("/login");
  };

  const navLinks = [
    { name: "Listings", path: "/", icon: Home },
    { name: "Rentals", path: "/rentals", icon: KeyRound },
    { name: "Projects", path: "/projects", icon: Building2 },
    { name: "Saved", path: "/saved", icon: Bookmark },
    { name: "Market Insights", path: "/insights", icon: BarChart3, badge: "Live" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & City Tag */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-white">Ivy Homes</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                    Chennai
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Intelligent Property Discovery</p>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                    {(user.email || "U")[0].toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-200 leading-tight truncate max-w-[160px]">
                      {user.email}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Verified
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 py-2 bg-slate-950/80 backdrop-blur-lg px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1.5 ${
                isActive ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}