import React, { useState } from 'react';
import { CloudRain, Calculator, Droplets, HardHat, Info, Sliders } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const RainwaterPage = () => {
  const { rainwaterData } = useSimulator();

  // Configurable parameters
  const [rainfallMm, setRainfallMm] = useState(rainwaterData.currentRainfallMm);
  const [catchmentArea, setCatchmentArea] = useState(rainwaterData.catchmentAreaSqMeters);
  const [runoffCoeff, setRunoffCoeff] = useState(rainwaterData.runoffCoefficient);

  // Exact Formula Calculation (Section 16)
  // Harvested Water (Litres) = Rainfall (mm) * Catchment Area (m^2) * Runoff Coefficient
  const computedHarvest = Math.round(rainfallMm * catchmentArea * runoffCoeff);

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            Rainwater Harvesting & Catchment Analytics
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Deterministic hydrological runoff formula model for college roof & campus paved surfaces.
          </p>
        </div>
        <span className="data-origin-badge badge-estimate">
          📊 Deterministic Formula Engine
        </span>
      </div>

      {/* Formula Banner */}
      <div className="dash-card mb-4 bg-primary bg-opacity-10 border-primary border-opacity-25">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 bg-primary text-white rounded-circle">
            <Calculator size={24} />
          </div>
          <div>
            <h6 className="fw-bold text-primary mb-1">Hydrological Runoff Formula</h6>
            <code className="text-dark fw-bold fs-6">
              Harvested Water (Litres) = Rainfall (mm) × Catchment Area (m²) × Runoff Coefficient
            </code>
            <div className="text-muted fs-7 mt-1">
              Rainfall inputs sourced from verified meteorological telemetry. Live values are never fabricated.
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Recorded Rainfall</div>
            <div className="fs-3 fw-bold font-display text-dark">{rainfallMm} mm</div>
            <div className="text-muted fs-7 mt-1">Monsoon Season Sensor</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3 border-primary border-opacity-50">
            <div className="text-muted fs-7">Estimated Harvest Yield</div>
            <div className="fs-3 fw-bold font-display text-primary">{computedHarvest.toLocaleString()} L</div>
            <div className="text-success fs-7 mt-1 fw-semibold">{(computedHarvest / 1000000).toFixed(2)} Megalitres</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3 border-info border-opacity-50">
            <div className="text-muted fs-7">Stored in Campus Sumps</div>
            <div className="fs-3 fw-bold font-display text-info">{rainwaterData.storedWaterLitres.toLocaleString()} L</div>
            <div className="text-muted fs-7 mt-1">Filtered & Chlorinated</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Available Storage Buffer</div>
            <div className="fs-3 fw-bold font-display text-success">{rainwaterData.availableStorageLitres.toLocaleString()} L</div>
            <div className="text-muted fs-7 mt-1">Sump Free Volume</div>
          </div>
        </div>
      </div>

      {/* Interactive Catchment Configurator */}
      <div className="dash-card mb-4">
        <h5 className="dash-card-title mb-3">
          <Sliders className="text-primary" size={20} />
          Configurable Catchment Area & Surface Coefficients
        </h5>

        <div className="row g-4">
          <div className="col-md-4">
            <label className="form-label fw-bold text-dark fs-7">Rainfall Depth (mm):</label>
            <input 
              type="number" 
              className="form-control" 
              value={rainfallMm} 
              onChange={(e) => setRainfallMm(Number(e.target.value))}
            />
            <div className="text-muted fs-7 mt-1">Current college weather station gauge.</div>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold text-dark fs-7">Catchment Roof Area (m²):</label>
            <input 
              type="number" 
              className="form-control" 
              value={catchmentArea} 
              onChange={(e) => setCatchmentArea(Number(e.target.value))}
            />
            <div className="text-muted fs-7 mt-1">Academic blocks, library & workshop rooftops.</div>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold text-dark fs-7">Runoff Coefficient (C):</label>
            <select 
              className="form-select" 
              value={runoffCoeff} 
              onChange={(e) => setRunoffCoeff(Number(e.target.value))}
            >
              <option value="0.90">0.90 – Concrete Roof Slab</option>
              <option value="0.85">0.85 – Terracotta / Glazed Tiles (College Standard)</option>
              <option value="0.75">0.75 – Corrugated Metal Roofing</option>
              <option value="0.60">0.60 – Paved Interlocking Pavers</option>
            </select>
            <div className="text-muted fs-7 mt-1">Surface material drainage factor.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RainwaterPage;
