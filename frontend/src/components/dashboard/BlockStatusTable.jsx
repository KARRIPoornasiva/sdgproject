import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, AlertTriangle, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

const BlockStatusTable = () => {
  const { blocks } = useSimulator();
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Critical':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">Critical</span>;
      case 'Warning':
        return <span className="badge bg-warning bg-opacity-15 text-warning border border-warning border-opacity-25 px-2 py-1">Warning</span>;
      case 'Normal':
      default:
        return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">Normal</span>;
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'High':
        return <span className="text-danger fw-bold d-flex align-items-center gap-1"><AlertTriangle size={14} /> High (94%)</span>;
      case 'Medium':
        return <span className="text-warning fw-semibold d-flex align-items-center gap-1"><AlertCircle size={14} /> Medium</span>;
      case 'Low':
      default:
        return <span className="text-success fw-medium d-flex align-items-center gap-1"><CheckCircle2 size={14} /> Low</span>;
    }
  };

  return (
    <div className="dash-card mb-4">
      <div className="dash-card-header flex-wrap gap-2">
        <div>
          <h5 className="dash-card-title">
            <Table className="text-primary" size={20} />
            College Block Status & Risk Matrix
          </h5>
          <div className="text-muted fs-7 mt-1">
            Dynamic database-fed block ledger showing live consumption variance, tank capacities, and AI risk scoring.
          </div>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Live Readings
        </span>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Block</th>
              <th>Category</th>
              <th>Actual (L)</th>
              <th>Expected (L)</th>
              <th>Difference</th>
              <th>Tank Level</th>
              <th>AI Leakage Risk</th>
              <th>Status</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => {
              const diff = block.currentConsumption - block.expectedConsumption;
              const isExcess = diff > 0;
              return (
                <tr key={block.id} className={block.status === 'Critical' ? 'table-danger-row' : ''}>
                  <td>
                    <div className="fw-bold text-dark">{block.code}</div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>{block.name}</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-secondary border" style={{ fontSize: '0.72rem' }}>
                      {block.category}
                    </span>
                  </td>
                  <td className="fw-semibold text-dark">
                    {block.currentConsumption.toLocaleString()} L
                  </td>
                  <td className="text-muted">
                    {block.expectedConsumption.toLocaleString()} L
                  </td>
                  <td>
                    <span className={`fw-semibold d-flex align-items-center gap-1 ${isExcess ? 'text-danger' : 'text-success'}`}>
                      {isExcess ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {isExcess ? `+${diff.toLocaleString()}` : `${diff.toLocaleString()}`} L
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ height: '6px', width: '60px' }}>
                        <div 
                          className={`progress-bar ${block.tankPercentage >= 95 ? 'bg-danger' : block.tankPercentage >= 80 ? 'bg-info' : 'bg-primary'}`}
                          style={{ width: `${block.tankPercentage}%` }}
                        ></div>
                      </div>
                      <span className="fw-medium fs-7">{block.tankPercentage}%</span>
                    </div>
                  </td>
                  <td>
                    {getRiskBadge(block.leakageRisk)}
                  </td>
                  <td>
                    {getStatusBadge(block.status)}
                  </td>
                  <td className="text-end">
                    <button 
                      className="btn btn-sm btn-outline-primary py-1 px-2 d-inline-flex align-items-center gap-1"
                      onClick={() => navigate('/blocks')}
                      style={{ fontSize: '0.75rem' }}
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockStatusTable;
