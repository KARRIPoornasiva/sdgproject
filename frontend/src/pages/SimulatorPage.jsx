import React from 'react';
import { 
  Sliders, 
  Play, 
  Square, 
  AlertTriangle, 
  CheckCircle2, 
  Waves, 
  ZapOff, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const SimulatorPage = () => {
  const { 
    isRunning, 
    setIsRunning, 
    simulationSpeed, 
    setSimulationSpeed, 
    activeScenario, 
    triggerScenario,
    activeLeak,
    blocks 
  } = useSimulator();

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h1 className="h3 mb-0 font-display fw-bold text-dark">
              Virtual ESP32 Hardware Simulator Workbench
            </h1>
            <span className="data-origin-badge badge-sim">
              🟣 Simulated Sensor Network
            </span>
          </div>
          <p className="text-muted fs-7 mb-0 mt-1">
            Simulate realistic edge hardware telemetries, pipe bursts, and tank overflows to demonstrate full AI closed-loop workflows.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button 
            className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold ${isRunning ? 'btn-success' : 'btn-secondary'}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <><Square size={14} /> Simulation Running</> : <><Play size={14} /> Resume Simulation</>}
          </button>
        </div>
      </div>

      {/* Demo Flow Diagram Notice (Section 36) */}
      <div className="dash-card mb-4 bg-light border">
        <h6 className="fw-bold text-dark mb-2 font-display">
          🔄 Complete Automated Demonstration Flow (Section 36)
        </h6>
        <div className="d-flex flex-wrap align-items-center gap-2 text-muted fs-7">
          <span className="badge bg-white text-dark border">1. Normal Flow</span>
          <span>➔</span>
          <span className="badge bg-danger text-white">2. Trigger Leakage</span>
          <span>➔</span>
          <span className="badge bg-white text-dark border">3. Sensor Flow Rises</span>
          <span>➔</span>
          <span className="badge bg-primary text-white">4. AI Anomaly Flag</span>
          <span>➔</span>
          <span className="badge bg-warning text-dark">5. Alert & Ticket Created</span>
          <span>➔</span>
          <span className="badge bg-success text-white">6. Technician Resolves</span>
          <span>➔</span>
          <span className="badge bg-success text-white">7. Verified Water Saving (4,640 L)</span>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div 
            className={`dash-card h-100 cursor-pointer ${activeScenario === 'NORMAL' ? 'border-success bg-success-subtle bg-opacity-10' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => triggerScenario('NORMAL')}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-success fs-6 d-flex align-items-center gap-2">
                <CheckCircle2 size={20} /> Normal Campus Operation
              </span>
              {activeScenario === 'NORMAL' && <span className="badge bg-success">Active Scenario</span>}
            </div>
            <p className="text-muted fs-7 mb-0">
              Calibrates all college blocks, tanks, and pumps to standard operating baselines. AI risk scores remain below 20%.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div 
            className={`dash-card h-100 cursor-pointer ${activeScenario === 'LEAKAGE_BLOCK_G' ? 'border-danger bg-danger-subtle bg-opacity-25' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => triggerScenario('LEAKAGE_BLOCK_G')}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-danger fs-6 d-flex align-items-center gap-2">
                <AlertTriangle size={20} /> Simulate Critical Leakage (Block G)
              </span>
              {activeScenario === 'LEAKAGE_BLOCK_G' && <span className="badge bg-danger">Active Scenario</span>}
            </div>
            <p className="text-muted fs-7 mb-0">
              Injects an anomalous 85.0 L/min flow rate into Block G washroom line. Triggers Isolation Forest scoring and 94% risk meter.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div 
            className={`dash-card h-100 cursor-pointer ${activeScenario === 'TANK_OVERFLOW_G' ? 'border-warning bg-warning-subtle bg-opacity-25' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => triggerScenario('TANK_OVERFLOW_G')}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-warning fs-6 d-flex align-items-center gap-2">
                <Waves size={20} /> Simulate Overhead Tank Overflow
              </span>
              {activeScenario === 'TANK_OVERFLOW_G' && <span className="badge bg-warning text-dark">Active Scenario</span>}
            </div>
            <p className="text-muted fs-7 mb-0">
              Drives Block G overhead tank level to 98% with Feed Pump status ON, triggering critical overflow banner and safety instructions.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div 
            className={`dash-card h-100 cursor-pointer ${activeScenario === 'PUMP_FAILURE' ? 'border-secondary bg-secondary-subtle bg-opacity-25' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => triggerScenario('PUMP_FAILURE')}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-secondary fs-6 d-flex align-items-center gap-2">
                <ZapOff size={20} /> Simulate Booster Pump Trip
              </span>
              {activeScenario === 'PUMP_FAILURE' && <span className="badge bg-secondary">Active Scenario</span>}
            </div>
            <p className="text-muted fs-7 mb-0">
              Simulates electrical phase loss and thermal trip on the main campus distribution pump.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;
