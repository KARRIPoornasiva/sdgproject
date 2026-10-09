import React from 'react';
import { Trees, CloudRain, Droplets, CheckCircle2, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const GardensPage = () => {
  const { gardenZones } = useSimulator();

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            Smart Landscaping & Garden Irrigation Automation
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Soil-moisture sensor gating, predictive rain lockouts, and STP non-potable micro-sprinkler automation.
          </p>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Soil Sensors Active
        </span>
      </div>

      {/* Grid of Garden Zones */}
      <div className="row g-4 mb-4">
        {gardenZones.map((zone) => {
          const isOff = zone.irrigationStatus === 'OFF';
          return (
            <div key={zone.id} className="col-12 col-lg-4">
              <div className="dash-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                      {zone.sprinklersCount} Sprinkler Nodes
                    </span>
                    <span className={`badge ${isOff ? 'bg-secondary' : 'bg-primary'}`}>
                      Irrigation: {zone.irrigationStatus}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1 font-display">{zone.name}</h5>
                  <div className="text-muted fs-7 mb-3">Fed by STP Recycled Water Line</div>

                  {/* Soil Moisture Bar */}
                  <div className="bg-light p-3 rounded-3 mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted fs-7">Soil Moisture Level:</span>
                      <span className="fw-bold text-dark fs-7">{zone.soilMoisturePct}%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className={`progress-bar ${zone.soilMoisturePct > 70 ? 'bg-success' : 'bg-warning'}`}
                        style={{ width: `${zone.soilMoisturePct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Gating Rule Display */}
                  <div className="p-3 bg-white rounded-3 border shadow-sm" style={{ fontSize: '0.78rem' }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Rain Expected:</span>
                      <strong className={zone.rainExpected ? 'text-primary' : 'text-muted'}>
                        {zone.rainExpected ? 'Yes (Rain Sensor Gate Active)' : 'No'}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Valve State:</span>
                      <strong className="text-dark">{zone.valveState}</strong>
                    </div>
                    <div className="pt-2 border-top text-muted">
                      <strong>AI Gating Reason:</strong> {zone.reason}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="text-muted fs-7">Water Saved Today:</span>
                  <span className="badge bg-success fs-7">+{zone.waterSavedTodayL.toLocaleString()} L</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GardensPage;
