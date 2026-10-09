import React from 'react';
import { Cylinder, Zap, AlertOctagon, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const TanksPage = () => {
  const { tanks } = useSimulator();

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            Overhead Tanks & Storage Sumps Telemetry
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Real-time ultrasonic reservoir capacities, inflow/outflow kinetics, and high-level safety cutoff interlocks.
          </p>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Ultrasonic Level Sensors
        </span>
      </div>

      <div className="row g-4">
        {tanks.map((tank) => {
          const isCritical = tank.percentage >= 95;
          const isLow = tank.percentage <= 20;

          return (
            <div key={tank.id} className="col-12 col-md-6 col-xl-4">
              <div className={`dash-card h-100 ${isCritical ? 'border-danger' : ''}`}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge bg-light text-secondary border mb-1">{tank.blockCode}</span>
                    <h5 className="fw-bold text-dark mb-0 font-display">{tank.name}</h5>
                  </div>
                  <span className={`badge ${isCritical ? 'bg-danger' : isLow ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {tank.percentage}%
                  </span>
                </div>

                <div className="progress mb-3" style={{ height: '14px', borderRadius: '8px' }}>
                  <div 
                    className={`progress-bar ${isCritical ? 'bg-danger' : tank.percentage > 80 ? 'bg-info' : 'bg-primary'}`}
                    style={{ width: `${tank.percentage}%` }}
                  ></div>
                </div>

                <div className="bg-light p-3 rounded-3 mb-3" style={{ fontSize: '0.8rem' }}>
                  <div className="d-flex justify-content-between py-1 border-bottom border-light">
                    <span className="text-muted">Storage:</span>
                    <strong className="text-dark">{tank.currentLitres.toLocaleString()} / {tank.capacity.toLocaleString()} L</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom border-light">
                    <span className="text-muted">Feed Pump Status:</span>
                    <strong className={`d-flex align-items-center gap-1 ${tank.pumpState === 'ON' ? 'text-success' : 'text-muted'}`}>
                      <Zap size={14} /> {tank.pumpState}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom border-light">
                    <span className="text-muted">Net Fill Rate:</span>
                    <strong className="text-primary">
                      {tank.fillRateLpm > 0 ? `+${tank.fillRateLpm} L/min` : `-${tank.emptyRateLpm} L/min`}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between pt-1 text-muted fs-7">
                    <span>Last Telemetry Ping:</span>
                    <span>{tank.lastUpdated}</span>
                  </div>
                </div>

                {isCritical && (
                  <div className="p-2 bg-danger bg-opacity-10 text-danger border border-danger rounded-3 fs-7 fw-semibold text-center">
                    🚨 High Level Cutoff: Inspect float-valve control.
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

export default TanksPage;
