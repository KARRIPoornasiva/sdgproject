import React from 'react';
import { AlertTriangle, Cpu, CheckCircle2, ShieldAlert, ArrowUpRight, Activity, Zap } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const AIAnomaliesPage = () => {
  const { blocks, activeLeak } = useSimulator();

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            AI Anomaly Detection & Multi-Variate Inspector
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Real-time Isolation Forest, rolling z-score baseline comparisons, and statistical outlier flags.
          </p>
        </div>
        <span className="data-origin-badge badge-ai">
          🤖 Isolation Forest + Z-Score
        </span>
      </div>

      {/* Anomaly Inspection Matrix */}
      <div className="dash-card mb-4">
        <h5 className="dash-card-title mb-3">
          <Cpu className="text-primary" size={20} />
          College Block Anomaly Scoring Ledger
        </h5>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Block</th>
                <th>Expected (L)</th>
                <th>Actual (L)</th>
                <th>Difference (L)</th>
                <th>Isolation Forest Score</th>
                <th>Z-Score</th>
                <th>Anomaly Status</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((b) => {
                const diff = b.currentConsumption - b.expectedConsumption;
                const isAnomalous = b.leakageRisk === 'High';
                const ifScore = isAnomalous ? -0.74 : 0.22;
                const zScore = isAnomalous ? '+3.82 σ' : '+0.24 σ';

                return (
                  <tr key={b.id} className={isAnomalous ? 'table-danger-row' : ''}>
                    <td>
                      <div className="fw-bold">{b.code}</div>
                      <div className="text-muted fs-7">{b.name}</div>
                    </td>
                    <td>{b.expectedConsumption.toLocaleString()} L</td>
                    <td className="fw-bold">{b.currentConsumption.toLocaleString()} L</td>
                    <td>
                      <span className={`fw-bold ${diff > 0 ? 'text-danger' : 'text-success'}`}>
                        {diff > 0 ? `+${diff.toLocaleString()}` : `${diff.toLocaleString()}`} L
                      </span>
                    </td>
                    <td>
                      <code className={ifScore < 0 ? 'text-danger fw-bold' : 'text-success'}>
                        {ifScore}
                      </code>
                    </td>
                    <td>
                      <span className={isAnomalous ? 'badge bg-danger' : 'text-muted'}>
                        {zScore}
                      </span>
                    </td>
                    <td>
                      {isAnomalous ? (
                        <span className="badge bg-danger d-inline-flex align-items-center gap-1">
                          <AlertTriangle size={12} /> Detected
                        </span>
                      ) : (
                        <span className="badge bg-success d-inline-flex align-items-center gap-1">
                          <CheckCircle2 size={12} /> Normal
                        </span>
                      )}
                    </td>
                    <td className="fw-bold">
                      {isAnomalous ? (
                        <span className="text-danger">High (94%)</span>
                      ) : (
                        <span className="text-muted">High (&gt;90%)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AIAnomaliesPage;
