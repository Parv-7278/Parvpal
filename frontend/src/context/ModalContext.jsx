import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    type: 'DRILL_DOWN', // 'DRILL_DOWN' | 'ALERT_VIEW_ALL' | 'INSIGHT_DETAIL' | 'SIMULATION_REPORT' | 'FORECAST'
    category: 'TELEMETRY',
    metricKey: null,
    currentValue: null,
    unit: '',
    status: 'NORMAL',
    historicalData: [],
    chartType: 'area',
    stats: null,
    thresholds: null,
    interpretation: '',
    recommendation: '',
    metadata: null,
    station: 'Maitri Station',
    data: null,
  });

  const openDrillDown = useCallback((config) => {
    setModalState({
      isOpen: true,
      title: config.title || 'Telemetry Parameter Analysis',
      type: config.type || 'DRILL_DOWN',
      category: config.category || 'TELEMETRY',
      metricKey: config.metricKey || null,
      currentValue: config.currentValue ?? null,
      unit: config.unit || '',
      status: config.status || 'NORMAL',
      historicalData: config.historicalData || [],
      chartType: config.chartType || 'area',
      stats: config.stats || null,
      thresholds: config.thresholds || null,
      interpretation: config.interpretation || '',
      recommendation: config.recommendation || '',
      metadata: config.metadata || null,
      station: config.station || 'Maitri Station',
      data: config.data || null,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ModalContext.Provider
      value={{
        modalState,
        openDrillDown,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
