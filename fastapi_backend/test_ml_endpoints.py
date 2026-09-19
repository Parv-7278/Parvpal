"""
Automated FastAPI Endpoint Validation for POLARIS Predictive ML Engine.
"""

import sys
import os
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_endpoints():
    print("=" * 80)
    print("TESTING FASTAPI PREDICTIVE ML ENDPOINTS")
    print("=" * 80)

    # 1. Health endpoint
    r_health = client.get("/api/health")
    print(f"\n1. GET /api/health -> Status: {r_health.status_code}")
    assert r_health.status_code == 200

    # 2. GET /api/ml/status
    r_status = client.get("/api/ml/status")
    print(f"\n2. GET /api/ml/status -> Status: {r_status.status_code}")
    print(f"   Response: {json.dumps(r_status.json(), indent=2)}")
    assert r_status.status_code == 200
    assert "models" in r_status.json()
    assert "maitri" in r_status.json()["models"]
    assert "bharati" in r_status.json()["models"]

    # 3. POST /api/ml/predict (Maitri)
    r_pred_m = client.post(
        "/api/ml/predict",
        json={"station_id": "maitri", "prediction_horizons": [1, 6, 24]},
        headers={"x-user-role": "india_operator"}
    )
    print(f"\n3. POST /api/ml/predict (Maitri) -> Status: {r_pred_m.status_code}")
    print(f"   Response: {json.dumps(r_pred_m.json(), indent=2)}")
    assert r_pred_m.status_code == 200
    assert r_pred_m.json()["status"] == "SUCCESS"
    assert "battery_24h" in r_pred_m.json()["prediction"]
    assert "generator_temp_24h" in r_pred_m.json()["prediction"]

    # 4. POST /api/ml/predict (Bharati)
    r_pred_b = client.post(
        "/api/ml/predict",
        json={"station_id": "bharati", "prediction_horizons": [1, 6, 24]},
        headers={"x-user-role": "india_operator"}
    )
    print(f"\n4. POST /api/ml/predict (Bharati) -> Status: {r_pred_b.status_code}")
    print(f"   Response: {json.dumps(r_pred_b.json(), indent=2)}")
    assert r_pred_b.status_code == 200
    assert r_pred_b.json()["status"] == "SUCCESS"

    # 5. POST /api/ai/energy-prediction (Backward Compatibility Test)
    r_compat = client.post(
        "/api/ai/energy-prediction",
        json={"station_id": "maitri", "prediction_hours": [1, 6, 24]},
        headers={"x-user-role": "india_operator"}
    )
    print(f"\n5. POST /api/ai/energy-prediction (Legacy Compatibility) -> Status: {r_compat.status_code}")
    print(f"   Response: {json.dumps(r_compat.json(), indent=2)}")
    assert r_compat.status_code == 200
    assert "battery_24h" in r_compat.json()["prediction"]

    # 6. POST /api/ml/telemetry-stream
    sample_stream = [
        {
            "station_id": "maitri",
            "battery_level": 76.5,
            "power_consumption": 108.2,
            "energy_generation": 134.0,
            "generator_temperature": 75.2,
            "generator_status": "RUNNING",
            "ambient_temperature": -19.0,
            "wind_speed": 29.5,
            "humidity": 67.0
        }
        for _ in range(5)
    ]
    r_stream = client.post(
        "/api/ml/telemetry-stream",
        json=sample_stream,
        headers={"x-user-role": "india_operator"}
    )
    print(f"\n6. POST /api/ml/telemetry-stream -> Status: {r_stream.status_code}")
    print(f"   Response: {json.dumps(r_stream.json(), indent=2)}")
    assert r_stream.status_code == 200

    # 7. AI Analyst 24h Summary Report Integrity (Make sure existing feature remains 100% operational)
    r_report = client.post(
        "/api/research/ai-analyst/report-24h",
        json={"station_id": "station-maitri"},
        headers={"x-user-role": "india_operator"}
    )
    print(f"\n7. POST /api/research/ai-analyst/report-24h (AI Summary Report Integrity) -> Status: {r_report.status_code}")
    assert r_report.status_code == 200
    print(f"   AI Summary Report Status: {r_report.json().get('status', 'OK')}")

    print("\n" + "=" * 80)
    print("ALL API ENDPOINT VALIDATION TESTS PASSED PERFECTLY!")
    print("=" * 80)


if __name__ == "__main__":
    test_endpoints()
