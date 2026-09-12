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
    <div className="min-h-screen pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-4">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personal Shortlist</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white leading-tight">
              Saved Properties
            </h1>

            <p className="mt-2 text-sm text-slate-300 font-medium">
              Synchronized with account <span className="text-white font-bold">{user?.email || "User"}</span>.
            </p>
          </div>

          <button
            onClick={fetchSaved}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-2 border border-slate-700 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            Refresh
          </button>
        </div>
      </section>

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-4 animate-pulse">
                <div className="aspect-[16/11] bg-slate-200 rounded-2xl mb-4"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700">
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : savedListings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Your shortlist is empty</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Click the heart icon on any property card to save it for quick comparison and offline access.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl transition shadow-lg shadow-slate-900/10"
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