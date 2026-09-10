# ❄️ Digital Platform for Efficient Remote Management of Indian Antarctic Research Stations

> **Smart India Hackathon (SIH 2026) Prototype**  
> Simulating remote operations, low-bandwidth telemetry, and prioritized emergency alert handling for **Maitri** and **Bharati** research stations.

---

## 🧭 System Architecture & Flow

```
Antarctic Station Simulator (Python)
        │ (Telemetry & Emergency Injection)
        ▼
Node.js + Express Backend
        │
        ▼
Priority Queue & Communication Simulator
        │ (Emergency alerts preempt buffer; Normal packets rate-limited)
        ▼
Latency Measurement Engine
        │ (Calculates Queue Delay + Propagation Delay + Total Latency)
        ▼
Supabase Database (PostgreSQL)
        │
        ▼
React India Mission Control Dashboard (Vite + WebSockets)
```

---

## 📁 Clean Modular Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js             # Supabase client with graceful local fallback
│   │   ├── controllers/
│   │   │   ├── alertController.js      # Alert ingestion and acknowledgment
│   │   │   ├── simulatorController.js  # Emergency scenario triggers
│   │   │   └── telemetryController.js  # Telemetry endpoints & queue metrics
│   │   ├── queue/
│   │   │   ├── PriorityQueue.js        # Priority queue data structure
│   │   │   └── satelliteLink.js        # Sat-link throughput & latency measurement
│   │   ├── routes/
│   │   │   ├── alertRoutes.js          # /api/alerts
│   │   │   ├── simulatorRoutes.js      # /api/simulator
│   │   │   └── telemetryRoutes.js      # /api/telemetry
│   │   ├── services/
│   │   │   ├── alertService.js         # Prioritized alert dispatch logic
│   │   │   └── telemetryService.js     # Sensor data processing & caching
│   │   └── server.js                   # Express server & Socket.IO broadcaster
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertFeed.jsx           # Incident feed with priority badges & ack
│   │   │   ├── Header.jsx              # Mission Control status bar
│   │   │   ├── LatencyChart.jsx        # Queue delay & latency comparison monitor
│   │   │   ├── MetricCard.jsx          # Sensor reading card with threshold styling
│   │   │   ├── ScenarioControl.jsx     # Inject scenarios (Generator Overheat, Blizzard)
│   │   │   ├── StationSelector.jsx     # Switch between Maitri and Bharati stations
│   │   │   └── TelemetryGrid.jsx       # Real-time sensor metrics grid
│   │   ├── context/
│   │   │   └── TelemetryContext.jsx    # Live state & WebSocket listener
│   │   ├── services/
│   │   │   ├── api.js                  # Backend REST API client
│   │   │   └── supabaseClient.js       # Optional client-side Supabase setup
│   │   ├── App.css                     # Mission control component styling
│   │   ├── App.jsx                     # Main layout
│   │   ├── index.css                   # Arctic dark theme, typography & utilities
│   │   └── main.jsx                    # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── simulator/
│   ├── config.py                       # Station coordinates and baseline parameters
│   ├── sensors.py                      # Realistic sensor stochastic drift model
│   ├── scenarios.py                    # Generator thermal runaway & blizzard tests
│   ├── simulator.py                    # Main simulation runner & CLI dispatch loop
│   ├── requirements.txt
│   └── README.md
│
├── database/
│   ├── schema.sql                      # Supabase PostgreSQL schema definition
│   └── seed.sql                        # Initial station seed data
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Database (Supabase)
Execute [`database/schema.sql`](file:///c:/Users/Parv/OneDrive/Desktop/code%20red/database/schema.sql) followed by [`database/seed.sql`](file:///c:/Users/Parv/OneDrive/Desktop/code%20red/database/seed.sql) in your Supabase SQL editor.  
*(Note: If Supabase credentials are not provided, the backend seamlessly runs with an in-memory mock store).*

### 2. Backend (Node.js)
```bash
cd backend
npm install
npm run dev
# Server running at http://localhost:5000
```

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Dashboard running at http://localhost:3000
```

### 4. Station Sensor Simulator (Python)
```bash
cd simulator
pip install -r requirements.txt

# Start normal background telemetry stream
python simulator.py

# Or trigger the Generator Thermal Runaway scenario (70°C → 78°C → 85°C → 92°C → 95°C)
python simulator.py --scenario generator_overheat --station station-maitri
```

---

## ⚠️ Important Simulation Disclaimer
- This project is a **software simulation prototype** created for SIH 2026.
- Latency and queueing delay values are measured directly by the **Satellite Link Simulator** module to demonstrate the algorithmic advantages of priority queueing under constrained satellite links.
