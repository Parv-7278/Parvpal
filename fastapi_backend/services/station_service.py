import math
import random
from datetime import datetime
from typing import Dict, Any, List, Optional
from models.schemas import (
    StationMetadata,
    StationHealthResponse,
    SubsystemScore,
    StationModulesResponse,
    DigitalTwinPin,
    BuildingDetail,
    BuildingSystem,
    BuildingMaintenance,
    EnergyFlowResponse,
    EnergySource,
    EnergyBreakdownItem,
    EnergyForecast,
    LogisticsResponse,
    LogisticsItem,
    ResourceTrendData,
    EnvironmentTelemetryResponse,
    SparklineWaveforms
)

# Canonical In-Memory Base Registry for Indian Antarctic Stations
RAW_STATIONS_DATA: Dict[str, Dict[str, Any]] = {
    "station-maitri": {
        "id": "station-maitri",
        "name": "MAITRI",
        "fullName": "Maitri Research Station",
        "country": "India",
        "established": 1989,
        "region": "Schirmacher Oasis, Queen Maud Land",
        "coords": "70° 45′ 57″ S, 11° 44′ 09″ E",
        "status": "Online",
        "statusColor": "#10b981",
        "altitude": "117 m above sea level",
        "environmentType": "Inland Rocky Moraine (Lake Priyadarshini Oasis)",
        "heroImage": "/stations/maitri.jpg",
        "health": {
            "total": 87,
            "rating": "Good",
            "ratingColor": "#10b981",
            "infrastructure": 91,
            "energy": 84,
            "logistics": 89,
            "environment": 78,
            "communication": 94,
        },
        "weather": {
            "temp": "-18.7",
            "unit": "°C",
            "condition": "Light Snow & Katabatic Drift",
            "windSpeed": "28 km/h",
            "windDir": "NW",
            "humidity": "68%",
            "pressure": "987 hPa",
            "visibility": "4.8 km",
            "snowAccumulation": "12 cm",
            "localTime": "19:42",
            "date": "25 May 2025"
        },
        "sparklines": {
            "temp": "M0,14 C15,8 25,20 40,12 C55,4 65,18 80,10 C95,2 105,16 120,8 C130,4 140,12 150,9",
            "wind": "M0,18 C20,12 35,2 50,15 C65,22 80,6 95,14 C110,18 125,5 138,10 C145,12 148,8 150,11",
            "snow": "M0,20 C18,19 32,18 50,15 C70,12 90,14 110,9 C125,7 135,11 150,6",
            "visibility": "M0,8 C15,9 30,12 45,18 C60,22 75,19 90,14 C105,10 120,16 135,13 C142,12 148,15 150,14"
        },
        "energy": {
            "generation": 132.0,
            "consumption": 105.0,
            "surplus": 27.0,
            "batteryPercent": 74.0,
            "batteryChargeKWh": "2,960 kWh",
            "batteryCapacityKWh": "4,000 kWh",
            "fuelLiters": "50,200 L",
            "fuelDays": "43 days",
            "dailyUsageL": "1,160 L",
            "fuelBarPercent": 58.0,
            "sources": {
                "gen1": {"name": "Diesel Generator 1", "current": 42.0, "max": 50.0, "loadPct": 84.0, "runtime": "320 hrs", "status": "Online"},
                "gen2": {"name": "Diesel Generator 2", "current": 38.0, "max": 50.0, "loadPct": 76.0, "runtime": "284 hrs", "status": "Online"},
                "solar": {"name": "Solar Array", "current": 12.0, "max": 20.0, "loadPct": 60.0, "runtime": "Efficiency: 88%", "status": "Online"},
                "wind": {"name": "Wind Turbine", "current": 8.0, "max": 20.0, "loadPct": 40.0, "runtime": "Turbines: 2/2 Active", "status": "Online"}
            },
            "breakdown": [
                {"name": "Buildings", "kw": 44.0, "pct": 42.0, "color": "#0284c7"},
                {"name": "Labs", "kw": 19.0, "pct": 18.0, "color": "#06b6d4"},
                {"name": "HVAC & Thermal", "kw": 16.0, "pct": 15.0, "color": "#f59e0b"},
                {"name": "Lake Intake Thaw", "kw": 8.0, "pct": 8.0, "color": "#10b981"},
                {"name": "Others", "kw": 18.0, "pct": 17.0, "color": "#8b5cf6"}
            ],
            "forecast": {
                "expectedGen": "~ 140 kW/day",
                "genDelta": "↑ 12% vs. current",
                "expectedCons": "~ 120 kW/day",
                "consDelta": "↑ 8% vs. current",
                "batteryReserve": "2.8 days"
            }
        },
        "logistics": [
            {"id": "fuel", "name": "Arctic Diesel Grade A", "amount": "50,200 L", "percent": 58.0, "daysLeft": "43 Days", "barColor": "#f59e0b", "iconColor": "#f87171"},
            {"id": "food", "name": "Rations & Sealed Stores", "amount": "3,250 kg", "percent": 82.0, "daysLeft": "67 Days", "barColor": "#10b981", "iconColor": "#10b981"},
            {"id": "medicine", "name": "Emergency Medical Bay", "amount": "620 kg", "percent": 89.0, "daysLeft": "89 Days", "barColor": "#10b981", "iconColor": "#10b981"},
            {"id": "spare-parts", "name": "Generator & Vehicle Spares", "amount": "1,120 kg", "percent": 74.0, "daysLeft": "55 Days", "barColor": "#10b981", "iconColor": "#10b981"}
        ],
        "resourceTrend": {
            "selectedDefault": "Fuel",
            "unit": "k L",
            "yMax": "75k L",
            "yMid": "50k L",
            "yLow": "25k L",
            "depletionDate": "15 Jul 2025",
            "actualPath": "M 50,48 L 95,58 L 140,68 L 185,78 L 230,88",
            "forecastPath": "M 230,88 L 275,102 L 320,118"
        },
        "pins": [
            {"id": "living-quarters", "name": "Living Quarters", "status": "Normal", "type": "normal", "top": "21%", "left": "36%", "temp": "21.5°C", "power": "24 kW", "pressure": "1013 hPa", "subsystem": "Habitation Module A & B", "notes": "Life support nominal, internal climate regulated."},
            {"id": "power-house", "name": "Power House", "status": "Warning", "type": "warning", "top": "21%", "left": "56%", "temp": "78.4°C", "power": "88 kW", "pressure": "3.2 bar", "subsystem": "Diesel Generator #2 & Hybrid Inverter", "notes": "Generator G-02 vibration anomaly detected. Elevated thermal signature."},
            {"id": "science-lab", "name": "Science Lab", "status": "Normal", "type": "normal", "top": "29%", "left": "45%", "temp": "19.8°C", "power": "18 kW", "pressure": "1012 hPa", "subsystem": "Atmospheric & Geomagnetic Laboratory", "notes": "Spectrometer and polar telemetry acquisition active."},
            {"id": "communication", "name": "Communication Mast", "status": "Normal", "type": "normal", "top": "27%", "left": "71%", "temp": "-4.2°C", "power": "12 kW", "pressure": "Nominal", "subsystem": "X-Band Radome & INMARSAT Uplink", "notes": "Direct satellite link to ISRO/NCPOR Goa locked."},
            {"id": "helipad", "name": "Helipad", "status": "Normal", "type": "normal", "top": "38%", "left": "28%", "temp": "-18.7°C", "power": "4 kW", "pressure": "987 hPa", "subsystem": "Primary Landing Zone (Echo-1)", "notes": "Wind within flight clearance envelope."}
        ],
        "buildings": {
            "main-control": {
                "id": "main-control",
                "name": "Main Control Building",
                "category": "critical",
                "status": "Normal",
                "status_type": "normal",
                "metric_label": "Indoor Temp",
                "metric_val": "21°C",
                "type": "Administration & Command",
                "built_year": "2012",
                "area": "1,200 m²",
                "occupancy": "28 / 30",
                "description": "Houses Maitri's control room, operations centre, IT infrastructure and administrative offices.",
                "pin_pos": {"top": "35%", "left": "45%"},
                "systems": [
                    {"name": "HVAC", "status": "Normal", "status_type": "normal"},
                    {"name": "Power Supply", "status": "Normal", "status_type": "normal"},
                    {"name": "Network Uplink", "status": "Normal", "status_type": "normal"}
                ],
                "maintenance": {
                    "last_inspection": "14 May 2025",
                    "next_scheduled": "28 Jun 2025",
                    "health": "98%",
                    "notes": "Structural foundation integrity confirmed nominal."
                }
            }
        }
    },
    "station-bharati": {
        "id": "station-bharati",
        "name": "BHARATI",
        "fullName": "Bharati Research Station",
        "country": "India",
        "established": 2012,
        "region": "Larsemann Hills, Prydz Bay",
        "coords": "69° 24′ 28″ S, 76° 11′ 14″ E",
        "status": "Online",
        "statusColor": "#10b981",
        "altitude": "35 m above sea level",
        "environmentType": "Coastal Antarctic Promontory (Prydz Bay Maritime)",
        "heroImage": "/stations/bharati.jpg",
        "health": {
            "total": 93,
            "rating": "Optimal",
            "ratingColor": "#10b981",
            "infrastructure": 96,
            "energy": 89,
            "logistics": 94,
            "environment": 91,
            "communication": 98,
        },
        "weather": {
            "temp": "-14.2",
            "unit": "°C",
            "condition": "Blowing Snow & Coastal Mist",
            "windSpeed": "44 km/h",
            "windDir": "ESE",
            "humidity": "82%",
            "pressure": "972 hPa",
            "visibility": "2.1 km",
            "snowAccumulation": "24 cm",
            "localTime": "20:12",
            "date": "25 May 2025"
        },
        "sparklines": {
            "temp": "M0,18 C15,14 25,12 40,8 C55,10 65,6 80,4 C95,9 105,7 120,5 C130,8 140,4 150,6",
            "wind": "M0,8 C20,18 35,22 50,14 C65,8 80,20 95,22 C110,14 125,18 138,20 C145,22 148,18 150,22",
            "snow": "M0,12 C18,14 32,16 50,18 C70,16 90,20 110,22 C125,20 135,24 150,22",
            "visibility": "M0,20 C15,16 30,14 45,10 C60,8 75,12 90,6 C105,8 120,4 135,6 C142,5 148,8 150,6"
        },
        "energy": {
            "generation": 185.0,
            "consumption": 148.0,
            "surplus": 37.0,
            "batteryPercent": 91.0,
            "batteryChargeKWh": "5,460 kWh",
            "batteryCapacityKWh": "6,000 kWh",
            "fuelLiters": "78,500 L",
            "fuelDays": "68 days",
            "dailyUsageL": "1,420 L",
            "fuelBarPercent": 78.0,
            "sources": {
                "gen1": {"name": "CHP Generator 1", "current": 72.0, "max": 90.0, "loadPct": 80.0, "runtime": "410 hrs", "status": "Online"},
                "gen2": {"name": "CHP Generator 2", "current": 65.0, "max": 90.0, "loadPct": 72.0, "runtime": "388 hrs", "status": "Online"},
                "solar": {"name": "Bifacial Solar Farm", "current": 32.0, "max": 45.0, "loadPct": 71.0, "runtime": "Efficiency: 94%", "status": "Online"},
                "wind": {"name": "Coastal Wind Array", "current": 16.0, "max": 30.0, "loadPct": 53.0, "runtime": "Turbines: 4/4 Active", "status": "Online"}
            },
            "breakdown": [
                {"name": "Satellite Radome", "kw": 50.0, "pct": 34.0, "color": "#0284c7"},
                {"name": "Main Habitat Complex", "kw": 41.0, "pct": 28.0, "color": "#06b6d4"},
                {"name": "Seawater Desalination", "kw": 24.0, "pct": 16.0, "color": "#10b981"},
                {"name": "Ocean Science Labs", "kw": 21.0, "pct": 14.0, "color": "#f59e0b"},
                {"name": "Runway Lighting Deck", "kw": 12.0, "pct": 8.0, "color": "#8b5cf6"}
            ],
            "forecast": {
                "expectedGen": "~ 195 kW/day",
                "genDelta": "↑ 15% vs. current",
                "expectedCons": "~ 155 kW/day",
                "consDelta": "↑ 5% vs. current",
                "batteryReserve": "4.2 days"
            }
        },
        "logistics": [
            {"id": "fuel", "name": "Arctic Diesel Grade A", "amount": "78,500 L", "percent": 78.0, "daysLeft": "68 Days", "barColor": "#10b981", "iconColor": "#f87171"},
            {"id": "food", "name": "Deep-Freeze Rations", "amount": "4,800 kg", "percent": 90.0, "daysLeft": "95 Days", "barColor": "#10b981", "iconColor": "#10b981"},
            {"id": "medicine", "name": "Medical & Surgical Bay", "amount": "950 kg", "percent": 95.0, "daysLeft": "120 Days", "barColor": "#10b981", "iconColor": "#10b981"},
            {"id": "spare-parts", "name": "Heavy Spares & Radome Avionics", "amount": "2,400 kg", "percent": 88.0, "daysLeft": "80 Days", "barColor": "#10b981", "iconColor": "#10b981"}
        ],
        "resourceTrend": {
            "selectedDefault": "Fuel",
            "unit": "k L",
            "yMax": "100k L",
            "yMid": "75k L",
            "yLow": "50k L",
            "depletionDate": "28 Aug 2025",
            "actualPath": "M 50,38 L 95,44 L 140,50 L 185,58 L 230,64",
            "forecastPath": "M 230,64 L 275,76 L 320,88"
        },
        "pins": [
            {"id": "bharati-main", "name": "Main Elevated Habitat", "status": "Normal", "type": "normal", "top": "25%", "left": "52%", "temp": "22.0°C", "power": "45 kW", "pressure": "1014 hPa", "subsystem": "Elevated 3-Story Habitat", "notes": "Aerodynamic steel stilt structure nominal."},
            {"id": "bharati-radome", "name": "Satellite Ground Station", "status": "Normal", "type": "normal", "top": "18%", "left": "58%", "temp": "-8.0°C", "power": "22 kW", "pressure": "Nominal", "subsystem": "Earth Observation Relay", "notes": "Tracking polar orbit Cartosat/Oceansat satellites."},
            {"id": "bharati-power", "name": "CHP Power Generation", "status": "Normal", "type": "normal", "top": "55%", "left": "70%", "temp": "74.1°C", "power": "72 kW", "pressure": "3.6 bar", "subsystem": "Combined Heat & Power Unit", "notes": "Primary CHP unit operating at optimal thermal balance."},
            {"id": "bharati-desal", "name": "Seawater Desalination", "status": "Normal", "type": "normal", "top": "65%", "left": "42%", "temp": "16.5°C", "power": "24 kW", "pressure": "5.2 bar", "subsystem": "Marine Reverse Osmosis Plant", "notes": "Direct seawater intake protected with anti-freeze heaters."}
        ],
        "buildings": {
            "bharati-main": {
                "id": "bharati-main",
                "name": "Main Elevated Habitat",
                "category": "critical",
                "status": "Normal",
                "status_type": "normal",
                "metric_label": "Indoor Temp",
                "metric_val": "22°C",
                "type": "3-Story Elevated Habitat",
                "built_year": "2012",
                "area": "2,162 m²",
                "occupancy": "42 / 47",
                "description": "Aerodynamic stilted habitat containing residential suites, operational control, medical hospital, and labs.",
                "pin_pos": {"top": "35%", "left": "50%"},
                "systems": [
                    {"name": "Aerodynamic Stilt Damper", "status": "Normal", "status_type": "normal"},
                    {"name": "Integrated CHP Heating", "status": "Normal", "status_type": "normal"},
                    {"name": "Fire Matrix", "status": "Normal", "status_type": "normal"}
                ],
                "maintenance": {
                    "last_inspection": "16 May 2025",
                    "next_scheduled": "30 Jun 2025",
                    "health": "99%",
                    "notes": "Underfloor wind deflection surfaces inspected."
                }
            }
        }
    }
}

class StationService:
    @staticmethod
    def normalize_station_id(station_id: str) -> str:
        s = station_id.lower().strip()
        if "maitri" in s:
            return "station-maitri"
        if "bharati" in s:
            return "station-bharati"
        return "station-maitri"

    @classmethod
    def get_raw_station_data(cls, station_id: str) -> Dict[str, Any]:
        norm_id = cls.normalize_station_id(station_id)
        return RAW_STATIONS_DATA.get(norm_id, RAW_STATIONS_DATA["station-maitri"])

    @classmethod
    def get_all_stations(cls) -> List[StationMetadata]:
        result = []
        for s_id, s_data in RAW_STATIONS_DATA.items():
            result.append(
                StationMetadata(
                    id=s_data["id"],
                    name=s_data["name"],
                    full_name=s_data["fullName"],
                    country=s_data["country"],
                    established=s_data["established"],
                    region=s_data["region"],
                    coords=s_data["coords"],
                    status=s_data["status"],
                    status_color=s_data["statusColor"],
                    altitude=s_data["altitude"],
                    environment_type=s_data["environmentType"],
                    hero_image=s_data.get("heroImage")
                )
            )
        return result

    @classmethod
    def get_health_index(cls, station_id: str) -> StationHealthResponse:
        data = cls.get_raw_station_data(station_id)
        health = data["health"]
        
        subsystems = [
            SubsystemScore(id="infrastructure", label="Infrastructure", score=health["infrastructure"], status="Nominal", color="#10b981"),
            SubsystemScore(id="energy", label="Energy Grid", score=health["energy"], status="Nominal", color="#10b981" if health["energy"] >= 85 else "#a3e635"),
            SubsystemScore(id="logistics", label="Logistics & Stores", score=health["logistics"], status="Nominal", color="#10b981"),
            SubsystemScore(id="environment", label="Environmental Systems", score=health["environment"], status="Nominal", color="#10b981" if health["environment"] >= 90 else "#facc15"),
            SubsystemScore(id="communication", label="Satellite Link", score=health["communication"], status="Optimal", color="#10b981"),
        ]

        return StationHealthResponse(
            station_id=data["id"],
            station_name=data["name"],
            total_score=health["total"],
            rating=health["rating"],
            rating_color=health["ratingColor"],
            infrastructure=health["infrastructure"],
            energy=health["energy"],
            logistics=health["logistics"],
            environment=health["environment"],
            communication=health["communication"],
            subsystems=subsystems,
            timestamp=datetime.utcnow()
        )

    @classmethod
    def get_3d_modules(cls, station_id: str) -> StationModulesResponse:
        data = cls.get_raw_station_data(station_id)
        pins = [DigitalTwinPin(**p) for p in data.get("pins", [])]
        
        buildings_map = {}
        for b_id, b_raw in data.get("buildings", {}).items():
            systems = [BuildingSystem(**sys) for sys in b_raw.get("systems", [])]
            maint = BuildingMaintenance(**b_raw["maintenance"]) if "maintenance" in b_raw else None
            buildings_map[b_id] = BuildingDetail(
                id=b_raw["id"],
                name=b_raw["name"],
                category=b_raw.get("category", "critical"),
                status=b_raw["status"],
                status_type=b_raw["status_type"],
                metric_label=b_raw["metric_label"],
                metric_val=b_raw["metric_val"],
                type=b_raw["type"],
                built_year=b_raw["built_year"],
                area=b_raw["area"],
                occupancy=b_raw["occupancy"],
                description=b_raw["description"],
                pin_pos=b_raw.get("pin_pos"),
                systems=systems,
                maintenance=maint
            )

        return StationModulesResponse(
            station_id=data["id"],
            station_name=data["name"],
            pins_count=len(pins),
            pins=pins,
            buildings=buildings_map,
            timestamp=datetime.utcnow()
        )

    @classmethod
    def get_energy_flow(cls, station_id: str) -> EnergyFlowResponse:
        data = cls.get_raw_station_data(station_id)
        eng = data["energy"]
        
        sources_dict = {}
        for k, v in eng.get("sources", {}).items():
            sources_dict[k] = EnergySource(
                name=v["name"],
                current_kw=float(v["current"]),
                max_kw=float(v["max"]),
                load_pct=float(v["loadPct"]),
                runtime=v["runtime"],
                status=v["status"]
            )
        
        breakdown_list = [
            EnergyBreakdownItem(
                name=item["name"],
                kw=float(item["kw"]),
                pct=float(item["pct"]),
                color=item["color"]
            )
            for item in eng.get("breakdown", [])
        ]

        fc = eng["forecast"]
        forecast_obj = EnergyForecast(
            expected_gen=fc["expectedGen"],
            gen_delta=fc["genDelta"],
            expected_cons=fc["expectedCons"],
            cons_delta=fc["consDelta"],
            battery_reserve=fc["batteryReserve"]
        )

        return EnergyFlowResponse(
            station_id=data["id"],
            station_name=data["name"],
            generation_kw=float(eng["generation"]),
            consumption_kw=float(eng["consumption"]),
            surplus_kw=float(eng["surplus"]),
            battery_percent=float(eng["batteryPercent"]),
            battery_charge_kwh=eng["batteryChargeKWh"],
            battery_capacity_kwh=eng["batteryCapacityKWh"],
            fuel_liters=eng["fuelLiters"],
            fuel_days=eng["fuelDays"],
            daily_usage_liters=eng["dailyUsageL"],
            fuel_bar_percent=float(eng["fuelBarPercent"]),
            sources=sources_dict,
            breakdown=breakdown_list,
            forecast=forecast_obj,
            timestamp=datetime.utcnow()
        )

    @classmethod
    def get_logistics_inventory(cls, station_id: str) -> LogisticsResponse:
        data = cls.get_raw_station_data(station_id)
        items = [
            LogisticsItem(
                id=item["id"],
                name=item["name"],
                amount=item["amount"],
                percent=float(item["percent"]),
                days_left=item["daysLeft"],
                bar_color=item["barColor"],
                icon_color=item["iconColor"]
            )
            for item in data.get("logistics", [])
        ]
        
        rt = data.get("resourceTrend", {})
        trend_obj = ResourceTrendData(
            selected_default=rt.get("selectedDefault", "Fuel"),
            unit=rt.get("unit", "k L"),
            y_max=rt.get("yMax", "75k L"),
            y_mid=rt.get("yMid", "50k L"),
            y_low=rt.get("yLow", "25k L"),
            depletion_date=rt.get("depletionDate", "15 Jul 2025"),
            actual_path=rt.get("actualPath", ""),
            forecast_path=rt.get("forecastPath", "")
        )

        return LogisticsResponse(
            station_id=data["id"],
            station_name=data["name"],
            items=items,
            resource_trend=trend_obj,
            timestamp=datetime.utcnow()
        )

    @classmethod
    def get_environment_telemetry(cls, station_id: str) -> EnvironmentTelemetryResponse:
        data = cls.get_raw_station_data(station_id)
        w = data["weather"]
        sp = data.get("sparklines", {})
        spark_obj = SparklineWaveforms(
            temp=sp.get("temp", ""),
            wind=sp.get("wind", ""),
            snow=sp.get("snow", ""),
            visibility=sp.get("visibility", "")
        )

        return EnvironmentTelemetryResponse(
            station_id=data["id"],
            station_name=data["name"],
            temp_c=w["temp"],
            condition=w["condition"],
            wind_speed_kmh=w["windSpeed"],
            wind_dir=w["windDir"],
            humidity_pct=w["humidity"],
            pressure_hpa=w["pressure"],
            visibility_km=w["visibility"],
            snow_accumulation_cm=w["snowAccumulation"],
            local_time=w["localTime"],
            date_str=w["date"],
            sparklines=spark_obj,
            timestamp=datetime.utcnow()
        )
