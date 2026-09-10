import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export default function StationSelector({ selectedStation, onSelectStation }) {
  const { isIndiaOperator, isStationOperator, assignedStation } = useAuth();

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

  return (
    <div className="station-selector-section polaris-card">
      <div className="card-header-simple">
        <span className="card-title">
          {isStationOperator ? 'ASSIGNED STATION' : 'STATION SELECTOR'}
        </span>
        {isStationOperator ? (
          <span className="station-locked-badge">
            <Lock size={10} /> Station Locked
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
                    // Fallback if image path differs
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
      </div>
    </div>
  );
}
