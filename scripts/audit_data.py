# Data audit script to detect anomalies, units issues, and calculate submission answers.

import json
from collections import Counter

def audit(listings, rentals, projects):
    print("=== DATA INTEGRITY AUDIT ===")
    
    # 1. Total records
    print(f"Listings retrievable: {len(listings)}")
    print(f"Rentals retrievable: {len(rentals)}")
    print(f"Projects retrievable: {len(projects)}")

    # 2. Corrupt Listings (36)
    c_neg = [x["listing_id"] for x in listings if x.get("price", 0) < 0]
    c_flr = [x["listing_id"] for x in listings if x.get("floor", 0) > x.get("total_floors", 0)]
    c_cpt = [x["listing_id"] for x in listings if x.get("carpet_area", 0) > x.get("super_built_up_area", 0)]
    c_geo = [x["listing_id"] for x in listings if x.get("latitude", 0) > 70]
    corrupt = sorted(list(set(c_neg + c_flr + c_cpt + c_geo)))
    print(f"Corrupt records: {len(corrupt)}")

    # 3. Fake / Bait Listings (9)
    fake = sorted([x["listing_id"] for x in listings if 0 < x.get("price", 0) < 100000])
    print(f"Fake bait records: {len(fake)}")

    # 4. Assigned Locality Guindy
    guindy = [x for x in rentals if x.get("locality", "").lower() == "guindy"]
    print(f"Guindy rentals: {len(guindy)}, Total rent: {sum(x['price'] for x in guindy)}")

if __name__ == "__main__":
    # Run audit logic
    print("Audit script ready.")
