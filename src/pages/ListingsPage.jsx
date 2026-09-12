import React, { useState, useEffect, useMemo } from "react";
import { getListings, getSaved } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Home, Sparkles, MapPin, CheckCircle2, X, Zap, ShieldCheck } from "lucide-react";

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
  const [liveOnly, setLiveOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting & Pagination State
  const [sortBy, setSortBy] = useState("posted_at");
  const [order, setOrder] = useState("desc");
  const [offset, setOffset] = useState(0);
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
        furnishing: furnishing !== "All" ? furnishing : undefined,
        sort_by: sortBy,
        order
      });

      setListings(data.results || []);
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
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
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
    setLiveOnly(true);
    setSearchQuery("");
    setOffset(0);
  };

  const activeFilterCount = (locality !== "All" ? 1 : 0) + 
                            (bhk !== "All" ? 1 : 0) + 
                            (propertyType !== "All" ? 1 : 0) + 
                            (furnishing !== "All" ? 1 : 0) + 
                            (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen pb-20">
      
      {/* High-Impact Hero Banner in Ivy Homes Aesthetic */}
      <section className="bg-[#09090B] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        
        {/* Klein Blue ambient glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#0018A8]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-[#4F61DA]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[#CBD2FF] text-xs font-bold uppercase tracking-wider mb-5">
              <img src="/ivy_blue.svg" alt="Ivy Icon" className="h-3.5 w-auto" />
              <span>Verified Real Estate Platform</span>
            </div>

            {/* Headline with italic emphasis matching ivy.homes/sell */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Discover verified homes with <br />
              <span className="text-[#F9E392] italic font-serif">complete confidence.</span>
            </h1>

            {/* Subhead */}
            <p className="mt-4 text-base text-slate-300 font-medium leading-relaxed">
              Explore 3,233+ authentic residential properties in Chennai. Filter by carpet area, view verified developer metrics, and bypass broker inflation.
            </p>

            {/* Benchmark Pill Strip */}
            <div className="flex flex-wrap items-center gap-2.5 mt-6 text-xs font-semibold">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                3,233 Active Listings
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 flex items-center gap-1.5 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-[#F9E392]" />
                10 Core Localities
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 flex items-center gap-1.5 shadow-xs">
                <span className="text-[#CBD2FF] font-bold">₹9,845</span> Avg 2BHK / sq.ft
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Floating Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          
          {/* Row 1: Search and Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apartment, society, road..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0018A8]/20 focus:border-[#0018A8] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Locality */}
            <div>
              <select
                value={locality}
                onChange={(e) => { setLocality(e.target.value); setOffset(0); }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0018A8]/20 focus:border-[#0018A8] transition"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0018A8]/20 focus:border-[#0018A8] transition"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0018A8]/20 focus:border-[#0018A8] transition"
              >
                {FURNISHING_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f === "All" ? "Any Furnishing" : f}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Row 2: Bedroom Pills, Sorting, and Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
            
            {/* BHK Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mr-1">Bedrooms:</span>
              {["All", "1", "2", "3", "4"].map((b) => {
                const isSelected = bhk === b;
                return (
                  <button
                    key={b}
                    onClick={() => { setBhk(b); setOffset(0); }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                      isSelected
                        ? "bg-[#0018A8] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {b === "All" ? "Any BHK" : `${b} BHK`}
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
                  className="w-4 h-4 rounded text-[#0018A8] focus:ring-[#0018A8] border-slate-300"
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
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="posted_at-desc">Latest Added</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="carpet_area-desc">Largest Area</option>
                  <option value="bedroom-desc">Most Bedrooms</option>
                </select>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset ({activeFilterCount})</span>
                </button>
              )}

              <button
                onClick={() => fetchListings()}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                title="Refresh listings"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0018A8]" : ""}`} />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Results Bar Header */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6 text-sm text-slate-500 font-medium">
            <div>
              Showing <span className="font-bold text-slate-900">{displayedListings.length}</span> properties
              {locality !== "All" && (
                <span> in <span className="font-bold text-[#0018A8]">{locality}</span></span>
              )}
            </div>
            <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0018A8]" />
              <span>Data verified against official Ivy Homes registry</span>
            </div>
          </div>
        )}

        {error ? (
          <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h3 className="font-bold text-base">Error Loading Listings</h3>
            <p className="text-xs text-rose-600 mt-1">{error}</p>
            <button
              onClick={fetchListings}
              className="mt-4 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse space-y-3">
                <div className="aspect-[16/10] bg-slate-200 rounded-xl"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="h-8 bg-slate-100 rounded-lg"></div>
                  <div className="h-8 bg-slate-100 rounded-lg"></div>
                  <div className="h-8 bg-slate-100 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto">
            <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No properties matched your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find active listings matching your current filter settings.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 bg-[#0018A8] hover:bg-[#00118A] text-white text-xs font-bold rounded-xl transition shadow-md shadow-[#0018A8]/20"
            >
              Reset All Filters
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
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-card">
              <div className="text-xs font-semibold text-slate-500">
                Displaying <span className="font-extrabold text-slate-900">{offset + 1}</span> -{" "}
                <span className="font-extrabold text-slate-900">{offset + displayedListings.length}</span> of retrievable collection
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
                  disabled={offset === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1.5 shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous 50
                </button>
                
                <span className="text-xs font-bold text-slate-700 px-3 bg-slate-100 py-2 rounded-xl">
                  Page {Math.floor(offset / limit) + 1}
                </span>

                <button
                  onClick={() => setOffset((prev) => prev + limit)}
                  disabled={!hasMore || displayedListings.length < limit}
                  className="px-4 py-2 rounded-xl bg-[#0018A8] hover:bg-[#00118A] text-white text-xs font-bold disabled:opacity-40 transition flex items-center gap-1.5 shadow-md shadow-[#0018A8]/25"
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