import React from 'react';
import { 
  Building2, 
  Activity, 
  Zap, 
  ArrowDown, 
  ArrowRight, 
  ArrowLeft,
  Shield, 
  Radio, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';

export default function PolarisFlowDiagram({ 
  onNavigateNode, 
  activeNode = 'login',
  compact = false 
}) {
  const { isIndiaOperator, isStationOperator, assignedStation, loginWithDemoRole } = useAuth();
  const { selectedStation, setSelectedStation } = useTelemetry();

  const handleSelect = (target) => {
    if (onNavigateNode) {
      onNavigateNode(target);
      return;
    }

    if (target === 'india') {
      loginWithDemoRole('india_operator');
      if (setSelectedStation) setSelectedStation('all-stations');
    } else if (target === 'maitri') {
      loginWithDemoRole('station-maitri');
      if (setSelectedStation) setSelectedStation('station-maitri');
    } else if (target === 'bharati') {
      loginWithDemoRole('station-bharati');
      if (setSelectedStation) setSelectedStation('station-bharati');
    }
  };

  // Determine current active node if not explicitly passed
  let currentActive = activeNode;
  if (activeNode === 'auto') {
    if (isIndiaOperator) {
      if (selectedStation === 'station-maitri') currentActive = 'india-maitri';
      else if (selectedStation === 'station-bharati') currentActive = 'india-bharati';
      else currentActive = 'india';
    } else if (isStationOperator) {
      if (assignedStation === 'station-maitri' || selectedStation === 'station-maitri') currentActive = 'maitri';
      else if (assignedStation === 'station-bharati' || selectedStation === 'station-bharati') currentActive = 'bharati';
    }
  }

  return (
    <div className={`polaris-flow-diagram-container ${compact ? 'flow-compact' : ''}`}>
      {/* Header Title */}
      <div className="flow-diagram-header">
        <div className="flow-title-wrap">
          <Sparkles size={14} className="text-cyan animate-pulse" />
          <span className="flow-main-heading">POLARIS Operational Command & Routing Architecture</span>
        </div>
        <span className="flow-sub-heading">Unified National Mission Control & Station Dashboard Hierarchy</span>
      </div>

      {/* Main Flow Tree Container */}
      <div className="flow-tree-wrapper">
        
        {/* TOP LEVEL: POLARIS LOGIN */}
        <div className="flow-level flow-level-root">
          <div 
            className={`flow-node flow-node-root ${currentActive === 'login' ? 'node-active' : ''}`}
            onClick={() => handleSelect('login')}
          >
            <div className="node-icon-bubble root-bubble">
              <Shield size={16} />
            </div>
            <div className="node-text-col">
              <span className="node-title">POLARIS LOGIN</span>
              <span className="node-subtitle">Central Government Auth Gateway</span>
            </div>
            {currentActive === 'login' && <span className="active-pulse-badge">ENTRY</span>}
          </div>
        </div>

        {/* CONNECTING TRIPLE TRUNK */}
        <div className="flow-triple-fork-lines">
          <div className="fork-vertical-stem" />
          <div className="fork-horizontal-bar" />
          <div className="fork-drops-row">
            <div className="fork-drop-line" />
            <div className="fork-drop-line" />
            <div className="fork-drop-line" />
          </div>
        </div>

        {/* THREE MAIN BRANCHES: INDIA | MAITRI | BHARATI */}
        <div className="flow-three-columns">
          
          {/* BRANCH 1: INDIA (HQ) */}
          <div className="flow-branch-col branch-india">
            {/* Entry Station Node */}
            <div 
              className={`flow-node flow-node-station node-india ${currentActive === 'india' || currentActive === 'india-maitri' || currentActive === 'india-bharati' ? 'node-active' : ''}`}
              onClick={() => handleSelect('india')}
              title="Click to enter India Control Centre"
            >
              <div className="node-top-tag tag-india">🇮🇳 NATIONAL HQ</div>
              <div className="node-icon-title-row">
                <span className="node-flag">🇮🇳</span>
                <span className="node-main-name">INDIA</span>
              </div>
              <span className="node-desc">Ministry of Earth Sciences / NCPOR</span>
            </div>

            <div className="flow-down-arrow">
              <ArrowDown size={14} className="text-cyan" />
            </div>

            {/* Dashboard Node */}
            <div 
              className={`flow-node flow-node-dashboard node-india-control ${(currentActive === 'india' || currentActive === 'india-maitri' || currentActive === 'india-bharati') ? 'node-active' : ''}`}
              onClick={() => handleSelect('india')}
            >
              <div className="node-icon-bubble india-bubble">
                <Building2 size={16} />
              </div>
              <div className="node-text-col">
                <span className="node-dashboard-title">INDIA CONTROL CENTRE</span>
                <span className="node-dashboard-sub">National Command & Unified Telemetry</span>
              </div>
            </div>

            <div className="flow-down-arrow">
              <ArrowDown size={14} className="text-cyan" />
            </div>

            {/* Cross-Station Dual Switch Split */}
            <div className="india-split-box">
              <div className="split-label">Multi-Station Switching:</div>
              <div className="split-buttons-row">
                <button 
                  type="button" 
                  className={`split-sub-btn ${currentActive === 'india-maitri' ? 'active' : ''}`}
                  onClick={() => {
                    handleSelect('india');
                    if (setSelectedStation) setSelectedStation('station-maitri');
                  }}
                  title="Command Maitri Station from India HQ"
                >
                  <span>🧊 Maitri View</span>
                </button>
                <button 
                  type="button" 
                  className={`split-sub-btn ${currentActive === 'india-bharati' ? 'active' : ''}`}
                  onClick={() => {
                    handleSelect('india');
                    if (setSelectedStation) setSelectedStation('station-bharati');
                  }}
                  title="Command Bharati Station from India HQ"
                >
                  <span>📡 Bharati View</span>
                </button>
              </div>
            </div>
          </div>

          {/* BRANCH 2: MAITRI (Station Base) */}
          <div className="flow-branch-col branch-maitri">
            {/* Entry Station Node */}
            <div 
              className={`flow-node flow-node-station node-maitri ${currentActive === 'maitri' ? 'node-active' : ''}`}
              onClick={() => handleSelect('maitri')}
              title="Click to enter Maitri Dashboard"
            >
              <div className="node-top-tag tag-maitri">🧊 STATION #1</div>
              <div className="node-icon-title-row">
                <span className="node-flag">🧊</span>
                <span className="node-main-name">MAITRI</span>
              </div>
              <span className="node-desc">Schirmacher Oasis (70°45′S)</span>
            </div>

            <div className="flow-down-arrow">
              <ArrowDown size={14} className="text-cyan" />
            </div>

            {/* Dashboard Node */}
            <div 
              className={`flow-node flow-node-dashboard node-maitri-dash ${currentActive === 'maitri' ? 'node-active' : ''}`}
              onClick={() => handleSelect('maitri')}
            >
              <div className="node-icon-bubble maitri-bubble">
                <Activity size={16} />
              </div>
              <div className="node-text-col">
                <span className="node-dashboard-title">MAITRI DASHBOARD</span>
                <span className="node-dashboard-sub">Inland Base Life-Support & Microgrid</span>
              </div>
            </div>

            <div className="flow-down-arrow">
              <ArrowDown size={14} className="text-cyan" />
            </div>

            {/* Link Back to India Node */}
            <div 
              className="flow-uplink-return-node"
              onClick={() => handleSelect('india')}
              title="Uplink / Return to India Control Centre"
            >
              <div className="uplink-badge">
                <Radio size={11} className="animate-pulse" />
                <span>Uplink to HQ</span>
              </div>
              <span className="uplink-name">🇮🇳 INDIA</span>
              <span className="uplink-hint">Click to jump to India HQ →</span>
            </div>
          </div>

          {/* BRANCH 3: BHARATI (Station Base) */}
          <div className="flow-branch-col branch-bharati">
            {/* Entry Station Node */}
            <div 
              className={`flow-node flow-node-station node-bharati ${currentActive === 'bharati' ? 'node-active' : ''}`}
              onClick={() => handleSelect('bharati')}
              title="Click to enter Bharati Dashboard"
            >
              <div className="node-top-tag tag-bharati">🧊 STATION #2</div>
              <div className="node-icon-title-row">
                <span className="node-flag">📡</span>
                <span className="node-main-name">BHARATI</span>
              </div>
              <span className="node-desc">Larsemann Hills (69°24′S)</span>
            </div>

            <div className="flow-down-arrow">
              <ArrowDown size={14} className="text-cyan" />
            </div>

            {/* Dashboard Node */}
            <div 
              className={`flow-node flow-node-dashboard node-bharati-dash ${currentActive === 'bharati' ? 'node-active' : ''}`}
              onClick={() => handleSelect('bharati')}
            >
              <div className="node-icon-bubble bharati-bubble">
                <Zap size={16} />
              </div>
              <div className="node-text-col">
                <span className="node-dashboard-title">BHARATI DASHBOARD</span>
                <span className="node-dashboard-sub">Coastal CHP & ISRO Satellite Uplink</span>
              </div>
            </div>

            <div className="flow-down-arrow">
              <ArrowDown size={14} className="text-cyan" />
            </div>

            {/* Link Back to India Node */}
            <div 
              className="flow-uplink-return-node"
              onClick={() => handleSelect('india')}
              title="Uplink / Return to India Control Centre"
            >
              <div className="uplink-badge">
                <Radio size={11} className="animate-pulse" />
                <span>Uplink to HQ</span>
              </div>
              <span className="uplink-name">🇮🇳 INDIA</span>
              <span className="uplink-hint">Click to jump to India HQ →</span>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Legend */}
      <div className="flow-diagram-footer">
        <div className="flow-legend-item">
          <span className="legend-dot dot-blue" />
          <span>National HQ Control</span>
        </div>
        <div className="flow-legend-item">
          <span className="legend-dot dot-cyan" />
          <span>Maitri Local Context</span>
        </div>
        <div className="flow-legend-item">
          <span className="legend-dot dot-emerald" />
          <span>Bharati Local Context</span>
        </div>
        <div className="flow-legend-item">
          <span className="legend-dot dot-gold" />
          <span>ISRO Space-Ground Sat-Link</span>
        </div>
      </div>
    </div>
  );
}
