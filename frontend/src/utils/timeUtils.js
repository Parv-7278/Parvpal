// ==============================================================================
// POLARIS Antarctic Digital Twin - Centralized Station Time Architecture
// Single Source of Truth for Station Timezone Formatting & Live Clocks
// ==============================================================================
import { useState, useEffect } from 'react';

/**
 * Standard Station Timezone Mapping (Single Source of Truth)
 * Maitri: Queen Maud Land, Princess Astrid Coast -> UTC (UTC+0)
 * Bharati: Larsemann Hills, Prydz Bay -> Antarctica/Mawson (UTC+5)
 */
export const STATION_TIMEZONES = {
  'station-maitri': {
    id: 'station-maitri',
    name: 'MAITRI',
    fullName: 'Maitri Research Station',
    timezone: 'UTC',
    timezone_label: 'UTC+0',
    location: 'Schirmacher Oasis, Queen Maud Land (-70.765833, 11.735833)'
  },
  'station-bharati': {
    id: 'station-bharati',
    name: 'BHARATI',
    fullName: 'Bharati Research Station',
    timezone: 'Antarctica/Mawson',
    timezone_label: 'UTC+5',
    location: 'Larsemann Hills, Prydz Bay (-69.407778, 76.187222)'
  }
};

/**
 * Resolves the IANA timezone string from a station ID, station object, or timezone identifier.
 * @param {string|object} stationOrTz - Station ID ('station-maitri', 'station-bharati'), station object, or IANA string.
 * @returns {string} IANA timezone identifier e.g. 'UTC' or 'Antarctica/Mawson'.
 */
export function getStationTimezone(stationOrTz) {
  if (!stationOrTz) return 'UTC';
  
  if (typeof stationOrTz === 'object') {
    if (stationOrTz.timezone) return stationOrTz.timezone;
    if (stationOrTz.id && STATION_TIMEZONES[stationOrTz.id]) {
      return STATION_TIMEZONES[stationOrTz.id].timezone;
    }
  }

  if (typeof stationOrTz === 'string') {
    const s = stationOrTz.toLowerCase();
    if (s === 'station-maitri' || s === 'maitri') return STATION_TIMEZONES['station-maitri'].timezone;
    if (s === 'station-bharati' || s === 'bharati') return STATION_TIMEZONES['station-bharati'].timezone;
    
    // Check if it's already an IANA timezone or recognized timezone
    try {
      Intl.DateTimeFormat(undefined, { timeZone: stationOrTz });
      return stationOrTz;
    } catch {
      return 'UTC';
    }
  }

  return 'UTC';
}

/**
 * Resolves the compact display timezone label (e.g. 'UTC+0', 'UTC+5').
 * @param {string|object} stationOrTz - Station ID, station object, or timezone identifier.
 * @returns {string} Display label e.g. 'UTC+0' or 'UTC+5'.
 */
export function getStationTimezoneLabel(stationOrTz) {
  if (!stationOrTz) return 'UTC+0';

  if (typeof stationOrTz === 'object') {
    if (stationOrTz.timezone_label) return stationOrTz.timezone_label;
    if (stationOrTz.id && STATION_TIMEZONES[stationOrTz.id]) {
      return STATION_TIMEZONES[stationOrTz.id].timezone_label;
    }
  }

  if (typeof stationOrTz === 'string') {
    const s = stationOrTz.toLowerCase();
    if (s === 'station-maitri' || s === 'maitri' || s === 'utc' || s === 'etc/gmt') {
      return 'UTC+0';
    }
    if (s === 'station-bharati' || s === 'bharati' || s === 'antarctica/mawson' || s.includes('mawson')) {
      return 'UTC+5';
    }
  }

  return 'UTC';
}

/**
 * Formats a Date or timestamp into a station-local time string (HH:MM:SS or HH:MM).
 * Uses Intl.DateTimeFormat with the exact station IANA timezone to prevent browser timezone bias.
 * 
 * @param {Date|number|string} dateOrTimestamp - Date instance, timestamp ms, or ISO 8601 string.
 * @param {string|object} stationOrTz - Target station ID or IANA timezone.
 * @param {object} options - Optional Intl.DateTimeFormat options.
 * @returns {string} Formatted local station time e.g. '14:42:18'.
 */
export function formatStationTime(dateOrTimestamp, stationOrTz, options = {}) {
  if (!dateOrTimestamp) return '--:--:--';
  const tz = getStationTimezone(stationOrTz);
  const d = dateOrTimestamp instanceof Date ? dateOrTimestamp : new Date(dateOrTimestamp);

  if (isNaN(d.getTime())) return '--:--:--';

  const defaultOptions = {
    timeZone: tz,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...options
  };

  try {
    return new Intl.DateTimeFormat('en-GB', defaultOptions).format(d);
  } catch (err) {
    console.warn('[timeUtils] DateTimeFormat error for tz:', tz, err);
    return d.toISOString().substring(11, 19);
  }
}

/**
 * Formats a Date or timestamp into a station-local date string (e.g. '25 May 2025' or '15 Sep 2026').
 * 
 * @param {Date|number|string} dateOrTimestamp - Date instance, timestamp ms, or ISO 8601 string.
 * @param {string|object} stationOrTz - Target station ID or IANA timezone.
 * @param {object} options - Optional Intl.DateTimeFormat options.
 * @returns {string} Formatted local station date string.
 */
export function formatStationDate(dateOrTimestamp, stationOrTz, options = {}) {
  if (!dateOrTimestamp) return '';
  const tz = getStationTimezone(stationOrTz);
  const d = dateOrTimestamp instanceof Date ? dateOrTimestamp : new Date(dateOrTimestamp);

  if (isNaN(d.getTime())) return '';

  const defaultOptions = {
    timeZone: tz,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options
  };

  try {
    return new Intl.DateTimeFormat('en-GB', defaultOptions).format(d);
  } catch (err) {
    console.warn('[timeUtils] DateFormat error for tz:', tz, err);
    return d.toISOString().substring(0, 10);
  }
}

/**
 * Formats a full datetime string with timezone label (e.g. '15 Sep 2026, 17:00:00 UTC+5').
 * 
 * @param {Date|number|string} dateOrTimestamp - Date instance, timestamp ms, or ISO 8601 string.
 * @param {string|object} stationOrTz - Target station ID or IANA timezone.
 * @returns {string} Formatted station datetime string.
 */
export function formatStationDateTime(dateOrTimestamp, stationOrTz) {
  if (!dateOrTimestamp) return '--';
  const tz = getStationTimezone(stationOrTz);
  const label = getStationTimezoneLabel(stationOrTz);
  const dateStr = formatStationDate(dateOrTimestamp, tz);
  const timeStr = formatStationTime(dateOrTimestamp, tz);
  return `${dateStr}, ${timeStr} ${label}`;
}

/**
 * Formats a telemetry timestamp tag in HH:MM:SS for SCADA and live stream logs.
 * 
 * @param {Date|number|string} dateOrTimestamp - Timestamp.
 * @param {string|object} stationOrTz - Station context.
 * @returns {string} Telemetry time string.
 */
export function formatStationTelemetryTime(dateOrTimestamp, stationOrTz) {
  return formatStationTime(dateOrTimestamp, stationOrTz, {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * React Hook that provides a live-ticking continuous clock for the selected station.
 * Seamlessly transitions when switching stations (e.g., Maitri -> Bharati) with zero stale state.
 * 
 * @param {string|object} stationOrTz - Station ID or IANA timezone string.
 * @param {number} intervalMs - Update interval in milliseconds (default 1000ms).
 * @returns {object} Object containing formatted time, seconds, date, timezone, and label.
 */
export function useStationClock(stationOrTz, intervalMs = 1000) {
  const tz = getStationTimezone(stationOrTz);
  const tzLabel = getStationTimezoneLabel(stationOrTz);

  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    // Immediately tick on mount or station change
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, intervalMs);

    return () => clearInterval(timer);
  }, [tz, intervalMs]);

  const timeStrWithSeconds = formatStationTime(currentTime, tz, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const timeStr = formatStationTime(currentTime, tz, {
    hour: '2-digit',
    minute: '2-digit'
  });

  const dateStr = formatStationDate(currentTime, tz);
  const dateTimeStr = `${dateStr} | ${timeStrWithSeconds} ${tzLabel}`;

  return {
    now: currentTime,
    timeStr,
    timeStrWithSeconds,
    dateStr,
    dateTimeStr,
    timezone: tz,
    timezoneLabel: tzLabel
  };
}
