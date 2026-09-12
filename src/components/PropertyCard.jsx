import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatINR, saveListing, unsaveListing } from "../api/client";
import { Heart, BedDouble, Bath, Maximize2, ShieldCheck, MapPin, ArrowRight, AlertTriangle } from "lucide-react";

const IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80"
];

export default function PropertyCard({ listing, isSavedInitially = false, onToggleSave }) {
  const [isSaved, setIsSaved] = useState(isSavedInitially);
  const [saving, setSaving] = useState(false);

  const hash = (listing.listing_id || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const imageUrl = IMAGES[Math.abs(hash) % IMAGES.length];

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;

    setSaving(true);
    const next = !isSaved;
    setIsSaved(next);
    try {
      if (next) await saveListing(listing.listing_id);
      else await unsaveListing(listing.listing_id);
      if (onToggleSave) onToggleSave(listing.listing_id, next);
    } catch {
      setIsSaved(!next);
    } finally {
      setSaving(false);
    }
  };

  const formattedArea = listing.carpet_area_sqft || listing.carpet_area || 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#0018A8]/40 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={listing.apartment_name || "Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto max-w-[80%]">
            {listing.is_live === false ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-xs">
                Inactive
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                Active
              </span>
            )}

            {listing.is_verified && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0018A8] text-white backdrop-blur-md shadow-xs flex items-center gap-1 border border-white/20">
                <ShieldCheck className="w-3 h-3 text-[#F9E392]" /> Verified by Ivy
              </span>
            )}

            {listing.is_sqm_converted && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-xs">
                Sq.M Converted
              </span>
            )}

            {listing.is_corrupt && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-700 text-white shadow-xs flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Anomaly
              </span>
            )}

            {listing.is_fake && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-600 text-white shadow-xs">
                Bait Enquiry
              </span>
            )}
          </div>

          {/* Heart Bookmark Button */}
          <button
            onClick={handleSaveClick}
            disabled={saving}
            className={`w-9 h-9 rounded-full pointer-events-auto transition-all flex items-center justify-center shadow-md backdrop-blur-md ${
              isSaved
                ? "bg-rose-500 text-white hover:bg-rose-600 scale-105"
                : "bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 hover:scale-105"
            }`}
            title={isSaved ? "Remove from saved" : "Save property"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Bottom image location tag */}
        <div className="absolute bottom-2.5 left-3 pointer-events-none">
          <span className="text-[11px] font-bold text-white/95 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/15">
            <MapPin className="w-3 h-3 text-[#F9E392]" />
            {listing.locality || "Chennai"}
          </span>
        </div>

      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Price & Rate */}
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatINR(listing.price)}
            </span>
            {listing.price_per_sqft > 0 && (
              <span className="text-xs font-bold text-[#0018A8] bg-[#EEF2FF] border border-[#CBD2FF] px-2 py-0.5 rounded-lg">
                ₹{listing.price_per_sqft.toLocaleString("en-IN")}/sq.ft
              </span>
            )}
          </div>

          {/* Property Title */}
          <Link
            to={`/listings/${listing.listing_id}`}
            className="block text-base font-bold text-slate-900 hover:text-[#0018A8] transition line-clamp-1 mt-2 group-hover:underline decoration-[#0018A8]/40 underline-offset-2"
          >
            {listing.apartment_name || "Chennai Residential Property"}
          </Link>

          {/* Short Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {listing.description || "Spacious residence featuring high-grade finishes, ample ventilation, and gated community infrastructure."}
          </p>
        </div>

        {/* Specs & Footer */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          
          {/* Spec Pills */}
          <div className="grid grid-cols-3 gap-1.5 text-slate-700 text-xs font-semibold mb-3.5">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
              <BedDouble className="w-3.5 h-3.5 text-[#0018A8]" />
              <span>{listing.bedroom ? `${listing.bedroom} BHK` : "Studio"}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
              <Bath className="w-3.5 h-3.5 text-[#0018A8]" />
              <span>{listing.bathroom || 1} Bath</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
              <Maximize2 className="w-3.5 h-3.5 text-[#0018A8]" />
              <span>{formattedArea} sqft</span>
            </div>
          </div>

          {/* CTA & Type */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {listing.property_type || "Apartment"}
            </span>

            <Link
              to={`/listings/${listing.listing_id}`}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0018A8] hover:text-[#00118A] transition group/link"
            >
              <span>Explore Property</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}