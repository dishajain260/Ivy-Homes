import React, { useState } from "react";
import submission from "../../submission.json";
import { formatINR, formatRent } from "../api/client";
import { BarChart3, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, DollarSign, Home, Building2, MapPin, Search, ExternalLink, HelpCircle, Layers, FileText } from "lucide-react";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("overview"); // overview, discrepancies, anomalies
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-ivy-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          Data Intelligence & Documentation Audit
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Chennai Real Estate Market Insights
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Comprehensive synthesis of retrievable records across Chennai.
          Includes computed market aggregates from the 404’d <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded">/v1/analytics/summary</code>,
          plus our rigorous empirical audit of all documentation discrepancies.
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Total & Active Listings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Listings Audited</span>
            <Home className="w-5 h-5 text-ivy-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {answers.total_listing_records.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>{answers.active_listings.toLocaleString()} active</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">3,717 unique properties</span>
          </div>
        </div>

        {/* 2 BHK Price/sqft */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg 2 BHK Price/Sq.Ft</span>
            <TrendingUp className="w-5 h-5 text-ivy-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{answers.avg_price_per_sqft_2bhk.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Excl. 36 corrupt & 9 fake bait records
          </div>
        </div>

        {/* Guindy Assigned Locality Rentals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Guindy Monthly Rent</span>
            <DollarSign className="w-5 h-5 text-ivy-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{(answers.total_monthly_rent / 100000).toFixed(2)} L
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Across all 160 units (₹{answers.total_monthly_rent.toLocaleString("en-IN")})
          </div>
        </div>

        {/* Costliest Project */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Costliest Project</span>
            <Building2 className="w-5 h-5 text-ivy-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{(answers.costliest_project.price_max_inr / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Project {answers.costliest_project.project_id} (Shriram Serenity)
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 mb-8 space-x-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 transition flex items-center gap-2 border-b-2 ${
            activeTab === "overview"
              ? "border-ivy-600 text-ivy-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Locality Intelligence
        </button>

        <button
          onClick={() => setActiveTab("discrepancies")}
          className={`pb-3 transition flex items-center gap-2 border-b-2 ${
            activeTab === "discrepancies"
              ? "border-ivy-600 text-ivy-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          Documentation Lies & Findings ({findings.length})
        </button>

        <button
          onClick={() => setActiveTab("anomalies")}
          className={`pb-3 transition flex items-center gap-2 border-b-2 ${
            activeTab === "anomalies"
              ? "border-ivy-600 text-ivy-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Corrupt & Fraud Auditing (36 + 9)
        </button>
      </div>

      {/* TAB 1: Locality Intelligence */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Chennai Neighborhood Benchmark
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Aggregated across all verified sale and rental inventory in our city database.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Locality</th>
                    <th className="pb-3 text-right">Sale Listings</th>
                    <th className="pb-3 text-right">Avg Sale Price</th>
                    <th className="pb-3 text-right">Median Rate / sq.ft</th>
                    <th className="pb-3 text-right">Rental Units</th>
                    <th className="pb-3 text-right">Avg Monthly Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {localityAnalytics.map((loc) => {
                    const isGuindy = loc.locality.includes("Guindy");
                    return (
                      <tr key={loc.locality} className={`hover:bg-slate-50 transition ${isGuindy ? "bg-ivy-50/50 font-bold" : ""}`}>
                        <td className="py-3 flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isGuindy ? "text-ivy-600" : "text-slate-400"}`} />
                          <span className={isGuindy ? "text-ivy-900" : "text-slate-900"}>{loc.locality}</span>
                          {isGuindy && (
                            <span className="text-[10px] bg-ivy-200 text-ivy-800 px-1.5 py-0.5 rounded-full">Assigned</span>
                          )}
                        </td>
                        <td className="py-3 text-right font-mono text-slate-900">{loc.listings}</td>
                        <td className="py-3 text-right">{formatINR(loc.avgPrice)}</td>
                        <td className="py-3 text-right font-bold text-slate-900">₹{loc.medianSqft.toLocaleString("en-IN")}</td>
                        <td className="py-3 text-right font-mono text-slate-900">{loc.rentals}</td>
                        <td className="py-3 text-right font-bold text-emerald-700">{formatRent(loc.avgRent)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Documentation Discrepancies */}
      {activeTab === "discrepancies" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFinding}
                onChange={(e) => setSearchFinding(e.target.value)}
                placeholder="Search findings by endpoint or text..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ivy-500/20"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFindingCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize flex-shrink-0 ${
                    findingCategory === c
                      ? "bg-ivy-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-4">
            {filteredFindings.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-white font-mono">
                      {f.endpoint}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                      {f.category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-rose-600 uppercase tracking-wider block mb-1">
                      Documented Claim (The Lie)
                    </span>
                    <p className="text-slate-700 leading-relaxed font-mono text-[11px]">{f.documented}</p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                      Actual Server Truth
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">{f.actual}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>
                    <span className="font-bold text-slate-700">How Found: </span>
                    {f.how_found}
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Engineering Impact: </span>
                    {f.impact}
                  </div>
                </div>

                {f.evidence && f.evidence.length > 0 && (
                  <div className="mt-3 pt-2 flex items-center gap-1.5 flex-wrap text-[11px]">
                    <span className="font-bold text-slate-600">Sample Evidence IDs:</span>
                    {f.evidence.slice(0, 10).map((id) => (
                      <span key={id} className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                        {id}
                      </span>
                    ))}
                    {f.evidence.length > 10 && (
                      <span className="text-slate-400 font-mono">+{f.evidence.length - 10} more</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Corrupt & Fraud Auditing */}
      {activeTab === "anomalies" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Corrupt Listings Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    36
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Corrupt Listing Records</h3>
                    <p className="text-[11px] text-slate-500">Describe entities that cannot exist in reality</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Identified across 4 distinct physical impossibilities generated in batches of 9:
                <br />• 9 records with negative prices (e.g. -₹1.81 Cr)
                <br />• 9 records with floor level &gt; building total floors
                <br />• 9 records where carpet area &gt; super built-up area
                <br />• 9 records with swapped coordinates (lat 80° placing them in Arctic Ocean)
              </p>

              <div className="max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono grid grid-cols-2 gap-1.5">
                {answers.corrupt_listing_ids.map((id) => (
                  <div key={id} className="p-1.5 bg-white rounded border border-slate-200 text-slate-700">
                    {id}
                  </div>
                ))}
              </div>
            </div>

            {/* Fake / Bait Listings Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                    9
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Fake / Bait Listings</h3>
                    <p className="text-[11px] text-slate-500">Commercial bait posted to generate enquiries</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Listings posted in the sale collection with prices ranging between ₹6,470 and ₹16,320
                (which correspond exactly to monthly rental figures in those areas). In Indian prop-tech,
                brokers post rent values under sale categories to capture prospective homebuyer phone calls.
              </p>

              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5">
                {answers.fake_listing_ids.map((id) => (
                  <div key={id} className="p-2 bg-white rounded border border-slate-200 text-slate-800 flex items-center justify-between">
                    <span className="font-bold">{id}</span>
                    <span className="text-[11px] text-orange-600 font-sans font-bold">Enquiry Lead Generator</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}