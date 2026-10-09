import React, { useState } from 'react';
import { Building2, Layers, Droplet, ArrowRight, ShieldCheck, Search, Filter } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const CampusPage = () => {
  const { blocks, totalConsumptionToday, totalWaterSaved } = useSimulator();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlocks = blocks.filter(b => {
    const matchesCat = selectedCategory === 'ALL' || b.category.toUpperCase() === selectedCategory;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            College Campus Infrastructure Overview
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Complete topology of college academic blocks, laboratory wings, administrative sectors, and utilities.
          </p>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Campus Telemetry Active
        </span>
      </div>

      {/* Campus Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Monitored College Bhavans</div>
            <div className="fs-3 fw-bold font-display text-dark">{blocks.length} Buildings</div>
            <div className="text-muted fs-7 mt-1">Academic, Labs, Innovation, Central</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Total Floor Footprint</div>
            <div className="fs-3 fw-bold font-display text-primary">
              {blocks.reduce((acc, b) => acc + (b.totalFloors || 0), 0)} Floors
            </div>
            <div className="text-muted fs-7 mt-1">Ground to 5th Floors</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Audited Water Sink Points</div>
            <div className="fs-3 fw-bold font-display text-info">
              {blocks.reduce((acc, b) => acc + (b.totalSinks || 0), 0)} Sinks
            </div>
            <div className="text-muted fs-7 mt-1">Table 2 Official University Audit</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Purified RO Kiosks</div>
            <div className="fs-3 fw-bold font-display text-success">40 Stations</div>
            <div className="text-muted fs-7 mt-1">IoT Telemetry Monitored</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="dash-card mb-4 p-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <div className="position-relative">
              <Search size={16} className="position-absolute ms-3 top-50 translate-middle-y text-muted" />
              <input
                type="text"
                className="form-control form-control-sm ps-5 bg-light"
                placeholder="Search bhavan name, code, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-8 d-flex justify-content-md-end gap-2 flex-wrap">
            {['ALL', 'ACADEMIC', 'LABORATORIES', 'INNOVATION', 'ADMINISTRATIVE', 'CENTRAL'].map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-light border'}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ fontSize: '0.78rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Blocks */}
      <div className="row g-3">
        {filteredBlocks.map((block) => (
          <div key={block.id} className="col-12 col-md-6 col-xl-4">
            <div className={`dash-card h-100 ${block.status === 'Critical' ? 'border-danger' : ''}`}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span className="badge bg-light text-primary border mb-1">{block.code}</span>
                  <h6 className="fw-bold text-dark mb-0">{block.name}</h6>
                </div>
                <span className={`badge ${block.status === 'Critical' ? 'bg-danger' : block.status === 'Warning' ? 'bg-warning text-dark' : 'bg-success'}`}>
                  {block.status}
                </span>
              </div>

              <div className="bg-light p-3 rounded-3 my-3" style={{ fontSize: '0.8rem' }}>
                <div className="d-flex justify-content-between py-1 border-bottom border-light">
                  <span className="text-muted">Today's Flow:</span>
                  <span className="fw-bold text-dark">{block.currentConsumption.toLocaleString()} L</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-light">
                  <span className="text-muted">Expected Baseline:</span>
                  <span className="text-muted">{block.expectedConsumption.toLocaleString()} L</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-light">
                  <span className="text-muted">Live Flow Rate:</span>
                  <span className="fw-bold text-primary">{block.flowRateLpm} L/min</span>
                </div>
                <div className="d-flex justify-content-between pt-1">
                  <span className="text-muted">Tank Level:</span>
                  <span className="fw-bold text-dark">{block.tankPercentage}%</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center text-muted fs-7">
                <span>{block.totalFloors} Floors • {block.washrooms} Washrooms</span>
                <span className={`fw-semibold ${block.riskScore > 50 ? 'text-danger' : 'text-success'}`}>
                  AI Risk: {block.riskScore}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampusPage;
