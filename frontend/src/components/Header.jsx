import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  ChevronDown, 
  Lock,
  LayoutDashboard,
  Box,
  Cpu,
  Zap,
  Package,
  CloudSnow,
  Activity,
  Radio,
  Sliders,
  Terminal,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  selectedStation, 
  onSelectStation, 
  unreadCount = 3,
  onOpenAlerts,
  onOpenAuth 
}) {
  const { profile, isIndiaOperator, isStationOperator, assignedStation, logout } = useAuth();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      });
      setTimeStr(`${time} IST`);

      const date = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      setDateStr(date);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const indiaTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'digital-twin', label: 'Digital Twin', icon: Box },
    { id: 'infrastructure', label: 'Infrastructure', icon: Cpu },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'logistics', label: 'Logistics', icon: Package },
    { id: 'environment', label: 'Environment', icon: CloudSnow },
    { id: 'research', label: 'Research', icon: Activity },
    { id: 'communication', label: 'Comms', icon: Radio },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadCount },
    { id: 'telemetry', label: 'Telemetry', icon: Layers, isLive: true },
    { id: 'simulations', label: 'Simulations', icon: Sliders },
    { id: 'remote-operations', label: 'Remote Ops', icon: Terminal },
  ];

  const stationTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'digital-twin', label: 'Digital Twin', icon: Box },
    { id: 'infrastructure', label: 'Infrastructure', icon: Cpu },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'logistics', label: 'Logistics', icon: Package },
    { id: 'environment', label: 'Environment', icon: CloudSnow },
    { id: 'research', label: 'Research', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadCount },
    { id: 'telemetry', label: 'Telemetry', icon: Layers, isLive: true },
    { id: 'remote-operations', label: 'Remote Ops', icon: Terminal },
  ];

  const tabs = isIndiaOperator ? indiaTabs : stationTabs;

  const currentStationLabel = selectedStation === 'station-bharati' 
    ? 'Bharati' 
    : selectedStation === 'all-stations'
    ? 'All Stations'
    : 'Maitri';

  return (
    <header className="polaris-header">
      {/* Brand & Logo + Station Quick Selector */}
      <div className="header-left-cluster">
        <div className="header-brand">
          <div className="logo-container">
            <svg className="polar-logo-svg" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L36 12V24L20 31L4 24V12L20 2Z" stroke="#38bdf8" strokeWidth="1.8" fill="rgba(6, 182, 212, 0.12)" />
              <path d="M11 23L17 14L22 21L27 10L33 23H11Z" fill="#0284c7" fillOpacity="0.4" />
              <path d="M27 10L22 21L17 14L11 23H33L27 10Z" stroke="#38bdf8" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M27 10L24.5 15.5L27 17L29.5 15L27 10Z" fill="#ffffff" />
              <path d="M17 14L14.8 18.5L17 19.5L19 18.5L17 14Z" fill="#ffffff" />
              <line x1="8" y1="26" x2="32" y2="26" stroke="#00e699" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">POLARIS</h1>
            <span className="brand-subtitle">Antarctic Digital Twin</span>
          </div>
        </div>

        {/* Station Selector: ONLY shown for India Operator */}
        {isIndiaOperator ? (
          <div className="header-station-pills">
            <button
              onClick={() => onSelectStation('all-stations')}
              className={`station-pill-btn ${selectedStation === 'all-stations' ? 'active' : ''}`}
              title="National Command: All Antarctic Stations"
            >
              <span className="station-pill-name">All Stations</span>
              <span className="station-pill-status">
                <span className="live-dot" /> Multi-HQ
              </span>
            </button>

            <button
              onClick={() => onSelectStation('station-maitri')}
              className={`station-pill-btn ${selectedStation === 'station-maitri' ? 'active' : ''}`}
              title="Switch to Maitri Station"
            >
              <span className="station-pill-name">Maitri</span>
              <span className="station-pill-status">
                <span className="live-dot" /> Online
              </span>
            </button>

            <button
              onClick={() => onSelectStation('station-bharati')}
              className={`station-pill-btn ${selectedStation === 'station-bharati' ? 'active' : ''}`}
              title="Switch to Bharati Station"
            >
              <span className="station-pill-name">Bharati</span>
              <span className="station-pill-status">
                <span className="live-dot" /> Online
              </span>
            </button>
          </div>
        ) : (
          /* For Station Operators: Show Fixed Station Badge without selector pills */
          <div className="header-assigned-station-badge">
            <div className="station-lock-tag">
              <Lock size={11} className="lock-icon" />
              <span className="locked-station-name">{currentStationLabel} Station</span>
            </div>
            <span className="station-pill-status">
              <span className="live-dot" /> Online (Assigned)
            </span>
          </div>
        )}
      </div>

      {/* Primary Top Navigation Tabs with Icons */}
      <nav className="header-nav">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${isActive ? 'active' : ''}`}
            >
              <IconComp size={13} className="nav-tab-icon" />
              <span className="nav-tab-label">{tab.label}</span>
              {tab.badge > 0 && (
                <span className="nav-tab-badge">{tab.badge}</span>
              )}
              {tab.isLive && (
                <span className="nav-live-dot" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="header-controls">
        {/* Notification Bell */}
        <button 
          className="notification-btn" 
          onClick={onOpenAlerts}
          title="Active Alerts"
        >
          <Bell size={17} className="bell-icon" />
          <span className="notification-badge">{unreadCount}</span>
        </button>

        {/* Mission Controller Profile Badge with Switch / Auth Trigger */}
        <div 
          className="user-profile-badge interactive-profile-badge" 
          onClick={onOpenAuth}
          title="Click to Switch Operator Context or Sign Out"
        >
          <div className="avatar-circle">
            <User size={14} />
          </div>
          <div className="user-info">
            <span className="user-role">
              {profile?.full_name || (isIndiaOperator ? 'Dr. Rajesh Sharma' : 'Station Lead')}
            </span>
            <span className="user-status-row">
              <span className={`operator-role-tag ${isIndiaOperator ? 'tag-india' : 'tag-station'}`}>
                {isIndiaOperator ? 'INDIA HQ' : currentStationLabel.toUpperCase()}
              </span>
              <span className="live-dot" />
            </span>
          </div>
          <ChevronDown size={13} className="profile-dropdown-arrow" />
        </div>
      </div>
    </header>
  );
}

