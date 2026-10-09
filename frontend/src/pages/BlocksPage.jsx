import React, { useState } from 'react';
import { Building, Droplet, ArrowUpRight, ArrowDownRight, Radio, Eye, AlertTriangle, CheckCircle2, Waves, Layers } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const BlocksPage = () => {
  const { blocks, activeLeak } = useSimulator();
  const [selectedBlock, setSelectedBlock] = useState(blocks[0]);

  const activeFloorData = selectedBlock.floorDistribution || [];

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            Aditya University Bhavans & Infrastructure Telemetry
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Floor-by-floor water sink points, washroom batteries, and riser flow telemetry audited across college buildings.
          </p>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Telemetry Polling (2.5s)
        </span>
      </div>

      {/* Block Selector Carousel */}
      <div className="d-flex gap-2 overflow-x-auto pb-2 mb-4">
        {blocks.map((b) => (
          <button
            key={b.id}
            className={`btn btn-sm px-3 py-2 text-nowrap rounded-3 ${selectedBlock.id === b.id ? 'btn-primary shadow-sm' : 'btn-white bg-white border'}`}
            onClick={() => setSelectedBlock(b)}
          >
            <span className="fw-bold">{b.code}</span>
            <span className={`badge ms-2 ${b.status === 'Critical' ? 'bg-danger' : b.status === 'Warning' ? 'bg-warning text-dark' : 'bg-light text-dark'}`} style={{ fontSize: '0.65rem' }}>
              {b.totalSinks} Sinks
            </span>
          </button>
        ))}
      </div>

      {/* Selected Block Detailed Header */}
      <div className="dash-card mb-4 border-primary border-opacity-25">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary px-2 py-1">{selectedBlock.code}</span>
              <h4 className="fw-bold text-dark mb-0 font-display">{selectedBlock.name}</h4>
            </div>
            <div className="text-muted fs-7 mt-1">
              Category: <strong>{selectedBlock.category}</strong> • Total Floors: <strong>{selectedBlock.totalFloors}</strong> • Audited Sink Points: <strong>{selectedBlock.totalSinks} Sinks</strong>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end">
              <div className="text-muted fs-7">AI Risk Index:</div>
              <div className={`fw-bold fs-5 ${selectedBlock.riskScore > 50 ? 'text-danger' : 'text-success'}`}>
                {selectedBlock.riskScore}% Risk
              </div>
            </div>
          </div>
        </div>

        {/* Floor-Wise Distribution Grid (From Table 2 Audit) */}
        <h6 className="fw-bold text-dark mt-3 mb-2 font-display fs-7 text-uppercase text-muted">
          Floor-Wise Water Sink Points & Flow Telemetry
        </h6>

        <div className="row g-3">
          {activeFloorData.map((fl, fIdx) => {
            const isAbnormalFloor = selectedBlock.code === 'Bhaskar Bhavan' && fIdx === 0 && activeLeak;

            return (
              <div key={fIdx} className="col-12 col-md-6 col-xl-4">
                <div className={`p-3 rounded-3 border h-100 ${isAbnormalFloor ? 'border-danger bg-danger-subtle bg-opacity-25' : 'bg-light'}`}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-dark fs-7">{fl.floor}</span>
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">
                      {fl.sinks} Sinks
                    </span>
                  </div>

                  <div className="space-y-1" style={{ fontSize: '0.78rem' }}>
                    <div className="d-flex justify-content-between text-muted py-1 border-bottom border-light">
                      <span>Washroom Battery Flow:</span>
                      <strong className={isAbnormalFloor ? 'text-danger fw-bold' : 'text-dark'}>
                        {isAbnormalFloor ? '85.0 L/min (Anomalous)' : `${fl.flowRateLpm} L/min`}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between text-muted py-1 border-bottom border-light">
                      <span>RO Drinking Kiosk:</span>
                      <strong className="text-dark">4.2 L/min</strong>
                    </div>
                    <div className="d-flex justify-content-between text-muted pt-1">
                      <span>Riser Pressure:</span>
                      <strong className="text-dark">2.4 bar (Stable)</strong>
                    </div>
                  </div>

                  {isAbnormalFloor && (
                    <div className="mt-2 p-1 bg-danger text-white rounded text-center fs-7 fw-bold">
                      ⚠️ Continuous Flow Anomaly
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlocksPage;
