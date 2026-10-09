import React from 'react';
import { Radio, CheckCircle2, AlertTriangle, Cpu, Activity, RefreshCw } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const sampleSensors = [
  { code: "FLOW_BLKG_WASH_01", type: "Flow (Hall Pulse)", block: "Block G (Ground Floor)", value: "85.0 L/min", status: "Active", isSim: true, health: "100%" },
  { code: "FLOW_BLKB_RISER_02", type: "Flow (Pulse)", block: "Block B (Riser 2)", value: "34.2 L/min", status: "Active", isSim: true, health: "98%" },
  { code: "TANK_BLKG_ULTRA_01", type: "Ultrasonic Level", block: "Block G Tank", value: "97% (33,950 L)", status: "Active", isSim: true, health: "100%" },
  { code: "PRESS_MAIN_LINE_01", type: "Piezoresistive", block: "Central Utility Riser", value: "2.8 bar", status: "Active", isSim: true, health: "99%" },
  { code: "SOIL_ZONE_1_CAP", type: "Capacitive Soil", block: "Quadrangle Lawn", value: "78% Moisture", status: "Active", isSim: true, health: "97%" },
  { code: "RAIN_MET_STATION_01", type: "Tipping Bucket", block: "Campus Roof Weather Stn", value: "42.5 mm", status: "Active", isSim: true, health: "100%" },
  { code: "CT_PUMP_BOOSTER_01", type: "Current Transducer", block: "Central Sump Pump", value: "14.2 A (7.5 kW)", status: "Active", isSim: true, health: "98%" },
  { code: "TDS_RO_OUTLET_01", type: "Conductivity TDS", block: "RO Plant Dispenser", value: "65 ppm", status: "Active", isSim: true, health: "96%" },
];

const SensorsPage = () => {
  const { isRunning, simulationSpeed } = useSimulator();

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            IoT Sensor Registry & Telemetry Monitor
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Physical ESP32 edge gateway interfaces, pulse counters, hydrostatic levels, and piezoresistive pressure nodes.
          </p>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Edge Telemetry Streaming
        </span>
      </div>

      <div className="dash-card mb-4">
        <h5 className="dash-card-title mb-3">
          <Radio className="text-primary" size={20} />
          Active Sensor Node Telemetry Stream
        </h5>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Sensor Code</th>
                <th>Sensor Type</th>
                <th>Monitored Location</th>
                <th>Current Telemetry Reading</th>
                <th>Transmission Mode</th>
                <th>Health Index</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sampleSensors.map((s, idx) => (
                <tr key={idx}>
                  <td>
                    <code className="text-dark fw-bold">{s.code}</code>
                  </td>
                  <td>
                    <span className="badge bg-light text-secondary border">{s.type}</span>
                  </td>
                  <td className="fw-medium text-dark">{s.block}</td>
                  <td>
                    <strong className="text-primary fs-7">{s.value}</strong>
                  </td>
                  <td>
                    <span className="data-origin-badge badge-sim">
                      🟣 Simulated ESP32
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ width: '50px', height: '6px' }}>
                        <div className="progress-bar bg-success" style={{ width: s.health }}></div>
                      </div>
                      <span className="fs-7 text-muted">{s.health}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SensorsPage;
