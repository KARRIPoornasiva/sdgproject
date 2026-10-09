import React from 'react';
import { Cylinder, AlertOctagon, Zap, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

const CircularProgress = ({ percentage, color = '#0284C7' }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circular-progress-wrap">
      <svg className="circular-progress-svg" viewBox="0 0 100 100">
        <circle
          className="circular-progress-bg"
          cx="50"
          cy="50"
          r={radius}
        />
        <circle
          className="circular-progress-bar"
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="position-absolute text-center">
        <span className="fw-bold font-display fs-5" style={{ color: color }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

const OverheadTankMonitoring = () => {
  const { tanks } = useSimulator();

  // Check critical overflow conditions (Tank >= 95% AND Pump = ON)
  const overflowTanks = tanks.filter(t => t.percentage >= 95 && t.pumpState === 'ON');

  return (
    <div className="dash-card mb-4">
      <div className="dash-card-header flex-wrap gap-2">
        <div>
          <h5 className="dash-card-title">
            <Cylinder className="text-primary" size={20} />
            Overhead Tank & Sump Monitoring
          </h5>
          <div className="text-muted fs-7 mt-1">
            Ultrasonic level sensors with automated fill/empty kinetics and high-level pump safety interlocks.
          </div>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Ultrasonic Telemetry
        </span>
      </div>

      {/* Critical Overflow Alert Banner if condition met (Section 13) */}
      {overflowTanks.length > 0 && (
        <div className="glass-banner-critical mb-4">
          <div className="d-flex align-items-start gap-3">
            <div className="p-2 bg-danger rounded-circle text-white flex-shrink-0">
              <AlertOctagon size={24} />
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="badge bg-danger">🚨 CRITICAL ALERT</span>
                <span className="text-danger fw-bold fs-7">High Water Level Hazard</span>
              </div>
              <h6 className="fw-bold text-danger mb-1">
                Possible Tank Overflow – {overflowTanks.map(t => t.name).join(', ')}
              </h6>
              <div className="text-dark fs-7 mb-2">
                Level reached <strong>{overflowTanks[0].percentage}%</strong> with Feed Pump status <strong>ON</strong>.
              </div>
              <div className="p-2 bg-white rounded border border-danger-subtle fs-7 text-danger fw-semibold d-flex align-items-center justify-content-between">
                <span>Action: Inspect pump float-valve control and verify level cutoff limiters.</span>
                <span className="badge bg-danger-subtle text-danger border border-danger">Authorized manual review</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of tanks */}
      <div className="row g-3">
        {tanks.slice(0, 4).map((tank) => {
          const isCritical = tank.percentage >= 95;
          const isWarning = tank.percentage >= 85 && !isCritical;
          const gaugeColor = isCritical ? '#EF4444' : isWarning ? '#F59E0B' : '#0284C7';

          return (
            <div key={tank.id} className="col-12 col-sm-6 col-xl-3">
              <div className={`p-3 rounded-3 border h-100 position-relative ${isCritical ? 'border-danger bg-danger-subtle bg-opacity-25' : 'bg-white'}`}>
                {isCritical && (
                  <span className="position-absolute top-0 end-0 mt-2 me-2 badge bg-danger">
                    ⚠️ Overflow Risk
                  </span>
                )}

                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="fw-bold text-dark fs-7 text-truncate" title={tank.name}>
                    {tank.name}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center my-2">
                  <CircularProgress percentage={tank.percentage} color={gaugeColor} />
                </div>

                <div className="bg-light p-2 rounded-2 mt-2" style={{ fontSize: '0.75rem' }}>
                  <div className="d-flex justify-content-between py-1 border-bottom border-light">
                    <span className="text-muted">Storage:</span>
                    <span className="fw-bold text-dark">{tank.currentLitres.toLocaleString()} / {tank.capacity.toLocaleString()} L</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom border-light">
                    <span className="text-muted">Feed Pump:</span>
                    <span className={`fw-bold d-flex align-items-center gap-1 ${tank.pumpState === 'ON' ? 'text-success' : 'text-secondary'}`}>
                      <Zap size={12} /> {tank.pumpState}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom border-light">
                    <span className="text-muted">Flow Rates:</span>
                    <span className="fw-medium text-dark">
                      {tank.fillRateLpm > 0 ? `+${tank.fillRateLpm} L/m` : `-${tank.emptyRateLpm} L/m`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between pt-1 text-muted" style={{ fontSize: '0.7rem' }}>
                    <span>Updated:</span>
                    <span>{tank.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverheadTankMonitoring;
