import os
import sys
import json
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from main import app

client = TestClient(app)

def test_predictions():
    print("--- 1. Testing Maitri Prediction (India Operator) ---")
    res = client.post(
        "/api/ai/energy-prediction",
        json={"station_id": "maitri", "prediction_hours": [1, 6, 24]},
        headers={"x-user-role": "india_operator"}
    )
    print("Status:", res.status_code)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    data = res.json()
    print("Response keys:", list(data.keys()))
    print("Model:", data["model"])
    print("Prediction:", data["prediction"])
    print("Generator Risk:", data["generator_risk"])
    print("Energy Risk:", data["energy_risk"])
    print("Confidence:", data["confidence"])
    print("Recommendation:", data["recommendation"][:60], "...")

    print("\n--- 2. Testing Bharati Prediction (India Operator) ---")
    res_b = client.post(
        "/api/ai/energy-prediction",
        json={"station_id": "bharati", "prediction_hours": [1, 6, 24]},
        headers={"x-user-role": "india_operator"}
    )
    print("Status:", res_b.status_code)
    assert res_b.status_code == 200
    data_b = res_b.json()
    print("Station:", data_b["station_id"])
    print("Prediction:", data_b["prediction"])

    print("\n--- 3. Testing RBAC Access Control (Maitri Operator accessing Bharati) ---")
    res_forbidden = client.post(
        "/api/ai/energy-prediction",
        json={"station_id": "bharati", "prediction_hours": [1, 6, 24]},
        headers={"x-user-role": "station_operator", "x-station-id": "station-maitri"}
    )
    print("Status:", res_forbidden.status_code)
    assert res_forbidden.status_code == 403, f"Expected 403 Forbidden, got {res_forbidden.status_code}"
    print("Forbidden detail:", res_forbidden.json().get("detail"))

    print("\n--- 4. Testing RBAC Access Control (Maitri Operator accessing Maitri) ---")
    res_allowed = client.post(
        "/api/ai/energy-prediction",
        json={"station_id": "maitri", "prediction_hours": [1, 6, 24]},
        headers={"x-user-role": "station_operator", "x-station-id": "station-maitri"}
    )
    print("Status:", res_allowed.status_code)
    assert res_allowed.status_code == 200
    print("Maitri operator authorized successfully.")

    print("\n ALL BACKEND TESTS PASSED!")

if __name__ == "__main__":
    test_predictions()
