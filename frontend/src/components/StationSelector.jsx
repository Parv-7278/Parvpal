import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowLeft, Building2, Radio } from 'lucide-react';

export default function StationSelector({ selectedStation, onSelectStation }) {
  const { isIndiaOperator, isStationOperator, assignedStation, loginWithDemoRole } = useAuth();

  const allStations = [
    {
      id: 'station-maitri',
      name: 'MAITRI',
      country: 'India',
      status: 'Online',
      image: '/stations/maitri.jpg',
      region: 'Queen Maud Land (70°45′S)'
    },
    {
      id: 'station-bharati',
      name: 'BHARATI',
      country: 'India',
      status: 'Online',
      image: '/stations/bharati.jpg',
      region: 'Larsemann Hills (69°24′S)'
    }
  ];

  const stations = isStationOperator
    ? allStations.filter(st => st.id === assignedStation)
    : allStations;

  const handleReturnToIndia = () => {
    loginWithDemoRole('india_operator');
    if (onSelectStation) {
      onSelectStation('all-stations');
    }
  };

  return (
    <div className="station-selector-section polaris-card">
      <div className="card-header-simple">
        <span className="card-title">
          {isStationOperator ? 'ASSIGNED STATION' : 'STATION SELECTOR'}
        </span>
        {isStationOperator ? (
          <span className="station-locked-badge">
            <Lock size={10} /> Local Command
          </span>
        ) : (
          <button 
            className={`all-stations-quick-btn ${selectedStation === 'all-stations' ? 'active' : ''}`}
            onClick={() => onSelectStation('all-stations')}
          >
            All Stations View
          </button>
        )}
      </div>

      <div className="station-card-list">
        {stations.map((st) => {
          const isSelected = selectedStation === st.id;
          return (
            <div
              key={st.id}
              onClick={() => isIndiaOperator && onSelectStation(st.id)}
              className={`station-item-card ${isSelected ? 'selected' : ''} ${!isIndiaOperator ? 'station-card-locked' : ''}`}
            >
              <div className="station-thumb-container">
                <img 
                  src={st.image} 
                  alt={st.name} 
                  className="station-thumb-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="thumb-scanline" />
              </div>

              <div className="station-meta">
                <div className="station-name-row">
                  <span className="station-name-text">{st.name}</span>
                </div>
                <div className="station-country-text">{st.region}</div>
                <div className="station-status-row">
                  <span className="live-dot" />
                  <span className="status-label">{st.status}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* For Station Operators: Quick Card to Uplink / Jump to India Control Centre */}
        {isStationOperator && (
          <div 
            className="station-uplink-india-card"
            onClick={handleReturnToIndia}
            title="Navigate to 🇮🇳 INDIA CONTROL CENTRE (National Mission Command)"
          >
            <div className="uplink-card-left">
              <Building2 size={16} className="text-blue-400" />
              <div className="uplink-card-text">
                <span className="uplink-card-title">🇮🇳 INDIA CONTROL CENTRE</span>
                <span className="uplink-card-sub">Uplink to National Mission HQ</span>
              </div>
            </div>
            <ArrowLeft size={14} className="uplink-card-arrow" />
          </div>
        )}
      </div>
    </div>
  );
}
