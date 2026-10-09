import React from 'react';
import { Zap, AlertTriangle, CheckCircle2, Clock, Activity, Power } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const PumpsPage = () => {
  const { pumps } = useSimulator();

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            Water Pump Network & Energy Telemetry
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Motor health status, operating hours, flow rates, and automated safety interlocks.
          </p>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Motor CT Sensors Active
        </span>
      </div>

      <div className="row g-4">
        {pumps.map((pump) => {
          const isTripped = pump.status === 'TRIPPED';
          const isOn = pump.status === 'ON';

          return (
            <div key={pump.id} className="col-12 col-md-6">
              <div className={`dash-card h-100 ${isTripped ? 'border-danger' : ''}`}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge bg-light text-secondary border mb-1">{pump.type}</span>
                    <h5 className="fw-bold text-dark mb-0 font-display">{pump.name}</h5>
                  </div>
                  <span className={`badge ${isTripped ? 'bg-danger' : isOn ? 'bg-success' : 'bg-secondary'}`}>
                    {pump.status}
                  </span>
                </div>

                <div className="bg-light p-3 rounded-3 mb-3" style={{ fontSize: '0.8rem' }}>
                  <div className="d-flex justify-content-between py-1 border-bottom border-light">
                    <span className="text-muted">Discharge Flow Rate:</span>
                    <strong className="text-primary">{pump.flowRateLpm} L/min</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom border-light">
                    <span className="text-muted">Rated Motor Power:</span>
                    <strong className="text-dark">{pump.powerKw} kW (3-Phase 415V)</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom border-light">
                    <span className="text-muted">Running Hours Today:</span>
                    <strong className="text-dark">{pump.hoursToday} hrs</strong>
                  </div>
                  <div className="d-flex justify-content-between pt-1">
                    <span className="text-muted">Control Logic:</span>
                    <span className="badge bg-primary bg-opacity-10 text-primary">SCADA Auto-Interlock</span>
                  </div>
                </div>

                {pump.warning && (
                  <div className="p-2 bg-warning bg-opacity-15 text-warning border border-warning rounded-3 fs-7 fw-semibold text-center mb-2">
                    ⚠️ {pump.warning}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PumpsPage;
