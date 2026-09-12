import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatINR, saveListing, unsaveListing } from "../api/client";
import { Heart, BedDouble, Bath, Maximize2, Compass, Layers, CheckCircle2, AlertTriangle, ShieldCheck, MapPin } from "lucide-react";

// Image palette based on property type / BHK
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"
];

export default function PropertyCard({ listing, isSavedInitially = false, onToggleSave }) {
  const [isSaved, setIsSaved] = useState(isSavedInitially);
  const [saving, setSaving] = useState(false);

  // Pick deterministic image based on listing_id hash
  const imgIdx = Math.abs(
    (listing.listing_id || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  ) % DEFAULT_IMAGES.length;
  const imageUrl = DEFAULT_IMAGES[imgIdx];

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;

    setSaving(true);
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    try {
      if (nextSaved) {
        await saveListing(listing.listing_id);
      } else {
        await unsaveListing(listing.listing_id);
      }
      if (onToggleSave) onToggleSave(listing.listing_id, nextSaved);
    } catch (err) {
      console.error("Save listing toggle failed", err);
      setIsSaved(!nextSaved); // revert on error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-ivy-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Card Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={listing.apartment_name || "Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            {listing.is_live === false && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/90 text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
                Inactive
              </span>
            )}
            {listing.is_verified && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}
            {listing.is_sqm_converted && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/90 text-white backdrop-blur-sm shadow-sm">
                Sq.M Normalised
              </span>
            )}
            {listing.is_corrupt && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-600/90 text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Anomaly
              </span>
            )}
            {listing.is_fake && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-600/90 text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
                Bait Rate
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleSaveClick}
            disabled={saving}
            className={`p-2.5 rounded-full pointer-events-auto transition shadow-md ${
              isSaved
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500 backdrop-blur-sm"
            }`}
            title={isSaved ? "Remove from saved" : "Save property"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Bottom Image Info: Price */}
        <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold tracking-tight drop-shadow-md">
              {formatINR(listing.price)}
            </span>
            {listing.price_per_sqft > 0 && (
              <span className="text-xs font-medium text-slate-200 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                ₹{listing.price_per_sqft.toLocaleString("en-IN")}/sq.ft
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & Type */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span className="flex items-center gap-1 text-slate-600 capitalize">
              <MapPin className="w-3.5 h-3.5 text-ivy-600" />
              {listing.locality || "Chennai"}
            </span>
            <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-[11px]">
              {listing.property_type || "Apartment"}
            </span>
          </div>

          {/* Apartment Title */}
          <Link
            to={`/listings/${listing.listing_id}`}
            className="block text-base font-bold text-slate-900 group-hover:text-ivy-700 transition line-clamp-1"
          >
            {listing.apartment_name || "Modern Residential Property"}
          </Link>
          
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {listing.description || "Spacious living space with high connectivity in prime Chennai locality."}
          </p>
        </div>

        {/* Property Highlights / Metrics */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-slate-600 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5 text-slate-400" />
            <span>{listing.bedroom ? `${listing.bedroom} BHK` : "Studio"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span>{listing.bathroom || 1} Bath</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{listing.carpet_area_sqft || listing.carpet_area || 0} sq.ft</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Fl {listing.floor ?? 0}/{listing.total_floors ?? 0}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{listing.facing_direction || "Facing open"}</span>
          </div>
        </div>

        {/* View Details Link */}
        <div className="mt-4 pt-2">
          <Link
            to={`/listings/${listing.listing_id}`}
            className="w-full inline-flex items-center justify-center py-2 px-4 rounded-xl bg-slate-100 hover:bg-ivy-50 hover:text-ivy-700 text-slate-700 text-xs font-bold transition"
          >
            View Full Listing
          </Link>
        </div>
      </div>
    </div>
  );
}