import React, { useState, useEffect, useMemo } from "react";
import { getListings, getSaved } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import { Search, Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Home, Sparkles, MapPin, CheckCircle2 } from "lucide-react";

const CHENNAI_LOCALITIES = [
  "All",
  "Adyar",
  "Anna Nagar",
  "Guindy",
  "OMR",
  "Perungudi",
  "Porur",
  "T Nagar",
  "Tambaram",
  "Thoraipakkam",
  "Velachery"
];

const PROPERTY_TYPES = [
  "All",
  "Apartment",
  "Independent House",
  "Villa",
  "Builder Floor",
  "Plot"
];

const FURNISHING_OPTIONS = [
  "All",
  "Unfurnished",
  "Semi-furnished",
  "Fully-furnished"
];

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [locality, setLocality] = useState("All");
  const [bhk, setBhk] = useState("All");
  const [propertyType, setPropertyType] = useState("All");
  const [furnishing, setFurnishing] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [liveOnly, setLiveOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting & Pagination State
  const [sortBy, setSortBy] = useState("posted_at");
  const [order, setOrder] = useState("desc");
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 50;

  useEffect(() => {
    getSaved().then((saved) => {
      setSavedIds(new Set(saved.map((s) => s.listing_id)));
    }).catch(console.warn);
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getListings({
        offset,
        limit,
        locality: locality !== "All" ? locality : undefined,
        bhk: bhk !== "All" ? bhk : undefined,
        property_type: propertyType !== "All" ? propertyType : undefined,
        min_price: minPrice ? Number(minPrice) : undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
        furnishing: furnishing !== "All" ? furnishing : undefined,
        sort_by: sortBy,
        order
      });

      setListings(data.results || []);
      setTotalCount(data.total || 0);
      setHasMore(data.has_more ?? false);
    } catch (err) {
      setError(err.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [offset, locality, bhk, propertyType, furnishing, sortBy, order]);

  const displayedListings = useMemo(() => {
    return listings.filter((item) => {
      if (liveOnly && item.is_live === false) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesApt = (item.apartment_name || "").toLowerCase().includes(q);
        const matchesLoc = (item.locality || "").toLowerCase().includes(q);
        const matchesDesc = (item.description || "").toLowerCase().includes(q);
        if (!matchesApt && !matchesLoc && !matchesDesc) return false;
      }
      return true;
    });
  }, [listings, liveOnly, searchQuery]);

  const handleToggleSave = (listingId, isSaved) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.add(listingId);
      else next.delete(listingId);
      return next;
    });
  };

  const handleResetFilters = () => {
    setLocality("All");
    setBhk("All");
    setPropertyType("All");
    setFurnishing("All");
    setMinPrice("");
    setMaxPrice("");
    setLiveOnly(true);
    setSearchQuery("");
    setOffset(0);
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Chennai Real Estate</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Discover Exceptional Homes in Chennai
            </h1>

            <p className="mt-3 text-base text-slate-300 font-medium leading-relaxed">
              Explore verified residential apartments, builder floors, and gated societies. Filter with guaranteed precision across all neighborhoods.
            </p>

            {/* Quick Stats Pill Chips */}
            <div className="flex flex-wrap items-center gap-3 mt-6 text-xs font-semibold text-slate-300">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                3,233+ Active Listings
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                10 Prime Localities
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
                <span className="text-emerald-400">₹9,845</span> Avg 2BHK / sq.ft
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Floating Filter Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xl shadow-slate-950/5 space-y-4">
          
          {/* Row 1: Search and Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apartment name, locality, keywords..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            {/* Locality */}
            <div>
              <select
                value={locality}
                onChange={(e) => { setLocality(e.target.value); setOffset(0); }}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white"
              >
                {CHENNAI_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === "All" ? "All Localities" : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <select
                value={propertyType}
                onChange={(e) => { setPropertyType(e.target.value); setOffset(0); }}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "All Property Types" : t}
                  </option>
                ))}
              </select>
            </div>

            {/* Furnishing */}
            <div>
              <select
                value={furnishing}
                onChange={(e) => { setFurnishing(e.target.value); setOffset(0); }}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition bg-white"
              >
                {FURNISHING_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f === "All" ? "Any Furnishing" : f}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Row 2: Bedroom Pills, Sort, Active Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
            
            {/* BHK Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[11px] mr-1">BHK:</span>
              {["All", "1", "2", "3", "4"].map((b) => {
                const isSelected = bhk === b;
                return (
                  <button
                    key={b}
                    onClick={() => { setBhk(b); setOffset(0); }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                      isSelected
                        ? "bg-slate-900 text-emerald-400 shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {b === "All" ? "All" : `${b} BHK`}
                  </button>
                );
              })}
            </div>

            {/* Sorting & Live Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={liveOnly}
                  onChange={(e) => setLiveOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span>Active Only</span>
              </label>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={`${sortBy}-${order}`}
                  onChange={(e) => {
                    const [s, o] = e.target.value.split("-");
                    setSortBy(s);
                    setOrder(o);
                    setOffset(0);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="posted_at-desc">Latest Added</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="carpet_area-desc">Largest Carpet Area</option>
                  <option value="bedroom-desc">Most Bedrooms</option>
                </select>
              </div>

              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-slate-400 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100"
              >
                Clear
              </button>

              <button
                onClick={() => fetchListings()}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                title="Refresh listings"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {error ? (
          <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h3 className="font-bold text-base">Error Loading Listings</h3>
            <p className="text-xs text-rose-600 mt-1">{error}</p>
            <button
              onClick={fetchListings}
              className="mt-4 px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-4 animate-pulse">
                <div className="aspect-[16/11] bg-slate-200 rounded-2xl mb-4"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : displayedListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No properties matched your filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting filters to explore all available properties.</p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedListings.map((listing) => (
                <PropertyCard
                  key={listing.listing_id}
                  listing={listing}
                  isSavedInitially={savedIds.has(listing.listing_id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">
                Displaying <span className="font-extrabold text-slate-900">{offset + 1}</span> -{" "}
                <span className="font-extrabold text-slate-900">{offset + displayedListings.length}</span> of retrievable collection
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
                  disabled={offset === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous 50
                </button>
                
                <span className="text-xs font-bold text-slate-700 px-3">
                  Page {Math.floor(offset / limit) + 1}
                </span>

                <button
                  onClick={() => setOffset((prev) => prev + limit)}
                  disabled={!hasMore || displayedListings.length < limit}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold disabled:opacity-40 transition flex items-center gap-1.5"
                >
                  Next 50
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}