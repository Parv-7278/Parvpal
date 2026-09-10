import React, { useState } from 'react';
import { RefreshCw, Thermometer, Wind, CloudSnow, Eye } from 'lucide-react';

export default function EnvironmentalConditions({ weather, sparklines }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('12:45 PM');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsRefreshing(false);
    }, 600);
  };

  const currentTemp = weather?.temp ? `${weather.temp}${weather.unit || '°C'}` : '-18.7°C';
  const currentWind = weather?.windSpeed || '28 km/h';
  const currentSnow = weather?.snowAccumulation || '12 cm';
  const currentVis = weather?.visibility || '4.8 km';

  const defaultSparklines = {
    temp: 'M0,14 C15,8 25,20 40,12 C55,4 65,18 80,10 C95,2 105,16 120,8 C130,4 140,12 150,9',
    wind: 'M0,18 C20,12 35,2 50,15 C65,22 80,6 95,14 C110,18 125,5 138,10 C145,12 148,8 150,11',
    snow: 'M0,20 C18,19 32,18 50,15 C70,12 90,14 110,9 C125,7 135,11 150,6',
    visibility: 'M0,8 C15,9 30,12 45,18 C60,22 75,19 90,14 C105,10 120,16 135,13 C142,12 148,15 150,14',
  };

  const activeSparklines = sparklines || defaultSparklines;

  const sparklineData = [
    {
      id: 'temp',
      label: 'Temperature',
      value: currentTemp,
      icon: Thermometer,
      color: '#38bdf8',
      path: activeSparklines.temp || defaultSparklines.temp,
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: currentWind,
      icon: Wind,
      color: '#0284c7',
      path: activeSparklines.wind || defaultSparklines.wind,
    },
    {
      id: 'snow',
      label: 'Snow Accumulation',
      value: currentSnow,
      icon: CloudSnow,
      color: '#60a5fa',
      path: activeSparklines.snow || defaultSparklines.snow,
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: currentVis,
      icon: Eye,
      color: '#a3e635',
      path: activeSparklines.visibility || defaultSparklines.visibility,
    },
  ];

  return (
    <div className="environmental-conditions-section polaris-card">
      <div className="card-header-simple">
        <span className="card-title">ENVIRONMENTAL CONDITIONS</span>
      </div>

      <div className="environmental-sparklines-list">
        {sparklineData.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="env-sparkline-row">
              <div className="env-meta-wrap">
                <div className="env-label-row">
                  <Icon size={12} className="env-row-icon" />
                  <span className="env-row-label">{item.label}</span>
                </div>
                {item.value && (
                  <span className="env-row-value mono-num">{item.value}</span>
                )}
              </div>

              {/* Sparkline Waveform SVG */}
              <div className="sparkline-chart-wrap">
                <svg viewBox="0 0 150 24" className="sparkline-svg" preserveAspectRatio="none">
                  <path
                    d={item.path}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Glowing end point dot */}
                  <circle cx="150" cy="9" r="2.5" fill={item.color} />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      <div className="environmental-footer">
        <span className="last-updated-text">
          Last Updated: <span className="mono-num">{lastUpdated}</span>
        </span>
        <button 
          className={`refresh-icon-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={handleRefresh}
          title="Refresh Conditions"
        >
          <RefreshCw size={12} />
        </button>
      </div>
    </div>
  );
}
