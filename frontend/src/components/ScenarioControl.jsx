import React, { useState } from 'react';
import { Flame, CloudLightning, BatteryWarning, Play, Check } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { triggerScenario } from '../services/api';

export default function ScenarioControl() {
  const { selectedStation, refreshData } = useTelemetry();
  const [loadingScenario, setLoadingScenario] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleTrigger = async (scenarioType, label) => {
    setLoadingScenario(scenarioType);
    setStatusMsg(null);
    try {
      const res = await triggerScenario(scenarioType, selectedStation);
      if (res.success) {
        setStatusMsg(`Dispatched ${label} to ${selectedStation}`);
        refreshData();
      }
    } catch (err) {
      setStatusMsg(`Failed to trigger: ${err.message}`);
    } finally {
      setTimeout(() => setLoadingScenario(null), 800);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  return (
    <div className="scenario-panel glass-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <Play className="text-cyan" size={18} />
          <h2>Emergency Scenario Simulator (Interactive Testing)</h2>
        </div>
        {statusMsg && <div className="scenario-status-pill mono-text">{statusMsg}</div>}
      </div>

      <p className="scenario-desc">
        Inject simulated operational failures to observe how the Priority Queue fast-tracks emergency alerts over routine telemetry.
      </p>

      <div className="scenario-button-grid">
        <button
          onClick={() => handleTrigger('GENERATOR_OVERHEAT', 'Generator Thermal Runaway')}
          disabled={!!loadingScenario}
          className="btn-scenario btn-scenario-flame"
        >
          <Flame size={18} />
          <div>
            <div className="btn-scenario-title">Generator Thermal Runaway</div>
            <div className="btn-scenario-subtitle">70°C → 78°C → 85°C → 92°C → 95°C (CRITICAL)</div>
          </div>
        </button>

        <button
          onClick={() => handleTrigger('BLIZZARD_WARNING', 'Blizzard Warning')}
          disabled={!!loadingScenario}
          className="btn-scenario btn-scenario-storm"
        >
          <CloudLightning size={18} />
          <div>
            <div className="btn-scenario-title">Blizzard Storm Warning</div>
            <div className="btn-scenario-subtitle">Winds &gt; 115 km/h (HIGH Priority)</div>
          </div>
        </button>

        <button
          onClick={() => handleTrigger('POWER_FAILURE', 'Power Grid Failure')}
          disabled={!!loadingScenario}
          className="btn-scenario btn-scenario-power"
        >
          <BatteryWarning size={18} />
          <div>
            <div className="btn-scenario-title">Power Grid Failure</div>
            <div className="btn-scenario-subtitle">Battery Bank 18.5% (CRITICAL Alert)</div>
          </div>
        </button>
      </div>
    </div>
  );
}
