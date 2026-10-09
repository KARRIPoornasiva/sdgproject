import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchAlert, AlertTriangle, Moon, Clock, Wrench, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const LeakDetectionPage = () => {
  const { activeLeak, nightLeak, createTicket } = useSimulator();
  const navigate = useNavigate();

  const handleCreateTicket = () => {
    if (!activeLeak) return;
    const newTicket = {
      id: `TICK-2026-${Math.floor(100 + Math.random() * 900)}`,
      block: activeLeak.block,
      floor: "Ground Floor",
      location: activeLeak.location,
      problem: `AI Leakage Alert: ${activeLeak.flowDetected} L/min flow rate. Continuous discharge detected.`,
      priority: "Critical",
      aiRisk: `${activeLeak.riskPercentage}%`,
      estimatedExcess: `~${activeLeak.estimatedExcessLitres} L`,
      assignedTechnician: "R. Sharma (Plumbing Lead)",
      status: "In Progress",
      createdTime: "Just now",
      resolvedTime: null,
      beforeRepairDailyFlow: 23040,
      afterRepairDailyFlow: null,
      waterSavedAfterRepair: null,
    };
    createTicket(newTicket);
    navigate('/maintenance');
  };

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            AI Leak Detection & Acoustic/Flow Surveillance
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Real-time hydrodynamic gradient tracking, continuous flow detection, and low-occupancy night surveillance.
          </p>
        </div>
        <span className="data-origin-badge badge-ai">
          🤖 AI Isolation Forest Active
        </span>
      </div>

      {/* Real-Time Leak Section */}
      <div className="dash-card mb-4 border-danger">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 bg-danger text-white rounded-3">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-danger font-display">Active Real-Time Anomaly Flag</h5>
              <div className="text-muted fs-7">Continuous unthrottled water flow above permissible variance</div>
            </div>
          </div>
          <span className="badge bg-danger">Critical Severity</span>
        </div>

        {activeLeak ? (
          <div className="bg-light p-4 rounded-3 border">
            <div className="row g-4 align-items-center">
              <div className="col-md-4">
                <div className="fw-bold text-dark fs-6">{activeLeak.block} – {activeLeak.location}</div>
                <div className="text-muted fs-7 mb-2">Duration: {activeLeak.durationMinutes} minutes active</div>
                <div className="p-2 bg-white rounded border">
                  <div className="text-muted fs-7">Flow Detected: <strong className="text-danger">{activeLeak.flowDetected} L/min</strong></div>
                  <div className="text-muted fs-7">Expected Range: <strong>{activeLeak.expectedFlow}</strong></div>
                </div>
              </div>

              <div className="col-md-5">
                <div className="text-muted fs-7 mb-1">AI Risk Confidence Meter:</div>
                <div className="risk-meter-track mb-2">
                  <div className="risk-meter-fill bg-danger" style={{ width: `${activeLeak.riskPercentage}%` }}></div>
                </div>
                <div className="d-flex justify-content-between text-muted fs-7">
                  <span>Confidence: <strong className="text-danger">{activeLeak.riskPercentage}%</strong></span>
                  <span>Excess Wastage: <strong className="text-danger">~{activeLeak.estimatedExcessLitres} L</strong></span>
                </div>
              </div>

              <div className="col-md-3 text-end">
                <button 
                  className="btn btn-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                  onClick={handleCreateTicket}
                >
                  <Wrench size={16} /> Dispatch Ticket
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-success">
            <CheckCircle2 size={32} className="mx-auto mb-2" />
            <h6 className="fw-bold">No Active Real-Time Leak Anomalies Detected</h6>
            <div className="text-muted fs-7">All continuous flow sensors are within normal bounds.</div>
          </div>
        )}
      </div>

      {/* Night-Time Leakage Window (Section 11) */}
      <div className="dash-card mb-4" style={{ background: '#0F172A', color: '#F8FAFC' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <Moon size={20} className="text-info" />
            <div>
              <h5 className="mb-0 text-white font-display">🌙 Night-Time Leakage Surveillance (12:00 AM – 5:00 AM)</h5>
              <div className="text-secondary fs-7">High-sensitivity nocturnal baseline monitoring during zero campus occupancy</div>
            </div>
          </div>
          <span className="badge bg-secondary">Automated Chrono-Job</span>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="p-3 rounded-3" style={{ background: '#1E293B', border: '1px solid #334155' }}>
              <div className="text-secondary fs-7">Monitored Block:</div>
              <div className="text-white fw-bold fs-6">{nightLeak.block} (IT Wing)</div>
              <div className="text-muted fs-7 mt-1">Ground floor main riser</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded-3" style={{ background: '#1E293B', border: '1px solid #334155' }}>
              <div className="text-secondary fs-7">Expected vs Actual Flow:</div>
              <div className="text-danger fw-bold fs-6">{activeLeak ? nightLeak.actualNightFlow : '180 L/h'}</div>
              <div className="text-secondary fs-7 mt-1">Expected: {nightLeak.expectedNightFlow}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded-3" style={{ background: '#1E293B', border: '1px solid #334155' }}>
              <div className="text-secondary fs-7">AI Diagnostic Result:</div>
              <div className="text-warning fw-bold fs-6">{activeLeak ? nightLeak.aiResult : 'Normal Baseline'}</div>
              <div className="text-info fs-7 mt-1">Confidence: {activeLeak ? `${nightLeak.riskPercentage}%` : 'Low'}</div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-top border-secondary border-opacity-25 text-secondary fs-7">
          Note: System identifies <em>Possible Leakage</em>; physical on-site audit is required.
        </div>
      </div>
    </div>
  );
};

export default LeakDetectionPage;
