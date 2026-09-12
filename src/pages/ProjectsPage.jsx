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
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-ivy-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            Verified Chennai Masterplans
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Builder Projects & Societies
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            RERA registered communities with normalized Indian rupee valuations and unit inventories.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Locality</label>
            <select
              value={locality}
              onChange={(e) => { setLocality(e.target.value); setOffset(0); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white"
            >
              {CHENNAI_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "All" ? "All Localities" : loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Project Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setOffset(0); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="under construction">Under Construction</option>
              <option value="ready to move">Ready to Move</option>
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
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No builder projects found</h3>
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
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    {/* Project Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img src={img} alt={proj.apartment_name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm capitalize ${
                          isReady ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"
                        }`}>
                          {proj.project_status}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-xl font-extrabold tracking-tight drop-shadow-md">
                          {formatINR(proj.price_min_inr)} - {formatINR(proj.price_max_inr)}
                        </div>
                        <div className="text-[11px] text-slate-300 font-medium">
                          {proj.min_area_sqft} - {proj.max_area_sqft} sq.ft
                        </div>
                      </div>
                    </div>

                    {/* Project Body */}
                    <div className="p-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="flex items-center gap-1 text-slate-700 capitalize font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-ivy-600" />
                          {proj.locality}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 font-bold">
                          {proj.project_id}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">
                        {proj.apartment_name}
                      </h3>
                      
                      <p className="text-xs text-slate-600 font-medium mb-3">
                        By {proj.developer_name}
                      </p>

                      <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600 font-medium mb-3">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Units</span>
                          <span className="font-bold text-slate-800">{proj.total_units}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Towers</span>
                          <span className="font-bold text-slate-800">{proj.total_towers}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Possession</span>
                          <span className="font-bold text-slate-800">{proj.possession_date ? proj.possession_date.substring(0, 7) : "N/A"}</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      {proj.amenities && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                          {proj.amenities.slice(0, 4).map((amenity, i) => (
                            <span key={i} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded capitalize">
                              {amenity}
                            </span>
                          ))}
                          {proj.amenities.length > 4 && (
                            <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
                              +{proj.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RERA Footer */}
                  <div className="p-4 pt-0">
                    <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-ivy-600" />
                        {proj.rera_number || "TN/RERA/Registered"}
                      </span>
                      <span className="font-bold text-slate-700">
                        {proj.total_listings} active listings
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200">
            <span className="text-xs font-medium text-slate-500">
              Offset: {offset} • Showing {projects.length} results
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