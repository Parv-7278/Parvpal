import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  Flame, 
  BatteryWarning, 
  Wind, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  RotateCcw, 
  ShieldAlert, 
  Cpu, 
  Zap,
  TrendingDown,
  FileText
} from 'lucide-react';
import { STATIONS_DATA } from '../data/stationsData';

export default function SimulationsView({ selectedStation, onOpenReport }) {
  const stationId = selectedStation === 'all-stations' ? 'station-maitri' : selectedStation;
  const station = STATIONS_DATA[stationId] || STATIONS_DATA['station-maitri'];
  const isMaitri = station.id === 'station-maitri';

  const [activeScenarioId, setActiveScenarioId] = useState('GEN_FAIL');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Station specific baseline metrics
  const totalGenKw = isMaitri ? 132 : 185;
  const totalConsKw = isMaitri ? 105 : 148;
  const batteryCapKwh = isMaitri ? 320 : 480;

  // Polar Scenario Definitions
  const scenarios = [
    {
      id: 'GEN_FAIL',
      name: 'Primary Generator G-02 Catastrophic Failure',
      icon: Flame,
      category: 'POWER GRID FAULT',
      description: 'Simulates sudden seizure / thermal shutdown of main diesel alternator unit G-02.',
      params: {
        powerDropPct: isMaitri ? -35 : -32,
        lostCapacityKw: isMaitri ? 46.2 : 59.2,
        batteryHours: isMaitri ? 14.5 : 18.0,
        loadShedRecommendation: 'Auto-Shed Science Lab & Auxiliary Quarters Trace Heaters (-35 kW)',
        missionRisk: 'HIGH',
        riskScore: 78,
        mitigationAction: 'Engage standby generator G-01 via Remote SCADA console within 15 minutes.'
      }
    },
    {
      id: 'BATT_DEGRADE',
      name: 'BESS Battery Bank String #2 Degradation (-40%)',
      icon: BatteryWarning,
      category: 'ENERGY STORAGE',
      description: 'Simulates severe sub-zero cell degradation leading to 40% loss in reserve energy buffer.',
      params: {
        powerDropPct: 0,
        lostCapacityKw: 0,
        batteryHours: isMaitri ? 9.2 : 14.5,
        loadShedRecommendation: 'Limit peak night-time lab equipment cycles to reduce discharge ramp rate.',
        missionRisk: 'MEDIUM',
        riskScore: 54,
        mitigationAction: 'Isolate affected battery module string #2 and maintain thermal insulation.'
      }
    },
    {
      id: 'BLIZZARD_SURGE',
      name: 'Category-5 Katabatic Blizzard Thermal Surge (+45 kW)',
      icon: Wind,
      category: 'EXTREME WEATHER',
      description: 'Simulates intense blizzard (-35°C, 120 km/h winds) requiring maximum trace heating across all conduits.',
      params: {
        powerDropPct: isMaitri ? +28 : +24,
        lostCapacityKw: isMaitri ? 37.0 : 44.4,
        batteryHours: isMaitri ? 11.0 : 16.2,
        loadShedRecommendation: 'Shed non-critical domestic laundry & workshop heating loads.',
        missionRisk: 'HIGH',
        riskScore: 72,
        mitigationAction: 'Ramp all auxiliary generators to 95% continuous rating and seal station airlocks.'
      }
    },
    {
      id: 'SATCOM_BLACKOUT',
      name: 'Solar Flare Geomagnetic Ionospheric Blackout (Kp 8+)',
      icon: Radio,
      category: 'COMMUNICATION LINK',
      description: 'Simulates intense solar storm causing high-frequency RF blackout and loss of satellite carrier tracking.',
      params: {
        powerDropPct: 0,
        lostCapacityKw: 0,
        batteryHours: isMaitri ? 18.2 : 26.5,
        loadShedRecommendation: 'Switch station SCADA to Autonomous Local Islanding Mode.',
        missionRisk: 'MEDIUM',
        riskScore: 62,
        mitigationAction: 'Store telemetry in local flash buffer and await ionospheric recovery.'
      }
    }
  ];

  const currentScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  const handleRunSimulation = () => {
    setSimulationRunning(true);
    setTimeout(() => {
      setSimulationResult(currentScenario.params);
      setSimulationRunning(false);
    }, 600);
  };

  // Scenario comparative chart data
  const comparativeChartData = [
    { name: 'Nominal Baseline', shortName: 'Baseline', availablePowerKw: totalGenKw, batteryHours: isMaitri ? 18.2 : 26.5 },
    { name: 'Genset G-02 Failure', shortName: 'Gen Fail', availablePowerKw: Math.round(totalGenKw * 0.65), batteryHours: isMaitri ? 14.5 : 18.0 },
    { name: 'Battery Degradation', shortName: 'Batt Deg.', availablePowerKw: totalGenKw, batteryHours: isMaitri ? 9.2 : 14.5 },
    { name: 'Blizzard Surge', shortName: 'Blizzard', availablePowerKw: Math.round(totalGenKw * 0.72), batteryHours: isMaitri ? 11.0 : 16.2 },
  ];

  // SVG parameters for comparative bar chart
  const maxPower = Math.max(...comparativeChartData.map(d => d.availablePowerKw)) * 1.15;
  const maxHours = Math.max(...comparativeChartData.map(d => d.batteryHours)) * 1.25;

  return (
    <div className="tab-page-container simulations-view-container">
      {/* Header Banner */}
      <div className="tab-page-header">
        <div>
          <h2 className="tab-page-title">{station.name} Polar What-If Scenario Diagnostics Studio</h2>
          <span className="tab-page-subtitle">
            Dynamic Fault Injection Engine, Energy Balance Depletion Simulation, and Automated Load-Shedding Optimization ({station.region})
          </span>
        </div>
        <div className="header-status-badge">
          <Sliders size={14} className="text-cyan" />
          <span>SIMULATION ENGINE: ONLINE (STATION-SCOPED BASELINE)</span>
        </div>
      </div>

      {/* Main Simulation Grid */}
      <div className="simulations-main-grid">
        {/* Left Column: Selectable Scenarios List */}
        <div className="scenarios-selector-col">
          <div className="panel-title-row">
            <Sliders size={16} className="text-cyan" />
            <h3 className="section-title">Select Polar Hazard Scenario</h3>
          </div>

          <div className="scenarios-stack">
            {scenarios.map((sc) => {
              const IconComp = sc.icon;
              const isSelected = sc.id === activeScenarioId;

              return (
                <div 
                  key={sc.id} 
                  className={`scenario-choice-card polaris-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setActiveScenarioId(sc.id);
                    setSimulationResult(null);
                  }}
                >
                  <div className="sc-card-top">
                    <div className="sc-icon-wrap">
                      <IconComp size={18} className="text-cyan" />
                    </div>
                    <div className="sc-title-wrap">
                      <span className="sc-category">{sc.category}</span>
                      <h4 className="sc-name">{sc.name}</h4>
                    </div>
                  </div>
                  <p className="sc-desc">{sc.description}</p>
                </div>
              );
            })}
          </div>

          <button 
            className="btn-run-simulation" 
            onClick={handleRunSimulation}
            disabled={simulationRunning}
          >
            <Play size={14} className={simulationRunning ? 'animate-spin' : ''} />
            <span>{simulationRunning ? 'Calculating Thermodynamic Model...' : `Run ${currentScenario.name} Simulation`}</span>
          </button>
        </div>

        {/* Right Column: Dynamic Simulation Diagnostics & Projected Impacts */}
        <div className="simulation-results-col">
          {/* Active Diagnostic Report Card */}
          <div className="diagnostic-report-card polaris-card">
            <div className="panel-title-row">
              <Cpu size={16} className="text-amber" />
              <h3 className="section-title">
                Diagnostic Output: {currentScenario.name}
              </h3>
            </div>

            <div className="sim-kpi-grid">
              <div className="sim-kpi-item">
                <span className="sim-kpi-label">Available Power Drop</span>
                <span className="sim-kpi-val text-critical mono-num">
                  {currentScenario.params.powerDropPct !== 0 ? `${currentScenario.params.powerDropPct}%` : '0% (Demand Surge)'}
                </span>
                <span className="sim-kpi-sub">Lost Capacity: {currentScenario.params.lostCapacityKw} kW</span>
              </div>

              <div className="sim-kpi-item">
                <span className="sim-kpi-label">Battery Autonomy Reserve</span>
                <span className="sim-kpi-val text-amber mono-num">
                  {currentScenario.params.batteryHours} Hours
                </span>
                <span className="sim-kpi-sub">Baseline: {isMaitri ? '18.2' : '26.5'} Hours</span>
              </div>

              <div className="sim-kpi-item">
                <span className="sim-kpi-label">Mission Risk Assessment</span>
                <span className={`sim-kpi-val mono-num ${currentScenario.params.missionRisk === 'HIGH' ? 'text-critical' : 'text-amber'}`}>
                  {currentScenario.params.missionRisk} RISK
                </span>
                <span className="sim-kpi-sub">Hazard Index: {currentScenario.params.riskScore} / 100</span>
              </div>
            </div>

            {/* Load Shedding & Action Box */}
            <div className="sim-action-callout">
              <div className="callout-header">
                <Zap size={14} className="text-cyan" />
                <span className="callout-title">Automated SCADA Non-Critical Load-Shedding Recommendation:</span>
              </div>
              <p className="callout-desc">{currentScenario.params.loadShedRecommendation}</p>
              <div className="mitigation-row">
                <span className="mitigation-label">Required Operator Action:</span>
                <span className="mitigation-text">{currentScenario.params.mitigationAction}</span>
              </div>
            </div>
          </div>

          {/* Comparative Scenario Benchmark Chart (Native SVG) */}
          <div className="comparative-chart-card polaris-card">
            <div className="panel-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingDown size={16} className="text-cyan" />
                <h3 className="section-title">Cross-Scenario Power & Battery Autonomy Comparison</h3>
              </div>
              <div className="stream-channel-legend" style={{ fontSize: '0.72rem', display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: '#38bdf8' }}>■ Available Power (kW)</span>
                <span style={{ color: '#10b981' }}>■ Battery Reserve (Hrs)</span>
              </div>
            </div>
            <div className="chart-box" style={{ height: 185, padding: '0.5rem 0' }}>
              <svg width="100%" height="100%" viewBox="0 0 540 160" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                {/* Horizontal Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                  const y = 135 - p * 110;
                  return (
                    <g key={idx}>
                      <line x1="45" y1={y} x2="520" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <text x="40" y={y + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                        {Math.round(p * maxPower)}kW
                      </text>
                    </g>
                  );
                })}

                {/* Bars */}
                {comparativeChartData.map((item, idx) => {
                  const groupX = 70 + idx * 115;
                  const powerHeight = (item.availablePowerKw / maxPower) * 110;
                  const battHeight = (item.batteryHours / maxHours) * 110;
                  const isCurrent = scenarios.find(s => s.id === activeScenarioId)?.name.includes(item.shortName) || (activeScenarioId === 'GEN_FAIL' && item.shortName === 'Gen Fail') || (activeScenarioId === 'BATT_DEGRADE' && item.shortName === 'Batt Deg.') || (activeScenarioId === 'BLIZZARD_SURGE' && item.shortName === 'Blizzard');

                  return (
                    <g key={idx}>
                      {/* Active highlight background column */}
                      {isCurrent && (
                        <rect x={groupX - 8} y={20} width={86} height={120} rx={4} fill="rgba(56, 189, 248, 0.06)" stroke="rgba(56, 189, 248, 0.2)" strokeDasharray="2 2" />
                      )}

                      {/* Power Bar */}
                      <rect 
                        x={groupX} 
                        y={135 - powerHeight} 
                        width={30} 
                        height={powerHeight} 
                        rx={3} 
                        fill="#38bdf8" 
                        fillOpacity={isCurrent ? 0.95 : 0.75}
                      />
                      <text 
                        x={groupX + 15} 
                        y={130 - powerHeight} 
                        textAnchor="middle" 
                        fill="#38bdf8" 
                        fontSize="9" 
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {item.availablePowerKw}k
                      </text>

                      {/* Battery Bar */}
                      <rect 
                        x={groupX + 36} 
                        y={135 - battHeight} 
                        width={30} 
                        height={battHeight} 
                        rx={3} 
                        fill="#10b981" 
                        fillOpacity={isCurrent ? 0.95 : 0.75}
                      />
                      <text 
                        x={groupX + 51} 
                        y={130 - battHeight} 
                        textAnchor="middle" 
                        fill="#10b981" 
                        fontSize="9" 
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {item.batteryHours}h
                      </text>

                      {/* X Label */}
                      <text 
                        x={groupX + 33} 
                        y={150} 
                        textAnchor="middle" 
                        fill={isCurrent ? '#38bdf8' : '#94a3b8'} 
                        fontSize="10"
                        fontWeight={isCurrent ? 'bold' : 'normal'}
                      >
                        {item.shortName}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
