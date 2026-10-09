import React from 'react';
import { Droplet, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const ROPage = () => {
  const { roData } = useSimulator();

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            Reverse Osmosis (RO) Drinking Water & Reject Recovery
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Potable water generation tracking, membrane health diagnostics, and reject water diversion recovery.
          </p>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Online TDS & Flow Meters
        </span>
      </div>

      {/* Primary KPI row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">RO Raw Input</div>
            <div className="fs-3 fw-bold font-display text-dark">{roData.inputLitres.toLocaleString()} L</div>
            <div className="text-muted fs-7 mt-1">Inlet TDS: {roData.tdsInlet} ppm</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3 border-success border-opacity-50">
            <div className="text-muted fs-7">Purified Drinking Water</div>
            <div className="fs-3 fw-bold font-display text-success">{roData.drinkingWaterLitres.toLocaleString()} L</div>
            <div className="text-success fs-7 mt-1 fw-semibold">Outlet TDS: {roData.tdsOutlet} ppm (Safe)</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3 border-warning border-opacity-50">
            <div className="text-muted fs-7">Total Reject Water</div>
            <div className="fs-3 fw-bold font-display text-warning">{roData.rejectWaterLitres.toLocaleString()} L</div>
            <div className="text-muted fs-7 mt-1">33.3% Concentration Stream</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3 border-primary border-opacity-50">
            <div className="text-muted fs-7">Recovered for Non-Potable</div>
            <div className="fs-3 fw-bold font-display text-primary">{roData.recoveredRejectLitres.toLocaleString()} L</div>
            <div className="text-primary fs-7 mt-1 fw-semibold">80.0% Reject Recovery</div>
          </div>
        </div>
      </div>

      {/* Reject Water Reuse Opportunity Alert (Section 15) */}
      <div className="dash-card mb-4 bg-warning bg-opacity-10 border-warning">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-warning text-dark rounded-circle">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-1">
                ⚠️ Potential Reuse Opportunity: {roData.unrecoveredRejectLitres.toLocaleString()} L Unrecovered Reject
              </h6>
              <div className="text-muted fs-7">
                Secondary RO reject brine stream can be redirected into the bus-washing sump and perimeter dust suppression line.
              </div>
            </div>
          </div>
          <button className="btn btn-sm btn-dark px-3 py-2 fw-semibold">
            Configure Bypass Diverter Valve
          </button>
        </div>
      </div>

      {/* Flow Visualization */}
      <div className="dash-card">
        <h5 className="dash-card-title mb-3">
          <Droplet className="text-primary" size={20} />
          RO Water Mass Balance Diagram
        </h5>

        <div className="bg-light p-4 rounded-4 border">
          <div className="row align-items-center text-center g-3">
            <div className="col-md-3">
              <div className="p-3 bg-white rounded-3 border shadow-sm">
                <div className="text-muted fs-7">Raw Water Inflow</div>
                <div className="fw-bold font-display fs-5 text-dark mt-1">120,000 L</div>
              </div>
            </div>

            <div className="col-md-1 fs-4 text-muted">➔</div>

            <div className="col-md-4">
              <div className="p-3 bg-primary text-white rounded-3 shadow">
                <div className="fw-bold">RO High-Pressure Multi-Stage Unit</div>
                <div className="fs-7 opacity-75 mt-1">Semi-Permeable Polyamide Membranes</div>
                <div className="badge bg-white text-primary mt-2">Filter Health: {roData.filtersHealthPct}%</div>
              </div>
            </div>

            <div className="col-md-1 fs-4 text-muted">➔</div>

            <div className="col-md-3 space-y-2">
              <div className="p-2 bg-success bg-opacity-10 text-success border border-success rounded-3 mb-2">
                <div className="fw-bold fs-7">🚰 Drinking Output</div>
                <div className="fw-bold">{roData.drinkingWaterLitres.toLocaleString()} L</div>
              </div>
              <div className="p-2 bg-info bg-opacity-10 text-info border border-info rounded-3">
                <div className="fw-bold fs-7">♻️ Recovered Reject</div>
                <div className="fw-bold">{roData.recoveredRejectLitres.toLocaleString()} L</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROPage;
