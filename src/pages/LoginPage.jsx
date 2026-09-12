import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, DEMO_USERS, DEMO_PASSWORD } from "../api/client";
import { Sparkles, KeyRound, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_USERS[0]);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      if (onLoginSuccess) onLoginSuccess();
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to authenticate with server");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-ivy-50/30 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ivy-600 to-ivy-800 flex items-center justify-center text-white mx-auto shadow-lg shadow-ivy-600/25 mb-4">
            <Sparkles className="w-7 h-7 text-ivy-200" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome to Ivy Homes</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Chennai Real Estate Intelligence Portal</p>
        </div>

        {/* Demo Accounts Selector */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-ivy-600" />
              Demo Credentials
            </span>
            <span className="text-[11px] font-semibold text-ivy-700 bg-ivy-100 px-2 py-0.5 rounded-full">
              Pre-authorized
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Click any demo account below to auto-fill credentials:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_USERS.map((u, i) => {
              const isSelected = email === u;
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleSelectDemo(u)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                    isSelected
                      ? "bg-ivy-600 border-ivy-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  Demo {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-ivy-500/20 focus:border-ivy-500 transition"
                placeholder="demo1@ivy.homes"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-ivy-500/20 focus:border-ivy-500 transition font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-ivy-600 to-ivy-700 hover:from-ivy-700 hover:to-ivy-800 text-white text-sm font-bold shadow-md shadow-ivy-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Authenticating...
              </span>
            ) : (
              <>
                <span>Sign In to Chennai Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Connected to <span className="font-mono text-slate-600">solve.ivy.homes</span> API.
            <br />
            Background tokens automatically refresh before 15m expiry.
          </p>
        </div>

      </div>
    </div>
  );
}