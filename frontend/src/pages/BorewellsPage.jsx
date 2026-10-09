import React from 'react';
import { Drill, Zap, DollarSign, Activity, BatteryCharging, ArrowDown, Droplet } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const BorewellsPage = () => {
  const { borewells } = useSimulator();

  const totalExtracted = borewells.reduce((acc, b) => acc + b.waterExtractedLitres, 0);
  const totalKwh = borewells.reduce((acc, b) => acc + b.energyUsedKwh, 0);
  const totalCost = borewells.reduce((acc, b) => acc + b.costInr, 0);

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            Deep Borewell Water Extraction & Energy Analytics
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Groundwater table drawdown, submersible pump operating hours, and energy efficiency metrics (Litres/kWh).
          </p>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Energy & Flow Sensors
        </span>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Total Extracted Today</div>
            <div className="fs-3 fw-bold font-display text-dark">{totalExtracted.toLocaleString()} L</div>
            <div className="text-muted fs-7 mt-1">Across 3 Deep Wells</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Total Power Consumed</div>
            <div className="fs-3 fw-bold font-display text-primary">{totalKwh.toFixed(1)} kWh</div>
            <div className="text-muted fs-7 mt-1">3-Phase Submersible Drives</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Electricity Cost</div>
            <div className="fs-3 fw-bold font-display text-secondary">₹{totalCost.toFixed(2)}</div>
            <div className="text-muted fs-7 mt-1">Commercial Tariff (₹8.0/kWh)</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3 border-success border-opacity-50">
            <div className="text-muted fs-7">Energy Extraction Index</div>
            <div className="fs-3 fw-bold font-display text-success">~1,980 L/kWh</div>
            <div className="text-success fs-7 mt-1 fw-semibold">High Hydro-Efficiency</div>
          </div>
        </div>
      </div>

      {/* Borewell cards */}
      <div className="row g-4">
        {borewells.map((bw) => (
          <div key={bw.id} className="col-12 col-lg-4">
            <div className="dash-card h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-light text-dark border">{bw.name}</span>
                <span className={`badge ${bw.pumpStatus === 'ON' ? 'bg-success' : 'bg-secondary'}`}>
                  Pump: {bw.pumpStatus}
                </span>
              </div>

              <div className="bg-light p-3 rounded-3 my-3" style={{ fontSize: '0.8rem' }}>
                <div className="d-flex justify-content-between py-1 border-bottom border-light">
                  <span className="text-muted">Extracted Today:</span>
                  <strong className="text-dark">{bw.waterExtractedLitres.toLocaleString()} L</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-light">
                  <span className="text-muted">Operating Hours:</span>
                  <strong className="text-dark">{bw.operatingHoursToday} hrs</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-light">
                  <span className="text-muted">Energy Used:</span>
                  <strong className="text-primary">{bw.energyUsedKwh} kWh</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-light">
                  <span className="text-muted">Hydro-Yield:</span>
                  <strong className="text-success">{bw.litresPerKwh} Litres/kWh</strong>
                </div>
                <div className="d-flex justify-content-between pt-1">
                  <span className="text-muted">Water Table Depth:</span>
                  <strong className="text-secondary">{bw.waterTableMeters} m (Well Depth: {bw.depthMeters} m)</strong>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center text-muted fs-7 pt-2 border-top">
                <span>Power Cost: <strong>₹{bw.costInr}</strong></span>
                <span className="badge bg-primary bg-opacity-10 text-primary">SCADA Linked</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BorewellsPage;
