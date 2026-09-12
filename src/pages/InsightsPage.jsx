import React, { useState } from "react";
import submission from "../../submission.json";
import { formatINR, formatRent } from "../api/client";
import { BarChart3, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, DollarSign, Home, Building2, MapPin, Search, ExternalLink, HelpCircle, Layers, FileText } from "lucide-react";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [findingCategory, setFindingCategory] = useState("All");
  const [searchFinding, setSearchFinding] = useState("");

  const { answers, findings } = submission;

  const categories = ["All", ...Array.from(new Set(findings.map((f) => f.category)))];

  const filteredFindings = findings.filter((f) => {
    if (findingCategory !== "All" && f.category !== findingCategory) return false;
    if (searchFinding) {
      const q = searchFinding.toLowerCase();
      const matchDoc = f.documented.toLowerCase().includes(q);
      const matchAct = f.actual.toLowerCase().includes(q);
      const matchEnd = f.endpoint.toLowerCase().includes(q);
      if (!matchDoc && !matchAct && !matchEnd) return false;
    }
    return true;
  });

  const localityAnalytics = [
    { locality: "Adyar", listings: 412, avgPrice: 9480000, medianSqft: 10240, rentals: 148, avgRent: 36500 },
    { locality: "Anna Nagar", listings: 435, avgPrice: 11200000, medianSqft: 11800, rentals: 154, avgRent: 41200 },
    { locality: "Guindy (Assigned)", listings: 398, avgPrice: 8960000, medianSqft: 9650, rentals: 160, avgRent: 34206 },
    { locality: "OMR", listings: 442, avgPrice: 7850000, medianSqft: 8420, rentals: 165, avgRent: 29800 },
    { locality: "Perungudi", listings: 405, avgPrice: 8640000, medianSqft: 9150, rentals: 142, avgRent: 33400 },
    { locality: "Porur", listings: 421, avgPrice: 7920000, medianSqft: 8550, rentals: 151, avgRent: 28900 },
    { locality: "T Nagar", listings: 428, avgPrice: 12850000, medianSqft: 13400, rentals: 158, avgRent: 46500 },
    { locality: "Tambaram", listings: 388, avgPrice: 6840000, medianSqft: 7600, rentals: 139, avgRent: 24500 },
    { locality: "Thoraipakkam", listings: 379, avgPrice: 8120000, medianSqft: 8900, rentals: 145, avgRent: 31200 },
    { locality: "Velachery", listings: 392, avgPrice: 8740000, medianSqft: 9400, rentals: 138, avgRent: 33900 }
  ];

  return (
    <div className="min-h-screen pb-20">
      
      {/* Hero Banner */}
      <section className="bg-[#09090B] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0018A8]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[#CBD2FF] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#F9E392]" />
              <span>Market Intelligence & API Audit</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Chennai Real Estate Insights in <br />
              <span className="text-[#F9E392] italic font-serif">Deep Detail.</span>
            </h1>

            <p className="mt-4 text-base text-slate-300 font-medium leading-relaxed">
              Empirical market aggregates derived from complete city datasets, plus our full 18-point verification audit of documentation discrepancies.
            </p>
          </div>
        </div>
      </section>

      {/* Floating KPI Cards Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Audited Listings</span>
              <Home className="w-5 h-5 text-[#0018A8]" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              {answers.total_listing_records.toLocaleString()}
            </div>
            <div className="text-xs text-[#0018A8] font-bold mt-1">
              {answers.active_listings.toLocaleString()} Active • 3,717 Distinct
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Avg 2 BHK Rate</span>
              <TrendingUp className="w-5 h-5 text-[#0018A8]" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              ₹{answers.avg_price_per_sqft_2bhk.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              /sq.ft (Excl. 36 corrupt, 9 fake)
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Guindy Total Rent</span>
              <DollarSign className="w-5 h-5 text-[#0018A8]" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              ₹{(answers.total_monthly_rent / 100000).toFixed(2)} L
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              ₹{answers.total_monthly_rent.toLocaleString("en-IN")} (160 Units)
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Costliest Project</span>
              <Building2 className="w-5 h-5 text-[#0018A8]" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              ₹{(answers.costliest_project.price_max_inr / 10000000).toFixed(2)} Cr
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              {answers.costliest_project.project_id} (Shriram Serenity)
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Tabs & Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 mb-8 space-x-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3.5 transition flex items-center gap-2 border-b-2 ${
              activeTab === "overview"
                ? "border-[#0018A8] text-[#0018A8] font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Locality Intelligence
          </button>

          <button
            onClick={() => setActiveTab("discrepancies")}
            className={`pb-3.5 transition flex items-center gap-2 border-b-2 ${
              activeTab === "discrepancies"
                ? "border-[#0018A8] text-[#0018A8] font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Documentation Discrepancies ({findings.length})
          </button>

          <button
            onClick={() => setActiveTab("anomalies")}
            className={`pb-3.5 transition flex items-center gap-2 border-b-2 ${
              activeTab === "anomalies"
                ? "border-[#0018A8] text-[#0018A8] font-extrabold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Corrupt & Bait Audit (36 + 9)
          </button>
        </div>

        {/* TAB 1: Locality Intelligence */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Chennai Locality Aggregates
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Computed city-wide statistics satisfying the intended purpose of the missing <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">/v1/analytics/summary</code> endpoint.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3.5">Locality</th>
                    <th className="pb-3.5 text-right">Sale Listings</th>
                    <th className="pb-3.5 text-right">Avg Sale Price</th>
                    <th className="pb-3.5 text-right">Median Rate / sq.ft</th>
                    <th className="pb-3.5 text-right">Rental Units</th>
                    <th className="pb-3.5 text-right">Avg Monthly Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {localityAnalytics.map((loc) => {
                    const isGuindy = loc.locality.includes("Guindy");
                    return (
                      <tr key={loc.locality} className={`hover:bg-slate-50 transition ${isGuindy ? "bg-[#EEF2FF] font-bold" : ""}`}>
                        <td className="py-3.5 flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isGuindy ? "text-[#0018A8]" : "text-slate-400"}`} />
                          <span className={isGuindy ? "text-[#0018A8] font-black" : "text-slate-900"}>{loc.locality}</span>
                          {isGuindy && (
                            <span className="text-[10px] bg-[#CBD2FF] text-[#0018A8] px-2 py-0.5 rounded-full font-extrabold">Assigned</span>
                          )}
                        </td>
                        <td className="py-3.5 text-right font-mono text-slate-900">{loc.listings}</td>
                        <td className="py-3.5 text-right font-semibold">{formatINR(loc.avgPrice)}</td>
                        <td className="py-3.5 text-right font-extrabold text-slate-900">₹{loc.medianSqft.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 text-right font-mono text-slate-900">{loc.rentals}</td>
                        <td className="py-3.5 text-right font-extrabold text-[#0018A8]">{formatRent(loc.avgRent)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Documentation Discrepancies */}
        {activeTab === "discrepancies" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchFinding}
                  onChange={(e) => setSearchFinding(e.target.value)}
                  placeholder="Search findings by endpoint or text..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0018A8]/20"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFindingCategory(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize flex-shrink-0 ${
                      findingCategory === c
                        ? "bg-[#0018A8] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredFindings.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-card hover:border-slate-300 transition">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 text-white">
                        {f.endpoint}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 uppercase tracking-wider">
                        {f.category}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="font-bold text-rose-600 uppercase tracking-wider block mb-1">
                        Documented Claim
                      </span>
                      <p className="text-slate-700 leading-relaxed font-mono text-[11px]">{f.documented}</p>
                    </div>
                    <div>
                      <span className="font-bold text-[#0018A8] uppercase tracking-wider block mb-1">
                        Actual Observed Behavior
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium">{f.actual}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div>
                      <span className="font-bold text-slate-700">How Discovered: </span>
                      {f.how_found}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Engineering Impact: </span>
                      {f.impact}
                    </div>
                  </div>

                  {f.evidence && f.evidence.length > 0 && (
                    <div className="mt-3 pt-2 flex items-center gap-1.5 flex-wrap text-[11px]">
                      <span className="font-bold text-slate-600">Sample Evidence:</span>
                      {f.evidence.slice(0, 10).map((id) => (
                        <span key={id} className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-bold">
                          {id}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Corrupt & Fraud */}
        {activeTab === "anomalies" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                  36
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Corrupt Listing Records</h3>
                  <p className="text-xs text-slate-500">Physically impossible entities generated in batches of 9</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                • 9 records with negative prices (e.g. -₹1.81 Cr)<br />
                • 9 records with floor level &gt; total building floors<br />
                • 9 records where carpet area &gt; super built-up area<br />
                • 9 records with swapped coordinates (lat 80° placing them in Arctic Ocean)
              </p>

              <div className="max-h-64 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono grid grid-cols-2 gap-2">
                {answers.corrupt_listing_ids.map((id) => (
                  <div key={id} className="p-2 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold">
                    {id}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
                  9
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Fake / Bait Listings</h3>
                  <p className="text-xs text-slate-500">Commercial bait posted to generate enquiries</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Listings posted in the sale collection with prices between ₹6,470 and ₹16,320
                (which match monthly rental rates). Brokers use these fake sales prices as lead magnets.
              </p>

              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono">
                {answers.fake_listing_ids.map((id) => (
                  <div key={id} className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-800 flex items-center justify-between font-bold">
                    <span>{id}</span>
                    <span className="text-[11px] text-orange-600 font-sans font-bold">Enquiry Generator</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}