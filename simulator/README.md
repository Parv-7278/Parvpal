# Antarctic Station Simulator (Python)

Simulates continuous environmental & machinery sensor telemetry for:
- **Maitri Research Station** (Queen Maud Land)
- **Bharati Research Station** (Larsemann Hills)

## Requirements
```bash
pip install -r requirements.txt
```

## Running the Simulator

### 1. Continuous Normal Telemetry:
```bash
python simulator.py
```

### 2. Trigger Generator Thermal Runaway Scenario:
```bash
# Simulates 70°C → 78°C → 85°C → 92°C → 95°C and dispatches a CRITICAL priority emergency alert
python simulator.py --scenario generator_overheat --station station-maitri
```

### 3. Trigger Blizzard Storm Scenario:
```bash
python simulator.py --scenario blizzard --station station-bharati
```
