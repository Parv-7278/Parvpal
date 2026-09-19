/**
 * POLARIS Digital Twin Layouts Index.
 * Station-aware layout resolver for Maitri (Modular Base) & Bharati (Next-Gen Monoblock).
 */

import { MAITRI_STATION_LAYOUT } from './maitriLayout';
import { BHARATI_STATION_LAYOUT } from './bharatiLayout';

export { MAITRI_STATION_LAYOUT } from './maitriLayout';
export { BHARATI_STATION_LAYOUT } from './bharatiLayout';

export function getStationLayout(stationId = 'station-maitri') {
  if (stationId === 'station-bharati' || String(stationId).toLowerCase().includes('bharati')) {
    return BHARATI_STATION_LAYOUT;
  }
  return MAITRI_STATION_LAYOUT;
}
