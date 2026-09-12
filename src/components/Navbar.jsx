import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authStorage, logout } from "../api/client";
import { Building2, Home, KeyRound, Bookmark, BarChart3, LogOut, ShieldCheck, Sparkles, ArrowRight, Zap, X } from "lucide-react";

export default function Navbar({ onUserChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authStorage.getUser();
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellApt, setSellApt] = useState("");
  const [sellLoc, setSellLoc] = useState("Guindy");
  const [sellOffer, setSellOffer] = useState(null);

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

  const handleCalculateOffer = (e) => {
    e.preventDefault();
    if (!sellApt) return;
    // Algorithmic instant valuation model based on Chennai dataset
    const baseRates = { Guindy: 9650, Adyar: 10240, "Anna Nagar": 11800, OMR: 8420, "T Nagar": 13400, Velachery: 9400 };
    const rate = baseRates[sellLoc] || 9200;
    const estimatedSqft = 1200;
    const estValue = rate * estimatedSqft;
    setSellOffer({
      low: Math.round((estValue * 0.96) / 100000) * 100000,
      high: Math.round((estValue * 1.04) / 100000) * 100000,
      turnaroundDays: 14
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 text-slate-900 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & City Tag */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <img
                  src="/ivyhomes_logo.svg"
                  alt="Ivy Homes"
                  className="h-6 sm:h-7 w-auto transition-transform group-hover:scale-[1.02]"
                />
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0018A8]/10 text-[#0018A8] border border-[#0018A8]/20 tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0018A8] animate-pulse"></span>
                  Chennai
                </span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#0018A8] text-white shadow-xs shadow-[#0018A8]/30"
                        : "text-slate-600 hover:text-[#0018A8] hover:bg-[#EEF2FF]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        isActive ? "bg-white text-[#0018A8]" : "bg-[#0018A8] text-white"
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & User Profile */}
            <div className="flex items-center gap-3">
              
              {/* Instant Offer Button (ivy.homes/sell reference) */}
              <button
                onClick={() => { setShowSellModal(true); setSellOffer(null); }}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E5FF] text-[#0018A8] text-xs font-extrabold border border-[#0018A8]/20 transition shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-[#0018A8]" />
                <span>Instant Home Offer</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-[#0018A8] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {(user.email || "U")[0].toUpperCase()}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                        {user.email}
                      </p>
                      <p className="text-[10px] text-[#0018A8] font-semibold flex items-center gap-1">
                        Verified Member
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-[#0018A8] hover:bg-[#00118A] text-white text-xs font-bold shadow-md shadow-[#0018A8]/20 transition"
                >
                  Sign In
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Tab Strip */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 py-2 bg-white px-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1.5 transition ${
                  isActive ? "text-[#0018A8] font-extrabold" : "text-slate-500"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Instant Offer Valuation Modal (inspired by ivy.homes/sell) */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setShowSellModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <img src="/ivy_blue.svg" alt="Ivy Icon" className="h-5 w-auto" />
              <span className="text-xs font-black text-[#0018A8] uppercase tracking-wider">Ivy Homes Liquidity</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Turn Keys into Cash. <br />
              <span className="text-[#0018A8] italic">Zero Broker Hassle.</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ivy Homes buys verified apartments directly in Chennai. Get an instant algorithmic valuation estimate in 10 seconds.
            </p>

            <form onSubmit={handleCalculateOffer} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apartment / Society Name</label>
                <input
                  type="text"
                  required
                  value={sellApt}
                  onChange={(e) => setSellApt(e.target.value)}
                  placeholder="e.g. Prestige Bella Vista, Olympia Grande"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0018A8]/20 focus:border-[#0018A8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Locality</label>
                  <select
                    value={sellLoc}
                    onChange={(e) => setSellLoc(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    {["Guindy", "Adyar", "Anna Nagar", "OMR", "T Nagar", "Velachery"].map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Configuration</label>
                  <select className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                    <option>2 BHK (Standard)</option>
                    <option>3 BHK (Spacious)</option>
                    <option>4 BHK (Luxury)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#0018A8] hover:bg-[#00118A] text-white text-xs font-extrabold transition shadow-md shadow-[#0018A8]/20 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Calculate Instant Cash Offer</span>
              </button>
            </form>

            {sellOffer && (
              <div className="mt-5 p-4 rounded-2xl bg-[#EEF2FF] border border-[#CBD2FF] text-slate-900 animate-slide-up">
                <div className="flex items-center justify-between text-xs font-bold text-[#0018A8] mb-1">
                  <span>Estimated Fair Cash Offer</span>
                  <span className="bg-[#0018A8] text-white px-2 py-0.5 rounded-full text-[10px]">Ivy Verified</span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  ₹{(sellOffer.low / 10000000).toFixed(2)} Cr - ₹{(sellOffer.high / 10000000).toFixed(2)} Cr
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  ⚡ Full payout liquidity within 14 business days. No open houses, no bargaining.
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}