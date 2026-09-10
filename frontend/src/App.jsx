import React, { useState } from 'react';
import Header from './components/Header';
import StationSelector from './components/StationSelector';
import StationHealthGauge from './components/StationHealthGauge';
import ActiveAlerts from './components/ActiveAlerts';
import DigitalTwinViewer from './components/DigitalTwinViewer';
import WeatherOverview from './components/WeatherOverview';
import EnvironmentalConditions from './components/EnvironmentalConditions';
import EnergySummary from './components/EnergySummary';
import LogisticsOverview from './components/LogisticsOverview';
import ResourceTrend from './components/ResourceTrend';
import PredictiveAlerts from './components/PredictiveAlerts';
import WhatIfSimulator from './components/WhatIfSimulator';
import DetailModal from './components/DetailModal';
import InfrastructureView from './components/InfrastructureView';
import EnergyView from './components/EnergyView';
import DigitalTwinView from './components/DigitalTwinView';
import LogisticsView from './components/LogisticsView';
import EnvironmentView from './components/EnvironmentView';
import CommunicationView from './components/CommunicationView';
import AlertsView from './components/AlertsView';
import TelemetryView from './components/TelemetryView';
import SimulationsView from './components/SimulationsView';
import ResearchView from './components/ResearchView';
import RemoteOperationsView from './components/RemoteOperationsView';
import AllStationsOverview from './components/AllStationsOverview';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { STATIONS_DATA } from './data/stationsData';
import './App.css';

function MainDashboard() {
  const { profile, isIndiaOperator, isStationOperator, assignedStation, logout } = useAuth();
  const { selectedStation, setSelectedStation } = useTelemetry();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    type: '',
    data: null,
  });

  const effectiveStationId = selectedStation === 'all-stations' ? 'station-maitri' : selectedStation;
  const stationData = STATIONS_DATA[effectiveStationId] || STATIONS_DATA['station-maitri'];

  const handleOpenAlerts = () => {
    setModalState({
      isOpen: true,
      title: `Active Mission Alerts & Incident Log (${stationData.name})`,
      type: 'ALERT_VIEW_ALL',
      data: stationData.alerts || null,
    });
  };

  const handleOpenInsight = (detailData) => {
    setModalState({
      isOpen: true,
      title: detailData?.title || 'Predictive Alert Detail',
      type: 'INSIGHT_DETAIL',
      data: detailData,
    });
  };

  const handleOpenReport = (scenarioObj) => {
    setModalState({
      isOpen: true,
      title: `Simulation Report: ${scenarioObj?.name || scenarioObj?.label || 'Energy Diagnostic Analysis'}`,
      type: 'SIMULATION_REPORT',
      data: scenarioObj,
    });
  };

  const handleOpenForecast = () => {
    setModalState({
      isOpen: true,
      title: `Detailed Polar Meteorological Forecast – ${stationData.name} (7-Day)`,
      type: 'FORECAST',
      data: stationData.weather,
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="polaris-dashboard-root">
      {/* Top Navbar with POLARIS brand crest, quick station pills, primary nav tabs, and status */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        selectedStation={selectedStation}
        onSelectStation={setSelectedStation}
        unreadCount={stationData.unreadAlertsCount}
        onOpenAlerts={handleOpenAlerts}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Role-Based Subheader Info Banner */}
      <div className="operator-role-banner">
        <div className="role-banner-left">
          <span className="role-badge-label">
            {isIndiaOperator 
              ? (selectedStation === 'all-stations' ? '🇮🇳 INDIA HQ NATIONAL COMMAND (ALL STATIONS)' : '🇮🇳 INDIA HQ NATIONAL COMMAND') 
              : `❄️ ${stationData.name.toUpperCase()} STATION • ONLINE • ASSIGNED`}
          </span>
          <span className="role-badge-desc">
            {profile?.full_name ? <strong style={{ color: '#bae6fd' }}>{profile.full_name} ({profile.clearance || 'Level 4 Bravo'}) — </strong> : ''}
            {isIndiaOperator 
              ? 'Multi-Station Unified Telemetry, Cross-Station Switching, and ISRO Space-Ground Uplink Active' 
              : `Restricted Operator Context: Access strictly isolated to ${stationData.name} Research Station`}
          </span>
        </div>
        <div className="role-banner-right">
          <button 
            className="switch-operator-btn"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Switch User Context
          </button>
          <button 
            className="switch-operator-btn sign-out-btn"
            onClick={logout}
            title="Sign out and return to Government Landing Page"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main View Switching controlled exclusively by Top Navbar */}
      {selectedStation === 'all-stations' && activeTab === 'overview' ? (
        <AllStationsOverview onSelectStation={setSelectedStation} />
      ) : activeTab === 'energy' ? (
        <EnergyView 
          selectedStation={effectiveStationId}
          onOpenAlerts={handleOpenAlerts}
          onOpenReport={handleOpenReport}
        />
      ) : activeTab === 'infrastructure' ? (
        <InfrastructureView 
          selectedStation={effectiveStationId}
        />
      ) : activeTab === 'digital-twin' ? (
        <DigitalTwinView 
          selectedStation={effectiveStationId}
        />
      ) : activeTab === 'logistics' ? (
        <LogisticsView 
          selectedStation={effectiveStationId}
        />
      ) : activeTab === 'environment' ? (
        <EnvironmentView 
          selectedStation={effectiveStationId}
        />
      ) : activeTab === 'research' ? (
        <ResearchView 
          selectedStation={selectedStation}
          onSelectStation={setSelectedStation}
        />
      ) : activeTab === 'communication' ? (
        <CommunicationView 
          selectedStation={effectiveStationId}
        />
      ) : activeTab === 'alerts' ? (
        <AlertsView 
          selectedStation={effectiveStationId}
        />
      ) : activeTab === 'telemetry' ? (
        <TelemetryView 
          selectedStation={effectiveStationId}
        />
      ) : activeTab === 'simulations' ? (
        <SimulationsView 
          selectedStation={effectiveStationId}
          onOpenReport={handleOpenReport}
        />
      ) : activeTab === 'remote-operations' ? (
        <RemoteOperationsView 
          selectedStation={effectiveStationId}
        />
      ) : (
        /* Overview Dashboard View */
        <main className="polaris-main-grid">
          {/* Left Column */}
          <aside className="polaris-col-left">
            <StationSelector 
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
            />
            <StationHealthGauge 
              health={stationData.health}
            />
            <ActiveAlerts 
              alerts={stationData.alerts}
              unreadCount={stationData.unreadAlertsCount}
              onOpenViewAll={handleOpenAlerts}
            />
          </aside>

          {/* Center Main Content Area */}
          <section className="polaris-col-center">
            <DigitalTwinViewer 
              selectedStation={effectiveStationId}
              stationData={stationData}
            />

            <div className="center-middle-grid">
              <EnergySummary 
                energy={stationData.energy}
              />
              <LogisticsOverview 
                inventory={stationData.logistics}
              />
              <ResourceTrend 
                trendData={stationData.resourceTrend}
                selectedStation={effectiveStationId}
              />
            </div>

            <div className="center-bottom-grid">
              <PredictiveAlerts 
                insights={stationData.predictiveInsights}
                onOpenInsight={handleOpenInsight}
              />
              <WhatIfSimulator 
                scenarios={stationData.scenarios}
                onOpenReport={handleOpenReport}
              />
            </div>
          </section>

          {/* Right Column */}
          <aside className="polaris-col-right">
            <WeatherOverview 
              weather={stationData.weather}
              onOpenForecast={handleOpenForecast}
            />
            <EnvironmentalConditions 
              weather={stationData.weather}
              sparklines={stationData.sparklines}
            />
          </aside>
        </main>
      )}

      {/* Interactive Detail Modal Dialog */}
      <DetailModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        type={modalState.type}
        data={modalState.data}
      />

      {/* Authentication & Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isBarrier={false}
      />
    </div>
  );
}

function AppContent() {
  const { profile } = useAuth();

  // If unauthenticated or profile is null, show Government of India POLARIS Landing Page
  if (!profile) {
    return <LandingPage />;
  }

  return <MainDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <TelemetryProvider>
        <AppContent />
      </TelemetryProvider>
    </AuthProvider>
  );
}
