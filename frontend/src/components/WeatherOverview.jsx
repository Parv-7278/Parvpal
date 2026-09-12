import React from 'react';
import { 
  CloudSnow, 
  Wind, 
  Compass, 
  Droplets, 
  Gauge,
  ArrowUpRight
} from 'lucide-react';
import { useModal } from '../context/ModalContext';

export default function WeatherOverview({ weather: weatherProp, onOpenForecast }) {
  const { openDrillDown } = useModal();
  const weather = weatherProp || {
    temp: '-18.7',
    unit: '°C',
    condition: 'Light Snow',
    windSpeed: '28 km/h',
    windDir: 'NW',
    humidity: '68%',
    pressure: '987 hPa'
  };

  const handleHeroClick = () => {
    openDrillDown({
      title: 'Surface Temperature & Chill Index',
      category: 'ENVIRONMENT',
      metricKey: 'temperature',
      currentValue: typeof weather?.temp === 'number' ? weather.temp : parseFloat(weather?.temp) || -18.7,
      unit: weather.unit || '°C',
      status: (parseFloat(weather?.temp) < -25) ? 'WARNING' : 'NORMAL',
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
      interpretation: 'Meteorological telemetry indicates stable surface layer conditions with mild convective heat loss.',
      recommendation: 'Check thermal trace circuits on fuel line transfer manifold.',
    });
  };

  const handleWindClick = () => {
    openDrillDown({
      title: 'Surface Wind Speed & Gust Diagnostics',
      category: 'ENVIRONMENT',
      metricKey: 'wind_speed',
      currentValue: parseFloat(weather?.windSpeed) || 28,
      unit: 'km/h',
      status: (parseFloat(weather?.windSpeed) > 60) ? 'WARNING' : 'NORMAL',
      thresholds: { warning: '> 60 km/h', critical: '> 85 km/h' },
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
      recommendation: 'Verify outer meteorological mast tension cables if sustained gusts exceed 50 km/h.',
    });
  };

  const handleHumidityClick = () => {
    openDrillDown({
      title: 'Relative Humidity & Frost Point Analysis',
      category: 'ENVIRONMENT',
      metricKey: 'humidity',
      currentValue: parseFloat(weather?.humidity) || 68,
      unit: '%',
      status: 'NORMAL',
      thresholds: { warning: '> 85% (Heavy Rime Frost)', critical: '> 95%' },
      stats: { min: '45%', avg: '64%', max: '78%' },
      historicalData: [
        { time: '00:00', val: 62 },
        { time: '04:00', val: 65 },
        { time: '08:00', val: 70 },
        { time: '12:00', val: 66 },
        { time: '16:00', val: 68 },
        { time: '20:00', val: 67 },
        { time: 'Now', val: parseFloat(weather?.humidity) || 68 },
      ],
      interpretation: 'Low sublimation rate prevents excessive icing across solar panel arrays and radome enclosures.',
      recommendation: 'Keep active dehumidifiers cycling in food and electronics storage bay.',
    });
  };

  const handlePressureClick = () => {
    openDrillDown({
      title: 'Barometric Atmospheric Pressure',
      category: 'ENVIRONMENT',
      metricKey: 'pressure',
      currentValue: parseFloat(weather?.pressure) || 987,
      unit: 'hPa',
      status: (parseFloat(weather?.pressure) < 970) ? 'WARNING' : 'NORMAL',
      thresholds: { warning: '< 970 hPa (Depression)', critical: '< 950 hPa (Polar Cyclone)' },
      stats: { min: '974 hPa', avg: '986 hPa', max: '1002 hPa' },
      historicalData: [
        { time: '00:00', val: 992 },
        { time: '04:00', val: 990 },
        { time: '08:00', val: 988 },
        { time: '12:00', val: 987 },
        { time: '16:00', val: 986 },
        { time: '20:00', val: 987 },
        { time: 'Now', val: parseFloat(weather?.pressure) || 987 },
      ],
      interpretation: 'Barometer reading steady. Slight downward tendency indicates approaching low-pressure maritime trough in 36 hours.',
      recommendation: 'Monitor synoptic charts for blizzard formation in the Southern Ocean sector.',
    });
  };

  return (
    <div className="weather-overview-section polaris-card">
      <div className="card-header-simple">
        <span className="card-title">WEATHER OVERVIEW</span>
        <span className="card-subtitle-badge">INTERACTIVE</span>
      </div>

      {/* Main Big Weather Display */}
      <div 
        className="weather-main-hero clickable-drilldown-card"
        onClick={handleHeroClick}
        title="Click to view full temperature telemetry and trend diagnostics"
      >
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
        <div 
          className="weather-param-row clickable-drilldown-card"
          onClick={handleWindClick}
          title="Click to inspect wind dynamics"
        >
          <div className="param-label-wrap">
            <Wind size={13} className="param-icon" />
            <span className="param-label">Wind Speed</span>
          </div>
          <span className="param-value mono-num">{weather.windSpeed}</span>
        </div>

        <div 
          className="weather-param-row clickable-drilldown-card"
          onClick={handleWindClick}
          title="Click to inspect wind vectors"
        >
          <div className="param-label-wrap">
            <Compass size={13} className="param-icon" />
            <span className="param-label">Wind Direction</span>
          </div>
          <span className="param-value mono-num">{weather.windDir}</span>
        </div>

        <div 
          className="weather-param-row clickable-drilldown-card"
          onClick={handleHumidityClick}
          title="Click to inspect humidity telemetry"
        >
          <div className="param-label-wrap">
            <Droplets size={13} className="param-icon" />
            <span className="param-label">Humidity</span>
          </div>
          <span className="param-value mono-num">{weather.humidity}</span>
        </div>

        <div 
          className="weather-param-row clickable-drilldown-card"
          onClick={handlePressureClick}
          title="Click to inspect atmospheric pressure analysis"
        >
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
