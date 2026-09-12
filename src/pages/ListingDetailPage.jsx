import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getListingDetail, getListings, formatINR, saveListing, unsaveListing, getSaved } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import { ArrowLeft, Heart, BedDouble, Bath, Maximize2, Compass, Layers, Car, ShieldCheck, MapPin, Phone, User, Calendar, ExternalLink, AlertTriangle, Building, CheckCircle2 } from "lucide-react";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80"
];

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const item = await getListingDetail(id);
        if (!isMounted) return;
        setListing(item);

        // Check if saved
        const savedList = await getSaved().catch(() => []);
        if (isMounted) {
          setIsSaved(savedList.some((s) => s.listing_id === id));
        }

        // Fetch similar listings client-side (same locality and bedroom)
        const simData = await getListings({
          locality: item.locality,
          bhk: item.bedroom,
          limit: 6
        }).catch(() => ({ results: [] }));
        
        if (isMounted) {
          setSimilar((simData.results || []).filter((x) => x.listing_id !== id).slice(0, 3));
        }

      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load listing");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [id]);

  const handleToggleSave = async () => {
    if (saving || !listing) return;
    setSaving(true);
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      if (nextSaved) {
        await saveListing(listing.listing_id);
      } else {
        await unsaveListing(listing.listing_id);
      }
    } catch (err) {
      setIsSaved(!nextSaved);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="w-10 h-10 border-4 border-ivy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-500">Loading verified property details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-rose-50 rounded-3xl border border-rose-200">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Property Not Found</h2>
          <p className="text-xs text-rose-600 mt-2">{error || "Could not retrieve property record."}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Return to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSave}
            disabled={saving}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              isSaved
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-white border border-slate-200 text-slate-700 hover:text-rose-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved to Shortlist" : "Save Property"}
          </button>
        </div>
      </div>

      {/* Title & Location Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-ivy-700 mb-1">
            <span className="flex items-center gap-1 capitalize">
              <MapPin className="w-3.5 h-3.5" />
              {listing.locality}, Chennai
            </span>
            <span>•</span>
            <span className="capitalize">{listing.property_type}</span>
            <span>•</span>
            <span className="font-mono text-slate-400">ID: {listing.listing_id}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {listing.apartment_name || "Premium Residential Property"}
          </h1>
        </div>

        {/* Pricing Header */}
        <div className="md:text-right">
          <div className="text-3xl font-extrabold text-slate-900">
            {formatINR(listing.price)}
          </div>
          {listing.price_per_sqft > 0 && (
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              ₹{listing.price_per_sqft.toLocaleString("en-IN")}/sq.ft
            </div>
          )}
        </div>
      </div>

      {/* Badges Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {listing.is_live ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active Listing
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Inactive / Expired
          </span>
        )}
        {listing.is_verified && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-ivy-100 text-ivy-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified by Ivy Homes
          </span>
        )}
        {listing.is_sqm_converted && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            Unit Normalized ({listing.carpet_area} sq.m → {listing.carpet_area_sqft} sq.ft)
          </span>
        )}
        {listing.is_corrupt && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            Data Anomaly Detected
          </span>
        )}
        {listing.is_fake && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
            Bait Price Rate
          </span>
        )}
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-3 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-200">
          <img
            src={GALLERY_IMAGES[activePhoto]}
            alt="Main property view"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
          {GALLERY_IMAGES.slice(1).map((img, i) => (
            <button
              key={i}
              onClick={() => setActivePhoto(i + 1)}
              className={`aspect-[16/10] rounded-xl overflow-hidden border-2 transition ${
                activePhoto === i + 1 ? "border-ivy-600 scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Key Specifications Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-4">Property Specifications</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <BedDouble className="w-5 h-5 text-ivy-600 mx-auto mb-1.5" />
            <div className="text-xs text-slate-400 font-medium">Bedrooms</div>
            <div className="text-sm font-bold text-slate-800">{listing.bedroom ? `${listing.bedroom} BHK` : "Studio"}</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <Bath className="w-5 h-5 text-ivy-600 mx-auto mb-1.5" />
            <div className="text-xs text-slate-400 font-medium">Bathrooms</div>
            <div className="text-sm font-bold text-slate-800">{listing.bathroom || 1}</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <Maximize2 className="w-5 h-5 text-ivy-600 mx-auto mb-1.5" />
            <div className="text-xs text-slate-400 font-medium">Carpet Area</div>
            <div className="text-sm font-bold text-slate-800">{listing.carpet_area_sqft || listing.carpet_area} sq.ft</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <Layers className="w-5 h-5 text-ivy-600 mx-auto mb-1.5" />
            <div className="text-xs text-slate-400 font-medium">Floor Level</div>
            <div className="text-sm font-bold text-slate-800">{listing.floor ?? 0} of {listing.total_floors ?? 0}</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <Compass className="w-5 h-5 text-ivy-600 mx-auto mb-1.5" />
            <div className="text-xs text-slate-400 font-medium">Facing</div>
            <div className="text-sm font-bold text-slate-800 capitalize">{listing.facing_direction || "Open"}</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <Car className="w-5 h-5 text-ivy-600 mx-auto mb-1.5" />
            <div className="text-xs text-slate-400 font-medium">Covered Parking</div>
            <div className="text-sm font-bold text-slate-800">{listing.covered_parking || 0} Slots</div>
          </div>

        </div>
      </div>

      {/* Two Column Section: Description & Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Left 2 Cols: Description & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-3">About this Property</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {listing.description || "No description provided for this listing."}
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Super Built-up Area:</span>
                <span className="font-semibold text-slate-800">{listing.super_built_up_area_sqft || listing.super_built_up_area || "N/A"} sq.ft</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Furnishing Status:</span>
                <span className="font-semibold text-slate-800 capitalize">{listing.furnishing || "Unfurnished"}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Balconies:</span>
                <span className="font-semibold text-slate-800">{listing.balcony ?? 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Source Portal:</span>
                <span className="font-semibold text-slate-800 capitalize">{listing.website || "Internal"}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Posted Date:</span>
                <span className="font-semibold text-slate-800">{listing.posted_at ? new Date(listing.posted_at).toLocaleDateString() : "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Coordinates:</span>
                <span className="font-semibold text-slate-800">{listing.latitude?.toFixed(4)}, {listing.longitude?.toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Builder Project Banner if available */}
          {listing.project_id && (
            <div className="bg-gradient-to-r from-ivy-900 to-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-ivy-300 uppercase block mb-1">
                  Builder Project Affiliation
                </span>
                <h3 className="text-lg font-bold">Associated Project: {listing.project_id}</h3>
                <p className="text-xs text-slate-300 mt-1">View society masterplan, amenities, and available inventory.</p>
              </div>
              <Link
                to={`/projects`}
                className="px-4 py-2 bg-ivy-600 hover:bg-ivy-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 flex-shrink-0"
              >
                <Building className="w-4 h-4" />
                View Project
              </Link>
            </div>
          )}
        </div>

        {/* Right 1 Col: Seller & Enquiry Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <h2 className="text-base font-bold text-slate-900 mb-4">Seller & Contact Information</h2>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-ivy-100 text-ivy-800 flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5 text-ivy-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{listing.posted_by_name || "Verified Agent"}</h3>
                <p className="text-xs text-slate-500 capitalize">{listing.posted_by || "Agent"} • Chennai</p>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${listing.posted_by_contact}`}
                className="w-full py-3 px-4 rounded-xl bg-ivy-600 hover:bg-ivy-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Call {listing.posted_by_contact || "Seller"}
              </a>

              {listing.listing_url && (
                <a
                  href={listing.listing_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Original Listing on {listing.website || "Portal"}
                </a>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-4 leading-relaxed">
              Ivy Homes coordinates visits and title deeds verification.
            </p>
          </div>
        </div>

      </div>

      {/* Similar Properties Section */}
      {similar.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
            Comparable Properties in {listing.locality}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Similar bedroom configuration and neighborhood pricing.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((s) => (
              <PropertyCard key={s.listing_id} listing={s} isSavedInitially={isSaved} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}