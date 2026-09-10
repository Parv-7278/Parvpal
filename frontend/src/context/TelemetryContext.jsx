import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { fetchLatestTelemetry, fetchQueueMetrics, fetchAlerts, fetchBenchmark } from '../services/api';
import { useAuth } from './AuthContext';

const TelemetryContext = createContext(null);

export const STATIONS = [
  { id: 'station-maitri', name: 'Maitri Research Station', region: 'Schirmacher Oasis, Queen Maud Land', coords: '70°45′57″S, 11°44′09″E' },
  { id: 'station-bharati', name: 'Bharati Research Station', region: 'Larsemann Hills, East Antarctica', coords: '69°24′28″S, 76°11′14″E' },
];

export function TelemetryProvider({ children }) {
  const { role, isIndiaOperator, isStationOperator, assignedStation } = useAuth();
  
  // Default station: If station operator, use assigned station; else default to station-maitri
  const [selectedStation, setSelectedStationState] = useState(() => {
    if (isStationOperator && assignedStation) {
      return assignedStation;
    }
    return 'station-maitri';
  });

  // Automatically synchronize station when auth profile changes
  useEffect(() => {
    if (isStationOperator && assignedStation) {
      setSelectedStationState(assignedStation);
    }
  }, [isStationOperator, assignedStation]);

  const setSelectedStation = useCallback((stationId) => {
    // Only India Operator can freely switch stations
    if (isIndiaOperator) {
      setSelectedStationState(stationId);
    } else if (isStationOperator && assignedStation) {
      // Locked to assigned station for station operators
      setSelectedStationState(assignedStation);
    }
  }, [isIndiaOperator, isStationOperator, assignedStation]);

  const [telemetry, setTelemetry] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [queueMetrics, setQueueMetrics] = useState({
    label: 'Simulated Latency Monitor',
    queueSnapshot: { count: 0, criticalCount: 0, highCount: 0, normalCount: 0, lowCount: 0, items: [] },
    recentLogs: [],
    summary: {
      totalProcessed: 0,
      critical: { count: 0, avgQueueDelayMs: 0, avgTotalLatencyMs: 0 },
      high: { count: 0, avgQueueDelayMs: 0, avgTotalLatencyMs: 0 },
      normal: { count: 0, avgQueueDelayMs: 0, avgTotalLatencyMs: 0 },
      low: { count: 0, avgQueueDelayMs: 0, avgTotalLatencyMs: 0 },
    },
  });
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initial load
  const loadInitialData = useCallback(async () => {
    try {
      const stationFilter = isStationOperator ? assignedStation : undefined;
      const [telRes, metricRes, alertRes] = await Promise.all([
        fetchLatestTelemetry(stationFilter),
        fetchQueueMetrics(),
        fetchAlerts(stationFilter),
      ]);

      if (telRes.success && telRes.data) setTelemetry(telRes.data);
      if (metricRes.success && metricRes.data) setQueueMetrics(metricRes.data);
      if (alertRes.success && alertRes.data) setAlerts(alertRes.data);
    } catch (err) {
      console.warn('[TelemetryContext] Backend not yet connected:', err.message);
    }
  }, [isStationOperator, assignedStation]);

  const runLiveBenchmark = useCallback(async () => {
    try {
      const res = await fetchBenchmark();
      if (res.success && res.data) {
        setBenchmarkData(res.data);
      }
      return res.data;
    } catch (err) {
      console.error('[TelemetryContext] Error running benchmark:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    loadInitialData();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const socket = io(backendUrl, {
      reconnectionAttempts: 5,
      timeout: 3000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('telemetry_update', (metric) => {
      if (metric.station_id && metric.data) {
        // Only accept if India Operator or matching assigned station
        if (!isStationOperator || metric.station_id === assignedStation) {
          setTelemetry((prev) => ({
            ...prev,
            [metric.station_id]: {
              ...prev[metric.station_id],
              ...metric.data,
              lastLatency: metric,
            },
          }));
        }
      }
    });

    socket.on('emergency_alert', (metric) => {
      const alert = metric.data;
      if (!isStationOperator || alert.station_id === assignedStation) {
        setAlerts((prev) => [alert, ...prev.filter(a => a.id !== alert.id)].slice(0, 50));
      }
    });

    socket.on('queue_metrics', (metrics) => {
      setQueueMetrics(metrics);
    });

    // Polling fallback every 3s in case socket is idle
    const interval = setInterval(loadInitialData, 3000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [loadInitialData, isStationOperator, assignedStation]);

  const activeStationId = isStationOperator ? (assignedStation || 'station-maitri') : selectedStation;

  const currentTelemetry = telemetry[activeStationId] || {
    station_id: activeStationId,
    temperature: activeStationId === 'station-maitri' ? -18.7 : -14.2,
    battery: activeStationId === 'station-maitri' ? 74.0 : 91.0,
    battery_level: activeStationId === 'station-maitri' ? 74.0 : 91.0,
    power_consumption: activeStationId === 'station-maitri' ? 105.0 : 148.0,
    generator_status: 'RUNNING',
    generator_temperature: activeStationId === 'station-maitri' ? 78.4 : 74.1,
    wind_speed: activeStationId === 'station-maitri' ? 28.0 : 44.0,
    water_level: activeStationId === 'station-maitri' ? 88.0 : 94.0,
    comms_status: 'SAT_LINK_NOMINAL',
  };

  const filteredAlerts = isStationOperator 
    ? alerts.filter(a => a.station_id === assignedStation)
    : alerts;

  const stationAlerts = filteredAlerts.filter(a => a.station_id === activeStationId);

  return (
    <TelemetryContext.Provider
      value={{
        selectedStation: activeStationId,
        setSelectedStation,
        stations: isStationOperator 
          ? STATIONS.filter(s => s.id === assignedStation)
          : STATIONS,
        telemetry,
        currentTelemetry,
        alerts: filteredAlerts,
        stationAlerts,
        queueMetrics,
        benchmarkData,
        runLiveBenchmark,
        isConnected,
        refreshData: loadInitialData,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
}
