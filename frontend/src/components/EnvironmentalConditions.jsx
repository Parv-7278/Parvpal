import React, { useState } from 'react';
import { RefreshCw, Thermometer, Wind, CloudSnow, Eye, ExternalLink } from 'lucide-react';
import { useModal } from '../context/ModalContext';

export default function EnvironmentalConditions({ weather, sparklines }) {
  const { openDrillDown } = useModal();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('12:45 PM');

  const handleRefresh = (e) => {
    e.stopPropagation();
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
      onDrillDown: () => openDrillDown({
        title: 'Ambient Surface Temperature',
        category: 'ENVIRONMENT',
        metricKey: 'temperature',
        currentValue: typeof weather?.temp === 'number' ? weather.temp : parseFloat(weather?.temp) || -18.7,
        unit: '°C',
        status: (weather?.temp && weather.temp < -25) ? 'WARNING' : 'NORMAL',
        thresholds: { warning: '< -25.0 °C', critical: '< -35.0 °C' },
        stats: { min: '-24.2 °C', avg: '-18.9 °C', max: '-12.1 °C' },
        historicalData: [
          { time: '00:00', val: -21.4 },
          { time: '04:00', val: -22.8 },
          { time: '08:00', val: -19.5 },
          { time: '12:00', val: -17.2 },
          { time: '16:00', val: -18.7 },
          { time: '20:00', val: -20.1 },
          { time: 'Now', val: typeof weather?.temp === 'number' ? weather.temp : -18.7 },
        ],
        interpretation: 'Thermal sensors at station perimeter indicate standard polar variance. Core habitat heating maintains nominal +21°C interior baseline.',
        recommendation: 'Ensure external pipeline trace heaters remain energized continuously.',
      }),
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: currentWind,
      icon: Wind,
      color: '#0284c7',
      path: activeSparklines.wind || defaultSparklines.wind,
      onDrillDown: () => openDrillDown({
        title: 'Surface Wind & Katabatic Velocity',
        category: 'ENVIRONMENT',
        metricKey: 'wind_speed',
        currentValue: parseFloat(weather?.windSpeed) || 28,
        unit: 'km/h',
        status: (parseFloat(weather?.windSpeed) > 60) ? 'WARNING' : 'NORMAL',
        thresholds: { warning: '> 60 km/h', critical: '> 85 km/h (Blizzard)' },
        stats: { min: '8 km/h', avg: '26 km/h', max: '68 km/h' },
        historicalData: [
          { time: '00:00', val: 14.5 },
          { time: '04:00', val: 18.2 },
          { time: '08:00', val: 24.0 },
          { time: '12:00', val: 32.5 },
          { time: '16:00', val: 28.0 },
          { time: '20:00', val: 22.4 },
          { time: 'Now', val: parseFloat(weather?.windSpeed) || 28 },
        ],
        interpretation: 'Katabatic wind flow from polar plateau remains sub-critical. Structural anchoring on communication radomes stable.',
        recommendation: 'Check anemometer anti-icing elements during pre-blizzard checklist.',
      }),
    },
    {
      id: 'snow',
      label: 'Snow Accumulation',
      value: currentSnow,
      icon: CloudSnow,
      color: '#60a5fa',
      path: activeSparklines.snow || defaultSparklines.snow,
      onDrillDown: () => openDrillDown({
        title: 'Snow Drift & Precipitation Depth',
        category: 'ENVIRONMENT',
        metricKey: 'snow_accumulation',
        currentValue: parseFloat(weather?.snowAccumulation) || 12,
        unit: 'cm',
        status: 'NORMAL',
        thresholds: { warning: '> 30 cm / 24h', critical: '> 60 cm' },
        stats: { min: '2 cm', avg: '11 cm', max: '19 cm' },
        historicalData: [
          { time: '00:00', val: 8.5 },
          { time: '04:00', val: 9.2 },
          { time: '08:00', val: 10.4 },
          { time: '12:00', val: 11.8 },
          { time: '16:00', val: 12.0 },
          { time: '20:00', val: 12.0 },
          { time: 'Now', val: parseFloat(weather?.snowAccumulation) || 12 },
        ],
        interpretation: 'Ultrasonic depth sensors confirm steady drift accumulation under the stilt module aerodynamics.',
        recommendation: 'Auto-blowers scheduled for air intake plenum clearance at 06:00 UTC.',
      }),
    },
    {
      id: 'visibility',
      label: 'Atmospheric Visibility',
      value: currentVis,
      icon: Eye,
      color: '#a3e635',
      path: activeSparklines.visibility || defaultSparklines.visibility,
      onDrillDown: () => openDrillDown({
        title: 'Atmospheric Visibility & Optical Range',
        category: 'ENVIRONMENT',
        metricKey: 'visibility',
        currentValue: parseFloat(weather?.visibility) || 4.8,
        unit: 'km',
        status: 'NORMAL',
        thresholds: { warning: '< 1.5 km (Drift)', critical: '< 0.3 km (Whiteout)' },
        stats: { min: '1.2 km', avg: '5.4 km', max: '15.0 km' },
        historicalData: [
          { time: '00:00', val: 6.2 },
          { time: '04:00', val: 5.8 },
          { time: '08:00', val: 4.5 },
          { time: '12:00', val: 4.8 },
          { time: '16:00', val: 5.0 },
          { time: '20:00', val: 4.8 },
          { time: 'Now', val: parseFloat(weather?.visibility) || 4.8 },
        ],
        interpretation: 'Forward-scatter optical sensor indicates clear operational corridor with light blowing snow.',
        recommendation: 'Maintain runway guidance strobes on automatic standby mode.',
      }),
    },
  ];

  return (
    <div className="environmental-conditions-section polaris-card">
      <div className="card-header-simple">
        <span className="card-title">ENVIRONMENTAL CONDITIONS</span>
        <span className="card-subtitle-badge">CLICK TO EXPAND</span>
      </div>

      <div className="environmental-sparklines-list">
        {sparklineData.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id} 
              className="env-sparkline-row clickable-drilldown-card"
              onClick={item.onDrillDown}
              title={`Click to inspect ${item.label} telemetry history`}
            >
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
