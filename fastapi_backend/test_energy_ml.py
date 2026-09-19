import asyncio
import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from services.energy_ml_service import EnergyPredictiveMLService


async def main():
    print("Testing Maitri Energy Prediction...")
    res_m = await EnergyPredictiveMLService.run_predictive_pipeline("maitri", [1, 6, 24])
    print("Maitri Output:")
    print(json.dumps(res_m, indent=2))

    print("\nTesting Bharati Energy Prediction...")
    res_b = await EnergyPredictiveMLService.run_predictive_pipeline("bharati", [1, 6, 24])
    print("Bharati Output:")
    print(json.dumps(res_b, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
