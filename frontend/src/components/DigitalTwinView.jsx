import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Thermometer, 
  Zap, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Camera, 
  Compass, 
  Eye, 
  RefreshCw,
  Cpu,
  Radio,
  Maximize2,
  Map as MapIcon,
  Globe2,
  Sparkles
} from 'lucide-react';
import DigitalTwinViewer from './DigitalTwinViewer';
import StationDigitalTwinMap from './StationDigitalTwinMap';
import { STATIONS_DATA } from '../data/stationsData';

export default function DigitalTwinView({ selectedStation }) {
  const stationId = selectedStation === 'all-stations' ? 'station-maitri' : selectedStation;
  const station = STATIONS_DATA[stationId] || STATIONS_DATA['station-maitri'];
  const isMaitri = station.id === 'station-maitri';

  const [viewType, setViewType] = useState('MAP'); // 'MAP' (Top-Down Tactical Twin Map) or '3D' (Spatial Exterior View)
  const [selectedPin, setSelectedPin] = useState(station.pins?.[0] || null);
  const [overlayMode, setOverlayMode] = useState('STANDARD'); // STANDARD, THERMAL, ELECTRICAL

  const stationModules = [
    {
      id: 'pin-power',
      name: 'Power House & Diesel Genset Farm',
      subsystem: 'Main Generating Station (415V 3-Phase)',
      status: isMaitri ? 'Normal' : 'Warning',
      temp: isMaitri ? '+18.5°C' : '+78.5°C (Stator Elevated)',
      power: isMaitri ? '132 kW Gen' : '185 kW CHP Gen',
      pressure: 'Nominal Glycol 2.4 bar',
      healthScore: isMaitri ? 94 : 82,
      components: [
        { name: 'Diesel Genset G-01', status: 'Running / 68°C', load: '65 kW' },
        { name: 'Diesel Genset G-02', status: isMaitri ? 'Standby / 22°C' : 'Warning / 78°C', load: isMaitri ? '0 kW' : '120 kW' },
        { name: 'Fuel Day Header Tank', status: 'Optimal / 92%', load: '1,800 L' },
        { name: 'Exhaust Heat Recovery Boiler', status: 'Active (85% eff)', load: '45 kW th' },
      ]
    },
    {
      id: 'pin-science',
      name: 'Science & Atmospheric Physics Lab',
      subsystem: 'Research Instrumentation & Clean Lab',
      status: 'Normal',
      temp: '+21.0°C',
      power: '28.4 kW',
      pressure: '+15 Pa Positive Overpressure',
      healthScore: 98,
      components: [
        { name: 'Broadband Seismometer Borehole', status: 'Sampling 100 Hz', load: '0.8 kW' },
        { name: 'Fluxgate Magnetometer Array', status: 'Optimal (Kp 2.3)', load: '1.2 kW' },
        { name: 'Aerosol Lidar Transceiver', status: 'Active Scanning', load: '4.5 kW' },
        { name: 'Cryospheric Ice-Core Freezer', status: '-32.0°C Sealed', load: '6.2 kW' },
      ]
    },
    {
      id: 'pin-living',
      name: 'Main Living Quarters & Life Support',
      subsystem: 'Habitation Module & HVAC Loop',
      status: 'Normal',
      temp: '+21.5°C',
      power: '34.2 kW',
      pressure: '1013.2 hPa',
      healthScore: 96,
      components: [
        { name: 'Central Air Handling Unit AHU-1', status: 'Active Recirc', load: '8.4 kW' },
        { name: 'Fresh Hydroponic Growth Chamber', status: 'Optimal LED Spectrum', load: '3.8 kW' },
        { name: 'Galley Induction Cooktop & Refrig', status: 'Nominal', load: '12.0 kW' },
        { name: 'Telemedicine Trauma Bay Unit', status: 'Standby / Ready', load: '2.5 kW' },
      ]
    },
    {
      id: 'pin-comms',
      name: 'Satellite Ground Station & Radome',
      subsystem: 'C-Band & Ku-Band Space-Ground Gateway',
      status: 'Normal',
      temp: '+19.2°C',
      power: '12.8 kW',
      pressure: 'Nominal Radome De-Icer Active',
      healthScore: 99,
      components: [
        { name: '7.3m Azimuth/Elevation Tracking Dish', status: 'Tracking INSAT-4CR', load: '4.2 kW' },
        { name: 'High-Power Solid-State Amplifier SSPA', status: 'Nominal / 120W RF', load: '2.8 kW' },
        { name: 'Radome Aerodynamic De-Icer Heater', status: 'Auto Pulse (15%)', load: '3.5 kW' },
      ]
    },
    {
      id: 'pin-water',
      name: isMaitri ? 'Lake Priyadarshini Water Pump House' : 'Seawater RO Desalination Plant',
      subsystem: 'Primary Potable Water Processing Plant',
      status: 'Normal',
      temp: '+16.5°C',
      power: '18.4 kW',
      pressure: '4.8 bar Line Pressure',
      healthScore: 95,
      components: [
        { name: isMaitri ? 'Lake Intake Submersible Pump' : 'Seawater High-Pressure RO Pump', status: 'Running', load: '7.5 kW' },
        { name: 'Potable UV Sterilization Filter', status: 'Active (0.2 NTU)', load: '1.2 kW' },
        { name: 'Pipeline Anti-Freeze Trace Heating', status: '+4.5°C Active', load: '6.4 kW' },
      ]
    }
  ];

  const currentModule = stationModules.find(m => m.id === selectedPin?.id || m.name.includes(selectedPin?.name || '')) || stationModules[0];

  return (
    <div className="tab-page-container digital-twin-view-container">
      {/* Header Banner */}
      <div className="tab-page-header">
        <div>
          <h2 className="tab-page-title">{station.name} Station – Digital Twin & Mission Control Telemetry</h2>
          <span className="tab-page-subtitle">
            Interactive Tactical Floorplan, SCADA Field Actuators, and Live Subsystem Health Mesh ({station.coords})
          </span>
        </div>

        {/* View Switcher: Top-Down Tactical Twin Map vs 3D Exterior Viewport */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="twin-layer-controls">
            <button 
              className={`layer-btn ${viewType === 'MAP' ? 'active' : ''}`}
              onClick={() => setViewType('MAP')}
              title="Among-Us Styled Tactical Floorplan View"
            >
              <MapIcon size={14} style={{ marginRight: '4px' }} />
              Tactical Twin Map
            </button>
            <button 
              className={`layer-btn ${viewType === '3D' ? 'active' : ''}`}
              onClick={() => setViewType('3D')}
              title="Exterior Spatial View"
            >
              <Globe2 size={14} style={{ marginRight: '4px' }} />
              3D Spatial Exterior
            </button>
          </div>

          {viewType === '3D' && (
            <div className="twin-layer-controls">
              <button 
                className={`layer-btn ${overlayMode === 'STANDARD' ? 'active' : ''}`}
                onClick={() => setOverlayMode('STANDARD')}
              >
                Standard
              </button>
              <button 
                className={`layer-btn ${overlayMode === 'THERMAL' ? 'active' : ''}`}
                onClick={() => setOverlayMode('THERMAL')}
              >
                Thermal
              </button>
              <button 
                className={`layer-btn ${overlayMode === 'ELECTRICAL' ? 'active' : ''}`}
                onClick={() => setOverlayMode('ELECTRICAL')}
              >
                Power Grid
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main View Area */}
      {viewType === 'MAP' ? (
        /* Top-Down Tactical Station Twin Map */
        <StationDigitalTwinMap selectedStation={stationId} />
      ) : (
        /* 3D Scene Viewport & Module Deep Inspector */
        <div className="digital-twin-main-grid">
          {/* Left Column: 3D Scene Viewport */}
          <div className="twin-viewport-column">
            <DigitalTwinViewer 
              selectedStation={stationId}
              stationData={station}
              onSelectPin={(pin) => setSelectedPin(pin)}
            />

            {/* Quick Module Navigation Selector Strip */}
            <div className="module-pills-strip polaris-card">
              <span className="strip-title">Station Modules:</span>
              <div className="pills-scroll-row">
                {stationModules.map((mod) => (
                  <button
                    key={mod.id}
                    className={`mod-pill-btn ${currentModule.id === mod.id ? 'active' : ''} ${mod.status === 'Warning' ? 'pill-warning' : ''}`}
                    onClick={() => setSelectedPin({ id: mod.id, name: mod.name })}
                  >
                    <span className={`status-dot ${mod.status === 'Warning' ? 'dot-warning' : 'dot-online'}`} />
                    <span className="mod-btn-name">{mod.name.split('&')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Deep SCADA Module Telemetry Inspector */}
          <div className="module-inspector-column">
            <div className="inspector-card polaris-card">
              <div className="inspector-header">
                <div className="ins-title-cluster">
                  <Box size={18} className="text-cyan" />
                  <div>
                    <span className="ins-subsystem-tag">{currentModule.subsystem}</span>
                    <h3 className="ins-module-name">{currentModule.name}</h3>
                  </div>
                </div>
                <div className="ins-health-badge">
                  <span className="ins-health-score mono-num">{currentModule.healthScore}</span>
                  <span className="ins-health-lbl">HEALTH</span>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="inspector-metrics-grid">
                <div className="ins-metric-box">
                  <span className="ins-m-lbl">
                    <Thermometer size={12} className="text-cyan" /> Ambient Temp
                  </span>
                  <span className="ins-m-val mono-num">{currentModule.temp}</span>
                </div>
                <div className="ins-metric-box">
                  <span className="ins-m-lbl">
                    <Zap size={12} className="text-amber" /> Active Power
                  </span>
                  <span className="ins-m-val mono-num">{currentModule.power}</span>
                </div>
                <div className="ins-metric-box">
                  <span className="ins-m-lbl">
                    <ShieldCheck size={12} className="text-emerald" /> Internal Pressure
                  </span>
                  <span className="ins-m-val mono-num">{currentModule.pressure}</span>
                </div>
              </div>

              {/* Sub-Components & Actuators List */}
              <div className="subcomponents-section">
                <h4 className="subcomp-title">Subsystem Components & SCADA Field Devices</h4>
                <div className="subcomp-list">
                  {currentModule.components.map((comp, idx) => (
                    <div key={idx} className="subcomp-item-row">
                      <div className="subcomp-left">
                        <span className="subcomp-name">{comp.name}</span>
                        <span className="subcomp-status">{comp.status}</span>
                      </div>
                      <span className="subcomp-load mono-num text-cyan">{comp.load}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SCADA Status Footnote */}
              <div className="inspector-footer">
                <div className="ins-status-indicator">
                  <span className={`live-dot ${currentModule.status === 'Warning' ? 'bg-amber' : 'bg-emerald'}`} />
                  <span>SCADA Status: <strong>{currentModule.status.toUpperCase()}</strong></span>
                </div>
                <span className="ins-sync-time">Synchronized with Station Field SCADA Bus</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
