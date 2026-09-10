import React, { useState } from 'react';
import { ChevronDown, Play, FileText, Loader2 } from 'lucide-react';

export default function WhatIfSimulator({ scenarios: scenariosProp, onOpenReport }) {
  const defaultScenarios = [
    {
      id: 'gen-fail',
      label: 'Generator G-02 Failure (Maitri)',
      metrics: {
        powerDelta: '-28%',
        powerNote: '( Grid Shift )',
        batteryReserve: '16 Hrs',
        batteryNote: '( Reserve )',
        loadAction: 'Auto Shed',
        loadNote: '( Non-Essential )',
        risk: 'Medium',
        riskNote: '( Controlled )',
        riskColor: '#f59e0b',
        powerColor: '#ef4444'
      }
    },
    {
      id: 'blizzard-cat5',
      label: 'Schirmacher Katabatic Storm (-35°C, 90 km/h)',
      metrics: {
        powerDelta: '+38%',
        powerNote: '( Heat Load )',
        batteryReserve: '14 Hrs',
        batteryNote: '( High Draw )',
        loadAction: 'Priority Hold',
        loadNote: '( Habitation )',
        risk: 'High',
        riskNote: '( Thermal Stress )',
        riskColor: '#ef4444',
        powerColor: '#ef4444'
      }
    },
  ];

  const scenarios = scenariosProp && scenariosProp.length > 0 ? scenariosProp : defaultScenarios;
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationRan, setSimulationRan] = useState(true);

  // Auto fallback to first scenario if selected one doesn't exist in current station
  const currentScenarioObj = scenarios.find(s => s.id === selectedScenario) || scenarios[0];
  const currentMetrics = currentScenarioObj.metrics;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationRan(true);
    }, 700);
  };

  return (
    <div className="what-if-simulator-card polaris-card">
      <div className="card-header-simple">
        <span className="card-title">WHAT-IF SIMULATOR</span>
      </div>

      {/* Scenario Selection & Run Bar */}
      <div className="simulator-controls-bar">
        <div className="scenario-dropdown-wrap">
          <span className="scenario-label-prefix">Scenario</span>
          <div className="scenario-select-box">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="scenario-select"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="select-chevron-icon" />
          </div>
        </div>

        <button 
          className="run-simulation-btn"
          onClick={handleRunSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? (
            <>
              <Loader2 size={13} className="spinning" />
              <span>Simulating...</span>
            </>
          ) : (
            <span>Run Simulation</span>
          )}
        </button>
      </div>

      {/* 4-Stat Metric Tiles Grid */}
      <div className="simulation-stats-grid">
        {/* Metric 1: Available Power */}
        <div className="sim-stat-card">
          <span className="sim-stat-label">Available Power</span>
          <span 
            className="sim-stat-value mono-num" 
            style={{ color: currentMetrics.powerColor }}
          >
            {currentMetrics.powerDelta}
          </span>
          <span className="sim-stat-sub">{currentMetrics.powerNote}</span>
        </div>

        {/* Metric 2: Battery Reserve */}
        <div className="sim-stat-card">
          <span className="sim-stat-label">Battery Reserve</span>
          <span className="sim-stat-value mono-num" style={{ color: '#fbbf24' }}>
            {currentMetrics.batteryReserve}
          </span>
          <span className="sim-stat-sub">{currentMetrics.batteryNote}</span>
        </div>

        {/* Metric 3: Non-critical Load */}
        <div className="sim-stat-card">
          <span className="sim-stat-label">Non-critical Load</span>
          <span className="sim-stat-value mono-num" style={{ color: '#38bdf8' }}>
            {currentMetrics.loadAction}
          </span>
          <span className="sim-stat-sub">{currentMetrics.loadNote}</span>
        </div>

        {/* Metric 4: Mission Risk */}
        <div className="sim-stat-card">
          <span className="sim-stat-label">Mission Risk</span>
          <span 
            className="sim-stat-value mono-num" 
            style={{ color: currentMetrics.riskColor }}
          >
            {currentMetrics.risk}
          </span>
          <span className="sim-stat-sub">{currentMetrics.riskNote}</span>
        </div>
      </div>

      {/* Footer Report Link */}
      <div className="simulator-footer-link">
        <button 
          className="view-report-link"
          onClick={() => onOpenReport(currentScenarioObj)}
        >
          <span>View Full Simulation Report</span>
          <span className="report-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
