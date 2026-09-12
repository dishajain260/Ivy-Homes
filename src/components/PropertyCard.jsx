import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatINR, saveListing, unsaveListing } from "../api/client";
import { Heart, BedDouble, Bath, Maximize2, Compass, Layers, ShieldCheck, MapPin, ArrowRight, AlertTriangle, Sparkles } from "lucide-react";

// Curated high-resolution architecture images
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

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-500/40 shadow-sm hover:shadow-2xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Image Container */}
      <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={listing.apartment_name || "Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Subtle dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/20 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto max-w-[80%]">
            {listing.is_live === false ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-sm flex items-center gap-1">
                Inactive
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 shadow-sm flex items-center gap-1">
                Active
              </span>
            )}

            {listing.is_verified && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-900/90 text-emerald-400 border border-emerald-400/30 backdrop-blur-md shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}

            {listing.is_sqm_converted && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-sm">
                Sq.M Corrected
              </span>
            )}

            {listing.is_corrupt && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Data Anomaly
              </span>
            )}

            {listing.is_fake && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-orange-500 text-white shadow-sm">
                Bait Rate
              </span>
            )}
          </div>

          {/* Heart Save Button */}
          <button
            onClick={handleSaveClick}
            disabled={saving}
            className={`w-9 h-9 rounded-full pointer-events-auto transition flex items-center justify-center shadow-lg backdrop-blur-md ${
              isSaved
                ? "bg-rose-500 text-white hover:bg-rose-600 scale-105"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500 hover:scale-105"
            }`}
            title={isSaved ? "Remove from saved" : "Save property"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Bottom Image Floating Price */}
        <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between pointer-events-none text-white">
          <div>
            <span className="text-2xl font-black tracking-tight drop-shadow-md">
              {formatINR(listing.price)}
            </span>
          </div>

          {listing.price_per_sqft > 0 && (
            <span className="text-[11px] font-bold text-emerald-300 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              ₹{listing.price_per_sqft.toLocaleString("en-IN")}/sq.ft
            </span>
          )}
        </div>

      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & Type */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-slate-600 capitalize">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {listing.locality || "Chennai"}
            </span>
            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
              {listing.property_type || "Apartment"}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/listings/${listing.listing_id}`}
            className="block text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1"
          >
            {listing.apartment_name || "Modern Chennai Property"}
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {listing.description || "Spacious layout with modern society amenities and prime arterial road connectivity."}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="mt-5 pt-3.5 border-t border-slate-100">
          <div className="grid grid-cols-3 gap-2 text-slate-600 text-xs font-semibold mb-4">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <BedDouble className="w-3.5 h-3.5 text-emerald-600" />
              <span>{listing.bedroom ? `${listing.bedroom} BHK` : "Studio"}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Bath className="w-3.5 h-3.5 text-emerald-600" />
              <span>{listing.bathroom || 1} Bath</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{listing.carpet_area_sqft || listing.carpet_area || 0} sq.ft</span>
            </div>
          </div>

          {/* Action Link */}
          <Link
            to={`/listings/${listing.listing_id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 group-hover:bg-emerald-600 shadow-sm"
          >
            <span>Explore Property</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}