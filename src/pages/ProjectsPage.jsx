import React, { useState, useEffect } from "react";
import { getProjects, formatINR } from "../api/client";
import { Building2, MapPin, Calendar, CheckCircle2, Clock, ShieldCheck, Sparkles, Filter, Layers, Home } from "lucide-react";

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

const PROJECT_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80"
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [locality, setLocality] = useState("All");
  const [status, setStatus] = useState("All");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 50;

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects({
        offset,
        limit,
        locality: locality !== "All" ? locality : undefined,
        project_status: status !== "All" ? status : undefined
      });
      setProjects(data.results || []);
      setHasMore(data.has_more ?? false);
    } catch (err) {
      setError(err.message || "Failed to load builder projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [offset, locality, status]);

  return (
    <div className="min-h-screen pb-16">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>Gated Communities & Societies</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              RERA Builder Projects
            </h1>

            <p className="mt-3 text-sm text-slate-300 font-medium leading-relaxed">
              Explore premier residential developments across Chennai with verified unit counts, tower heights, and normalized Indian rupee valuations.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xl shadow-slate-950/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            
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
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Project Status</label>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setOffset(0); }}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-800 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="under construction">Under Construction</option>
                <option value="ready to move">Ready to Move</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Main Grid */}
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
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No builder projects found</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj, idx) => {
                const img = PROJECT_IMAGES[idx % PROJECT_IMAGES.length];
                const isReady = (proj.project_status || "").toLowerCase().includes("ready");
                return (
                  <div
                    key={proj.project_id}
                    className="group bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-500/40 shadow-sm hover:shadow-2xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                        <img src={img} alt={proj.apartment_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-sm capitalize ${
                            isReady ? "bg-emerald-500 text-slate-950" : "bg-blue-600 text-white"
                          }`}>
                            {proj.project_status}
                          </span>
                        </div>

                        <div className="absolute bottom-3.5 left-4 right-4 text-white">
                          <div className="text-xl font-black tracking-tight drop-shadow-md">
                            {formatINR(proj.price_min_inr)} - {formatINR(proj.price_max_inr)}
                          </div>
                          <div className="text-[11px] font-bold text-emerald-300 mt-0.5">
                            {proj.min_area_sqft} - {proj.max_area_sqft} sq.ft
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
                          <span className="flex items-center gap-1 text-slate-600 capitalize">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            {proj.locality}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded">
                            {proj.project_id}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 mb-1">
                          {proj.apartment_name}
                        </h3>
                        
                        <p className="text-xs text-slate-600 font-medium mb-4">
                          By <span className="font-bold text-slate-800">{proj.developer_name}</span>
                        </p>

                        <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600 font-semibold mb-4">
                          <div className="bg-slate-50 p-2 rounded-xl text-center">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">Units</span>
                            <span className="font-extrabold text-slate-900">{proj.total_units}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl text-center">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">Towers</span>
                            <span className="font-extrabold text-slate-900">{proj.total_towers}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl text-center">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">Possession</span>
                            <span className="font-extrabold text-slate-900">{proj.possession_date ? proj.possession_date.substring(0, 7) : "N/A"}</span>
                          </div>
                        </div>

                        {/* Amenities Chips */}
                        {proj.amenities && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.amenities.slice(0, 4).map((amenity, i) => (
                              <span key={i} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md capitalize">
                                {amenity}
                              </span>
                            ))}
                            {proj.amenities.length > 4 && (
                              <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                                +{proj.amenities.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 pt-0">
                      <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs border border-slate-100">
                        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {proj.rera_number || "TN/RERA/Registered"}
                        </span>
                        <span className="font-extrabold text-slate-700 text-xs">
                          {proj.total_listings} units
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">
                Offset: {offset} • Showing {projects.length} builder projects
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
                  disabled={!hasMore || projects.length < limit}
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