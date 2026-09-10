import React from 'react';
import { 
  CloudSnow, 
  Wind, 
  Compass, 
  Droplets, 
  Gauge,
  ArrowUpRight
} from 'lucide-react';

export default function WeatherOverview({ weather: weatherProp, onOpenForecast }) {
  const weather = weatherProp || {
    temp: '-18.7',
    unit: '°C',
    condition: 'Light Snow',
    windSpeed: '28 km/h',
    windDir: 'NW',
    humidity: '68%',
    pressure: '987 hPa'
  };

  return (
    <div className="weather-overview-section polaris-card">
      <div className="card-header-simple">
        <span className="card-title">WEATHER OVERVIEW</span>
      </div>

      {/* Main Big Weather Display */}
      <div className="weather-main-hero">
        <div className="weather-hero-left">
          {/* Animated Snow Cloud Icon */}
          <div className="weather-cloud-wrap">
            <svg className="snow-cloud-svg" viewBox="0 0 54 44" fill="none">
              <path 
                d="M38 18C37.5 10 30 6 23 9C17 6 9 12 11 19C5 21 4 29 10 32C12 33 40 33 42 32C47 30 48 22 42 19C40 18.5 39 18 38 18Z" 
                fill="#38bdf8" 
                fillOpacity="0.2" 
                stroke="#38bdf8" 
                strokeWidth="1.8" 
                strokeLinejoin="round" 
              />
              {/* Falling Snowflakes */}
              <circle cx="16" cy="38" r="1.5" fill="#ffffff" className="flake-anim flake-1" />
              <circle cx="27" cy="40" r="1.8" fill="#ffffff" className="flake-anim flake-2" />
              <circle cx="37" cy="38" r="1.5" fill="#ffffff" className="flake-anim flake-3" />
            </svg>
          </div>
        </div>

        <div className="weather-hero-right">
          <div className="weather-temp-row">
            <span className="temp-number mono-num">{weather.temp}</span>
            <span className="temp-unit">{weather.unit}</span>
          </div>
          <div className="weather-condition-label">{weather.condition}</div>
        </div>
      </div>

      {/* Weather Parameters Table */}
      <div className="weather-params-list">
        <div className="weather-param-row">
          <div className="param-label-wrap">
            <Wind size={13} className="param-icon" />
            <span className="param-label">Wind Speed</span>
          </div>
          <span className="param-value mono-num">{weather.windSpeed}</span>
        </div>

        <div className="weather-param-row">
          <div className="param-label-wrap">
            <Compass size={13} className="param-icon" />
            <span className="param-label">Wind Direction</span>
          </div>
          <span className="param-value mono-num">{weather.windDir}</span>
        </div>

        <div className="weather-param-row">
          <div className="param-label-wrap">
            <Droplets size={13} className="param-icon" />
            <span className="param-label">Humidity</span>
          </div>
          <span className="param-value mono-num">{weather.humidity}</span>
        </div>

        <div className="weather-param-row">
          <div className="param-label-wrap">
            <Gauge size={13} className="param-icon" />
            <span className="param-label">Pressure</span>
          </div>
          <span className="param-value mono-num">{weather.pressure}</span>
        </div>
      </div>

      {/* Forecast Link */}
      <div className="weather-card-footer">
        <button 
          className="detailed-forecast-link"
          onClick={onOpenForecast}
        >
          <span>Detailed Forecast</span>
          <span className="forecast-arrow">→</span>
        </button>
      </div>
    </div>
  );
}
