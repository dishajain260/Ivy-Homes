import React, { useState, useEffect } from "react";
import { getRentals, formatINR, formatRent } from "../api/client";
import { KeyRound, MapPin, BedDouble, Bath, Maximize2, Search, ArrowUpDown, ChevronLeft, ChevronRight, Sparkles, Building, Phone, CheckCircle2 } from "lucide-react";

const CHENNAI_LOCALITIES = [
  "All",
  "Guindy",
  "Adyar",
  "Anna Nagar",
  "OMR",
  "Perungudi",
  "Porur",
  "T Nagar",
  "Tambaram",
  "Thoraipakkam",
  "Velachery"
];

const RENTAL_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80"
];

export default function RentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [locality, setLocality] = useState("All");
  const [bhk, setBhk] = useState("All");
  const [furnishing, setFurnishing] = useState("All");
  const [sortBy, setSortBy] = useState("price");
  const [order, setOrder] = useState("asc");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 50;

  const fetchRentals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRentals({
        offset,
        limit,
        locality: locality !== "All" ? locality : undefined,
        bhk: bhk !== "All" ? bhk : undefined,
        furnishing: furnishing !== "All" ? furnishing : undefined,
        sort_by: sortBy,
        order
      });
      setRentals(data.results || []);
      setHasMore(data.has_more ?? false);
    } catch (err) {
      setError(err.message || "Failed to load rental properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [offset, locality, bhk, furnishing, sortBy, order]);

  return (
    <div className="min-h-screen pb-20">
      
      {/* Hero Banner */}
      <section className="bg-[#09090B] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0018A8]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[#CBD2FF] text-xs font-bold uppercase tracking-wider mb-4">
              <KeyRound className="w-3.5 h-3.5 text-[#F9E392]" />
              <span>Rental Homes Portfolio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Verified Rental Homes in <br />
              <span className="text-[#F9E392] italic font-serif">Chennai.</span>
            </h1>

            <p className="mt-4 text-base text-slate-300 font-medium leading-relaxed">
              Transparent monthly rents, verified security deposits, and carpet areas across Chennai’s key residential hubs.
            </p>
          </div>

          {/* Guindy Spotlight Card */}
          <div>
            <button
              onClick={() => { setLocality("Guindy"); setOffset(0); }}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 text-left shadow-card ${
                locality === "Guindy"
                  ? "bg-white text-slate-900 border-white ring-4 ring-white/20"
                  : "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                locality === "Guindy" ? "bg-[#0018A8] text-white" : "bg-white/15 text-[#F9E392]"
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${locality === "Guindy" ? "text-[#0018A8]" : "text-[#CBD2FF]"}`}>
                  Assigned Locality Focus
                </div>
                <div className="text-sm font-extrabold">Guindy: 160 Units (₹54.73 L/mo)</div>
              </div>
            </button>
          </div>

        </div>
      </section>

      {/* Floating Filter Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Locality</label>
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

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Bedrooms</label>
              <select
                value={bhk}
                onChange={(e) => { setBhk(e.target.value); setOffset(0); }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0018A8]/20 focus:border-[#0018A8] transition"
              >
                <option value="All">All Bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Furnishing</label>
              <select
                value={furnishing}
                onChange={(e) => { setFurnishing(e.target.value); setOffset(0); }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0018A8]/20 focus:border-[#0018A8] transition"
              >
                <option value="All">All Furnishing</option>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="fully-furnished">Fully-furnished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Sort by</label>
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split("-");
                  setSortBy(s);
                  setOrder(o);
                  setOffset(0);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0018A8]/20 focus:border-[#0018A8] transition"
              >
                <option value="price-asc">Rent: Low to High</option>
                <option value="price-desc">Rent: High to Low</option>
                <option value="carpet_area-desc">Largest Area</option>
                <option value="posted_at-desc">Recently Posted</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse space-y-3">
                <div className="aspect-[16/10] bg-slate-200 rounded-xl"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 max-w-lg mx-auto">
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto">
            <KeyRound className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No rental properties found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting filters to explore all available properties.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentals.map((rental, index) => {
                const img = RENTAL_IMAGES[index % RENTAL_IMAGES.length];
                return (
                  <div
                    key={rental.listing_id}
                    className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#0018A8]/40 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img src={img} alt={rental.apartment_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                        
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/95 text-slate-900 shadow-xs capitalize">
                            {rental.furnishing}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-3">
                          <span className="text-[11px] font-bold text-white/95 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/15">
                            <MapPin className="w-3 h-3 text-[#F9E392]" />
                            {rental.locality}
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            {formatRent(rental.price)}
                          </span>
                          {rental.deposit && (
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                              Deposit: {formatINR(rental.deposit)}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-2">
                          {rental.apartment_name || `${rental.bedroom} BHK Rental Home`}
                        </h3>
                        
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                          {rental.description || "Well maintained rental unit in prime locality with 24x7 water and power backup."}
                        </p>

                        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-slate-700 text-xs font-semibold">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                            <BedDouble className="w-3.5 h-3.5 text-[#0018A8]" />
                            <span>{rental.bedroom} BHK</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                            <Bath className="w-3.5 h-3.5 text-[#0018A8]" />
                            <span>{rental.bathroom} Bath</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                            <Maximize2 className="w-3.5 h-3.5 text-[#0018A8]" />
                            <span>{rental.carpet_area} sqft</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Contact */}
                    <div className="p-4 sm:p-5 pt-0">
                      <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Contact ({rental.posted_by})</span>
                          <span className="font-extrabold text-slate-800">{rental.posted_by_name}</span>
                        </div>
                        <a
                          href={`tel:${rental.posted_by_contact}`}
                          className="px-3.5 py-1.5 bg-[#0018A8] hover:bg-[#00118A] text-white rounded-lg font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-card">
              <span className="text-xs font-semibold text-slate-500">
                Offset: {offset} • Showing {rentals.length} rentals
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
                  disabled={offset === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition shadow-xs"
                >
                  Previous
                </button>
                <button
                  onClick={() => setOffset((prev) => prev + limit)}
                  disabled={!hasMore || rentals.length < limit}
                  className="px-4 py-2 rounded-xl bg-[#0018A8] hover:bg-[#00118A] text-white text-xs font-bold disabled:opacity-40 transition shadow-md shadow-[#0018A8]/20"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}