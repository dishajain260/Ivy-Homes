import React, { useState, useEffect } from "react";
import { getRentals, formatINR, formatRent } from "../api/client";
import { KeyRound, MapPin, BedDouble, Bath, Maximize2, Search, ArrowUpDown, ChevronLeft, ChevronRight, Sparkles, Building, Phone } from "lucide-react";

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
    <div className="min-h-screen pb-16">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-4">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Rental Homes Portfolio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Verified Rental Properties
            </h1>

            <p className="mt-3 text-sm text-slate-300 font-medium leading-relaxed">
              Transparent monthly rents, verified security deposits, and carpet areas across Chennai.
            </p>
          </div>

          {/* Guindy Assigned Locality Spotlight */}
          <div>
            <button
              onClick={() => { setLocality("Guindy"); setOffset(0); }}
              className={`p-4 rounded-2xl border transition flex items-center gap-3.5 text-left shadow-lg ${
                locality === "Guindy"
                  ? "bg-emerald-500 border-emerald-400 text-slate-950"
                  : "bg-slate-800/80 border-slate-700 text-white hover:bg-slate-800"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center font-black">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Assigned Locality Focus</div>
                <div className="text-sm font-extrabold">Guindy: 160 Units (₹54.73 L/mo)</div>
              </div>
            </button>
          </div>

        </div>
      </section>

      {/* Floating Filter Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xl shadow-slate-950/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Locality</label>
              <select
                value={locality}
                onChange={(e) => { setLocality(e.target.value); setOffset(0); }}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-white"
              >
                {CHENNAI_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === "All" ? "All Localities" : loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Bedrooms</label>
              <select
                value={bhk}
                onChange={(e) => { setBhk(e.target.value); setOffset(0); }}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-white"
              >
                <option value="All">All Bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Furnishing</label>
              <select
                value={furnishing}
                onChange={(e) => { setFurnishing(e.target.value); setOffset(0); }}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-white"
              >
                <option value="All">All Furnishing</option>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="fully-furnished">Fully-furnished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Sort by</label>
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split("-");
                  setSortBy(s);
                  setOrder(o);
                  setOffset(0);
                }}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-white"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : rentals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
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
                    className="group bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-500/40 shadow-sm hover:shadow-2xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                        <img src={img} alt={rental.apartment_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/90 text-slate-900 shadow-sm capitalize">
                            {rental.furnishing}
                          </span>
                        </div>

                        <div className="absolute bottom-3.5 left-4 right-4 text-white flex items-end justify-between">
                          <div>
                            <span className="text-2xl font-black tracking-tight drop-shadow-md">
                              {formatRent(rental.price)}
                            </span>
                          </div>
                          {rental.deposit && (
                            <span className="text-[11px] font-bold text-emerald-300 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                              Deposit: {formatINR(rental.deposit)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
                          <span className="flex items-center gap-1 text-slate-600 capitalize">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            {rental.locality}
                          </span>
                          <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                            {rental.property_type}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 mb-1">
                          {rental.apartment_name || `${rental.bedroom} BHK Rental Home`}
                        </h3>
                        
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                          {rental.description || "Well maintained rental unit in prime locality with 24x7 water and power backup."}
                        </p>

                        <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-slate-600 text-xs font-semibold">
                          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <BedDouble className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{rental.bedroom} BHK</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <Bath className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{rental.bathroom} Bath</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{rental.carpet_area} sq.ft</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Contact */}
                    <div className="p-5 pt-0">
                      <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Contact ({rental.posted_by})</span>
                          <span className="font-extrabold text-slate-800">{rental.posted_by_name}</span>
                        </div>
                        <a
                          href={`tel:${rental.posted_by_contact}`}
                          className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition"
                        >
                          Call
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">
                Offset: {offset} • Showing {rentals.length} rentals
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
                  disabled={offset === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setOffset((prev) => prev + limit)}
                  disabled={!hasMore || rentals.length < limit}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold disabled:opacity-40"
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