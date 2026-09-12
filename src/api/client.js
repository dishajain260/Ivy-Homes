// Ivy Homes API Client & Auth Manager

const BASE_URL = "https://solve.ivy.homes";
export const DEFAULT_API_KEY = "IVY26-55BECC886D73";
export const DEMO_PASSWORD = "9c07e285fc";
export const DEMO_USERS = [
  "demo1@ivy.homes",
  "demo2@ivy.homes",
  "demo3@ivy.homes"
];

// Token & Session Storage Keys
const KEY_ACCESS_TOKEN = "ivy_access_token";
const KEY_REFRESH_TOKEN = "ivy_refresh_token";
const KEY_EXPIRES_AT = "ivy_expires_at";
const KEY_USER = "ivy_user";
const KEY_SAVED_LOCAL = "ivy_saved_local";

let refreshPromise = null;

export const authStorage = {
  getAccessToken: () => localStorage.getItem(KEY_ACCESS_TOKEN),
  getRefreshToken: () => localStorage.getItem(KEY_REFRESH_TOKEN),
  getUser: () => {
    try {
      const u = localStorage.getItem(KEY_USER);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  getExpiresAt: () => {
    const t = localStorage.getItem(KEY_EXPIRES_AT);
    return t ? parseInt(t, 10) : 0;
  },
  setSession: (data) => {
    if (data.access_token) localStorage.setItem(KEY_ACCESS_TOKEN, data.access_token);
    if (data.refresh_token) localStorage.setItem(KEY_REFRESH_TOKEN, data.refresh_token);
    if (data.expires_in) {
      const expiresAt = Date.now() + (data.expires_in * 1000) - 30000; // 30s buffer
      localStorage.setItem(KEY_EXPIRES_AT, expiresAt.toString());
    }
    if (data.user) localStorage.setItem(KEY_USER, JSON.stringify(data.user));
  },
  clearSession: () => {
    localStorage.removeItem(KEY_ACCESS_TOKEN);
    localStorage.removeItem(KEY_REFRESH_TOKEN);
    localStorage.removeItem(KEY_EXPIRES_AT);
    localStorage.removeItem(KEY_USER);
  },
  isAuthenticated: () => {
    return !!localStorage.getItem(KEY_ACCESS_TOKEN);
  }
};

// Auto refresh background scheduler
let refreshTimer = null;
export function startTokenRefreshTimer() {
  if (refreshTimer) clearTimeout(refreshTimer);
  
  const scheduleNext = () => {
    const expiresAt = authStorage.getExpiresAt();
    if (!expiresAt) return;
    const now = Date.now();
    const delay = Math.max(10000, expiresAt - now - 60000); // 1 minute before expiry
    
    refreshTimer = setTimeout(async () => {
      try {
        if (authStorage.getRefreshToken()) {
          console.log("[Auth] Proactively refreshing token in background...");
          await refreshToken();
          scheduleNext();
        }
      } catch (err) {
        console.error("[Auth] Background refresh failed:", err);
      }
    }, delay);
  };
  scheduleNext();
}

export async function login(email, password) {
  const resp = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": DEFAULT_API_KEY
    },
    body: JSON.stringify({ email, password })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail || `Login failed with status ${resp.status}`);
  }

  const data = await resp.json();
  authStorage.setSession(data);
  startTokenRefreshTimer();
  return data;
}

export async function refreshToken() {
  if (refreshPromise) return refreshPromise;

  const rToken = authStorage.getRefreshToken();
  if (!rToken) {
    authStorage.clearSession();
    throw new Error("No refresh token available");
  }

  refreshPromise = (async () => {
    try {
      const resp = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": DEFAULT_API_KEY
        },
        body: JSON.stringify({ refresh_token: rToken })
      });

      if (!resp.ok) {
        authStorage.clearSession();
        throw new Error("Token refresh rejected by server");
      }

      const data = await resp.json();
      authStorage.setSession(data);
      return data.access_token;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function logout() {
  if (refreshTimer) clearTimeout(refreshTimer);
  const token = authStorage.getAccessToken();
  try {
    if (token) {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "X-API-Key": DEFAULT_API_KEY,
          "Authorization": `Bearer ${token}`
        }
      });
    }
  } catch (err) {
    console.warn("Logout request error:", err);
  } finally {
    authStorage.clearSession();
  }
}

// Low-level fetch wrapper with automatic token refresh & header injection
async function apiFetch(path, options = {}) {
  let token = authStorage.getAccessToken();
  const expiresAt = authStorage.getExpiresAt();

  if (token && expiresAt && Date.now() > expiresAt - 30000) {
    try {
      token = await refreshToken();
    } catch {
      // let request try with existing token
    }
  }

  const headers = {
    "X-API-Key": DEFAULT_API_KEY,
    ...(options.headers || {})
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let resp = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (resp.status === 401 && authStorage.getRefreshToken()) {
    try {
      token = await refreshToken();
      headers["Authorization"] = `Bearer ${token}`;
      resp = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers
      });
    } catch {
      authStorage.clearSession();
      window.dispatchEvent(new CustomEvent("ivy:session_expired"));
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!resp.ok) {
    const errorBody = await resp.json().catch(() => ({ detail: resp.statusText }));
    throw new Error(errorBody.detail || `Request failed with status ${resp.status}`);
  }

  return resp.json();
}

// Currency & number formatting helpers
export function formatINR(num) {
  if (num === null || num === undefined) return "N/A";
  if (num < 0) return `-₹${Math.abs(num).toLocaleString("en-IN")}`;
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  return `₹${num.toLocaleString("en-IN")}`;
}

export function formatRent(num) {
  if (num === null || num === undefined) return "N/A";
  return `₹${num.toLocaleString("en-IN")}/mo`;
}

// Normalizer for Listing Objects
export function normalizeListing(item) {
  if (!item) return null;

  // Detect and normalize MagicHomes square meters unit bug
  let carpet_sqft = item.carpet_area || 0;
  let super_sqft = item.super_built_up_area || 0;
  let is_sqm_converted = false;

  if (item.website === "magichomes" && carpet_sqft > 0 && carpet_sqft < 250) {
    carpet_sqft = Math.round(carpet_sqft * 10.7639);
    super_sqft = Math.round(super_sqft * 10.7639);
    is_sqm_converted = true;
  }

  // Detect corrupt anomalies
  const is_negative_price = item.price !== null && item.price < 0;
  const is_impossible_floor = item.floor !== null && item.total_floors !== null && item.floor > item.total_floors;
  const is_carpet_gt_super = carpet_sqft > 0 && super_sqft > 0 && carpet_sqft > super_sqft;
  const is_swapped_coords = item.latitude !== null && item.latitude > 70;
  const is_future_posted = item.posted_at && item.posted_at > "2026-09-12";
  
  const is_corrupt = is_negative_price || is_impossible_floor || is_carpet_gt_super || is_swapped_coords;
  const is_fake = item.price > 0 && item.price < 100000;

  const price_per_sqft = (carpet_sqft > 0 && item.price > 0)
    ? Math.round(item.price / carpet_sqft)
    : 0;

  let corrected_lat = item.latitude;
  let corrected_lon = item.longitude;
  if (is_swapped_coords && item.longitude < 20) {
    corrected_lat = item.longitude;
    corrected_lon = item.latitude;
  }

  return {
    ...item,
    carpet_area_sqft: carpet_sqft,
    super_built_up_area_sqft: super_sqft,
    is_sqm_converted,
    price_per_sqft,
    is_corrupt,
    is_fake,
    is_swapped_coords,
    is_future_posted,
    latitude: corrected_lat,
    longitude: corrected_lon,
    raw_latitude: item.latitude,
    raw_longitude: item.longitude
  };
}

// Normalizer for Projects (handles Lakhs vs Crores mixed units)
export function normalizeProject(p) {
  if (!p) return null;

  const convertToINR = (val) => {
    if (val === null || val === undefined) return 0;
    if (val < 10) return Math.round(val * 10000000);
    return Math.round(val * 100000);
  };

  const price_min_inr = convertToINR(p.price_min);
  const price_max_inr = convertToINR(p.price_max);

  return {
    ...p,
    price_min_inr,
    price_max_inr,
    raw_price_min: p.price_min,
    raw_price_max: p.price_max
  };
}

export function normalizeRental(r) {
  if (!r) return null;
  return {
    ...r,
    price_per_sqft: (r.carpet_area > 0 && r.price > 0) ? Math.round(r.price / r.carpet_area) : 0
  };
}

export async function getListings({
  offset = 0,
  limit = 50,
  locality,
  bhk,
  property_type,
  min_price,
  max_price,
  furnishing,
  sort_by,
  order = "asc"
} = {}) {
  const params = new URLSearchParams();
  params.set("offset", offset.toString());
  params.set("limit", Math.min(limit, 50).toString());

  if (locality && locality !== "all") params.set("locality", locality.toLowerCase());
  if (bhk && bhk !== "all") params.set("bhk", bhk.toString());
  if (property_type && property_type !== "all") params.set("property_type", property_type.toLowerCase());
  if (sort_by) params.set("sort_by", sort_by);
  if (order) params.set("order", order);

  const data = await apiFetch(`/v1/listings?${params.toString()}`);
  let results = (data.results || []).map(normalizeListing);

  if (min_price) {
    results = results.filter(x => x.price >= min_price);
  }
  if (max_price) {
    results = results.filter(x => x.price <= max_price);
  }
  if (furnishing && furnishing !== "all") {
    results = results.filter(x => x.furnishing === furnishing.toLowerCase());
  }

  return {
    ...data,
    results
  };
}

export async function getListingDetail(id) {
  const data = await apiFetch(`/v1/listings/${id}`);
  return normalizeListing(data);
}

export async function getRentals({
  offset = 0,
  limit = 50,
  locality,
  bhk,
  furnishing,
  sort_by,
  order = "asc"
} = {}) {
  const params = new URLSearchParams();
  params.set("offset", offset.toString());
  params.set("limit", Math.min(limit, 50).toString());

  if (locality && locality !== "all") params.set("locality", locality.toLowerCase());
  if (bhk && bhk !== "all") params.set("bhk", bhk.toString());
  if (furnishing && furnishing !== "all") params.set("furnishing", furnishing.toLowerCase());
  if (sort_by) params.set("sort_by", sort_by);
  if (order) params.set("order", order);

  const data = await apiFetch(`/v1/rentals?${params.toString()}`);
  return {
    ...data,
    results: (data.results || []).map(normalizeRental)
  };
}

export async function getProjects({
  offset = 0,
  limit = 50,
  locality,
  project_status,
  sort_by,
  order = "asc"
} = {}) {
  const params = new URLSearchParams();
  params.set("offset", offset.toString());
  params.set("limit", Math.min(limit, 50).toString());

  if (locality && locality !== "all") params.set("locality", locality.toLowerCase());
  if (project_status && project_status !== "all") params.set("project_status", project_status.toLowerCase());
  if (sort_by) params.set("sort_by", sort_by);
  if (order) params.set("order", order);

  const data = await apiFetch(`/v1/projects?${params.toString()}`);
  return {
    ...data,
    results: (data.results || []).map(normalizeProject)
  };
}

export async function getSaved() {
  try {
    const data = await apiFetch("/v1/saved");
    const results = (data.results || []).map(normalizeListing);
    const user = authStorage.getUser();
    const storageKey = user ? `${KEY_SAVED_LOCAL}_${user.email}` : KEY_SAVED_LOCAL;
    localStorage.setItem(storageKey, JSON.stringify(results.map(x => x.listing_id)));
    return results;
  } catch (err) {
    console.warn("Falling back to local saved cache:", err);
    return [];
  }
}

export async function saveListing(listingId) {
  const data = await apiFetch("/v1/saved", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listing_id: listingId })
  });
  return data;
}

export async function unsaveListing(listingId) {
  const data = await apiFetch(`/v1/saved/${listingId}`, {
    method: "DELETE"
  });
  return data;
}