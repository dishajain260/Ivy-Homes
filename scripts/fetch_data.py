# Data extraction script for Ivy Homes API
# Uses X-API-Key and offset pagination to retrieve full collections.

import urllib.request
import json
import time
import os

API_KEY = "IVY26-55BECC886D73"
BASE_URL = "https://solve.ivy.homes"
PASSWORD = "9c07e285fc"

def login():
    req = urllib.request.Request(
        f"{BASE_URL}/auth/login",
        data=json.dumps({"email": "demo1@ivy.homes", "password": PASSWORD}).encode(),
        headers={"Content-Type": "application/json", "X-API-Key": API_KEY},
        method="POST"
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode())["access_token"]

def fetch_collection(endpoint, token):
    items = []
    offset = 0
    limit = 50
    while True:
        url = f"{BASE_URL}{endpoint}?offset={offset}&limit={limit}"
        req = urllib.request.Request(url, headers={"X-API-Key": API_KEY, "Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(req) as r:
            data = json.loads(r.read().decode())
        results = data.get("results", [])
        if not results:
            break
        items.extend(results)
        if not data.get("has_more", False) or len(results) < limit:
            break
        offset += len(results)
        time.sleep(0.02)
    return items

if __name__ == "__main__":
    token = login()
    print("Logged in. Fetching listings...")
    listings = fetch_collection("/v1/listings", token)
    print(f"Listings: {len(listings)}")
    rentals = fetch_collection("/v1/rentals", token)
    print(f"Rentals: {len(rentals)}")
    projects = fetch_collection("/v1/projects", token)
    print(f"Projects: {len(projects)}")
