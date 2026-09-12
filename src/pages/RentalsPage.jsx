import React, { useState, useEffect } from "react";
import { getRentals, formatINR, formatRent } from "../api/client";
import { KeyRound, MapPin, BedDouble, Bath, Maximize2, Layers, Search, ArrowUpDown, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Filter } from "lucide-react";

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
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-ivy-700 text-xs font-bold uppercase tracking-wider mb-1">
            <KeyRound className="w-3.5 h-3.5" />
            Verified Rental Homes
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Rental Listings in Chennai
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Accurate monthly rents, verified deposits, and square-footage across top localities.
          </p>
        </div>

        {/* Assigned Locality Spotlight Badge */}
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => { setLocality("Guindy"); setOffset(0); }}
            className={`px-4 py-2.5 rounded-2xl border transition flex items-center gap-2 text-xs font-bold shadow-sm ${
              locality === "Guindy"
                ? "bg-ivy-600 border-ivy-600 text-white"
                : "bg-white border-ivy-200 text-ivy-800 hover:bg-ivy-50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-ivy-400" />
            <span>Assigned Locality: Guindy (160 Units)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Locality */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Locality</label>
            <select
              value={locality}
              onChange={(e) => { setLocality(e.target.value); setOffset(0); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white"
            >
              {CHENNAI_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "All" ? "All Chennai Localities" : loc}
                </option>
              ))}
            </select>
          </div>

          {/* BHK */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Bedrooms</label>
            <select
              value={bhk}
              onChange={(e) => { setBhk(e.target.value); setOffset(0); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white"
            >
              <option value="All">All Bedrooms</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
            </select>
          </div>

          {/* Furnishing */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Furnishing</label>
            <select
              value={furnishing}
              onChange={(e) => { setFurnishing(e.target.value); setOffset(0); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white"
            >
              <option value="All">All Furnishing</option>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-furnished</option>
              <option value="fully-furnished">Fully-furnished</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Sort by</label>
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [s, o] = e.target.value.split("-");
                setSortBy(s);
                setOrder(o);
                setOffset(0);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white"
            >
              <option value="price-asc">Rent: Low to High</option>
              <option value="price-desc">Rent: High to Low</option>
              <option value="carpet_area-desc">Largest Area</option>
              <option value="posted_at-desc">Recently Posted</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
      ) : rentals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <KeyRound className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No rental homes found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting filters to view all rentals.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental, index) => {
              const img = RENTAL_IMAGES[index % RENTAL_IMAGES.length];
              return (
                <div
                  key={rental.listing_id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    {/* Rental Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img src={img} alt={rental.apartment_name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-slate-900 shadow-sm capitalize">
                          {rental.furnishing}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold tracking-tight drop-shadow-md">
                          {formatRent(rental.price)}
                        </span>
                        {rental.deposit && (
                          <span className="text-xs font-semibold text-slate-200 bg-black/40 px-2 py-0.5 rounded">
                            Deposit: {formatINR(rental.deposit)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rental Body */}
                    <div className="p-4">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                        <span className="flex items-center gap-1 text-slate-700 capitalize font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-ivy-600" />
                          {rental.locality}
                        </span>
                        <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-[11px]">
                          {rental.property_type}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">
                        {rental.apartment_name || `${rental.bedroom} BHK Rental Home`}
                      </h3>
                      
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                        {rental.description || "Well maintained rental unit in prime locality."}
                      </p>

                      <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rental.bedroom} BHK</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rental.bathroom} Bath</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{rental.carpet_area} sq.ft</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Owner Contact */}
                  <div className="p-4 pt-0">
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Contact ({rental.posted_by})</span>
                        <span className="font-bold text-slate-800">{rental.posted_by_name}</span>
                      </div>
                      <a
                        href={`tel:${rental.posted_by_contact}`}
                        className="px-3 py-1.5 bg-ivy-600 hover:bg-ivy-700 text-white rounded-lg font-bold text-xs transition"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200">
            <span className="text-xs font-medium text-slate-500">
              Offset: {offset} • Showing {rentals.length} results
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
                className="px-4 py-2 rounded-xl bg-ivy-600 hover:bg-ivy-700 text-white text-xs font-bold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}