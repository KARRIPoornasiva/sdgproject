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
  Gauge,
  HelpCircle,
  X
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

const SimulatorModal = ({ isOpen, onClose }) => {
  const { 
    isRunning, 
    setIsRunning, 
    simulationSpeed, 
    setSimulationSpeed, 
    activeScenario, 
    triggerScenario 
  } = useSimulator();

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1200 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-dark text-white border-0 py-3 px-4" style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)' }}>
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded-3 bg-purple-subtle text-purple" style={{ background: '#7C3AED', color: '#FFF' }}>
                <Sliders size={20} />
              </div>
              <div>
                <h5 className="modal-title font-display fw-bold mb-0">Virtual ESP32 Sensor & Scenario Simulator</h5>
                <div className="text-secondary fs-7" style={{ fontSize: '0.75rem' }}>
                  Inject synthetic hardware scenarios to validate end-to-end AI detection & ticket dispatching.
                </div>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4 bg-light">
            {/* Simulation Engine Controls */}
            <div className="bg-white p-3 rounded-3 border mb-4 shadow-sm">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold text-dark fs-7">Engine Status:</span>
                  <button 
                    className={`btn btn-sm d-flex align-items-center gap-1 ${isRunning ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? <><Square size={12} /> Running</> : <><Play size={12} /> Paused</>}
                  </button>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted fs-7">Telemetry Speed:</span>
                  <div className="btn-group btn-group-sm" role="group">
                    {[1, 2, 5].map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        className={`btn ${simulationSpeed === speed ? 'btn-purple text-white' : 'btn-outline-secondary'}`}
                        style={simulationSpeed === speed ? { background: '#7C3AED' } : {}}
                        onClick={() => setSimulationSpeed(speed)}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Scenarios Grid */}
            <h6 className="fw-bold text-dark mb-3 fs-7 text-uppercase tracking-wider">
              1-Click Live Test Scenarios (Demonstration Flow)
            </h6>

            <div className="row g-3">
              {/* Scenario 1: Normal Flow */}
              <div className="col-md-6">
                <div 
                  className={`p-3 rounded-3 border cursor-pointer h-100 transition-all ${activeScenario === 'NORMAL' ? 'border-success bg-success-subtle bg-opacity-25 shadow-sm' : 'bg-white'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => triggerScenario('NORMAL')}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold text-success fs-7 d-flex align-items-center gap-1">
                      <CheckCircle2 size={16} /> Normal Campus Flow
                    </span>
                    {activeScenario === 'NORMAL' && <span className="badge bg-success">Active</span>}
                  </div>
                  <div className="text-muted fs-7">
                    All blocks operate within standard baseline bounds. No leaks, normal tank levels.
                  </div>
                </div>
              </div>

              {/* Scenario 2: Simulate Critical Leakage in Block G */}
              <div className="col-md-6">
                <div 
                  className={`p-3 rounded-3 border cursor-pointer h-100 transition-all ${activeScenario === 'LEAKAGE_BLOCK_G' ? 'border-danger bg-danger-subtle bg-opacity-25 shadow-sm' : 'bg-white'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => triggerScenario('LEAKAGE_BLOCK_G')}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold text-danger fs-7 d-flex align-items-center gap-1">
                      <AlertTriangle size={16} /> Simulate Critical Leakage
                    </span>
                    {activeScenario === 'LEAKAGE_BLOCK_G' && <span className="badge bg-danger">Active</span>}
                  </div>
                  <div className="text-muted fs-7">
                    Spikes Block G flow to 85 L/min. Triggers AI Isolation Forest, 94% risk meter & alert ticket.
                  </div>
                </div>
              </div>

              {/* Scenario 3: Simulate Tank Overflow */}
              <div className="col-md-6">
                <div 
                  className={`p-3 rounded-3 border cursor-pointer h-100 transition-all ${activeScenario === 'TANK_OVERFLOW_G' ? 'border-warning bg-warning-subtle bg-opacity-25 shadow-sm' : 'bg-white'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => triggerScenario('TANK_OVERFLOW_G')}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold text-warning fs-7 d-flex align-items-center gap-1">
                      <Waves size={16} /> Simulate Tank Overflow
                    </span>
                    {activeScenario === 'TANK_OVERFLOW_G' && <span className="badge bg-warning text-dark">Active</span>}
                  </div>
                  <div className="text-muted fs-7">
                    Drives Block G tank to 98% with Feed Pump ON, triggering critical overflow banner.
                  </div>
                </div>
              </div>

              {/* Scenario 4: Simulate Pump Failure */}
              <div className="col-md-6">
                <div 
                  className={`p-3 rounded-3 border cursor-pointer h-100 transition-all ${activeScenario === 'PUMP_FAILURE' ? 'border-secondary bg-secondary-subtle bg-opacity-25 shadow-sm' : 'bg-white'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => triggerScenario('PUMP_FAILURE')}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold text-secondary fs-7 d-flex align-items-center gap-1">
                      <ZapOff size={16} /> Simulate Pump Trip
                    </span>
                    {activeScenario === 'PUMP_FAILURE' && <span className="badge bg-secondary">Active</span>}
                  </div>
                  <div className="text-muted fs-7">
                    Simulates booster motor thermal overload and electrical cutout alarm.
                  </div>
                </div>
              </div>

              {/* Scenario 5: Simulate High Campus Consumption */}
              <div className="col-md-12">
                <div 
                  className={`p-3 rounded-3 border cursor-pointer transition-all ${activeScenario === 'HIGH_CONSUMPTION' ? 'border-primary bg-primary-subtle bg-opacity-25 shadow-sm' : 'bg-white'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => triggerScenario('HIGH_CONSUMPTION')}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold text-primary fs-7 d-flex align-items-center gap-1">
                      <TrendingUp size={16} /> Simulate Campus Surge Load (+35%)
                    </span>
                    {activeScenario === 'HIGH_CONSUMPTION' && <span className="badge bg-primary">Active</span>}
                  </div>
                  <div className="text-muted fs-7">
                    Emulates full college festival / sports event consumption across all college blocks.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-white border-top py-2 px-4 d-flex justify-content-between">
            <span className="data-origin-badge badge-sim">
              🟣 SIMULATED HARDWARE MODE
            </span>
            <button type="button" className="btn btn-dark btn-sm px-4" onClick={onClose}>
              Apply & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorModal;
