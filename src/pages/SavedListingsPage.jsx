import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSaved, authStorage } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import { Bookmark, Heart, Home, RefreshCw, Sparkles, Building2 } from "lucide-react";

export default function SavedListingsPage() {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = authStorage.getUser();

  const fetchSaved = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getSaved();
      setSavedListings(results);
    } catch (err) {
      setError(err.message || "Failed to load saved listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [user?.email]);

  const handleToggleSave = (listingId, isSaved) => {
    if (!isSaved) {
      setSavedListings((prev) => prev.filter((item) => item.listing_id !== listingId));
    }
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* Luxury Hero Banner */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#042f2e] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-emerald-200 text-xs font-bold uppercase tracking-wider mb-4">
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              <span>Personal Shortlist</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Saved Properties
            </h1>

            <p className="mt-3 text-base text-emerald-100/90 font-medium">
              Synchronized with authorized account <span className="text-white font-bold">{user?.email || "User"}</span>.
            </p>
          </div>

          <button
            onClick={fetchSaved}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition flex items-center gap-2 border border-white/20 shadow-xs backdrop-blur-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-300" : ""}`} />
            Refresh Shortlist
          </button>
        </div>
      </section>

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse space-y-3">
                <div className="aspect-[16/10] bg-slate-200 rounded-xl"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 max-w-lg mx-auto">
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : savedListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-card max-w-xl mx-auto p-8">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your shortlist is empty</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Click the heart button on any property card across Chennai to save it for quick access and comparison.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20"
            >
              <Home className="w-4 h-4" />
              Explore Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((listing) => (
              <PropertyCard
                key={listing.listing_id}
                listing={listing}
                isSavedInitially={true}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}