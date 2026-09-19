"""
POLARIS Machine Learning Model Training Script.
Usage:
    python train_model.py

Performs data validation, feature engineering, TimeSeriesSplit cross-validation,
fits separate models for Maitri and Bharati, and prints MAE, RMSE, and R2 evaluation metrics.
"""

import sys
import os
import logging
from datetime import datetime

# Add parent directory to path so relative imports work when executed directly
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("polaris.train")

from ml.prediction_model import PolarisMLPredictionModel
from ml.synthetic_telemetry import SyntheticPolarTelemetryGenerator

def run_training_pipeline():
    logger.info("==================================================================")
    logger.info("❄️  POLARIS ANTARCTIC MACHINE LEARNING PREDICTION TRAINING PIPELINE")
    logger.info("==================================================================")

    stations = ["station-maitri", "station-bharati"]
    results = {}

    for st_id in stations:
        is_bharati = "bharati" in st_id
        station_name = "Bharati Station" if is_bharati else "Maitri Station"
        logger.info(f"\n🚀 [1/4] Generating 30-day physics-constrained telemetry for {station_name}...")
        
        telemetry = SyntheticPolarTelemetryGenerator.generate_station_dataset(
            station_id=st_id,
            num_hours=720,    # 30 days
            step_minutes=15,  # 2,880 samples
            seed=42 if not is_bharati else 84
        )
        logger.info(f"   ✓ Telemetry points generated: {len(telemetry)} observations.")

        logger.info(f"⚙️  [2/4] Initializing Multi-Target Random Forest Regressor for {st_id}...")
        model = PolarisMLPredictionModel(station_id=st_id)

        logger.info(f"📊 [3/4] Running TimeSeriesSplit cross-validation & fitting production weights...")
        metadata = model.train(records=telemetry, n_splits=4)

        logger.info(f"💾 [4/4] Model persisted successfully to disk.")
        logger.info(f"==================================================================")
        logger.info(f"📋 EVALUATION METRICS FOR {station_name.upper()}:")
        logger.info(f"   - Model Type:       {metadata['model_type']}")
        logger.info(f"   - Mean R² Score:    {metadata['mean_r2']:.3f}")
        logger.info(f"   - Mean MAE:         {metadata['mean_mae']:.2f}")
        logger.info(f"   - Mean RMSE:        {metadata['mean_rmse']:.2f}")
        logger.info(f"   - Confidence Score: {metadata['confidence_score'] * 100:.1f}%")
        logger.info(f"   - Training Samples: {metadata['training_samples']}")
        logger.info(f"   - Features Count:   {metadata['num_features']}")
        logger.info(f"   - Horizon Targets:  {metadata['num_targets']} (+15m, +30m, +60m, +120m)")
        logger.info("\n🔍 TOP EXPLAINABILITY FEATURES (MODEL FEATURE IMPORTANCE):")
        for feat, imp in list(metadata["top_features"].items())[:6]:
            logger.info(f"   • {feat:<32}: {imp:.4f} ({imp * 100:.1f}%)")

        logger.info("==================================================================")
        results[st_id] = metadata

    logger.info("\n✅ ALL POLARIS STATION ML MODELS SUCCESSFULLY TRAINED & PERSISTED.")
    return results

if __name__ == "__main__":
    run_training_pipeline()
