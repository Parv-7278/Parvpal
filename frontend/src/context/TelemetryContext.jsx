import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchLatestTelemetry, fetchQueueMetrics, fetchAlerts, getStationHealth } from '../services/api';
import { useAuth } from './AuthContext';

const TelemetryContext = createContext(null);

export const STATIONS = [
  { id: 'station-maitri', name: 'Maitri Research Station', region: 'Schirmacher Oasis, Queen Maud Land', coords: '70°45′57″S, 11°44′09″E' },
  { id: 'station-bharati', name: 'Bharati Research Station', region: 'Larsemann Hills, East Antarctica', coords: '69°24′28″S, 76°11′14″E' },
];

export function TelemetryProvider({ children }) {
  const { role, isIndiaOperator, isStationOperator, assignedStation } = useAuth();
  
  // Single Source of Truth for Station Selection
  const [selectedStation, setSelectedStationState] = useState(() => {
    if (isStationOperator && assignedStation) {
      return assignedStation;
    }
    return 'station-maitri';
  });

  const [isLoadingStationData, setIsLoadingStationData] = useState(false);
  const [isSimulatorOnline, setIsSimulatorOnline] = useState(false);
  const [telemetry, setTelemetry] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [queueMetrics, setQueueMetrics] = useState({
    label: 'ISRO GSAT-30 Ku-Band Polar Link',
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

  const wsRef = useRef(null);

  // Synchronize when auth changes (e.g. logging in as Maitri or Bharati operator)
  useEffect(() => {
    if (isStationOperator && assignedStation) {
      setSelectedStationState(assignedStation);
    }
  }, [isStationOperator, assignedStation]);

  // Centralized Station Switcher with immediate stale-data clearing & WS re-subscription
  const setSelectedStation = useCallback((stationId) => {
    if (isIndiaOperator) {
      setIsLoadingStationData(true);
      setSelectedStationState(stationId);

      // Notify WebSocket server of station context change
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          action: 'set_station',
          station_id: stationId === 'all-stations' ? 'station-maitri' : stationId
        }));
      }

      // Finish loading transition
      setTimeout(() => {
        setIsLoadingStationData(false);
      }, 150);
    } else if (isStationOperator && assignedStation) {
      setSelectedStationState(assignedStation);
    }
  }, [isIndiaOperator, isStationOperator, assignedStation]);

  // Fetch Latest Station Telemetry & Alerts
  const refreshData = useCallback(async () => {
    try {
      const stationFilter = isStationOperator ? assignedStation : (selectedStation === 'all-stations' ? undefined : selectedStation);
      const [telRes, metricRes, alertRes] = await Promise.all([
        fetchLatestTelemetry(stationFilter),
        fetchQueueMetrics().catch(() => null),
        fetchAlerts(stationFilter).catch(() => null),
      ]);

      if (telRes && telRes.success && telRes.data) {
        setTelemetry((prev) => ({ ...prev, ...telRes.data }));
        setIsSimulatorOnline(true);
      }
      if (metricRes && metricRes.success && metricRes.data) {
        setQueueMetrics(metricRes.data);
      }
      if (alertRes && alertRes.success && alertRes.data) {
        setAlerts(alertRes.data);
      }
    } catch (err) {
      console.warn('[TelemetryContext] Backend synchronization notice:', err.message);
    }
  }, [isStationOperator, assignedStation, selectedStation]);

  // Connect to WebSocket on Mount and maintain live streaming
  useEffect(() => {
    refreshData();

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/telemetry';
    let socket;

    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsSimulatorOnline(true);
        const currentTarget = isStationOperator ? assignedStation : (selectedStation === 'all-stations' ? 'station-maitri' : selectedStation);
        socket.send(JSON.stringify({
          action: 'set_station',
          station_id: currentTarget
        }));
      };

      socket.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          if (packet.packet_type === 'EMERGENCY_ALERT' && packet.data) {
            const newAlert = packet.data;
            if (!isStationOperator || newAlert.station_id === assignedStation) {
              setAlerts((prev) => [newAlert, ...prev.filter(a => a.id !== newAlert.id)].slice(0, 50));
            }
          } else if (packet.station_id) {
            setTelemetry((prev) => ({
              ...prev,
              [packet.station_id]: {
                ...prev[packet.station_id],
                station_id: packet.station_id,
                station_name: packet.station_name,
                temperature: packet.ambient_temperature_c,
                wind_speed: packet.wind_speed_kmh,
                battery: packet.battery_level_percent,
                battery_level: packet.battery_level_percent,
                power_consumption: packet.power_consumption_kw,
                power_generation: packet.power_generation_kw,
                generator_temperature: packet.generator_core_temp_c,
                generator_status: packet.system_status || 'RUNNING',
                seismic_frequency: packet.seismic_frequency_hz,
                geomagnetic_kp: packet.geomagnetic_kp_index,
                latency_ms: packet.comms_latency_ms,
                timestamp: packet.timestamp,
                time_label: packet.time_label,
              }
            }));
            setIsSimulatorOnline(true);
          }
        } catch (err) {
          console.debug('[TelemetryContext] Non-JSON WS packet:', event.data);
        }
      };

      socket.onerror = () => {
        // Will fallback to periodic polling
      };

      socket.onclose = () => {
        setIsSimulatorOnline(false);
      };
    } catch (e) {
      console.warn('[TelemetryContext] WebSocket initialization notice:', e.message);
    }

    const interval = setInterval(refreshData, 3000);

    return () => {
      clearInterval(interval);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [refreshData, isStationOperator, assignedStation, selectedStation]);

  const activeStationId = isStationOperator ? (assignedStation || 'station-maitri') : selectedStation;
  const effectiveId = activeStationId === 'all-stations' ? 'station-maitri' : activeStationId;

  // Station-specific live telemetry without stale cross-contamination
  const currentTelemetry = telemetry[effectiveId] || {
    station_id: effectiveId,
    station_name: effectiveId === 'station-maitri' ? 'MAITRI' : 'BHARATI',
    temperature: effectiveId === 'station-maitri' ? -18.7 : -14.2,
    battery: effectiveId === 'station-maitri' ? 74.0 : 91.0,
    battery_level: effectiveId === 'station-maitri' ? 74.0 : 91.0,
    power_consumption: effectiveId === 'station-maitri' ? 105.0 : 148.0,
    power_generation: effectiveId === 'station-maitri' ? 132.0 : 185.0,
    generator_status: 'RUNNING',
    generator_temperature: effectiveId === 'station-maitri' ? 78.4 : 74.1,
    wind_speed: effectiveId === 'station-maitri' ? 28.0 : 44.0,
    water_level: effectiveId === 'station-maitri' ? 88.0 : 94.0,
    comms_status: 'SAT_LINK_NOMINAL',
  };

  const filteredAlerts = isStationOperator 
    ? alerts.filter(a => a.station_id === assignedStation)
    : alerts;

  const stationAlerts = activeStationId === 'all-stations' 
    ? filteredAlerts 
    : filteredAlerts.filter(a => a.station_id === activeStationId);

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
        isSimulatorOnline,
        isLoadingStationData,
        refreshData,
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
