import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Activity, 
  Radio, 
  Compass, 
  HeartPulse, 
  Waves, 
  Snowflake, 
  Thermometer, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  Users,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Maximize2,
  Layers,
  Building2,
  Zap,
  Globe2,
  ArrowRight,
  Shield,
  Wind
} from 'lucide-react';
import { fetchStationResearch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTelemetry } from '../context/TelemetryContext';

// High-fidelity fallback scientific telemetry for Antarctica
const FALLBACK_RESEARCH_DATA = {
  'station-maitri': {
    station_id: 'station-maitri',
    station_name: 'MAITRI',
    observatory_name: 'Maitri Solid Earth Geomagnetic & Seismic Observatory',
    region: 'Schirmacher Oasis, Queen Maud Land (70° 45′ S, 11° 44′ E)',
    timestamp: new Date().toISOString(),
    seismic: {
      dominant_frequency_hz: 1.84,
      peak_frequency_hz: 2.45,
      avg_frequency_hz: 1.76,
      trend: '↑ 3.8%',
      peak_ground_acceleration_g: 0.00185,
      tremor_amplitude_um: 3.42,
      status: 'NORMAL',
      raw_status: 'NOMINAL_MICROSEISMIC',
      event_classification: 'TECTONIC_BASEMENT_MICRO_FRACTURE',
      borehole_depth_meters: 45.0,
      sensor_model: 'Nanometrics Trillium 120QA Borehole Seismometer',
    },
    snow_accumulation: {
      snowpack_total_depth_cm: 142.5,
      snow_accumulation_24h_cm: 12.4,
      rate_cm_day: 2.1,
      snow_accumulation_7d_cm: 58.2,
      trend: 'INCREASING',
      drift_accumulation_rate_cm_per_hr: 0.85,
      snow_density_kg_per_m3: 345.0,
      subsurface_firn_temperature_c: -16.4,
      status: 'NORMAL',
      sensor_model: 'Campbell Scientific SR50A Acoustic Ultrasonic Depth Sensor',
    },
    geomagnetic_kp: {
      kp_index_current: 2.45,
      status: 'QUIET',
      storm_classification: 'G1_MINOR_UNSETTLED',
      trend: '↑ INCREASING',
      total_magnetic_field_intensity_nt: 42875.2,
      horizontal_component_h_nt: 18632.4,
      magnetic_declination_deg: -21.4,
      auroral_electrojet_activity: 'Active Auroral Bands Visible',
      ionospheric_scintillation_s4: 0.165,
      sensor_model: 'Fluxgate Tri-Axial Magnetometer (dIdD)',
    },
    crew_biotelemetry: {
      active_overwintering_personnel: 24,
      count: 24,
      average_heart_rate_bpm: 73.0,
      average_spo2_percent: 98.4,
      average_stress_index: 24.0,
      average_activity: 'NORMAL',
      status: 'HEALTHY',
      aggregation: 'SIMULATED / AGGREGATED',
      hypothermia_alert_count: 0,
      sleep_efficiency_pct: 88.0,
      crew_summary: 'All 24 overwintering researchers report nominal biometric vitals and synchronized circadian rhythm.',
      duty_distribution: [
        { role: 'Atmospheric Physics & Meteo', count: 8, pct: 33 },
        { role: 'Glaciology & Cryosphere Core', count: 6, pct: 25 },
        { role: 'Microgrid & Life Support', count: 6, pct: 25 },
        { role: 'Station Command & Logistics', count: 4, pct: 17 },
      ]
    },
    systems_status: {
      seismic: 'ONLINE',
      snow: 'ONLINE',
      geomagnetic: 'ONLINE',
      telemetry_link: 'LIVE',
      data_sync: 'CONNECTED',
    }
  },
  'station-bharati': {
    station_id: 'station-bharati',
    station_name: 'BHARATI',
    observatory_name: 'Bharati Polar Earth & Remote Sensing Marine Observatory',
    region: 'Larsemann Hills, East Antarctica (69° 24′ S, 76° 11′ E)',
    timestamp: new Date().toISOString(),
    seismic: {
      dominant_frequency_hz: 3.65,
      peak_frequency_hz: 4.85,
      avg_frequency_hz: 3.52,
      trend: '↑ 5.4%',
      peak_ground_acceleration_g: 0.00420,
      tremor_amplitude_um: 6.42,
      status: 'ELEVATED',
      raw_status: 'ELEVATED_COASTAL_MICRO_SURGE',
      event_classification: 'PRYDZ_BAY_ICE_SHELF_TIDAL_FLEXURE',
      borehole_depth_meters: 65.0,
      sensor_model: 'Nanometrics Trillium 120QA Borehole Seismometer',
    },
    snow_accumulation: {
      snowpack_total_depth_cm: 215.8,
      snow_accumulation_24h_cm: 24.2,
      rate_cm_day: 4.8,
      snow_accumulation_7d_cm: 94.6,
      trend: 'INCREASING',
      drift_accumulation_rate_cm_per_hr: 1.75,
      snow_density_kg_per_m3: 390.0,
      subsurface_firn_temperature_c: -12.8,
      status: 'WARNING',
      sensor_model: 'Campbell Scientific SR50A Acoustic Ultrasonic Depth Sensor',
    },
    geomagnetic_kp: {
      kp_index_current: 3.85,
      status: 'ACTIVE',
      storm_classification: 'G1_MINOR_UNSETTLED',
      trend: '↑ INCREASING',
      total_magnetic_field_intensity_nt: 44120.8,
      horizontal_component_h_nt: 19410.5,
      magnetic_declination_deg: 64.8,
      auroral_electrojet_activity: 'Dynamic Corona Visible',
      ionospheric_scintillation_s4: 0.185,
      sensor_model: 'Fluxgate Tri-Axial Magnetometer (dIdD)',
    },
    crew_biotelemetry: {
      active_overwintering_personnel: 42,
      count: 42,
      average_heart_rate_bpm: 76.0,
      average_spo2_percent: 97.2,
      average_stress_index: 28.0,
      average_activity: 'NORMAL',
      status: 'HEALTHY',
      aggregation: 'SIMULATED / AGGREGATED',
      hypothermia_alert_count: 0,
      sleep_efficiency_pct: 85.0,
      crew_summary: 'All 42 overwintering researchers and ISRO satellite ground engineers report optimal vitals.',
      duty_distribution: [
        { role: 'ISRO Ground Station & Sat-Comms', count: 14, pct: 33 },
        { role: 'Marine Geochemistry & Ocean', count: 12, pct: 29 },
        { role: 'CHP Cogeneration & Desal', count: 10, pct: 24 },
        { role: 'Station Command & Logistics', count: 6, pct: 14 },
      ]
    },
    systems_status: {
      seismic: 'ONLINE',
      snow: 'ONLINE',
      geomagnetic: 'ONLINE',
      telemetry_link: 'LIVE',
      data_sync: 'CONNECTED',
    }
  }
};

// Generate realistic time-series points for historical chart
function generateHistoricalData(stationId, metric, timeRange) {
  const isMaitri = stationId !== 'station-bharati';
  let numPoints = 24;
  let timeLabels = [];
  const now = new Date();

  if (timeRange === '1H') {
    numPoints = 12;
    for (let i = numPoints - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 5 * 60 * 1000);
      timeLabels.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  } else if (timeRange === '6H') {
    numPoints = 18;
    for (let i = numPoints - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 20 * 60 * 1000);
      timeLabels.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  } else if (timeRange === '24H') {
    numPoints = 24;
    for (let i = numPoints - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      timeLabels.push(`${d.getHours()}:00`);
    }
  } else {
    // 7D
    numPoints = 14;
    for (let i = numPoints - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 12 * 60 * 60 * 1000);
      timeLabels.push(d.toLocaleDateString([], { weekday: 'short', hour: '2-digit' }));
    }
  }

  // Base parameters by metric
  let baseVal = 1.84;
  let variance = 0.4;
  let unit = 'Hz';
  let yMin = 0;
  let yMax = 4;
  let threshold = 2.5;

  if (metric === 'seismic') {
    baseVal = isMaitri ? 1.84 : 3.65;
    variance = isMaitri ? 0.35 : 0.8;
    unit = 'Hz';
    yMin = isMaitri ? 0.5 : 1.5;
    yMax = isMaitri ? 3.5 : 6.0;
    threshold = isMaitri ? 2.5 : 4.5;
  } else if (metric === 'snow') {
    baseVal = isMaitri ? 142.5 : 215.8;
    variance = isMaitri ? 2.5 : 5.0;
    unit = 'cm';
    yMin = isMaitri ? 135 : 200;
    yMax = isMaitri ? 155 : 235;
    threshold = isMaitri ? 150 : 230;
  } else if (metric === 'geomagnetic') {
    baseVal = isMaitri ? 2.45 : 3.85;
    variance = isMaitri ? 0.6 : 0.9;
    unit = 'Kp';
    yMin = 0;
    yMax = 9;
    threshold = 4.0;
  } else if (metric === 'temperature') {
    baseVal = isMaitri ? -18.7 : -14.2;
    variance = isMaitri ? 2.2 : 1.8;
    unit = '°C';
    yMin = isMaitri ? -26 : -22;
    yMax = isMaitri ? -10 : -8;
    threshold = -25.0;
  } else if (metric === 'wind') {
    baseVal = isMaitri ? 28.0 : 44.0;
    variance = isMaitri ? 8.0 : 14.0;
    unit = 'km/h';
    yMin = 0;
    yMax = isMaitri ? 60 : 90;
    threshold = isMaitri ? 45 : 65;
  }

  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 3;
    const noise = Math.sin(angle) * (variance * 0.7) + Math.cos(angle * 1.5) * (variance * 0.3);
    const val = Number((baseVal + noise).toFixed(2));
    points.push({
      time: timeLabels[i] || `${i}`,
      value: val,
    });
  }

  return { points, unit, yMin, yMax, threshold, baseVal };
}

export default function ResearchView({ selectedStation = 'station-maitri', onSelectStation }) {
  const { role, isIndiaOperator, isStationOperator, assignedStation } = useAuth();
  const { isConnected: isWsConnected, alerts: allAlerts } = useTelemetry();

  // Effective station resolution based on Role
  const effectiveStation = useMemo(() => {
    if (isStationOperator && assignedStation) {
      return assignedStation;
    }
    return selectedStation || 'station-maitri';
  }, [isStationOperator, assignedStation, selectedStation]);

  const isComparisonMode = isIndiaOperator && selectedStation === 'all-stations';

  // State management
  const [researchData, setResearchData] = useState(null);
  const [comparisonData, setComparisonData] = useState({
    maitri: FALLBACK_RESEARCH_DATA['station-maitri'],
    bharati: FALLBACK_RESEARCH_DATA['station-bharati']
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Chart Controls
  const [selectedMetric, setSelectedMetric] = useState('seismic'); // 'seismic' | 'snow' | 'geomagnetic' | 'temperature' | 'wind'
  const [timeRange, setTimeRange] = useState('24H'); // '1H' | '6H' | '24H' | '7D'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Real-time ticking counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch telemetry from backend
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);
    try {
      if (isComparisonMode) {
        const [mRes, bRes] = await Promise.all([
          fetchStationResearch('station-maitri', role, assignedStation).catch(() => null),
          fetchStationResearch('station-bharati', role, assignedStation).catch(() => null),
        ]);

        setComparisonData({
          maitri: (mRes && mRes.success && mRes.data) ? mRes.data : FALLBACK_RESEARCH_DATA['station-maitri'],
          bharati: (bRes && bRes.success && bRes.data) ? bRes.data : FALLBACK_RESEARCH_DATA['station-bharati'],
        });
      } else {
        const targetId = effectiveStation === 'all-stations' ? 'station-maitri' : effectiveStation;
        const res = await fetchStationResearch(targetId, role, assignedStation);
        if (res && res.success && res.data) {
          setResearchData(res.data);
        } else {
          setResearchData(FALLBACK_RESEARCH_DATA[targetId] || FALLBACK_RESEARCH_DATA['station-maitri']);
        }
      }
      setLastSyncTime(new Date());
      setSecondsAgo(0);
    } catch (err) {
      console.warn('[ResearchView] API fetch notice, using calibrated station fallback:', err.message);
      const targetId = effectiveStation === 'all-stations' ? 'station-maitri' : effectiveStation;
      setResearchData(FALLBACK_RESEARCH_DATA[targetId] || FALLBACK_RESEARCH_DATA['station-maitri']);
      setLastSyncTime(new Date());
      setSecondsAgo(0);
    } finally {
      setIsLoading(false);
    }
  }, [effectiveStation, isComparisonMode, role, assignedStation]);

  // Sync on mount and periodic refresh every 5s
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Active data record for single-station view
  const activeStationId = effectiveStation === 'all-stations' ? 'station-maitri' : effectiveStation;
  const activeData = researchData || FALLBACK_RESEARCH_DATA[activeStationId] || FALLBACK_RESEARCH_DATA['station-maitri'];
  const { seismic, snow_accumulation: snow, geomagnetic_kp: kp, crew_biotelemetry: crew } = activeData;

  const stationName = activeStationId === 'station-bharati' ? 'BHARATI' : 'MAITRI';
  const stationLocation = activeStationId === 'station-bharati' 
    ? 'Larsemann Hills (69° 24′ S, 76° 11′ E)' 
    : 'Schirmacher Oasis (70° 45′ S, 11° 44′ E)';

  // Chart data calculations
  const chartDataset = useMemo(() => {
    return generateHistoricalData(activeStationId, selectedMetric, timeRange);
  }, [activeStationId, selectedMetric, timeRange]);

  // SVG Chart Dimensions & Scaling
  const svgWidth = 620;
  const svgHeight = 170;
  const padLeft = 48;
  const padRight = 20;
  const padTop = 22;
  const padBottom = 28;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const chartPoints = useMemo(() => {
    const { points, yMin, yMax } = chartDataset;
    if (!points || points.length === 0) return [];
    const valRange = yMax - yMin || 1;

    return points.map((pt, idx) => {
      const x = padLeft + (idx / (points.length - 1)) * plotWidth;
      const normalizedY = Math.max(0, Math.min(1, (pt.value - yMin) / valRange));
      const y = padTop + (1 - normalizedY) * plotHeight;
      return { ...pt, x, y };
    });
  }, [chartDataset, plotWidth, plotHeight, padLeft, padTop]);

  // SVG Path Generator
  const chartSvgPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    return chartPoints.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      return `${acc} L ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }, '');
  }, [chartPoints]);

  const chartAreaPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];
    const baseY = padTop + plotHeight;
    return `${chartSvgPath} L ${last.x.toFixed(1)},${baseY} L ${first.x.toFixed(1)},${baseY} Z`;
  }, [chartSvgPath, chartPoints, padTop, plotHeight]);

  // Summary statistics for chart
  const chartStats = useMemo(() => {
    const vals = chartDataset.points.map(p => p.value);
    if (!vals.length) return { min: 0, max: 0, avg: 0, cur: 0 };
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const cur = vals[vals.length - 1];
    return { min, max, avg: Number(avg.toFixed(2)), cur };
  }, [chartDataset]);

  // Station-specific alerts
  const researchAlerts = useMemo(() => {
    const filtered = (allAlerts || []).filter(a => {
      const matchStation = isComparisonMode ? true : a.station_id === activeStationId;
      const isResearchCategory = (a.category === 'ENVIRONMENT' || a.category === 'RESEARCH' || a.category === 'THERMAL' || a.type === 'WEATHER');
      return matchStation && isResearchCategory;
    });

    if (filtered.length > 0) return filtered.slice(0, 4);

    // Contextual active scientific logs if no emergency alerts
    if (activeStationId === 'station-bharati') {
      return [
        { id: 'b-res-01', severity: 'WARNING', title: 'Elevated Coastal Seismic Surge', description: 'Prydz Bay ice shelf tidal flexure detected tremor frequency 3.65 Hz at 65m borehole.', timestamp: 'Just now' },
        { id: 'b-res-02', severity: 'INFO', title: 'Campbell SR50A Snow Profile Synced', description: 'Snowpack accumulation rate stable at 4.8 cm/day. Firn compaction 84%.', timestamp: '3m ago' },
        { id: 'b-res-03', severity: 'INFO', title: 'ISRO Ground Telemetry Uplink Active', description: 'Ku-Band GSAT-7A space-ground link operating at 100% link efficiency.', timestamp: '12m ago' },
      ];
    }
    return [
      { id: 'm-res-01', severity: 'INFO', title: 'Schirmacher Oasis Tremor Baseline Nominal', description: 'Trillium 120QA 45m borehole records steady 1.84 Hz microseismic baseline.', timestamp: 'Just now' },
      { id: 'm-res-02', severity: 'INFO', title: 'Lake Priyadarshini Water Firn Core Verified', description: 'Subsurface temperature -16.4°C. Acoustic ultrasound depth sensor nominal.', timestamp: '5m ago' },
      { id: 'm-res-03', severity: 'INFO', title: 'Planetary Kp Index Steady (G1 Unsettled)', description: 'dIdD Fluxgate magnetometer reports total field intensity 42,875 nT.', timestamp: '18m ago' },
    ];
  }, [allAlerts, activeStationId, isComparisonMode]);

  // UTC / IST Time String Formatting
  const lastSyncStr = lastSyncTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }) + ' UTC';

  // ==========================================================================
  // COMPARISON VIEW FOR INDIA HQ OPERATOR (ALL STATIONS)
  // ==========================================================================
  if (isComparisonMode) {
    const { maitri, bharati } = comparisonData;

    return (
      <div className="research-view-layout comparison-mode-layout">
        {/* Comparison Header */}
        <div className="research-header-card polaris-card">
          <div className="r-header-left">
            <div className="r-icon-badge">
              <Activity size={22} className="text-cyan" />
            </div>
            <div>
              <div className="r-title-row">
                <h2 className="r-title">POLAR RESEARCH OBSERVATORIES COMPARISON</h2>
                <span className="station-role-badge india-command-badge">🇮🇳 NATIONAL COMMAND OVERVIEW</span>
              </div>
              <span className="r-sub">
                Side-by-side scientific telemetry & observatory status for India's Antarctic Stations
              </span>
            </div>
          </div>

          <div className="r-header-right">
            <div className="station-toggle-pills">
              <button 
                type="button"
                className={`st-pill active`}
                onClick={() => onSelectStation && onSelectStation('all-stations')}
              >
                All Stations
              </button>
              <button 
                type="button"
                className={`st-pill`}
                onClick={() => onSelectStation && onSelectStation('station-maitri')}
              >
                Maitri Only
              </button>
              <button 
                type="button"
                className={`st-pill`}
                onClick={() => onSelectStation && onSelectStation('station-bharati')}
              >
                Bharati Only
              </button>
            </div>

            <span className="live-pill">
              <span className="live-dot" /> LIVE / SIMULATED
            </span>
            <button 
              className={`refresh-icon-btn ${isLoading ? 'spinning' : ''}`}
              onClick={loadData}
              title="Refresh Research Matrix"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Comparison Summary Grid */}
        <div className="research-comparison-matrix-grid">
          {/* MAITRI CARD */}
          <div className="comparison-station-card polaris-card">
            <div className="comp-card-header">
              <div className="comp-st-title-col">
                <span className="comp-st-tag">INLAND OASIS</span>
                <h3 className="comp-st-name">Maitri Research Station</h3>
                <span className="comp-st-sub">Schirmacher Oasis • 70° 45′ S, 11° 44′ E</span>
              </div>
              <button 
                className="inspect-st-btn"
                onClick={() => onSelectStation && onSelectStation('station-maitri')}
              >
                <span>Inspect Maitri</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="comp-metrics-list">
              <div className="comp-metric-row">
                <span className="comp-lbl"><Waves size={14} className="text-cyan" /> Seismic Tremor:</span>
                <span className="comp-val mono-num text-emerald">{maitri.seismic.dominant_frequency_hz} Hz ({maitri.seismic.status})</span>
              </div>
              <div className="comp-metric-row">
                <span className="comp-lbl"><Snowflake size={14} className="text-cyan" /> Snowpack Depth:</span>
                <span className="comp-val mono-num text-cyan">{maitri.snow_accumulation.snowpack_total_depth_cm} cm (+{maitri.snow_accumulation.snow_accumulation_24h_cm} cm/24h)</span>
              </div>
              <div className="comp-metric-row">
                <span className="comp-lbl"><Compass size={14} className="text-cyan" /> Geomagnetic Kp:</span>
                <span className="comp-val mono-num text-emerald">Kp {maitri.geomagnetic_kp.kp_index_current} ({maitri.geomagnetic_kp.status})</span>
              </div>
              <div className="comp-metric-row">
                <span className="comp-lbl"><Users size={14} className="text-cyan" /> Overwintering Crew:</span>
                <span className="comp-val mono-num">{maitri.crew_biotelemetry.active_overwintering_personnel} Active ({maitri.crew_biotelemetry.status})</span>
              </div>
              <div className="comp-metric-row">
                <span className="comp-lbl"><Radio size={14} className="text-cyan" /> Satellite Link:</span>
                <span className="comp-val text-emerald">GSAT-7A Ku-Band Nominal</span>
              </div>
            </div>
          </div>

          {/* BHARATI CARD */}
          <div className="comparison-station-card polaris-card">
            <div className="comp-card-header">
              <div className="comp-st-title-col">
                <span className="comp-st-tag tag-cyan">COASTAL HILLS</span>
                <h3 className="comp-st-name">Bharati Research Station</h3>
                <span className="comp-st-sub">Larsemann Hills • 69° 24′ S, 76° 11′ E</span>
              </div>
              <button 
                className="inspect-st-btn"
                onClick={() => onSelectStation && onSelectStation('station-bharati')}
              >
                <span>Inspect Bharati</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="comp-metrics-list">
              <div className="comp-metric-row">
                <span className="comp-lbl"><Waves size={14} className="text-cyan" /> Seismic Tremor:</span>
                <span className="comp-val mono-num text-amber">{bharati.seismic.dominant_frequency_hz} Hz ({bharati.seismic.status})</span>
              </div>
              <div className="comp-metric-row">
                <span className="comp-lbl"><Snowflake size={14} className="text-cyan" /> Snowpack Depth:</span>
                <span className="comp-val mono-num text-cyan">{bharati.snow_accumulation.snowpack_total_depth_cm} cm (+{bharati.snow_accumulation.snow_accumulation_24h_cm} cm/24h)</span>
              </div>
              <div className="comp-metric-row">
                <span className="comp-lbl"><Compass size={14} className="text-cyan" /> Geomagnetic Kp:</span>
                <span className="comp-val mono-num text-cyan">Kp {bharati.geomagnetic_kp.kp_index_current} ({bharati.geomagnetic_kp.status})</span>
              </div>
              <div className="comp-metric-row">
                <span className="comp-lbl"><Users size={14} className="text-cyan" /> Overwintering Crew:</span>
                <span className="comp-val mono-num">{bharati.crew_biotelemetry.active_overwintering_personnel} Active ({bharati.crew_biotelemetry.status})</span>
              </div>
              <div className="comp-metric-row">
                <span className="comp-lbl"><Radio size={14} className="text-cyan" /> ISRO Radome Downlink:</span>
                <span className="comp-val text-emerald">Active Space-Ground Link</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // SINGLE STATION SCIENTIFIC MONITORING CONSOLE (MAITRI OR BHARATI)
  // ==========================================================================
  return (
    <div className="research-view-layout">
      
      {/* ====================================================================
          HEADER BANNER: STATION CONTEXT & LIVE METRICS STATUS
          ==================================================================== */}
      <div className="research-header-card polaris-card">
        <div className="r-header-left">
          <div className="r-icon-badge">
            <Activity size={22} className="text-cyan" />
          </div>
          <div>
            <div className="r-title-row">
              <h2 className="r-title">{stationName} RESEARCH & SCIENTIFIC TELEMETRY</h2>
              <span className={`station-role-badge ${activeStationId === 'station-bharati' ? 'tag-bharati' : 'tag-maitri'}`}>
                {activeStationId === 'station-bharati' ? 'BHARATI BASE • 69°S' : 'MAITRI BASE • 70°S'}
              </span>
            </div>
            <span className="r-sub">
              {activeData.observatory_name} &nbsp;•&nbsp; <span className="text-cyan">{stationLocation}</span>
            </span>
          </div>
        </div>

        <div className="r-header-right">
          {/* Station Switcher Pills for India Command */}
          {isIndiaOperator && onSelectStation && (
            <div className="station-toggle-pills">
              <button 
                type="button"
                className={`st-pill ${activeStationId === 'station-maitri' ? 'active' : ''}`}
                onClick={() => onSelectStation('station-maitri')}
              >
                Maitri
              </button>
              <button 
                type="button"
                className={`st-pill ${activeStationId === 'station-bharati' ? 'active' : ''}`}
                onClick={() => onSelectStation('station-bharati')}
              >
                Bharati
              </button>
              <button 
                type="button"
                className={`st-pill`}
                onClick={() => onSelectStation('all-stations')}
              >
                All Stations
              </button>
            </div>
          )}

          {/* Status & Last Updated Timestamp */}
          <div className="r-status-timestamp-group">
            <span className="live-pill">
              <span className="live-dot" /> LIVE TELEMETRY
            </span>
            <span className="r-clock-badge" title="Coordinated Universal Time & Sync Interval">
              <Clock size={11} className="text-dim" />
              <span>{lastSyncStr}</span>
              <span className="sync-secs mono-num">({secondsAgo}s ago)</span>
            </span>
          </div>

          <button 
            className={`refresh-icon-btn ${isLoading ? 'spinning' : ''}`}
            onClick={loadData}
            title="Refresh Scientific Sensor Matrix"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ====================================================================
          TOP 4 PRIMARY RESEARCH METRIC CARDS
          ==================================================================== */}
      <div className="research-top-metrics-grid">
        
        {/* CARD 1: SEISMIC ACTIVITY */}
        <div className="r-metric-card polaris-card">
          <div className="r-card-header">
            <span className="r-card-title">SEISMIC ACTIVITY</span>
            <Waves size={17} className="text-cyan" />
          </div>
          <div className="r-card-body">
            <div className="r-stat-main-row">
              <span className="r-stat-val mono-num">{seismic.dominant_frequency_hz}</span>
              <span className="r-stat-unit">Hz</span>
            </div>
            <div className="r-stat-footer-row">
              <span className={`status-tag ${seismic.status === 'NORMAL' ? 'tag-green' : 'tag-amber'}`}>
                {seismic.status}
              </span>
              <span className="r-trend-badge text-emerald">{seismic.trend || '↑ 3.8%'}</span>
              <span className="r-data-source-chip">SIMULATED</span>
            </div>
          </div>
          <div className="r-card-subtext">
            Borehole Depth: {seismic.borehole_depth_meters}m • Ground Accel: {seismic.peak_ground_acceleration_g}g
          </div>
        </div>

        {/* CARD 2: SNOW ACCUMULATION */}
        <div className="r-metric-card polaris-card">
          <div className="r-card-header">
            <span className="r-card-title">SNOW ACCUMULATION</span>
            <Snowflake size={17} className="text-cyan" />
          </div>
          <div className="r-card-body">
            <div className="r-stat-main-row">
              <span className="r-stat-val mono-num">{snow.snowpack_total_depth_cm}</span>
              <span className="r-stat-unit">cm</span>
            </div>
            <div className="r-stat-footer-row">
              <span className="status-tag tag-cyan">
                Rate: {snow.rate_cm_day || '2.1'} cm/day
              </span>
              <span className="r-trend-badge text-cyan">↑ INCREASING</span>
              <span className="r-data-source-chip">SIMULATED</span>
            </div>
          </div>
          <div className="r-card-subtext">
            24h Drift: +{snow.snow_accumulation_24h_cm} cm • Density: {snow.snow_density_kg_per_m3} kg/m³
          </div>
        </div>

        {/* CARD 3: GEOMAGNETIC ACTIVITY */}
        <div className="r-metric-card polaris-card">
          <div className="r-card-header">
            <span className="r-card-title">GEOMAGNETIC ACTIVITY</span>
            <Compass size={17} className="text-cyan" />
          </div>
          <div className="r-card-body">
            <div className="r-stat-main-row">
              <span className="r-stat-val mono-num">Kp {kp.kp_index_current}</span>
              <span className="r-stat-unit">/ 9 Kp</span>
            </div>
            <div className="r-stat-footer-row">
              <span className={`status-tag ${kp.kp_index_current < 3 ? 'tag-green' : kp.kp_index_current < 5 ? 'tag-cyan' : 'tag-amber'}`}>
                {kp.status || (kp.kp_index_current < 3 ? 'QUIET' : kp.kp_index_current < 5 ? 'ACTIVE' : 'STORM')}
              </span>
              {/* Visual 9-Step Kp Segment Bar */}
              <div className="kp-scale-bar-compact" title={`Planetary Kp Scale: ${kp.kp_index_current} / 9`}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                  <span 
                    key={lvl} 
                    className={`kp-step-dot ${lvl <= Math.round(kp.kp_index_current) ? (lvl > 5 ? 'step-red' : lvl > 3 ? 'step-amber' : 'step-green') : ''}`}
                  />
                ))}
              </div>
              <span className="r-data-source-chip">SIMULATED</span>
            </div>
          </div>
          <div className="r-card-subtext">
            Field: {kp.total_magnetic_field_intensity_nt} nT • Scintillation: {kp.ionospheric_scintillation_s4} (S4)
          </div>
        </div>

        {/* CARD 4: CREW BIO-TELEMETRY (AGGREGATED & PRIVACY-SAFE) */}
        <div className="r-metric-card polaris-card">
          <div className="r-card-header">
            <span className="r-card-title">CREW BIO-TELEMETRY</span>
            <HeartPulse size={17} className="text-cyan" />
          </div>
          <div className="r-card-body">
            <div className="r-stat-main-row">
              <span className="r-stat-val mono-num">{crew.active_overwintering_personnel || crew.count || 24}</span>
              <span className="r-stat-unit">Crew</span>
            </div>
            <div className="r-stat-footer-row">
              <span className="status-tag tag-green">
                Avg HR: {crew.average_heart_rate_bpm} bpm
              </span>
              <span className="r-trend-badge text-cyan">SpO₂ {crew.average_spo2_percent}%</span>
              <span className="r-data-source-chip agg-chip">AGGREGATED</span>
            </div>
          </div>
          <div className="r-card-subtext">
            Stress Index: {crew.average_stress_index}/100 • Activity: {crew.average_activity || 'NORMAL'}
          </div>
        </div>

      </div>

      {/* ====================================================================
          MAIN HISTORICAL RESEARCH TELEMETRY CHART (SELECTABLE METRICS & RANGES)
          ==================================================================== */}
      <div className="research-main-chart-card polaris-card">
        <div className="chart-header-controls-row">
          <div className="chart-title-group">
            <div className="chart-icon-box">
              <Sparkles size={16} className="text-cyan" />
            </div>
            <div>
              <h3 className="chart-heading">HISTORICAL RESEARCH TELEMETRY</h3>
              <span className="chart-subheading">
                Station-calibrated scientific observation trends for {stationName} Research Station
              </span>
            </div>
          </div>

          <div className="chart-controls-cluster">
            {/* Metric Selectors */}
            <div className="chart-metric-pills">
              <button 
                type="button" 
                className={`c-metric-pill ${selectedMetric === 'seismic' ? 'active' : ''}`}
                onClick={() => setSelectedMetric('seismic')}
              >
                <Waves size={12} />
                <span>Seismic (Hz)</span>
              </button>
              <button 
                type="button" 
                className={`c-metric-pill ${selectedMetric === 'snow' ? 'active' : ''}`}
                onClick={() => setSelectedMetric('snow')}
              >
                <Snowflake size={12} />
                <span>Snowpack (cm)</span>
              </button>
              <button 
                type="button" 
                className={`c-metric-pill ${selectedMetric === 'geomagnetic' ? 'active' : ''}`}
                onClick={() => setSelectedMetric('geomagnetic')}
              >
                <Compass size={12} />
                <span>Geomagnetic (Kp)</span>
              </button>
              <button 
                type="button" 
                className={`c-metric-pill ${selectedMetric === 'temperature' ? 'active' : ''}`}
                onClick={() => setSelectedMetric('temperature')}
              >
                <Thermometer size={12} />
                <span>Temp (°C)</span>
              </button>
              <button 
                type="button" 
                className={`c-metric-pill ${selectedMetric === 'wind' ? 'active' : ''}`}
                onClick={() => setSelectedMetric('wind')}
              >
                <Wind size={12} />
                <span>Wind (km/h)</span>
              </button>
            </div>

            {/* Time Range Selectors */}
            <div className="chart-range-pills">
              {['1H', '6H', '24H', '7D'].map((range) => (
                <button
                  key={range}
                  type="button"
                  className={`c-range-pill ${timeRange === range ? 'active' : ''}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live SVG Chart Viewport */}
        <div className="research-chart-viewport">
          {/* Top Statistics Legend Strip */}
          <div className="chart-stats-summary-bar">
            <div className="c-stat-item">
              <span className="c-stat-lbl">CURRENT:</span>
              <span className="c-stat-val mono-num text-cyan">{chartStats.cur} {chartDataset.unit}</span>
            </div>
            <div className="c-stat-item">
              <span className="c-stat-lbl">24H AVERAGE:</span>
              <span className="c-stat-val mono-num text-emerald">{chartStats.avg} {chartDataset.unit}</span>
            </div>
            <div className="c-stat-item">
              <span className="c-stat-lbl">MIN / MAX:</span>
              <span className="c-stat-val mono-num">{chartStats.min} / {chartStats.max} {chartDataset.unit}</span>
            </div>
            <div className="c-stat-item">
              <span className="c-stat-lbl">SIMULATED THRESHOLD:</span>
              <span className="c-stat-val mono-num text-amber">{chartDataset.threshold} {chartDataset.unit}</span>
            </div>
          </div>

          <div className="svg-container-wrap">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="research-svg-chart"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="researchAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                const y = padTop + ratio * plotHeight;
                const val = chartDataset.yMax - ratio * (chartDataset.yMax - chartDataset.yMin);
                return (
                  <g key={idx}>
                    <line 
                      x1={padLeft} 
                      y1={y} 
                      x2={svgWidth - padRight} 
                      y2={y} 
                      stroke="rgba(255, 255, 255, 0.06)" 
                      strokeDasharray="4 4" 
                    />
                    <text 
                      x={padLeft - 8} 
                      y={y + 3.5} 
                      fill="#64748b" 
                      fontSize="9" 
                      textAnchor="end" 
                      className="mono-num"
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Threshold Line */}
              {(() => {
                const range = chartDataset.yMax - chartDataset.yMin || 1;
                const normThresh = (chartDataset.threshold - chartDataset.yMin) / range;
                const threshY = padTop + (1 - normThresh) * plotHeight;
                if (threshY >= padTop && threshY <= padTop + plotHeight) {
                  return (
                    <g>
                      <line 
                        x1={padLeft} 
                        y1={threshY} 
                        x2={svgWidth - padRight} 
                        y2={threshY} 
                        stroke="#f59e0b" 
                        strokeWidth="1.2" 
                        strokeDasharray="4 3" 
                      />
                      <text 
                        x={svgWidth - padRight + 2} 
                        y={threshY + 3} 
                        fill="#f59e0b" 
                        fontSize="8" 
                        className="mono-num"
                      >
                        LIMIT
                      </text>
                    </g>
                  );
                }
                return null;
              })()}

              {/* Gradient Area Fill */}
              <path d={chartAreaPath} fill="url(#researchAreaGrad)" />

              {/* Line Stroke */}
              <path 
                d={chartSvgPath} 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Data Points */}
              {chartPoints.map((pt, i) => (
                <circle 
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.time === pt.time ? 4.5 : (i === chartPoints.length - 1 ? 3.5 : 2.5)}
                  fill={hoveredPoint?.time === pt.time ? '#ffffff' : (i === chartPoints.length - 1 ? '#38bdf8' : '#0284c7')}
                  stroke="#38bdf8"
                  strokeWidth={hoveredPoint?.time === pt.time ? 2 : 1}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  style={{ cursor: 'pointer' }}
                />
              ))}

              {/* X-Axis Time Labels */}
              {chartPoints.filter((_, idx) => idx % Math.ceil(chartPoints.length / 6) === 0 || idx === chartPoints.length - 1).map((pt, i) => (
                <text 
                  key={i}
                  x={pt.x}
                  y={svgHeight - 8}
                  fill="#64748b"
                  fontSize="8.5"
                  textAnchor="middle"
                  className="mono-num"
                >
                  {pt.time}
                </text>
              ))}

              {/* Hover Crosshair & Tooltip */}
              {hoveredPoint && (
                <g>
                  <line 
                    x1={hoveredPoint.x} 
                    y1={padTop} 
                    x2={hoveredPoint.x} 
                    y2={padTop + plotHeight} 
                    stroke="#38bdf8" 
                    strokeWidth="1" 
                    strokeDasharray="2 2" 
                  />
                  <g transform={`translate(${Math.min(svgWidth - 95, Math.max(padLeft, hoveredPoint.x - 45))}, ${Math.max(padTop - 5, hoveredPoint.y - 30)})`}>
                    <rect x="0" y="0" width="90" height="22" rx="4" fill="#080e1a" stroke="#0ea5e9" strokeWidth="1" />
                    <text x="45" y="10" fill="#94a3b8" fontSize="7.5" textAnchor="middle">{hoveredPoint.time}</text>
                    <text x="45" y="18" fill="#38bdf8" fontSize="8.5" fontWeight="bold" textAnchor="middle" className="mono-num">
                      {hoveredPoint.value} {chartDataset.unit}
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* ====================================================================
          4-QUADRANT SCIENTIFIC OBSERVATORIES DEEP-DIVE GRID
          ==================================================================== */}
      <div className="research-quadrant-grid">
        
        {/* QUAD 1: SEISMIC MONITORING PANEL */}
        <div className="research-panel polaris-card">
          <div className="r-panel-header">
            <div className="r-panel-title-group">
              <Waves size={16} className="text-cyan" />
              <h3>Borehole Seismic Tremor Monitor</h3>
            </div>
            <span className={`status-pill ${seismic.status === 'NORMAL' ? 'pill-green' : 'pill-amber'}`}>
              {seismic.status}
            </span>
          </div>

          <div className="r-hero-stat">
            <span className="r-hero-num mono-num">{seismic.dominant_frequency_hz}</span>
            <span className="r-hero-unit">Hz</span>
          </div>
          <div className="r-hero-sublabel">Dominant Natural Tremor Frequency</div>

          <div className="r-stats-subgrid">
            <div className="r-substat-box">
              <span className="r-substat-lbl">Peak Frequency</span>
              <span className="r-substat-val mono-num text-cyan">{seismic.peak_frequency_hz || '2.45'} Hz</span>
            </div>
            <div className="r-substat-box">
              <span className="r-substat-lbl">Average Frequency</span>
              <span className="r-substat-val mono-num text-emerald">{seismic.avg_frequency_hz || '1.76'} Hz</span>
            </div>
            <div className="r-substat-box">
              <span className="r-substat-lbl">Ground Acceleration</span>
              <span className="r-substat-val mono-num">{seismic.peak_ground_acceleration_g} g</span>
            </div>
            <div className="r-substat-box">
              <span className="r-substat-lbl">Displacement</span>
              <span className="r-substat-val mono-num">{seismic.tremor_amplitude_um} µm</span>
            </div>
          </div>

          {/* Live Waveform-style visualization */}
          <div className="seismic-waveform-box">
            <div className="waveform-header-row">
              <span className="w-lbl">Real-Time Seismograph Waveform:</span>
              <span className="w-sub">SIMULATED STREAM</span>
            </div>
            <div className="seismic-waveform-visual">
              <svg viewBox="0 0 280 40" className="waveform-svg">
                <path 
                  d={activeStationId === 'station-bharati' 
                    ? "M0,20 Q15,4 30,20 T60,20 T90,36 T120,6 T150,30 T180,10 T210,34 T240,12 T280,20" 
                    : "M0,20 Q35,8 70,20 T140,20 T210,12 T280,20"} 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="1.8" 
                  className="flowing-wire-anim"
                />
              </svg>
            </div>
            <span className="seismic-event-tag mono-num">
              Event: {seismic.event_classification} ({seismic.borehole_depth_meters}m Borehole)
            </span>
          </div>
        </div>

        {/* QUAD 2: SNOW / GLACIOLOGICAL MONITORING PANEL */}
        <div className="research-panel polaris-card">
          <div className="r-panel-header">
            <div className="r-panel-title-group">
              <Snowflake size={16} className="text-cyan" />
              <h3>Ultrasonic Snowpack & Firn Profile</h3>
            </div>
            <span className="status-pill pill-green">SR50A Acoustic Depth</span>
          </div>

          <div className="r-hero-stat">
            <span className="r-hero-num mono-num">{snow.snowpack_total_depth_cm}</span>
            <span className="r-hero-unit">cm</span>
          </div>
          <div className="r-hero-sublabel">Total Snowpack / Ice Core Depth</div>

          <div className="r-stats-subgrid">
            <div className="r-substat-box">
              <span className="r-substat-lbl">Accumulation Rate</span>
              <span className="r-substat-val mono-num text-cyan">{snow.rate_cm_day || '2.1'} cm/day</span>
            </div>
            <div className="r-substat-box">
              <span className="r-substat-lbl">7-Day Net Accumulation</span>
              <span className="r-substat-val mono-num text-emerald">+{snow.snow_accumulation_7d_cm || '58.2'} cm</span>
            </div>
            <div className="r-substat-box">
              <span className="r-substat-lbl">Snowpack Density</span>
              <span className="r-substat-val mono-num">{snow.snow_density_kg_per_m3} kg/m³</span>
            </div>
            <div className="r-substat-box">
              <span className="r-substat-lbl">Sub-Surface Firn Temp</span>
              <span className="r-substat-val mono-num text-amber">{snow.subsurface_firn_temperature_c}°C</span>
            </div>
          </div>

          {/* Glaciological Firn Compaction Meter */}
          <div className="snow-density-meter">
            <div className="meter-label-row">
              <span>Firn Compaction Index (Deep Ice Core)</span>
              <span className="mono-num text-cyan">84% Solid Firn</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: '84%', background: 'linear-gradient(90deg, #38bdf8, #0284c7)' }} />
            </div>
            <span className="meter-note">
              {activeStationId === 'station-bharati' 
                ? 'High coastal maritime snowfall rate. Warning threshold configured at 230 cm.'
                : 'Dry inland oasis precipitation rate. Nominal accumulation profile.'}
            </span>
          </div>
        </div>

        {/* QUAD 3: GEOMAGNETIC & AURORAL MONITORING PANEL */}
        <div className="research-panel polaris-card">
          <div className="r-panel-header">
            <div className="r-panel-title-group">
              <Compass size={16} className="text-cyan" />
              <h3>Geomagnetic & Auroral Flux</h3>
            </div>
            <span className="status-pill pill-green">{kp.storm_classification}</span>
          </div>

          <div className="r-hero-stat">
            <span className="r-hero-num mono-num text-cyan">{kp.kp_index_current}</span>
            <span className="r-hero-unit">/ 9 Kp</span>
          </div>
          <div className="r-hero-sublabel">Planetary Geomagnetic Kp Index</div>

          <div className="r-stats-subgrid">
            <div className="r-substat-box">
              <span className="r-substat-lbl">Total Magnetic Field</span>
              <span className="r-substat-val mono-num">{kp.total_magnetic_field_intensity_nt} nT</span>
            </div>
            <div className="r-substat-box">
              <span className="r-substat-lbl">Horizontal Vector (H)</span>
              <span className="r-substat-val mono-num">{kp.horizontal_component_h_nt} nT</span>
            </div>
            <div className="r-substat-box">
              <span className="r-substat-lbl">Magnetic Declination</span>
              <span className="r-substat-val mono-num">{kp.magnetic_declination_deg}°</span>
            </div>
            <div className="r-substat-box">
              <span className="r-substat-lbl">GNSS S4 Scintillation</span>
              <span className="r-substat-val mono-num text-emerald">{kp.ionospheric_scintillation_s4} (Quiet)</span>
            </div>
          </div>

          {/* Auroral Status Banner */}
          <div className="aurora-activity-tag">
            <span className="tag-icon">🌌</span>
            <span>Auroral Status: <strong>{kp.auroral_electrojet_activity}</strong></span>
          </div>
        </div>

        {/* QUAD 4: CREW BIO-TELEMETRY (AGGREGATED & PRIVACY SAFE) */}
        <div className="research-panel polaris-card">
          <div className="r-panel-header">
            <div className="r-panel-title-group">
              <HeartPulse size={16} className="text-cyan" />
              <h3>Overwintering Crew Bio-Telemetry</h3>
            </div>
            <span className="status-pill pill-green">
              {crew.active_overwintering_personnel || crew.count || 24} Active Expedition Crew
            </span>
          </div>

          <div className="crew-summary-stats">
            <div className="c-stat-tile">
              <span className="c-lbl">Avg Heart Rate</span>
              <span className="c-val mono-num text-emerald">{crew.average_heart_rate_bpm} <small>bpm</small></span>
            </div>
            <div className="c-stat-tile">
              <span className="c-lbl">Avg Blood SpO₂</span>
              <span className="c-val mono-num text-cyan">{crew.average_spo2_percent}%</span>
            </div>
            <div className="c-stat-tile">
              <span className="c-lbl">Stress Score</span>
              <span className="c-val mono-num text-emerald">{crew.average_stress_index} / 100</span>
            </div>
          </div>

          {/* Aggregated Expedition Roles Distribution (Privacy-Safe) */}
          <div className="crew-aggregated-duty-box">
            <div className="agg-duty-header">
              <span className="agg-duty-title">Aggregated Expedition Personnel Distribution:</span>
              <span className="agg-duty-badge">PRIVACY-SAFE</span>
            </div>
            <div className="duty-bars-stack">
              {(crew.duty_distribution || [
                { role: 'Atmospheric & Climate Science', pct: 35 },
                { role: 'Microgrid & Life Support Engineering', pct: 30 },
                { role: 'Glaciology & Cryosphere Core', pct: 20 },
                { role: 'Command & Medical Safety', pct: 15 },
              ]).map((duty, idx) => (
                <div key={idx} className="duty-bar-item">
                  <div className="duty-bar-labels">
                    <span>{duty.role}</span>
                    <span className="mono-num text-cyan">{duty.pct}%</span>
                  </div>
                  <div className="duty-track">
                    <div className="duty-fill" style={{ width: `${duty.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <span className="privacy-disclaimer-txt">
              🔒 Aggregated station-level indicator. Individual medical records and personal identifiable info are protected.
            </span>
          </div>
        </div>

      </div>

      {/* ====================================================================
          OPERATIONAL STATUS & RECENT RESEARCH ALERTS
          ==================================================================== */}
      <div className="research-bottom-status-grid">
        
        {/* Research Systems Status Panel */}
        <div className="r-status-panel polaris-card">
          <div className="r-panel-header">
            <div className="r-panel-title-group">
              <ShieldCheck size={16} className="text-cyan" />
              <h3>Research Subsystems Health</h3>
            </div>
            <span className="status-pill pill-green">ALL SYSTEMS NOMINAL</span>
          </div>

          <div className="r-systems-status-list">
            <div className="r-sys-status-row">
              <div className="sys-left">
                <span className="live-dot" />
                <span>Borehole Seismometer (Trillium 120QA)</span>
              </div>
              <span className="sys-status-val text-emerald">ONLINE (45m Depth)</span>
            </div>
            <div className="r-sys-status-row">
              <div className="sys-left">
                <span className="live-dot" />
                <span>Campbell SR50A Acoustic Snow Profiler</span>
              </div>
              <span className="sys-status-val text-emerald">ONLINE (Calibrated)</span>
            </div>
            <div className="r-sys-status-row">
              <div className="sys-left">
                <span className="live-dot" />
                <span>Tri-Axial Fluxgate Magnetometer (dIdD)</span>
              </div>
              <span className="sys-status-val text-emerald">ONLINE (Continuous)</span>
            </div>
            <div className="r-sys-status-row">
              <div className="sys-left">
                <span className={`live-dot ${isWsConnected ? '' : 'dot-amber'}`} />
                <span>Research Telemetry WebSocket Link</span>
              </div>
              <span className={`sys-status-val ${isWsConnected ? 'text-emerald' : 'text-amber'}`}>
                {isWsConnected ? 'LIVE / CONNECTED' : 'DISCONNECTED (Polling)'}
              </span>
            </div>
            <div className="r-sys-status-row">
              <div className="sys-left">
                <span className="live-dot" />
                <span>Satellite Bandwidth Sync (GSAT-7A)</span>
              </div>
              <span className="sys-status-val text-cyan">NOMINAL (Priority Q)</span>
            </div>
          </div>
        </div>

        {/* Recent Research Alerts & Incidents */}
        <div className="r-alerts-panel polaris-card">
          <div className="r-panel-header">
            <div className="r-panel-title-group">
              <AlertTriangle size={16} className="text-cyan" />
              <h3>Recent Research & Environmental Alerts</h3>
            </div>
            <span className="status-pill pill-cyan">{researchAlerts.length} Active Events</span>
          </div>

          <div className="r-alerts-feed-stack">
            {researchAlerts.map((alt) => (
              <div key={alt.id} className={`r-alert-item-card ${alt.severity === 'WARNING' ? 'alt-warning' : 'alt-info'}`}>
                <div className="alt-item-top">
                  <span className={`alt-sev-pill ${alt.severity === 'WARNING' ? 'sev-warn' : 'sev-info'}`}>
                    {alt.severity}
                  </span>
                  <h5 className="alt-item-title">{alt.title}</h5>
                  <span className="alt-item-time mono-num">{alt.timestamp || 'Recent'}</span>
                </div>
                <p className="alt-item-desc">{alt.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
