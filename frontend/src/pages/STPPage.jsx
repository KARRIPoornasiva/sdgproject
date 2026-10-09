import React from 'react';
import { Recycle, AlertTriangle, CheckCircle2, ArrowDown, Activity, Droplets } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const STPPage = () => {
  const { stpData } = useSimulator();

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h1 className="h3 mb-0 font-display fw-bold text-dark">
              Sewage Treatment Plant (STP) Management
            </h1>
            <span className="badge bg-warning text-dark border border-warning">
              NON-POTABLE RECYCLED WATER
            </span>
          </div>
          <p className="text-muted fs-7 mb-0 mt-1">
            Real-time greywater and blackwater biological treatment, filtration kinetics, and campus redistribution network.
          </p>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> STP SCADA Online
        </span>
      </div>

      {/* STP Primary Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Raw Wastewater Inlet</div>
            <div className="fs-3 fw-bold font-display text-dark">{stpData.inletFlowLpd.toLocaleString()} L/day</div>
            <div className="text-muted fs-7 mt-1">Campus Sewer Inflow</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3 border-info border-opacity-50">
            <div className="text-muted fs-7">Treated Non-Potable Water</div>
            <div className="fs-3 fw-bold font-display text-info">{stpData.treatedWaterLpd.toLocaleString()} L/day</div>
            <div className="text-success fs-7 mt-1 fw-semibold">94.2% Plant Recovery</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Treated Water Quality (BOD)</div>
            <div className="fs-3 fw-bold font-display text-success">{stpData.bodLevel} mg/L</div>
            <div className="text-muted fs-7 mt-1">Permissible: &lt; 10 mg/L</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Effluent pH & Turbidity</div>
            <div className="fs-3 fw-bold font-display text-dark">{stpData.phLevel} pH / {stpData.turbidityNtu} NTU</div>
            <div className="text-success fs-7 mt-1 fw-semibold">Optimal Clarification</div>
          </div>
        </div>
      </div>

      {/* Sankey / Visual Distribution Flow Diagram (Section 14) */}
      <div className="dash-card mb-4">
        <h5 className="dash-card-title mb-3">
          <Recycle className="text-info" size={20} />
          Campus Recycled Water Flow Architecture
        </h5>

        <div className="bg-light p-4 rounded-4 border text-center">
          <div className="row justify-content-center align-items-center g-3">
            {/* Raw Wastewater */}
            <div className="col-md-3">
              <div className="p-3 bg-secondary text-white rounded-3 shadow-sm">
                <div className="fw-bold">Campus Wastewater</div>
                <div className="fs-5 font-display fw-bold mt-1">{stpData.inletFlowLpd.toLocaleString()} L</div>
                <div className="fs-7 opacity-75">Academic + Lab Greywater</div>
              </div>
            </div>

            <div className="col-md-1 d-flex justify-content-center">
              <div className="fs-4 text-muted">➔</div>
            </div>

            {/* STP Plant */}
            <div className="col-md-3">
              <div className="p-3 bg-info text-dark rounded-3 shadow-sm border border-2 border-primary">
                <div className="fw-bold">STP Multi-Stage Treatment</div>
                <div className="fs-5 font-display fw-bold mt-1">{stpData.treatedWaterLpd.toLocaleString()} L</div>
                <div className="fs-7">Aeration • Clarifier • UV</div>
              </div>
            </div>

            <div className="col-md-1 d-flex justify-content-center">
              <div className="fs-4 text-muted">➔</div>
            </div>

            {/* Treated Non Potable Sump */}
            <div className="col-md-3">
              <div className="p-3 bg-primary text-white rounded-3 shadow-sm">
                <div className="fw-bold">Recycled Non-Potable Sump</div>
                <div className="fs-5 font-display fw-bold mt-1">64,000 L Buffered</div>
                <div className="fs-7">Automated Booster Feed</div>
              </div>
            </div>
          </div>

          <div className="my-3 text-muted">↓ Non-Potable Distribution Streams ↓</div>

          {/* Breakdown Streams */}
          <div className="row g-3 justify-content-center">
            <div className="col-6 col-md-2">
              <div className="p-2 bg-white rounded-3 border">
                <div className="text-muted fs-7">🌿 Gardens & Lawns</div>
                <div className="fw-bold text-dark fs-6 mt-1">{stpData.distribution.gardening.toLocaleString()} L</div>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="p-2 bg-white rounded-3 border">
                <div className="text-muted fs-7">🚽 Toilet Flushing</div>
                <div className="fw-bold text-dark fs-6 mt-1">{stpData.distribution.toiletFlushing.toLocaleString()} L</div>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="p-2 bg-white rounded-3 border">
                <div className="text-muted fs-7">🚌 Bus Washing</div>
                <div className="fw-bold text-dark fs-6 mt-1">{stpData.distribution.busWashing.toLocaleString()} L</div>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="p-2 bg-white rounded-3 border">
                <div className="text-muted fs-7">🧹 Road Cleaning</div>
                <div className="fw-bold text-dark fs-6 mt-1">{stpData.distribution.roadCleaning.toLocaleString()} L</div>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="p-2 bg-white rounded-3 border">
                <div className="text-muted fs-7">🏗️ Construction / Other</div>
                <div className="fw-bold text-dark fs-6 mt-1">{stpData.distribution.otherNonPotable.toLocaleString()} L</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STPPage;
