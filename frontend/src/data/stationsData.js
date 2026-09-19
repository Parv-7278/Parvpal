// Station-Specific Data Repository for POLARIS Antarctic Digital Twin
// Contains distinct telemetry, 3D twins, building catalogs, weather, energy profiles, predictive models, and alerts for Maitri and Bharati.

export const STATIONS_DATA = {
  // ========================================================================
  // MAITRI RESEARCH STATION (Schirmacher Oasis, Inland Antarctica)
  // ========================================================================
  'station-maitri': {
    id: 'station-maitri',
    name: 'MAITRI',
    fullName: 'Maitri Research Station',
    country: 'India',
    established: 1989,
    region: 'Schirmacher Oasis, Queen Maud Land',
    coords: '70° 45′ 57″ S, 11° 44′ 09″ E',
    status: 'Online',
    statusColor: '#10b981',
    heroImage: '/stations/maitri.jpg',
    altitude: '117 m above sea level',
    environmentType: 'Inland Rocky Moraine (Lake Priyadarshini Oasis)',
    timezone: 'UTC',
    timezone_label: 'UTC+0',

    // Health Scores
    health: {
      total: 87,
      rating: 'Good',
      ratingColor: '#10b981',
      infrastructure: 91,
      energy: 84,
      logistics: 89,
      environment: 78,
      communication: 94,
    },

    // Weather & Environmental Conditions
    weather: {
      temp: '-18.7',
      unit: '°C',
      condition: 'Light Snow',
      windSpeed: '28 km/h',
      windDir: 'NW',
      humidity: '68%',
      pressure: '987 hPa',
      visibility: '4.8 km',
      snowAccumulation: '12 cm',
      localTime: '19:42',
      date: '25 May 2025',
    },

    // Sparkline Waveforms
    sparklines: {
      temp: 'M0,14 C15,8 25,20 40,12 C55,4 65,18 80,10 C95,2 105,16 120,8 C130,4 140,12 150,9',
      wind: 'M0,18 C20,12 35,2 50,15 C65,22 80,6 95,14 C110,18 125,5 138,10 C145,12 148,8 150,11',
      snow: 'M0,20 C18,19 32,18 50,15 C70,12 90,14 110,9 C125,7 135,11 150,6',
      visibility: 'M0,8 C15,9 30,12 45,18 C60,22 75,19 90,14 C105,10 120,16 135,13 C142,12 148,15 150,14',
    },

    // Energy Profile
    energy: {
      generation: 132,
      consumption: 105,
      surplus: 27,
      batteryPercent: 74,
      batteryChargeKWh: '2,960 kWh',
      batteryCapacityKWh: '4,000 kWh',
      fuelLiters: '50,200 L',
      fuelDays: '43 days',
      dailyUsageL: '1,160 L',
      fuelBarPercent: 58,
      sources: {
        gen1: { name: 'Generator 1', current: 42, max: 50, loadPct: 84, runtime: '320 hrs', status: 'Online' },
        gen2: { name: 'Generator 2', current: 38, max: 50, loadPct: 76, runtime: '284 hrs', status: 'Online' },
        solar: { name: 'Solar Array', current: 12, max: 20, loadPct: 60, runtime: 'Efficiency: 88%', status: 'Online' },
        wind: { name: 'Wind Turbine', current: 8, max: 20, loadPct: 40, runtime: 'Turbines: 2/2 Active', status: 'Online' },
      },
      breakdown: [
        { name: 'Buildings', kw: 44, pct: 42, color: '#0284c7' },
        { name: 'Labs', kw: 19, pct: 18, color: '#06b6d4' },
        { name: 'HVAC', kw: 16, pct: 15, color: '#f59e0b' },
        { name: 'Water Treatment', kw: 8, pct: 8, color: '#10b981' },
        { name: 'Others', kw: 18, pct: 17, color: '#8b5cf6' },
      ],
      forecast: {
        expectedGen: '~ 140 kW/day',
        genDelta: '↑ 12% vs. current',
        expectedCons: '~ 120 kW/day',
        consDelta: '↑ 8% vs. current',
        batteryReserve: '2.8 days',
      }
    },

    // Energy Status Gauge (Right Sidebar)
    energyStatus: {
      score: 84,
      rating: 'Good',
      subsystems: [
        { label: 'Generation', val: '78 / 100', color: '#10b981' },
        { label: 'Consumption', val: '82 / 100', color: '#10b981' },
        { label: 'Battery', val: '74 / 100', color: '#38bdf8' },
        { label: 'Fuel Reserve', val: '43 days', color: '#f59e0b' },
        { label: 'Solar', val: '67 / 100', color: '#facc15' },
        { label: 'Wind', val: '59 / 100', color: '#38bdf8' },
      ]
    },

    // AI Energy Insights (Energy View)
    aiInsights: {
      summary: 'Based on current trends, Maitri fuel reserve is expected to drop below 30 days in 12 days if heating load spikes during next week’s storm. Generator 2 vibration requires scheduled bearing inspection.',
      recommendations: [
        'Monitor Generator 2 vibration anomaly (trend: +3.4% RMS/week).',
        'Enable Lake Priyadarshini intake heating to avoid sub-surface freezing.',
        'Shift secondary laboratory spectrometer loads to peak solar window (11:00–14:00).',
      ]
    },

    // Logistics Stock
    logistics: [
      { id: 'fuel', name: 'Fuel (Arctic Diesel)', amount: '50,200 L', percent: 58, daysLeft: '43 Days', barColor: '#f59e0b', iconColor: '#f87171' },
      { id: 'food', name: 'Rations & Dry Food', amount: '3,250 kg', percent: 82, daysLeft: '67 Days', barColor: '#10b981', iconColor: '#10b981' },
      { id: 'medicine', name: 'Medical Supplies', amount: '620 kg', percent: 89, daysLeft: '89 Days', barColor: '#10b981', iconColor: '#10b981' },
      { id: 'spare-parts', name: 'Generator & Spares', amount: '1,120 kg', percent: 74, daysLeft: '55 Days', barColor: '#10b981', iconColor: '#10b981' },
    ],

    // Resource Trend
    resourceTrend: {
      selectedDefault: 'Fuel',
      unit: 'k L',
      yMax: '75k L',
      yMid: '50k L',
      yLow: '25k L',
      depletionDate: '15 Jul 2025',
      actualPath: 'M 50,48 L 95,58 L 140,68 L 185,78 L 230,88',
      forecastPath: 'M 230,88 L 275,102 L 320,118',
    },

    // Predictive Insights (Overview)
    predictiveInsights: [
      {
        id: 'pi-m1',
        severity: 'high',
        title: 'Generator G-02 (Maitri) – Bearing Vibration Risk',
        description: 'Vibration and temperature trend elevated. Estimated failure window: 24 - 48 hrs.',
        detailData: {
          title: 'Generator G-02 Diagnostic Report (Maitri)',
          riskLevel: 'HIGH (84% Probability)',
          window: '24 - 48 Hours',
          vibration: '4.8 mm/s RMS (Threshold: 2.5 mm/s)',
          temp: '78.4°C (Operating Max: 75°C)',
          recommendation: 'Transfer 25 kW load to Generator G-01. Schedule oil sample extraction and bearing inspection.'
        }
      },
      {
        id: 'pi-m2',
        severity: 'medium',
        title: 'Lake Priyadarshini Intake Trace Heating',
        description: 'Water intake temperature dipping near freezing point (+0.4°C). Trace heater load adjustment advised.',
        detailData: {
          title: 'Lake Intake Thermal Integrity',
          riskLevel: 'MEDIUM (Freeze Risk)',
          window: '6 - 12 Hours',
          temp: '+0.4°C (Safe Margin: > +2.0°C)',
          recommendation: 'Increase intake pipeline heat tracing from 35% to 65% power before midnight temperature trough.'
        }
      },
      {
        id: 'pi-m3',
        severity: 'info',
        title: 'Katabatic Wind Energy Surge Window',
        description: 'Forecasted 35 km/h gusts tonight will increase wind turbine yield by +28%.',
        detailData: {
          title: 'Renewable Power Capture Opportunity',
          riskLevel: 'POSITIVE HARVEST',
          window: 'Tonight (22:00 - 06:00)',
          windGusts: 'Gusts up to 48 km/h NW',
          recommendation: 'Pre-condition battery storage banks to absorb excess wind turbine generation.'
        }
      }
    ],

    // What-If Scenarios
    scenarios: [
      {
        id: 'gen-fail-m',
        label: 'Generator G-02 Sudden Trip (Maitri)',
        metrics: {
          powerDelta: '-28%',
          powerNote: '( Grid Shift )',
          batteryReserve: '16 Hrs',
          batteryNote: '( Reserve )',
          loadAction: 'Auto Shed',
          loadNote: '( Non-Essential )',
          risk: 'Medium',
          riskNote: '( Controlled )',
          riskColor: '#f59e0b',
          powerColor: '#ef4444'
        }
      },
      {
        id: 'oasis-storm',
        label: 'Schirmacher Katabatic Storm (-35°C, 90 km/h)',
        metrics: {
          powerDelta: '+38%',
          powerNote: '( Heat Load )',
          batteryReserve: '14 Hrs',
          batteryNote: '( High Draw )',
          loadAction: 'Priority Hold',
          loadNote: '( Habitation )',
          risk: 'High',
          riskNote: '( Thermal Stress )',
          riskColor: '#ef4444',
          powerColor: '#ef4444'
        }
      },
      {
        id: 'lake-freeze',
        label: 'Lake Priyadarshini Water Line Blockage',
        metrics: {
          powerDelta: '+12%',
          powerNote: '( Emergency Thaw )',
          batteryReserve: '28 Hrs',
          batteryNote: '( Normal )',
          loadAction: 'Melt Skid',
          loadNote: '( Backup Active )',
          risk: 'Medium',
          riskNote: '( Water Supply )',
          riskColor: '#f59e0b',
          powerColor: '#38bdf8'
        }
      },
      {
        id: 'fuel-convoy',
        label: 'Convoy Resupply 3-Week Weather Delay',
        metrics: {
          powerDelta: '-15%',
          powerNote: '( Fuel Rationing )',
          batteryReserve: '22 Days',
          batteryNote: '( Rationed )',
          loadAction: 'Eco Mode',
          loadNote: '( Science Bay )',
          risk: 'Low',
          riskNote: '( Manageable )',
          riskColor: '#10b981',
          powerColor: '#38bdf8'
        }
      }
    ],

    // Active Alerts
    alerts: [
      { id: 'alert-m1', severity: 'critical', title: 'High Vibration Detected', source: 'Generator G-02 (Maitri)', time: '12:40 PM', type: 'critical' },
      { id: 'alert-m2', severity: 'warning', title: 'Fuel Reserve Critical Trend', source: 'Maitri Fuel Farm', time: '12:35 PM', type: 'warning' },
      { id: 'alert-m3', severity: 'warning', title: 'Katabatic High Wind Warning', source: 'Schirmacher Oasis', time: '12:30 PM', type: 'warning' },
    ],
    unreadAlertsCount: 3,

    // 3D Digital Twin Pins
    pins: [
      { id: 'living-quarters', name: 'Living Quarters', status: 'Normal', type: 'normal', top: '21%', left: '36%', temp: '21.5°C', power: '24 kW', pressure: '1013 hPa', subsystem: 'Habitation Module A & B', notes: 'Life support nominal, internal climate regulated.' },
      { id: 'power-house', name: 'Power House', status: 'Warning', type: 'warning', top: '21%', left: '56%', temp: '78.4°C', power: '88 kW', pressure: '3.2 bar', subsystem: 'Diesel Generator #2 & Hybrid Inverter', notes: 'Generator G-02 vibration anomaly detected. Elevated thermal signature.' },
      { id: 'science-lab', name: 'Science Lab', status: 'Normal', type: 'normal', top: '29%', left: '45%', temp: '19.8°C', power: '18 kW', pressure: '1012 hPa', subsystem: 'Atmospheric & Geomagnetic Laboratory', notes: 'Spectrometer and polar telemetry acquisition active.' },
      { id: 'communication', name: 'Communication Mast', status: 'Normal', type: 'normal', top: '27%', left: '71%', temp: '-4.2°C', power: '12 kW', pressure: 'Nominal', subsystem: 'X-Band Radome & INMARSAT Uplink', notes: 'Direct satellite link to ISRO/NCPOR Goa locked.' },
      { id: 'helipad', name: 'Helipad', status: 'Normal', type: 'normal', top: '38%', left: '28%', temp: '-18.7°C', power: '4 kW', pressure: '987 hPa', subsystem: 'Primary Landing Zone (Echo-1)', notes: 'Wind within flight clearance envelope.' },
      { id: 'warehouse', name: 'Warehouse', status: 'Normal', type: 'normal', top: '39%', left: '49%', temp: '6.0°C', power: '9 kW', pressure: 'Nominal', subsystem: 'Dry Logistics & Cold Supply Bay', notes: 'Fuel and ration stores secured.' },
      { id: 'water-treatment', name: 'Water Treatment', status: 'Normal', type: 'normal', top: '39%', left: '69%', temp: '14.2°C', power: '15 kW', pressure: '4.8 bar', subsystem: 'Lake Priyadarshini Intake Filtration', notes: 'Reverse osmosis purification operating at 92% output.' },
    ],

    // Infrastructure Catalog
    buildings: {
      'main-control': {
        id: 'main-control',
        name: 'Main Control Building',
        category: 'critical',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Indoor Temp',
        metricVal: '21°C',
        image: '/buildings/main_control.jpg',
        type: 'Administration & Command',
        builtYear: '2012',
        area: '1,200 m²',
        occupancy: '28 / 30',
        description: "Houses Maitri's control room, operations centre, IT infrastructure and administrative offices.",
        pinPos: { top: '35%', left: '45%' },
        systems: [
          { name: 'HVAC', status: 'Normal', statusType: 'normal' },
          { name: 'Power Supply', status: 'Normal', statusType: 'normal' },
          { name: 'Water Supply', status: 'Normal', statusType: 'normal' },
          { name: 'Network & Communication', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '14 May 2025', nextScheduled: '28 Jun 2025', health: '98%', notes: 'Structural foundation integrity confirmed nominal. Roof de-icing heaters verified.' }
      },
      'living-quarters': {
        id: 'living-quarters',
        name: 'Living Quarters',
        category: 'others',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Indoor Temp',
        metricVal: '18°C',
        image: '/buildings/living_quarters.jpg',
        type: 'Habitation Module',
        builtYear: '2013',
        area: '950 m²',
        occupancy: '24 / 28',
        description: 'Habitation pods, galley, dining hall, recreation lounge, and medical dispensary for resident expedition crew.',
        pinPos: { top: '30%', left: '72%' },
        systems: [
          { name: 'Climate Control', status: 'Normal', statusType: 'normal' },
          { name: 'Freshwater Distribution', status: 'Normal', statusType: 'normal' },
          { name: 'Emergency Backup Heating', status: 'Normal', statusType: 'normal' },
          { name: 'Fire Suppression System', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '02 May 2025', nextScheduled: '15 Jul 2025', health: '95%', notes: 'Thermal insulation layers inspected after recent blizzard. Zero draft detected.' }
      },
      'laboratory-block': {
        id: 'laboratory-block',
        name: 'Laboratory Block',
        category: 'critical',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Indoor Temp',
        metricVal: '22°C',
        image: '/buildings/laboratory.jpg',
        type: 'Scientific Research',
        builtYear: '2014',
        area: '820 m²',
        occupancy: '12 / 16',
        description: 'Atmospheric physics, geology, magnetosphere, and glaciological laboratory research suites with cryogenic storage.',
        pinPos: { top: '21%', left: '61%' },
        systems: [
          { name: 'Cleanroom Filtration', status: 'Normal', statusType: 'normal' },
          { name: 'Cryo-Cooling Loop', status: 'Normal', statusType: 'normal' },
          { name: 'High-Precision Power Line', status: 'Normal', statusType: 'normal' },
          { name: 'Spectrometer Data Feeds', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '20 Apr 2025', nextScheduled: '20 Jun 2025', health: '97%', notes: 'Spectrometer calibration completed. Cryogenic liquid helium levels at 94%.' }
      },
      'generator-yard': {
        id: 'generator-yard',
        name: 'Generator Yard',
        category: 'utilities',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Total Output',
        metricVal: '3.2 MW',
        image: '/buildings/generator.jpg',
        type: 'Power Generation',
        builtYear: '2012',
        area: '650 m²',
        occupancy: '2 / 4 (Automated)',
        description: 'Triple-redundant containerized diesel generator plant, microgrid synchronizer, and heat exchangers.',
        pinPos: { top: '22%', left: '28%' },
        systems: [
          { name: 'Diesel Generator G-01', status: 'Normal', statusType: 'normal' },
          { name: 'Diesel Generator G-02', status: 'Attention', statusType: 'warning' },
          { name: 'Thermal Exhaust Scavenger', status: 'Normal', statusType: 'normal' },
          { name: 'Emergency Load Shedder', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '18 May 2025', nextScheduled: '25 May 2025', health: '84%', notes: 'Generator G-02 vibration anomaly under monitoring. Routine oil sample sent to lab.' }
      },
      'fuel-storage': {
        id: 'fuel-storage',
        name: 'Fuel Storage',
        category: 'storage',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Remaining',
        metricVal: '50,200 L',
        image: '/buildings/fuel.jpg',
        type: 'Logistics / POL Facility',
        builtYear: '2012',
        area: '1,500 m²',
        occupancy: 'Automated Facility',
        description: 'Insulated bulk fuel storage tank farm containing Aviation Turbine Fuel (ATF) and Arctic Diesel (D-A).',
        pinPos: { top: '46%', left: '25%' },
        systems: [
          { name: 'Tank Heating Tracing', status: 'Normal', statusType: 'normal' },
          { name: 'Leak Detection Sensors', status: 'Normal', statusType: 'normal' },
          { name: 'Transfer Pump Skid A', status: 'Normal', statusType: 'normal' },
          { name: 'Transfer Pump Skid B', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '10 May 2025', nextScheduled: '10 Jun 2025', health: '92%', notes: 'Heated pipeline loop pressurized at 4.2 bar. Zero condensation detected in tank sumps.' }
      },
      'water-treatment': {
        id: 'water-treatment',
        name: 'Water Treatment',
        category: 'utilities',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Daily Output',
        metricVal: '12,500 L',
        image: '/buildings/water.jpg',
        type: 'Water & Sanitation',
        builtYear: '2015',
        area: '480 m²',
        occupancy: 'Automated Facility',
        description: 'Raw water intake filtration from Lake Priyadarshini, reverse osmosis desalination, and biological wastewater recycling.',
        pinPos: { top: '33%', left: '24%' },
        systems: [
          { name: 'RO Membrane Unit', status: 'Normal', statusType: 'normal' },
          { name: 'Lake Priyadarshini Intake Pump', status: 'Normal', statusType: 'normal' },
          { name: 'UV Sterilization Stage', status: 'Normal', statusType: 'normal' },
          { name: 'Effluent Bio-Digester', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '08 May 2025', nextScheduled: '08 Jun 2025', health: '96%', notes: 'Lake intake trace heating active against sub-surface freezing.' }
      },
      'communication-tower': {
        id: 'communication-tower',
        name: 'Communication Mast',
        category: 'critical',
        status: 'Attention',
        statusType: 'warning',
        metricLabel: 'Signal Strength',
        metricVal: 'Stable',
        image: '/buildings/comms.jpg',
        type: 'Telecommunications',
        builtYear: '2016',
        area: '250 m²',
        occupancy: 'Unmanned Tower',
        description: 'Lattice mast antenna supporting X-Band satellite ground link to NRSC/ISRO Hyderabad, HF/VHF marine radio, and internal WiFi mesh.',
        pinPos: { top: '18%', left: '47%' },
        systems: [
          { name: 'ISRO X-Band Satellite Uplink', status: 'Normal', statusType: 'normal' },
          { name: 'INMARSAT C-Band Terminal', status: 'Normal', statusType: 'normal' },
          { name: 'HF Transceiver Array', status: 'Attention', statusType: 'warning' },
          { name: 'Station-Wide WiFi Mesh', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '01 May 2025', nextScheduled: '01 Jun 2025', health: '88%', notes: 'HF antenna guy-wire tension tuned following katabatic wind gusts.' }
      },
      'warehouse': {
        id: 'warehouse',
        name: 'Warehouse & Storage',
        category: 'storage',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Capacity',
        metricVal: '85%',
        image: '/buildings/fuel.jpg',
        type: 'Storage & Logistics',
        builtYear: '2013',
        area: '780 m²',
        occupancy: '4 / 8',
        description: 'Dry food stores, cold supply containers, spare parts cache, heavy vehicle spare tracks, and workshop.',
        pinPos: { top: '45%', left: '53%' },
        systems: [
          { name: 'Dehumidification Unit', status: 'Normal', statusType: 'normal' },
          { name: 'Overhead Crane Hoist', status: 'Normal', statusType: 'normal' },
          { name: 'Freezer Storage (-25°C)', status: 'Normal', statusType: 'normal' },
          { name: 'Tool Inventory Barcode Scanner', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '12 May 2025', nextScheduled: '12 Jun 2025', health: '94%', notes: 'Spare generator parts inventoried. Emergency survival kits restocked.' }
      },
      'helipad': {
        id: 'helipad',
        name: 'Helipad & Fuel Point',
        category: 'others',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Flight Status',
        metricVal: 'Clear',
        image: '/buildings/main_control.jpg',
        type: 'Aviation Infrastructure',
        builtYear: '2012',
        area: '600 m²',
        occupancy: 'Aviation Deck',
        description: 'Primary concrete reinforced helicopter landing zone with visual glide slope indicator, windsock, and fuel de-icing hydrant.',
        pinPos: { top: '48%', left: '67%' },
        systems: [
          { name: 'Perimeter Runway Lights', status: 'Normal', statusType: 'normal' },
          { name: 'Automated Weather Station (AWOS)', status: 'Normal', statusType: 'normal' },
          { name: 'Aviation Fuel Dispenser', status: 'Normal', statusType: 'normal' },
          { name: 'Surface Heating De-Icer', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '15 May 2025', nextScheduled: '15 Jun 2025', health: '99%', notes: 'Deck heating cables cleared of snowdrifts. Friction coefficient nominal.' }
      },
    }
  },

  // ========================================================================
  // BHARATI RESEARCH STATION (Larsemann Hills, Coastal Antarctica)
  // ========================================================================
  'station-bharati': {
    id: 'station-bharati',
    name: 'BHARATI',
    fullName: 'Bharati Research Station',
    country: 'India',
    established: 2012,
    region: 'Larsemann Hills, Prydz Bay',
    coords: '69° 24′ 28″ S, 76° 11′ 14″ E',
    status: 'Online',
    statusColor: '#10b981',
    heroImage: '/stations/bharati.jpg',
    altitude: '35 m above sea level',
    environmentType: 'Coastal Antarctic Promontory (Prydz Bay Maritime)',
    timezone: 'Antarctica/Mawson',
    timezone_label: 'UTC+5',

    // Health Scores
    health: {
      total: 93,
      rating: 'Optimal',
      ratingColor: '#10b981',
      infrastructure: 96,
      energy: 89,
      logistics: 94,
      environment: 91,
      communication: 98,
    },

    // Weather & Environmental Conditions (Coastal Antarctic)
    weather: {
      temp: '-14.2',
      unit: '°C',
      condition: 'Blowing Snow & Coastal Mist',
      windSpeed: '44 km/h',
      windDir: 'ESE',
      humidity: '82%',
      pressure: '972 hPa',
      visibility: '2.1 km',
      snowAccumulation: '24 cm',
      localTime: '20:12',
      date: '25 May 2025',
    },

    // Sparkline Waveforms
    sparklines: {
      temp: 'M0,18 C15,14 25,12 40,8 C55,10 65,6 80,4 C95,9 105,7 120,5 C130,8 140,4 150,6',
      wind: 'M0,8 C20,18 35,22 50,14 C65,8 80,20 95,22 C110,14 125,18 138,20 C145,22 148,18 150,22',
      snow: 'M0,12 C18,14 32,16 50,18 C70,16 90,20 110,22 C125,20 135,24 150,22',
      visibility: 'M0,20 C15,16 30,14 45,10 C60,8 75,12 90,6 C105,8 120,4 135,6 C142,5 148,8 150,6',
    },

    // Energy Profile (Larger modern complex + Satellite ground station)
    energy: {
      generation: 185,
      consumption: 148,
      surplus: 37,
      batteryPercent: 91,
      batteryChargeKWh: '5,460 kWh',
      batteryCapacityKWh: '6,000 kWh',
      fuelLiters: '78,500 L',
      fuelDays: '68 days',
      dailyUsageL: '1,420 L',
      fuelBarPercent: 78,
      sources: {
        gen1: { name: 'CHP Generator 1', current: 72, max: 90, loadPct: 80, runtime: '410 hrs', status: 'Online' },
        gen2: { name: 'CHP Generator 2', current: 65, max: 90, loadPct: 72, runtime: '388 hrs', status: 'Online' },
        solar: { name: 'Bifacial Solar Farm', current: 32, max: 45, loadPct: 71, runtime: 'Efficiency: 94%', status: 'Online' },
        wind: { name: 'Coastal Wind Array', current: 16, max: 30, loadPct: 53, runtime: 'Turbines: 4/4 Active', status: 'Online' },
      },
      breakdown: [
        { name: 'Satellite Radome', kw: 50, pct: 34, color: '#0284c7' },
        { name: 'Main Complex Hab', kw: 41, pct: 28, color: '#06b6d4' },
        { name: 'Seawater Desal', kw: 24, pct: 16, color: '#10b981' },
        { name: 'Ocean Labs', kw: 21, pct: 14, color: '#f59e0b' },
        { name: 'Runway Lights & Deck', kw: 12, pct: 8, color: '#8b5cf6' },
      ],
      forecast: {
        expectedGen: '~ 195 kW/day',
        genDelta: '↑ 15% vs. current',
        expectedCons: '~ 155 kW/day',
        consDelta: '↑ 5% vs. current',
        batteryReserve: '4.2 days',
      }
    },

    // Energy Status Gauge (Right Sidebar)
    energyStatus: {
      score: 89,
      rating: 'Optimal',
      subsystems: [
        { label: 'CHP Generation', val: '92 / 100', color: '#10b981' },
        { label: 'Grid Load Balance', val: '88 / 100', color: '#10b981' },
        { label: 'Battery BESS', val: '91 / 100', color: '#10b981' },
        { label: 'Fuel Reserve', val: '68 days', color: '#10b981' },
        { label: 'Bifacial Solar', val: '74 / 100', color: '#facc15' },
        { label: 'Coastal Wind', val: '82 / 100', color: '#38bdf8' },
      ]
    },

    // AI Energy Insights (Energy View)
    aiInsights: {
      summary: 'Bharati Combined Heat & Power (CHP) loop is operating at 93% efficiency with 78,500 L fuel reserve (68 days). High-priority satellite passes will draw 50 kW continuous over next 4 hours.',
      recommendations: [
        'Radome automatic heating cycle is active for incoming Prydz Bay coastal fog.',
        'Seawater reverse osmosis plant running at nominal 18,000 L/day output.',
        'Coastal wind turbine array generating 16 kW surplus — stored into lithium BESS bank.',
      ]
    },

    // Logistics Stock
    logistics: [
      { id: 'fuel', name: 'Fuel (Arctic Diesel)', amount: '78,500 L', percent: 78, daysLeft: '68 Days', barColor: '#10b981', iconColor: '#f87171' },
      { id: 'food', name: 'Deep-Freeze Rations', amount: '4,800 kg', percent: 90, daysLeft: '95 Days', barColor: '#10b981', iconColor: '#10b981' },
      { id: 'medicine', name: 'Medical & Surgical Bay', amount: '950 kg', percent: 95, daysLeft: '120 Days', barColor: '#10b981', iconColor: '#10b981' },
      { id: 'spare-parts', name: 'Heavy Spares & Avionics', amount: '2,400 kg', percent: 88, daysLeft: '80 Days', barColor: '#10b981', iconColor: '#10b981' },
    ],

    // Resource Trend
    resourceTrend: {
      selectedDefault: 'Fuel',
      unit: 'k L',
      yMax: '100k L',
      yMid: '75k L',
      yLow: '50k L',
      depletionDate: '28 Aug 2025',
      actualPath: 'M 50,38 L 95,44 L 140,50 L 185,58 L 230,64',
      forecastPath: 'M 230,64 L 275,76 L 320,88',
    },

    // Predictive Insights (Overview)
    predictiveInsights: [
      {
        id: 'pi-b1',
        severity: 'high',
        title: 'ISRO Earth Observation Radome – De-icing Surge',
        description: 'Coastal mist freezing onto radome membrane. De-icing heaters drawing 48 kW during satellite telemetry window.',
        detailData: {
          title: 'Radome Thermal Management Diagnostic (Bharati)',
          riskLevel: 'HIGH THERMAL DEMAND',
          window: 'During Pass (21:30 - 23:45)',
          powerDraw: '48 kW dedicated heating load',
          iceThickness: '3.4 mm riming accumulation',
          recommendation: 'Engage secondary CHP thermal loop to circulate hot glycol to the radome base.'
        }
      },
      {
        id: 'pi-b2',
        severity: 'medium',
        title: 'Prydz Bay Coastal Gale Gale Inflow',
        description: 'Gale force winds of 44–65 km/h ESE detected on coastal radar. Wind turbines will reach rated cutoff speed.',
        detailData: {
          title: 'Coastal Wind Array Overspeed Alert',
          riskLevel: 'MEDIUM (Braking Engaged)',
          window: 'Next 18 Hours',
          windSpeed: '44 km/h sustained (gusts 68 km/h)',
          recommendation: 'Pitch turbine blades to auto-feather if sustained winds exceed 75 km/h.'
        }
      },
      {
        id: 'pi-b3',
        severity: 'info',
        title: 'Vessel Tracking: MV Vasiliy Golovnin',
        description: 'Polar research vessel en route from Cape Town. Estimated Prydz Bay berthing: 14 June.',
        detailData: {
          title: 'Expedition Vessel Logistics Update',
          riskLevel: 'ON SCHEDULE',
          window: 'Arrival in 20 Days',
          cargoManifest: '120,000 L ATF/Diesel + 6 container modules',
          recommendation: 'Prepare POL pipeline manifold and snowcat clearing of the coastal ice shelf.'
        }
      }
    ],

    // What-If Scenarios
    scenarios: [
      {
        id: 'chp-fail-b',
        label: 'CHP Generator #1 Maintenance Cutout (Bharati)',
        metrics: {
          powerDelta: '-22%',
          powerNote: '( Backup Active )',
          batteryReserve: '26 Hrs',
          batteryNote: '( BESS Buffer )',
          loadAction: 'CHP #2 Sync',
          loadNote: '( Auto Start )',
          risk: 'Low',
          riskNote: '( High Redundancy )',
          riskColor: '#10b981',
          powerColor: '#f59e0b'
        }
      },
      {
        id: 'radome-blizzard',
        label: 'Prydz Bay Maritime Blizzard (-30°C, 120 km/h)',
        metrics: {
          powerDelta: '+32%',
          powerNote: '( Radome + Hab )',
          batteryReserve: '20 Hrs',
          batteryNote: '( High Drain )',
          loadAction: 'Priority Hold',
          loadNote: '( Satellite Link )',
          risk: 'High',
          riskNote: '( Coastal Gale )',
          riskColor: '#ef4444',
          powerColor: '#ef4444'
        }
      },
      {
        id: 'desal-ice',
        label: 'Sub-Sea Seawater Intake Ice Blockage',
        metrics: {
          powerDelta: '+18%',
          powerNote: '( Subsea Thaw )',
          batteryReserve: '34 Hrs',
          batteryNote: '( Normal )',
          loadAction: 'Reserve Tank',
          loadNote: '( 45k L Fresh )',
          risk: 'Medium',
          riskNote: '( Desalination )',
          riskColor: '#f59e0b',
          powerColor: '#38bdf8'
        }
      },
      {
        id: 'satellite-peak',
        label: 'Continuous 24-Hr Polar Satellite Pass',
        metrics: {
          powerDelta: '+25%',
          powerNote: '( Uplink / Downlink )',
          batteryReserve: '4.2 Days',
          batteryNote: '( BESS + Wind )',
          loadAction: 'Grid Shift',
          loadNote: '( Clean Power )',
          risk: 'Low',
          riskNote: '( Planned Load )',
          riskColor: '#10b981',
          powerColor: '#10b981'
        }
      }
    ],

    // Active Alerts
    alerts: [
      { id: 'alert-b1', severity: 'warning', title: 'Ocean Katabatic Gale Alert', source: 'Prydz Bay Coastal Radar', time: '13:10 PM', type: 'warning' },
      { id: 'alert-b2', severity: 'info', title: 'Radome De-icing Active', source: 'Earth Observation Hub', time: '12:55 PM', type: 'info' },
      { id: 'alert-b3', severity: 'info', title: 'Vessel Tracking: MV Golovnin', source: 'Southern Ocean Link', time: '12:15 PM', type: 'info' },
    ],
    unreadAlertsCount: 2,

    // 3D Digital Twin Pins for Bharati
    pins: [
      { id: 'bharati-main', name: 'Main Elevated Habitat', status: 'Normal', type: 'normal', top: '25%', left: '52%', temp: '22.0°C', power: '45 kW', pressure: '1014 hPa', subsystem: 'Elevated 3-Story Research Habitat', notes: 'Aerodynamic steel stilt structure nominal.' },
      { id: 'bharati-radome', name: 'Satellite Ground Station', status: 'Normal', type: 'normal', top: '18%', left: '58%', temp: '-8.0°C', power: '22 kW', pressure: 'Nominal', subsystem: 'Earth Observation Data Relay', notes: 'Tracking polar orbit satellites in real time.' },
      { id: 'bharati-helipad', name: 'Helipad & Aviation Deck', status: 'Normal', type: 'normal', top: '76%', left: '30%', temp: '-14.2°C', power: '6 kW', pressure: '972 hPa', subsystem: 'Aviation Deck & De-icing Station', notes: 'Visual beacon operational.' },
      { id: 'bharati-power', name: 'CHP Power Generation', status: 'Normal', type: 'normal', top: '55%', left: '70%', temp: '74.1°C', power: '72 kW', pressure: '3.6 bar', subsystem: 'Combined Heat & Power (CHP) Unit', notes: 'Primary CHP operating at optimal thermal balance.' },
      { id: 'bharati-desal', name: 'Seawater Desalination', status: 'Normal', type: 'normal', top: '65%', left: '42%', temp: '16.5°C', power: '24 kW', pressure: '5.2 bar', subsystem: 'Marine Reverse Osmosis Plant', notes: 'Direct seawater intake protected with anti-freeze trace heaters.' },
      { id: 'bharati-hangar', name: 'Snowcat Vehicle Hangar', status: 'Normal', type: 'normal', top: '70%', left: '78%', temp: '8.0°C', power: '14 kW', pressure: 'Nominal', subsystem: 'Kässbohrer PistenBully Fleet Maintenance', notes: '4 polar tracked vehicles serviced and fueled.' },
    ],

    // Infrastructure Catalog for Bharati
    buildings: {
      'bharati-main': {
        id: 'bharati-main',
        name: 'Main Elevated Habitat',
        category: 'critical',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Indoor Temp',
        metricVal: '22°C',
        image: '/buildings/main_control.jpg',
        type: '3-Story Elevated Habitat',
        builtYear: '2012',
        area: '2,162 m²',
        occupancy: '42 / 47',
        description: 'State-of-the-art aerodynamic stilted habitat containing residential suites, operational control, medical hospital, and lounge.',
        pinPos: { top: '35%', left: '50%' },
        systems: [
          { name: 'Aerodynamic Stilt Damper', status: 'Normal', statusType: 'normal' },
          { name: 'Integrated CHP Heating', status: 'Normal', statusType: 'normal' },
          { name: 'Pressurized Life Support', status: 'Normal', statusType: 'normal' },
          { name: 'Fire Suppression & Gas Matrix', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '16 May 2025', nextScheduled: '30 Jun 2025', health: '99%', notes: 'Composite exterior panels and underfloor wind deflection surfaces inspected.' }
      },
      'bharati-radome': {
        id: 'bharati-radome',
        name: 'Satellite Ground Station',
        category: 'critical',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Uplink Speed',
        metricVal: '1.2 Gbps',
        image: '/buildings/comms.jpg',
        type: 'Remote Sensing Ground Segment',
        builtYear: '2012',
        area: '420 m²',
        occupancy: 'Automated Radome',
        description: 'Geodesic radome housing ISRO/NRSC high-gain tracking dish for real-time Cartosat, Oceansat, and RISAT telemetry acquisition.',
        pinPos: { top: '20%', left: '58%' },
        systems: [
          { name: 'X-Band Downlink Receiver', status: 'Normal', statusType: 'normal' },
          { name: 'S-Band Telemetry Beacon', status: 'Normal', statusType: 'normal' },
          { name: 'Radome Internal De-icer', status: 'Normal', statusType: 'normal' },
          { name: 'Cryo-Cooled LNA Arrays', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '12 May 2025', nextScheduled: '12 Jun 2025', health: '98%', notes: 'Azimuth/Elevation servo motors greased for -40°C operation.' }
      },
      'bharati-power': {
        id: 'bharati-power',
        name: 'CHP Power Plant',
        category: 'utilities',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Total Output',
        metricVal: '4.8 MW',
        image: '/buildings/generator.jpg',
        type: 'Combined Heat & Power',
        builtYear: '2012',
        area: '850 m²',
        occupancy: '3 / 6 (Automated)',
        description: 'Advanced dual Volvo-Penta CHP units capturing 93% thermal efficiency for station space heating and meltwater generation.',
        pinPos: { top: '48%', left: '68%' },
        systems: [
          { name: 'CHP Unit #1 (Primary)', status: 'Normal', statusType: 'normal' },
          { name: 'CHP Unit #2 (Standby)', status: 'Normal', statusType: 'normal' },
          { name: 'Thermal Distribution Loop', status: 'Normal', statusType: 'normal' },
          { name: 'Lithium BESS Storage', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '19 May 2025', nextScheduled: '26 May 2025', health: '95%', notes: 'Waste heat thermal exchangers operating at 92°C nominal.' }
      },
      'bharati-desal': {
        id: 'bharati-desal',
        name: 'Seawater Desalination Plant',
        category: 'utilities',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Daily Output',
        metricVal: '18,000 L',
        image: '/buildings/water.jpg',
        type: 'Marine Water Infrastructure',
        builtYear: '2013',
        area: '520 m²',
        occupancy: 'Automated Facility',
        description: 'Sub-sea marine pipeline intake from Prydz Bay delivering pure potable water via multi-stage RO and mineralization.',
        pinPos: { top: '60%', left: '38%' },
        systems: [
          { name: 'Sub-Sea Heated Intake Line', status: 'Normal', statusType: 'normal' },
          { name: 'High-Pressure RO Skid', status: 'Normal', statusType: 'normal' },
          { name: 'Chlorination & UV Filtration', status: 'Normal', statusType: 'normal' },
          { name: 'Greywater Recycling Loop', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '11 May 2025', nextScheduled: '11 Jun 2025', health: '97%', notes: 'Prydz Bay seawater temperature: -1.8°C; intake trace heat at 8°C.' }
      },
      'bharati-fuel': {
        id: 'bharati-fuel',
        name: 'Bulk POL Complex',
        category: 'storage',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Remaining',
        metricVal: '78,500 L',
        image: '/buildings/fuel.jpg',
        type: 'Double-Walled Tank Farm',
        builtYear: '2012',
        area: '1,800 m²',
        occupancy: 'Automated Facility',
        description: 'Containment berm with 8 double-walled Arctic Diesel and Aviation Kerosene storage tanks with vacuum leak detection.',
        pinPos: { top: '50%', left: '22%' },
        systems: [
          { name: 'Vacuum Interstitial Monitoring', status: 'Normal', statusType: 'normal' },
          { name: 'Underground Heated Transfer Line', status: 'Normal', statusType: 'normal' },
          { name: 'Ship-to-Shore Refueling Manifold', status: 'Normal', statusType: 'normal' },
          { name: 'Emergency Fuel Cutoff Valves', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '07 May 2025', nextScheduled: '07 Jun 2025', health: '99%', notes: 'Annual hydrostatic pressure certification completed.' }
      },
      'bharati-hangar': {
        id: 'bharati-hangar',
        name: 'Vehicle & Snowcat Hangar',
        category: 'storage',
        status: 'Normal',
        statusType: 'normal',
        metricLabel: 'Fleet Ready',
        metricVal: '4 / 4 Units',
        image: '/buildings/living_quarters.jpg',
        type: 'Vehicle Maintenance & Bay',
        builtYear: '2013',
        area: '900 m²',
        occupancy: '4 Mechanics',
        description: 'Heated maintenance bays, hydraulic overhead cranes, and tooling shop for PistenBully snow groomers and crane trucks.',
        pinPos: { top: '68%', left: '74%' },
        systems: [
          { name: 'Underfloor Radiant Heating', status: 'Normal', statusType: 'normal' },
          { name: 'Engine Block Pre-Heaters', status: 'Normal', statusType: 'normal' },
          { name: 'Exhaust Gas Extraction System', status: 'Normal', statusType: 'normal' },
          { name: 'Heavy Hydraulic Lift Rack', status: 'Normal', statusType: 'normal' },
        ],
        maintenance: { lastInspection: '17 May 2025', nextScheduled: '17 Jun 2025', health: '96%', notes: 'Snowcat PB-300 track tension adjusted for hard blue ice.' }
      },
    }
  }
};
