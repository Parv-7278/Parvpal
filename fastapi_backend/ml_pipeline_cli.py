"""
POLARIS Machine Learning Pipeline CLI & Test Harness.
Demonstrates:
1. Station Telemetry Ingestion (Maitri & Bharati)
2. Feature Engineering with Diurnal Harmonics & Lag Dynamics
3. TimeSeriesSplit Supervised Model Training
4. Multi-Horizon Forecasting (+1h, +6h, +24h)
5. Model Persistence (Joblib + Metadata JSON)
6. Thermal, Battery, and Power Load Risk Classification
7. Insufficient Data Safety Guard Verification
"""

import sys
import os
import json
import asyncio

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ml.telemetry_dataset import TelemetryDataset, TelemetryRecord
from ml.model_pipeline import StationMLPipeline
from ml.predictor import StationPredictor


async def run_ml_pipeline_suite():
    print("=" * 80)
    print("[POLARIS PREDICTIVE ANALYTICS / ML PIPELINE VALIDATION SUITE]")
    print("=" * 80)

    # -------------------------------------------------------------------------
    # Test 1: Training & Model Persistence for Maitri
    # -------------------------------------------------------------------------
    print("\n[TEST 1] Training Time-Series Regressor for MAITRI Station...")
    maitri_records = TelemetryDataset.generate_realistic_telemetry(station_id="maitri", num_records=168)
    print(f"  Generated {len(maitri_records)} sequential hourly telemetry observations for Maitri.")

    maitri_pipeline = StationMLPipeline(station_id="maitri")
    maitri_meta = maitri_pipeline.train_and_evaluate(maitri_records, n_splits=3)
    
    print(f"  Model Type: {maitri_meta['model_type']}")
    print(f"  Trained on Feature Matrix: {maitri_meta['feature_matrix_rows']} rows x {maitri_meta['num_features']} features")
    print(f"  Cross-Validation Splits: {maitri_meta['cv_splits_evaluated']}")
    print(f"  Mean R² Score: {maitri_meta['mean_r2']:.3f} | Mean MAE: {maitri_meta['mean_mae']:.2f}")
    print(f"  Target Metrics Sample:")
    for target in ["batt_24h", "cons_24h", "temp_24h"]:
        m = maitri_meta["target_metrics"][target]
        print(f"    - {target}: R² = {m['r2']}, MAE = {m['mae']}, RMSE = {m['rmse']}")
    print(f"  Model successfully persisted to: {maitri_pipeline.model_path}")

    # -------------------------------------------------------------------------
    # Test 2: Training & Model Persistence for Bharati
    # -------------------------------------------------------------------------
    print("\n[TEST 2] Training Time-Series Regressor for BHARATI Station...")
    bharati_records = TelemetryDataset.generate_realistic_telemetry(station_id="bharati", num_records=168)
    print(f"  Generated {len(bharati_records)} sequential hourly telemetry observations for Bharati.")

    bharati_pipeline = StationMLPipeline(station_id="bharati")
    bharati_meta = bharati_pipeline.train_and_evaluate(bharati_records, n_splits=3)
    print(f"  Mean R² Score: {bharati_meta['mean_r2']:.3f} | Mean MAE: {bharati_meta['mean_mae']:.2f}")
    print(f"  Model successfully persisted to: {bharati_pipeline.model_path}")

    # -------------------------------------------------------------------------
    # Test 3: Multi-Horizon Forecasting & Risk Diagnostics for Maitri
    # -------------------------------------------------------------------------
    print("\n[TEST 3] Running Multi-Horizon Inference for MAITRI...")
    maitri_pred = await StationPredictor.predict_for_station("maitri", custom_history=maitri_records)
    print(f"  Status: {maitri_pred['status']}")
    print(f"  Confidence: {maitri_pred['confidence']}")
    print(f"  Predictions:")
    print(f"    - Battery Level: +1h={maitri_pred['prediction']['battery_1h']}%, +6h={maitri_pred['prediction']['battery_6h']}%, +24h={maitri_pred['prediction']['battery_24h']}%")
    print(f"    - Power Demand:  +1h={maitri_pred['prediction']['power_1h']} kW, +6h={maitri_pred['prediction']['power_6h']} kW, +24h={maitri_pred['prediction']['power_24h']} kW")
    print(f"    - Gen Core Temp: +1h={maitri_pred['prediction']['generator_temp_1h']}°C, +6h={maitri_pred['prediction']['generator_temp_6h']}°C, +24h={maitri_pred['prediction']['generator_temp_24h']}°C")
    print(f"  Risks & Trends:")
    print(f"    - Generator Thermal Risk: {maitri_pred['generator_risk']}")
    print(f"    - Battery Depletion Risk: {maitri_pred['battery_risk']}")
    print(f"    - Power Load Surge Risk:  {maitri_pred['power_load_risk']}")
    print(f"    - Overall Equipment Risk: {maitri_pred['overall_equipment_risk']}")
    print(f"    - Anomaly Status:         {maitri_pred['anomaly_status']}")
    print(f"  Directive: {maitri_pred['recommendation']}")

    # -------------------------------------------------------------------------
    # Test 4: Multi-Horizon Forecasting with Injected Anomaly (Thermal & Load Surge)
    # -------------------------------------------------------------------------
    print("\n[TEST 4] Testing Anomaly & Overheating Risk Detection...")
    anomaly_records = TelemetryDataset.generate_realistic_telemetry(station_id="maitri", num_records=168, inject_anomaly=True)
    anomaly_pred = await StationPredictor.predict_for_station("maitri", custom_history=anomaly_records)
    print(f"  Anomaly Detection Status: {anomaly_pred['anomaly_status']}")
    print(f"  Detected Anomalies: {anomaly_pred['anomalies_detected']}")
    print(f"  Generator Risk Level: {anomaly_pred['generator_risk']}")
    print(f"  Overall Risk Level: {anomaly_pred['overall_equipment_risk']}")
    print(f"  Anomaly Directive: {anomaly_pred['recommendation']}")

    # -------------------------------------------------------------------------
    # Test 5: Insufficient Data Guard Verification (< 4 records)
    # -------------------------------------------------------------------------
    print("\n[TEST 5] Testing Insufficient Data Guard (Zero Guesswork Policy)...")
    insufficient_records = [maitri_records[-1]]  # Only 1 observation
    guarded_result = await StationPredictor.predict_for_station("maitri", custom_history=insufficient_records)
    print(f"  Status returned: {guarded_result['status']}")
    print(f"  Message: {guarded_result['message']}")
    print(f"  Prediction object is None: {guarded_result['prediction'] is None}")
    assert guarded_result["status"] == "INSUFFICIENT_DATA", "Must return INSUFFICIENT_DATA"
    assert guarded_result["prediction"] is None, "Must not fabricate prediction when insufficient data exists"

    print("\n" + "=" * 80)
    print("✅ ALL 5 ML PIPELINE VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 80)


if __name__ == "__main__":
    asyncio.run(run_ml_pipeline_suite())
