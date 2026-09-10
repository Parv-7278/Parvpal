import math
import random
import time
from datetime import datetime
from typing import Dict, Any, List
from models.schemas import (
    ResearchTelemetryResponse,
    SeismicReading,
    SnowAccumulationData,
    GeomagneticKpIndex,
    CrewVitals,
    CrewBiotelemetry
)

class ResearchService:
    @staticmethod
    def get_research_telemetry(station_id: str) -> ResearchTelemetryResponse:
        s_lower = station_id.lower()
        is_maitri = "maitri" in s_lower
        
        now = datetime.utcnow()
        t_sec = time.time()

        # 1. Seismic Tremor Model (Nanometrics Trillium 120QA Borehole)
        # Maitri: Schirmacher Oasis rocky bed (lower base frequency ~ 1.2 - 2.8 Hz)
        # Bharati: Larsemann Hills coastal maritime ice-shelf calving micro-tremors (~ 2.5 - 6.5 Hz)
        if is_maitri:
            base_hz = 1.8 + 0.4 * math.sin(t_sec / 12.0) + random.uniform(-0.15, 0.15)
            pga = 0.0018 + random.uniform(0.0, 0.0006)
            amp_um = 3.2 + 0.8 * math.cos(t_sec / 8.0)
            seis_status = "NOMINAL_MICROSEISMIC"
            event_class = "TECTONIC_BASEMENT_MICRO_FRACTURE"
            borehole_m = 45.0
            observatory = "Maitri Solid Earth Geomagnetic & Seismic Observatory"
            station_name = "MAITRI"
            actual_station_id = "station-maitri"
        else:
            base_hz = 3.6 + 0.9 * math.sin(t_sec / 7.0) + random.uniform(-0.25, 0.25)
            pga = 0.0042 + random.uniform(0.0, 0.0015)
            amp_um = 6.4 + 1.2 * math.sin(t_sec / 5.0)
            seis_status = "ELEVATED_COASTAL_MICRO_SURGE"
            event_class = "PRYDZ_BAY_ICE_SHELF_TIDAL_FLEXURE"
            borehole_m = 65.0
            observatory = "Bharati Polar Earth & Remote Sensing Marine Observatory"
            station_name = "BHARATI"
            actual_station_id = "station-bharati"

        seismic_obj = SeismicReading(
            station_id=actual_station_id,
            sensor_model="Nanometrics Trillium 120QA High-Gain Seismometer",
            dominant_frequency_hz=round(max(0.1, base_hz), 3),
            peak_ground_acceleration_g=round(pga, 5),
            tremor_amplitude_um=round(amp_um, 2),
            status=seis_status,
            event_classification=event_class,
            borehole_depth_meters=borehole_m
        )

        # 2. Snow Accumulation & Firn Densification (SR50A Acoustic Ultrasound)
        if is_maitri:
            snow_depth_cm = 142.5 + random.uniform(-0.2, 0.4)
            accum_24h = 12.4 + random.uniform(-0.1, 0.3)
            drift_rate = 0.85
            density = 345.0
            firn_temp = -16.4
        else:
            snow_depth_cm = 215.8 + random.uniform(-0.3, 0.6)
            accum_24h = 24.2 + random.uniform(-0.2, 0.5)
            drift_rate = 1.75
            density = 390.0
            firn_temp = -12.8

        snow_obj = SnowAccumulationData(
            station_id=actual_station_id,
            sensor_model="Campbell Scientific SR50A Acoustic Ultrasonic Depth Sensor",
            snowpack_total_depth_cm=round(snow_depth_cm, 1),
            snow_accumulation_24h_cm=round(accum_24h, 1),
            drift_accumulation_rate_cm_per_hr=round(drift_rate, 2),
            snow_density_kg_per_m3=density,
            subsurface_firn_temperature_c=firn_temp
        )

        # 3. Geomagnetic Kp Index & Auroral Activity
        kp_val = 2.33 + 0.5 * math.sin(t_sec / 25.0) + random.uniform(-0.1, 0.1)
        kp_val = max(0.0, min(9.0, kp_val))
        
        if kp_val < 2.0:
            storm_cat = "G0_QUIET"
            aurora = "Faint Polar Diffuse Arc (Low)"
        elif kp_val < 4.0:
            storm_cat = "G1_MINOR_UNSETTLED"
            aurora = "Active Auroral Bands Visible"
        elif kp_val < 6.0:
            storm_cat = "G2_MODERATE_STORM"
            aurora = "Dynamic Corona & Pulsating Rays"
        else:
            storm_cat = "G3_STRONG_GEOMAGNETIC_STORM"
            aurora = "Severe Aurora Australis Corona"

        geomag_obj = GeomagneticKpIndex(
            station_id=actual_station_id,
            sensor_model="Fluxgate Tri-Axial Magnetometer (dIdD)",
            kp_index_current=round(kp_val, 2),
            storm_classification=storm_cat,
            total_magnetic_field_intensity_nt=round(42850.0 + 35.0 * math.sin(t_sec / 15.0), 1),
            horizontal_component_h_nt=round(18620.0 + 15.0 * math.cos(t_sec / 15.0), 1),
            magnetic_declination_deg=-21.4 if is_maitri else 64.8,
            auroral_electrojet_activity=aurora,
            ionospheric_scintillation_s4=round(0.12 + 0.05 * (kp_val / 3.0), 3)
        )

        # 4. Crew Bio-Telemetry (Overwintering Expedition Team Vitals)
        if is_maitri:
            crew_list = [
                CrewVitals(member_id="MTR-01", codename="LEADER-EXP44", role="Station Commander", heart_rate_bpm=72, spo2_percent=98.5, skin_temp_c=34.2, stress_index_score=24, sleep_efficiency_pct=88.0, polar_circadian_alignment="Synchronized", activity_status="Command Operations"),
                CrewVitals(member_id="MTR-02", codename="ENG-POWER-01", role="Chief Energy Engineer", heart_rate_bpm=78, spo2_percent=97.8, skin_temp_c=33.8, stress_index_score=38, sleep_efficiency_pct=82.0, polar_circadian_alignment="Slight Phase Delay", activity_status="Generator Maintenance"),
                CrewVitals(member_id="MTR-03", codename="MED-SURG-01", role="Medical Officer", heart_rate_bpm=68, spo2_percent=99.0, skin_temp_c=34.5, stress_index_score=18, sleep_efficiency_pct=92.0, polar_circadian_alignment="Synchronized", activity_status="Laboratory Analysis"),
                CrewVitals(member_id="MTR-04", codename="SCI-METEO-01", role="Atmospheric Physicist", heart_rate_bpm=74, spo2_percent=98.2, skin_temp_c=33.5, stress_index_score=22, sleep_efficiency_pct=85.0, polar_circadian_alignment="Synchronized", activity_status="Balloon Sounding Prep"),
            ]
            personnel = 24
        else:
            crew_list = [
                CrewVitals(member_id="BHR-01", codename="LEADER-EXP44", role="Station Director", heart_rate_bpm=70, spo2_percent=98.8, skin_temp_c=34.4, stress_index_score=20, sleep_efficiency_pct=90.0, polar_circadian_alignment="Synchronized", activity_status="Radome Mission Control"),
                CrewVitals(member_id="BHR-02", codename="ISRO-RADOME-01", role="Satellite Ground Lead", heart_rate_bpm=76, spo2_percent=98.0, skin_temp_c=34.0, stress_index_score=32, sleep_efficiency_pct=84.0, polar_circadian_alignment="Synchronized", activity_status="RISAT-2B Downlink Tracking"),
                CrewVitals(member_id="BHR-03", codename="OCEAN-CHEM-01", role="Marine Geochemist", heart_rate_bpm=69, spo2_percent=99.1, skin_temp_c=34.2, stress_index_score=19, sleep_efficiency_pct=91.0, polar_circadian_alignment="Synchronized", activity_status="Water Sample Titration"),
                CrewVitals(member_id="BHR-04", codename="ENG-CHP-01", role="CHP Mechanical Engineer", heart_rate_bpm=75, spo2_percent=97.9, skin_temp_c=33.7, stress_index_score=28, sleep_efficiency_pct=86.0, polar_circadian_alignment="Synchronized", activity_status="Desal Skid Calibration"),
            ]
            personnel = 42

        avg_hr = sum(c.heart_rate_bpm for c in crew_list) / len(crew_list)
        avg_spo2 = sum(c.spo2_percent for c in crew_list) / len(crew_list)
        avg_stress = sum(c.stress_index_score for c in crew_list) / len(crew_list)

        crew_obj = CrewBiotelemetry(
            station_id=actual_station_id,
            active_overwintering_personnel=personnel,
            average_heart_rate_bpm=round(avg_hr, 1),
            average_spo2_percent=round(avg_spo2, 1),
            average_stress_index=round(avg_stress, 1),
            hypothermia_alert_count=0,
            crew_members=crew_list
        )

        return ResearchTelemetryResponse(
            station_id=actual_station_id,
            station_name=station_name,
            research_observatory_name=observatory,
            timestamp=now,
            seismic=seismic_obj,
            snow_accumulation=snow_obj,
            geomagnetic_kp=geomag_obj,
            crew_biotelemetry=crew_obj
        )
