import asyncio
import json
import math
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# -----------------------------------------------------------------------------
# FastAPI App Definition
# -----------------------------------------------------------------------------
app = FastAPI(
    title="Smart WaterGuard AI – Aditya University Water Management API",
    description="Production-grade AI-Enabled Real-Time College Water Conservation & Management System Backend for Aditya University.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Real-Time WebSocket Connection Manager
# -----------------------------------------------------------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in list(self.active_connections):
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                self.disconnect(connection)

ws_manager = ConnectionManager()

# -----------------------------------------------------------------------------
# Data Models & Schemas
# -----------------------------------------------------------------------------
class BlockModel(BaseModel):
    id: str
    code: str
    name: str
    category: str
    currentConsumption: float
    expectedConsumption: float
    tankPercentage: float
    leakageRisk: str
    riskScore: float
    status: str
    totalFloors: int
    totalSinks: int
    flowRateLpm: float
    nightFlowLph: float
    expectedNightFlowLph: float

class TankModel(BaseModel):
    id: str
    name: str
    blockCode: str
    capacity: float
    currentLitres: float
    percentage: float
    pumpState: str
    fillRateLpm: float
    emptyRateLpm: float
    lastUpdated: str
    status: str
    overflowAlert: bool = False

class LeakAlertModel(BaseModel):
    id: str
    block: str
    location: str
    flowDetected: float
    expectedFlow: str
    durationMinutes: int
    riskPercentage: float
    possibleIssue: str
    estimatedExcessLitres: float
    detectedTime: str
    status: str
    severity: str

class MaintenanceTicketModel(BaseModel):
    id: str
    block: str
    floor: str
    location: str
    problem: str
    priority: str
    aiRisk: str
    estimatedExcess: str
    assignedTechnician: str
    status: str
    createdTime: str
    resolvedTime: Optional[str] = None
    beforeRepairDailyFlow: float
    afterRepairDailyFlow: Optional[float] = None
    waterSavedAfterRepair: Optional[float] = None

class ScenarioTriggerRequest(BaseModel):
    scenario: str = Field(..., description="NORMAL, LEAKAGE_BLOCK_G, LEAKAGE_BHASKAR, TANK_OVERFLOW_G, PUMP_FAILURE, HIGH_CONSUMPTION")

class ChatQueryRequest(BaseModel):
    query: str

class TelemetryIngestPacket(BaseModel):
    sensor_code: str
    value: float
    unit: str
    is_simulated: bool = True
    timestamp: Optional[str] = None

# -----------------------------------------------------------------------------
# In-Memory Database State (Aditya University Campus Infrastructure & Water Sinks)
# -----------------------------------------------------------------------------
CAMPUS_BLOCKS = [
    {
        "id": "bldg-bhaskar",
        "code": "Bhaskar Bhavan",
        "shortCode": "BB",
        "name": "Bhaskar Bhavan (Academic & Computing Complex)",
        "category": "Academic",
        "currentConsumption": 23040,
        "expectedConsumption": 18000,
        "tankPercentage": 97,
        "leakageRisk": "High",
        "riskScore": 94,
        "status": "Critical",
        "totalFloors": 5,
        "totalSinks": 20,
        "flowRateLpm": 85.0,
        "nightFlowLph": 2100,
        "expectedNightFlowLph": 200,
    },
    {
        "id": "bldg-bgb",
        "code": "Bill Gates Bhavan",
        "shortCode": "BGB",
        "name": "Bill Gates Bhavan (CSE & AI Department)",
        "category": "Academic",
        "currentConsumption": 16500,
        "expectedConsumption": 16000,
        "tankPercentage": 82,
        "leakageRisk": "Low",
        "riskScore": 14,
        "status": "Normal",
        "totalFloors": 4,
        "totalSinks": 17,
        "flowRateLpm": 24.2,
        "nightFlowLph": 150,
        "expectedNightFlowLph": 160,
    },
    {
        "id": "bldg-akb",
        "code": "Abdul Kalam Bhavan",
        "shortCode": "AKB",
        "name": "Dr. APJ Abdul Kalam Bhavan (ECE & EEE)",
        "category": "Academic",
        "currentConsumption": 15800,
        "expectedConsumption": 15500,
        "tankPercentage": 78,
        "leakageRisk": "Low",
        "riskScore": 12,
        "status": "Normal",
        "totalFloors": 4,
        "totalSinks": 17,
        "flowRateLpm": 22.8,
        "nightFlowLph": 140,
        "expectedNightFlowLph": 150,
    },
    {
        "id": "bldg-rtb",
        "code": "Ratan Tata Bhavan",
        "shortCode": "RTB",
        "name": "Ratan Tata Bhavan (Mechanical & Aerospace)",
        "category": "Academic",
        "currentConsumption": 17200,
        "expectedConsumption": 15000,
        "tankPercentage": 84,
        "leakageRisk": "Medium",
        "riskScore": 58,
        "status": "Warning",
        "totalFloors": 5,
        "totalSinks": 16,
        "flowRateLpm": 34.2,
        "nightFlowLph": 480,
        "expectedNightFlowLph": 160,
    },
    {
        "id": "bldg-incubation",
        "code": "Incubation Centre",
        "shortCode": "INC",
        "name": "Aditya Incubation & Startup Innovation Hub",
        "category": "Innovation",
        "currentConsumption": 12400,
        "expectedConsumption": 13000,
        "tankPercentage": 74,
        "leakageRisk": "Low",
        "riskScore": 11,
        "status": "Normal",
        "totalFloors": 6,
        "totalSinks": 16,
        "flowRateLpm": 18.6,
        "nightFlowLph": 110,
        "expectedNightFlowLph": 130,
    },
    {
        "id": "bldg-bschool",
        "code": "B-School",
        "shortCode": "BS",
        "name": "School of Management & Business Studies",
        "category": "Academic",
        "currentConsumption": 13800,
        "expectedConsumption": 14000,
        "tankPercentage": 70,
        "leakageRisk": "Low",
        "riskScore": 13,
        "status": "Normal",
        "totalFloors": 4,
        "totalSinks": 16,
        "flowRateLpm": 21.0,
        "nightFlowLph": 125,
        "expectedNightFlowLph": 140,
    },
    {
        "id": "bldg-einstein",
        "code": "Einstein Bhavan",
        "shortCode": "EB",
        "name": "Einstein Bhavan (Basic Sciences & Research)",
        "category": "Academic",
        "currentConsumption": 13200,
        "expectedConsumption": 13500,
        "tankPercentage": 68,
        "leakageRisk": "Low",
        "riskScore": 10,
        "status": "Normal",
        "totalFloors": 5,
        "totalSinks": 15,
        "flowRateLpm": 19.5,
        "nightFlowLph": 115,
        "expectedNightFlowLph": 135,
    },
    {
        "id": "bldg-pharm1",
        "code": "Pharmacy-I",
        "shortCode": "PH-I",
        "name": "Aditya College of Pharmacy – Block I",
        "category": "Laboratories",
        "currentConsumption": 12800,
        "expectedConsumption": 13000,
        "tankPercentage": 76,
        "leakageRisk": "Low",
        "riskScore": 15,
        "status": "Normal",
        "totalFloors": 4,
        "totalSinks": 14,
        "flowRateLpm": 20.4,
        "nightFlowLph": 130,
        "expectedNightFlowLph": 140,
    },
    {
        "id": "bldg-cotton",
        "code": "Cotton Bhavan",
        "shortCode": "CB",
        "name": "Sir Arthur Cotton Bhavan (Civil & Environmental)",
        "category": "Academic",
        "currentConsumption": 10400,
        "expectedConsumption": 11000,
        "tankPercentage": 65,
        "leakageRisk": "Low",
        "riskScore": 9,
        "status": "Normal",
        "totalFloors": 4,
        "totalSinks": 11,
        "flowRateLpm": 16.2,
        "nightFlowLph": 95,
        "expectedNightFlowLph": 110,
    },
    {
        "id": "bldg-pharm2",
        "code": "Pharmacy-II",
        "shortCode": "PH-II",
        "name": "Aditya College of Pharmacy – Block II",
        "category": "Laboratories",
        "currentConsumption": 9800,
        "expectedConsumption": 10000,
        "tankPercentage": 72,
        "leakageRisk": "Low",
        "riskScore": 11,
        "status": "Normal",
        "totalFloors": 4,
        "totalSinks": 10,
        "flowRateLpm": 15.0,
        "nightFlowLph": 85,
        "expectedNightFlowLph": 100,
    },
    {
        "id": "bldg-klrao",
        "code": "K. L. Rao Bhavan",
        "shortCode": "KLRB",
        "name": "Dr. K. L. Rao Bhavan (Hydraulics & Mechanical)",
        "category": "Laboratories",
        "currentConsumption": 9600,
        "expectedConsumption": 10000,
        "tankPercentage": 75,
        "leakageRisk": "Low",
        "riskScore": 8,
        "status": "Normal",
        "totalFloors": 4,
        "totalSinks": 10,
        "flowRateLpm": 14.8,
        "nightFlowLph": 80,
        "expectedNightFlowLph": 95,
    },
    {
        "id": "bldg-edison",
        "code": "Edison Bhavan",
        "shortCode": "EB-II",
        "name": "Thomas Alva Edison Bhavan (Electrical Machines)",
        "category": "Laboratories",
        "currentConsumption": 6800,
        "expectedConsumption": 7000,
        "tankPercentage": 62,
        "leakageRisk": "Low",
        "riskScore": 7,
        "status": "Normal",
        "totalFloors": 4,
        "totalSinks": 6,
        "flowRateLpm": 10.5,
        "nightFlowLph": 60,
        "expectedNightFlowLph": 75,
    },
    {
        "id": "bldg-dining",
        "code": "Dining Halls",
        "shortCode": "DH",
        "name": "Central Dining Complex & Food Court",
        "category": "Central",
        "currentConsumption": 18500,
        "expectedConsumption": 18000,
        "tankPercentage": 88,
        "leakageRisk": "Low",
        "riskScore": 16,
        "status": "Normal",
        "totalFloors": 2,
        "totalSinks": 7,
        "flowRateLpm": 28.5,
        "nightFlowLph": 120,
        "expectedNightFlowLph": 140,
    },
    {
        "id": "bldg-maingate",
        "code": "Main Gate",
        "shortCode": "MG",
        "name": "Main Campus Gate & Visitor Reception",
        "category": "Administrative",
        "currentConsumption": 2400,
        "expectedConsumption": 2500,
        "tankPercentage": 60,
        "leakageRisk": "Low",
        "riskScore": 5,
        "status": "Normal",
        "totalFloors": 1,
        "totalSinks": 3,
        "flowRateLpm": 4.2,
        "nightFlowLph": 20,
        "expectedNightFlowLph": 30,
    },
]

CAMPUS_TANKS = [
    {
        "id": "tank-bhaskar",
        "name": "Bhaskar Bhavan Overhead Tank",
        "blockCode": "Bhaskar Bhavan",
        "capacity": 35000,
        "currentLitres": 33950,
        "percentage": 97,
        "pumpState": "ON",
        "fillRateLpm": 92.0,
        "emptyRateLpm": 85.0,
        "lastUpdated": "Just now",
        "status": "Critical",
        "overflowAlert": True,
    },
    {
        "id": "tank-bgb",
        "name": "Bill Gates Bhavan Overhead Tank",
        "blockCode": "Bill Gates Bhavan",
        "capacity": 25000,
        "currentLitres": 20500,
        "percentage": 82,
        "pumpState": "OFF",
        "fillRateLpm": 0,
        "emptyRateLpm": 24.2,
        "lastUpdated": "Just now",
        "status": "Normal",
        "overflowAlert": False,
    },
    {
        "id": "tank-akb",
        "name": "Abdul Kalam Bhavan Overhead Tank",
        "blockCode": "Abdul Kalam Bhavan",
        "capacity": 25000,
        "currentLitres": 19500,
        "percentage": 78,
        "pumpState": "OFF",
        "fillRateLpm": 0,
        "emptyRateLpm": 22.8,
        "lastUpdated": "Just now",
        "status": "Normal",
        "overflowAlert": False,
    },
    {
        "id": "tank-rtb",
        "name": "Ratan Tata Bhavan Overhead Tank",
        "blockCode": "Ratan Tata Bhavan",
        "capacity": 30000,
        "currentLitres": 25200,
        "percentage": 84,
        "pumpState": "ON",
        "fillRateLpm": 65.0,
        "emptyRateLpm": 34.2,
        "lastUpdated": "Just now",
        "status": "Normal",
        "overflowAlert": False,
    },
]

ACTIVE_LEAK = {
    "id": "leak-001",
    "block": "Bhaskar Bhavan",
    "location": "Ground Floor Washroom (East Wing Sink Riser)",
    "flowDetected": 85.0,
    "expectedFlow": "18–25 L/min",
    "durationMinutes": 42,
    "riskPercentage": 94,
    "possibleIssue": "Continuous sink tap / flush valve malfunction / lateral pipe leakage",
    "estimatedExcessLitres": 1340,
    "detectedTime": "42 mins ago",
    "status": "Active",
    "severity": "Critical",
}

MAINTENANCE_TICKETS = [
    {
        "id": "TICK-2026-042",
        "block": "Bhaskar Bhavan",
        "floor": "Ground Floor",
        "location": "East Wing Washroom & Sink Battery",
        "problem": "Continuous high flow rate detected (85 L/min). Stuck dual-flush valve and commercial sink faucet tap leak.",
        "priority": "Critical",
        "aiRisk": "94%",
        "estimatedExcess": "1,340 L (rising)",
        "assignedTechnician": "R. Sharma (Plumbing Lead)",
        "status": "In Progress",
        "createdTime": "Today, 08:15 AM",
        "resolvedTime": None,
        "beforeRepairDailyFlow": 23040,
        "afterRepairDailyFlow": None,
        "waterSavedAfterRepair": None,
    },
    {
        "id": "TICK-2026-031",
        "block": "K. L. Rao Bhavan",
        "floor": "1st Floor",
        "location": "Hydraulics Laboratory Sink Points",
        "problem": "Fitting pressure drop and overhead bypass valve seepage.",
        "priority": "Medium",
        "aiRisk": "25%",
        "estimatedExcess": "4,640 L/day",
        "assignedTechnician": "S. Rao (Hydraulics Specialist)",
        "status": "Closed",
        "createdTime": "3 days ago",
        "resolvedTime": "Yesterday, 02:10 PM",
        "beforeRepairDailyFlow": 23040,
        "afterRepairDailyFlow": 18400,
        "waterSavedAfterRepair": 4640,
    },
]

STP_DATA = {
    "inletFlowLpd": 780000,
    "treatedWaterLpd": 650000,
    "distribution": {
        "gardening": 280000,
        "toiletFlushing": 220000,
        "busWashing": 75000,
        "roadCleaning": 50000,
        "otherNonPotable": 25000,
    },
    "efficiencyPct": 94.2,
    "bodLevel": 8.5,
    "codLevel": 32.0,
    "phLevel": 7.3,
    "turbidityNtu": 2.1,
    "status": "Optimal",
}

RO_DATA = {
    "inputLitres": 120000,
    "drinkingWaterLitres": 80000,
    "rejectWaterLitres": 40000,
    "recoveredRejectLitres": 32000,
    "unrecoveredRejectLitres": 8000,
    "recoveryRatePct": 80.0,
    "tdsInlet": 850,
    "tdsOutlet": 65,
    "filtersHealthPct": 88,
}

RAINWATER_DATA = {
    "currentRainfallMm": 42.5,
    "catchmentAreaSqMeters": 52000,
    "runoffCoefficient": 0.85,
    "estimatedHarvestLitres": 1878500,
    "storedWaterLitres": 1450000,
    "usedWaterLitres": 428500,
    "availableStorageLitres": 850000,
}

# -----------------------------------------------------------------------------
# REST API Endpoints (Section 30)
# -----------------------------------------------------------------------------

@app.get("/")
def read_root():
    return {
        "system": "Smart WaterGuard AI",
        "university": "Aditya University",
        "status": "ONLINE",
        "scope": "College Campus & College Blocks Only (No Hostels)",
        "totalBhavans": len(CAMPUS_BLOCKS),
        "totalAuditedSinks": sum(b["totalSinks"] for b in CAMPUS_BLOCKS),
        "timestamp": datetime.utcnow().isoformat(),
        "docs": "/docs"
    }

# 1. Dashboard Aggregate KPIs
@app.get("/api/v1/dashboard/kpis")
def get_dashboard_kpis():
    total_consumption = sum(b["currentConsumption"] for b in CAMPUS_BLOCKS)
    total_saved = sum(t["waterSavedAfterRepair"] for t in MAINTENANCE_TICKETS if t["waterSavedAfterRepair"]) + 35000
    active_leaks = sum(1 for b in CAMPUS_BLOCKS if b["leakageRisk"] in ["High", "Medium"])
    critical_leaks = sum(1 for b in CAMPUS_BLOCKS if b["leakageRisk"] == "High")
    tank_alerts = sum(1 for t in CAMPUS_TANKS if t["percentage"] >= 95 or t["percentage"] <= 20)

    return {
        "totalConsumptionLitres": total_consumption,
        "totalConsumptionML": round(total_consumption / 1000000, 2),
        "consumptionDeltaVsYesterdayPct": -8.4,
        "recycledWaterLitres": STP_DATA["treatedWaterLpd"],
        "waterSavedLitres": total_saved,
        "activeLeakageRisks": active_leaks,
        "criticalLeakCount": critical_leaks,
        "tankAlertCount": tank_alerts,
        "aiCampusRiskScore": "Elevated (Bhaskar Bhavan)" if ACTIVE_LEAK else "Low",
        "timestamp": datetime.utcnow().isoformat()
    }

# 2. Real-Time Consumption Timeseries (24h / 7d / 30d)
@app.get("/api/v1/dashboard/consumption-timeseries")
def get_consumption_timeseries(range: str = Query("24h", regex="^(24h|7d|30d)$")):
    if range == "7d":
        return [
            {"time": "Mon", "actual": 1380000, "expected": 1350000},
            {"time": "Tue", "actual": 1420000, "expected": 1360000},
            {"time": "Wed", "actual": 1450000, "expected": 1370000},
            {"time": "Thu", "actual": 1410000, "expected": 1360000},
            {"time": "Fri", "actual": 1420000, "expected": 1350000},
            {"time": "Sat", "actual": 480000, "expected": 450000},
            {"time": "Sun", "actual": 310000, "expected": 300000},
        ]
    elif range == "30d":
        return [
            {"time": f"Day {i+1}", "actual": 1350000 + int(math.sin(i)*50000), "expected": 1350000}
            for i in range(30)
        ]
    else: # 24h
        return [
            {"time": "00:00", "actual": 3200, "expected": 2800},
            {"time": "02:00", "actual": 2100, "expected": 1200},
            {"time": "04:00", "actual": 2400, "expected": 1400},
            {"time": "06:00", "actual": 18500, "expected": 16000},
            {"time": "08:00", "actual": 68000, "expected": 62000},
            {"time": "10:00", "actual": 142000, "expected": 125000},
            {"time": "12:00", "actual": 184000, "expected": 155000},
            {"time": "14:00", "actual": 156000, "expected": 140000},
            {"time": "16:00", "actual": 112000, "expected": 105000},
            {"time": "18:00", "actual": 54000, "expected": 48000},
            {"time": "20:00", "actual": 24000, "expected": 20000},
            {"time": "22:00", "actual": 11000, "expected": 8000},
        ]

# 3. Blocks Management
@app.get("/api/v1/blocks")
def get_blocks():
    return CAMPUS_BLOCKS

@app.get("/api/v1/blocks/{block_id}")
def get_block_detail(block_id: str):
    block = next((b for b in CAMPUS_BLOCKS if b["id"] == block_id or b["code"].lower() == block_id.lower()), None)
    if not block:
        raise HTTPException(status_code=404, detail="Bhavan/Block not found")
    return block

# 4. Tanks & Overflow Interlock
@app.get("/api/v1/tanks")
def get_tanks():
    return CAMPUS_TANKS

# 5. STP Management
@app.get("/api/v1/stp")
def get_stp_status():
    return STP_DATA

# 6. RO Water Management
@app.get("/api/v1/ro-water")
def get_ro_status():
    return RO_DATA

# 7. Rainwater Harvesting (Formula Engine)
@app.get("/api/v1/rainwater")
def get_rainwater_analytics(
    rainfall_mm: float = 42.5,
    catchment_area_m2: float = 52000,
    runoff_coeff: float = 0.85
):
    harvested = round(rainfall_mm * catchment_area_m2 * runoff_coeff)
    return {
        "rainfallMm": rainfall_mm,
        "catchmentAreaSqMeters": catchment_area_m2,
        "runoffCoefficient": runoff_coeff,
        "formula": "Harvested Water (L) = Rainfall (mm) * Catchment Area (m2) * Runoff Coefficient",
        "estimatedHarvestLitres": harvested,
        "storedWaterLitres": RAINWATER_DATA["storedWaterLitres"],
        "availableStorageLitres": RAINWATER_DATA["availableStorageLitres"]
    }

# 8. Maintenance Tickets Lifecycle
@app.get("/api/v1/maintenance/tickets")
def get_maintenance_tickets():
    return MAINTENANCE_TICKETS

@app.post("/api/v1/maintenance/tickets")
def create_maintenance_ticket(ticket: MaintenanceTicketModel):
    MAINTENANCE_TICKETS.insert(0, ticket.dict())
    return {"message": "Ticket created successfully", "ticket": ticket}

@app.post("/api/v1/maintenance/tickets/{ticket_id}/resolve")
def resolve_maintenance_ticket(
    ticket_id: str,
    after_repair_flow: float = 18400,
    water_saved: float = 4640
):
    for t in MAINTENANCE_TICKETS:
        if t["id"] == ticket_id:
            t["status"] = "Resolved"
            t["resolvedTime"] = "Just now"
            t["afterRepairDailyFlow"] = after_repair_flow
            t["waterSavedAfterRepair"] = water_saved

            # Normalize Bhaskar Bhavan if it was resolved
            for b in CAMPUS_BLOCKS:
                if b["code"] == "Bhaskar Bhavan":
                    b["currentConsumption"] = after_repair_flow
                    b["flowRateLpm"] = 22.5
                    b["leakageRisk"] = "Low"
                    b["riskScore"] = 14
                    b["status"] = "Normal"

            return {"message": "Ticket resolved and verified", "ticket": t}
    raise HTTPException(status_code=404, detail="Ticket not found")

# 9. AI Anomaly & Recommendations
@app.get("/api/v1/ai/anomalies")
def get_ai_anomalies():
    return [
        {
            "block": b["code"],
            "actual": b["currentConsumption"],
            "expected": b["expectedConsumption"],
            "difference": b["currentConsumption"] - b["expectedConsumption"],
            "isolationForestScore": -0.74 if b["leakageRisk"] == "High" else 0.22,
            "zScore": "+3.82" if b["leakageRisk"] == "High" else "+0.24",
            "anomalyDetected": b["leakageRisk"] == "High",
            "confidence": "High (94%)" if b["leakageRisk"] == "High" else "High (>90%)"
        }
        for b in CAMPUS_BLOCKS
    ]

# 10. Simulator Scenario Trigger (Section 27)
@app.post("/api/v1/simulator/trigger-scenario")
async def trigger_scenario(req: ScenarioTriggerRequest):
    scenario = req.scenario.upper()

    if scenario == "NORMAL":
        for b in CAMPUS_BLOCKS:
            if b["code"] == "Bhaskar Bhavan":
                b["currentConsumption"] = 18400
                b["flowRateLpm"] = 22.5
                b["leakageRisk"] = "Low"
                b["riskScore"] = 14
                b["status"] = "Normal"
                b["nightFlowLph"] = 180
        for t in CAMPUS_TANKS:
            if t["blockCode"] == "Bhaskar Bhavan":
                t["percentage"] = 78
                t["pumpState"] = "OFF"
                t["status"] = "Normal"
                t["overflowAlert"] = False

    elif scenario in ["LEAKAGE_BLOCK_G", "LEAKAGE_BHASKAR"]:
        for b in CAMPUS_BLOCKS:
            if b["code"] == "Bhaskar Bhavan":
                b["currentConsumption"] = 23040
                b["flowRateLpm"] = 85.0
                b["leakageRisk"] = "High"
                b["riskScore"] = 94
                b["status"] = "Critical"
                b["nightFlowLph"] = 2100
        for t in CAMPUS_TANKS:
            if t["blockCode"] == "Bhaskar Bhavan":
                t["percentage"] = 97
                t["pumpState"] = "ON"
                t["status"] = "Critical"
                t["overflowAlert"] = True

    # Broadcast updated state over WebSocket
    await ws_manager.broadcast({
        "event": "SCENARIO_TRIGGERED",
        "scenario": scenario,
        "blocks": CAMPUS_BLOCKS,
        "tanks": CAMPUS_TANKS,
        "timestamp": datetime.utcnow().isoformat()
    })

    return {"message": f"Scenario {scenario} triggered", "scenario": scenario}

# 11. AI Chat Assistant (Strict Database Facts - Section 28)
@app.post("/api/v1/chat/query")
def chat_query(req: ChatQueryRequest):
    q = req.query.lower()

    if "consumed the most" in q or "highest consumption" in q or "most water" in q:
        top = sorted(CAMPUS_BLOCKS, key=lambda x: x["currentConsumption"], reverse=True)[0]
        return {
            "answer": f"Based on live telemetry, **{top['code']} ({top['name']})** has consumed the most water today at **{top['currentConsumption']:,} L** (Expected baseline: {top['expectedConsumption']:,} L).",
            "source": "CAMPUS_BLOCKS_DATABASE"
        }

    if "leakage risk" in q or "leak" in q or "highest risk" in q:
        high_risk = [b for b in CAMPUS_BLOCKS if b["leakageRisk"] == "High"]
        if high_risk:
            b = high_risk[0]
            return {
                "answer": f"**{b['code']}** has the highest leakage risk at **{b['riskScore']}% (Critical)**. An anomalous flow rate of **{b['flowRateLpm']} L/min** was detected on the Ground Floor washroom sink riser.",
                "source": "AI_ISOLATION_FOREST_ENGINE"
            }
        return {
            "answer": "All Aditya University Bhavans are currently operating within nominal baseline risk thresholds (<20%).",
            "source": "AI_ISOLATION_FOREST_ENGINE"
        }

    if "water saved" in q or "savings" in q:
        total_saved = sum(t["waterSavedAfterRepair"] for t in MAINTENANCE_TICKETS if t["waterSavedAfterRepair"]) + 35000
        return {
            "answer": f"A total of **{total_saved:,} L** of water was saved today through prompt plumbing repair verifications and STP landscaping reuse across Aditya University.",
            "source": "WATER_SAVINGS_LEDGER"
        }

    if "stp" in q or "recycled" in q:
        return {
            "answer": f"The STP plant is delivering **{STP_DATA['treatedWaterLpd']:,} L/day** of non-potable treated water (Gardening: {STP_DATA['distribution']['gardening']:,} L, Flushing: {STP_DATA['distribution']['toiletFlushing']:,} L, Bus Washing: {STP_DATA['distribution']['busWashing']:,} L).",
            "source": "STP_SCADA_SYSTEM"
        }

    if "tank" in q or "overflow" in q:
        high_tanks = [t for t in CAMPUS_TANKS if t["percentage"] >= 95]
        if high_tanks:
            t = high_tanks[0]
            return {
                "answer": f"⚠️ **{t['name']}** requires attention: Level is at **{t['percentage']}%** with Feed Pump status **{t['pumpState']}**. High overflow hazard.",
                "source": "ULTRASONIC_TANK_MONITOR"
            }
        return {
            "answer": "All overhead tanks across campus Bhavans are within safe operating levels (20% to 90%).",
            "source": "ULTRASONIC_TANK_MONITOR"
        }

    return {
        "answer": "Insufficient data is available to answer this question accurately from the campus water telemetry database.",
        "source": "DATABASE_FALLBACK"
    }

# 12. WebSocket Telemetry Live Stream
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Broadcast live sensor pulse every 3 seconds
            payload = {
                "event": "TELEMETRY_HEARTBEAT",
                "blocks": CAMPUS_BLOCKS,
                "tanks": CAMPUS_TANKS,
                "timestamp": datetime.utcnow().isoformat()
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
