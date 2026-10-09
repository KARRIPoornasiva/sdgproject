import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  AlertTriangle, 
  Clock, 
  Droplet, 
  ArrowRight, 
  Wrench, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert,
  Cpu,
  Layers
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

const AILeakDetectionPanel = () => {
  const { activeLeak, createTicket } = useSimulator();
  const [ticketCreated, setTicketCreated] = useState(false);
  const navigate = useNavigate();

  const handleCreateTicket = () => {
    if (!activeLeak) return;
    const newTicket = {
      id: `TICK-2026-${Math.floor(100 + Math.random() * 900)}`,
      block: activeLeak.block,
      floor: "Ground Floor",
      location: activeLeak.location,
      problem: `AI Flagged: Continuous anomalous flow (${activeLeak.flowDetected} L/min). ${activeLeak.possibleIssue}`,
      priority: "Critical",
      aiRisk: `${activeLeak.riskPercentage}%`,
      estimatedExcess: `~${activeLeak.estimatedExcessLitres} L`,
      assignedTechnician: "R. Sharma (Plumbing Team Lead)",
      status: "In Progress",
      createdTime: "Just now",
      resolvedTime: null,
      beforeRepairDailyFlow: 23040,
      afterRepairDailyFlow: null,
      waterSavedAfterRepair: null,
    };
    createTicket(newTicket);
    setTicketCreated(true);
    setTimeout(() => {
      navigate('/maintenance');
    }, 800);
  };

  if (!activeLeak) {
    return (
      <div className="dash-card mb-4 bg-success bg-opacity-10 border-success border-opacity-25">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-success rounded-circle text-white shadow-sm">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="fw-bold text-success mb-0 font-display">🤖 AI Leak Detection Engine Active</h5>
                <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-50">
                  Isolation Forest Inlier
                </span>
              </div>
              <div className="text-muted fs-7 mt-1">
                All college block flow baselines, night sensors, and riser pressures are within nominal operating limits (Score: +0.22).
              </div>
            </div>
          </div>
          <span className="badge bg-success px-3 py-2 fw-semibold">Campus Baseline Stable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-card mb-4 border-danger border-opacity-60" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FEF2F2 100%)' }}>
      <div className="dash-card-header flex-wrap gap-2 pb-2 border-bottom border-danger border-opacity-15">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 bg-danger rounded-3 text-white shadow-sm">
            <ShieldAlert size={22} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="dash-card-title text-danger mb-0 font-display">
                🤖 AI LEAK DETECTION – ANOMALOUS DISCHARGE IDENTIFIED
              </h5>
              <span className="badge bg-danger">Critical Anomaly</span>
            </div>
            <div className="text-muted fs-7 mt-1">
              Isolation Forest identified anomalous multi-variate continuous flow signature.
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="data-origin-badge badge-live">
            <span className="pulse-dot pulse-dot-danger"></span> High Priority
          </span>
          <span className="data-origin-badge badge-ai">
            Scikit-Learn Isolation Forest
          </span>
        </div>
      </div>

      <div className="row g-4 mt-1 align-items-center">
        {/* Left column: Block & Flow metrics */}
        <div className="col-12 col-md-4 border-end-md">
          <div className="d-flex align-items-center gap-2 text-danger mb-1">
            <AlertTriangle size={18} />
            <span className="fw-bold fs-6">{activeLeak.block} – {activeLeak.location}</span>
          </div>
          <div className="text-muted fs-7 mb-3">Department of Computing & AI Labs</div>

          <div className="bg-white p-3 rounded-3 border shadow-sm">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted fs-7">Flow Detected:</span>
              <span className="fw-bold text-danger fs-6">{activeLeak.flowDetected} L/min</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted fs-7">Expected Baseline:</span>
              <span className="fw-medium text-secondary fs-7">{activeLeak.expectedFlow}</span>
            </div>
            <div className="d-flex justify-content-between pt-2 border-top">
              <span className="text-muted fs-7">Continuous Duration:</span>
              <span className="fw-bold text-dark fs-7 d-flex align-items-center gap-1">
                <Clock size={12} className="text-danger" /> {activeLeak.durationMinutes} minutes
              </span>
            </div>
          </div>
        </div>

        {/* Center column: AI Risk Meter & Probable Root Cause */}
        <div className="col-12 col-md-5 border-end-md">
          <div className="mb-2 d-flex justify-content-between align-items-center">
            <span className="fw-bold text-dark fs-7">Isolation Forest Outlier Confidence:</span>
            <span className="badge bg-danger fs-7">{activeLeak.riskPercentage}% Risk (Score: -0.74)</span>
          </div>

          {/* Visual Risk Meter */}
          <div className="risk-meter-track mb-3">
            <div 
              className="risk-meter-fill bg-danger" 
              style={{ width: `${activeLeak.riskPercentage}%` }}
            ></div>
          </div>

          <div className="bg-white p-3 rounded-3 border shadow-sm">
            <div className="text-muted fs-7 mb-1">Prescriptive Root Cause:</div>
            <div className="fw-semibold text-dark fs-7 mb-2">{activeLeak.possibleIssue}</div>
            
            <div className="d-flex justify-content-between align-items-center pt-2 border-top">
              <span className="text-muted fs-7">Estimated Excess Wastage:</span>
              <span className="fw-bold text-danger fs-6">~{activeLeak.estimatedExcessLitres.toLocaleString()} L</span>
            </div>
          </div>
        </div>

        {/* Right column: Action Dispatch buttons */}
        <div className="col-12 col-md-3 text-center text-md-start">
          <div className="d-grid gap-2">
            <button 
              className="btn btn-danger d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold shadow-sm"
              onClick={handleCreateTicket}
              disabled={ticketCreated}
            >
              <Wrench size={16} />
              {ticketCreated ? 'Workorder Dispatched!' : 'Create Maintenance Ticket'}
            </button>
            <button 
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 py-2 fs-7"
              onClick={() => navigate('/ai-recommendations')}
            >
              <span>View AI Prescriptions</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="text-muted fs-7 text-center mt-2" style={{ fontSize: '0.68rem' }}>
            Requires physical manual confirmation on-site.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILeakDetectionPanel;
