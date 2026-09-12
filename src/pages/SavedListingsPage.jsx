import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSaved, unsaveListing, authStorage } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import { Bookmark, Heart, Home, RefreshCw, Sparkles } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-ivy-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            Personal Shortlist
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Properties
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Properties bookmarked for account <span className="font-semibold text-slate-800">{user?.email || "User"}</span>.
            Persisted server-side across reloads and re-logins.
          </p>
        </div>

        <button
          onClick={fetchSaved}
          className="mt-4 md:mt-0 p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-ivy-700 hover:bg-ivy-50 transition shadow-sm flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-ivy-600" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
              <div className="aspect-[16/10] bg-slate-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700">
          <p className="text-sm font-bold">{error}</p>
        </div>
      ) : savedListings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No saved properties yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the heart icon on any property card to save it to your personal shortlist.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-ivy-600 hover:bg-ivy-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-ivy-600/20"
          >
            <Home className="w-4 h-4" />
            Explore Properties for Sale
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
  );
}