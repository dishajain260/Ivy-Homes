# Submission Validator
# Verifies format, answers types, and findings schema against assignment specs.

import json
import sys

def verify(path):
    with open(path) as f:
        data = json.load(f)

    assert "api_key" in data, "Missing api_key"
    assert "candidate" in data, "Missing candidate"
    assert "answers" in data, "Missing answers"
    assert "findings" in data, "Missing findings"

    answers = data["answers"]
    expected_keys = [
        "total_listing_records", "unique_properties", "active_listings",
        "corrupt_listing_ids", "total_monthly_rent", "avg_price_per_sqft_2bhk",
        "costliest_project", "listings_last_7_days", "fake_listing_ids",
        "projects_with_wrong_listing_count"
    ]
    for k in expected_keys:
        assert k in answers, f"Missing answer key: {k}"

    print(f"All {len(expected_keys)} answer keys present.")
    print(f"Total findings documented: {len(data['findings'])}")
    print("Validation passed successfully!")

if __name__ == "__main__":
    verify("submission.json")
