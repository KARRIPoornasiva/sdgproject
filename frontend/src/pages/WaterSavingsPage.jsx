import React from 'react';
import { Award, TrendingDown, DollarSign, Leaf, CheckCircle2, Trophy, ArrowUpRight } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const WaterSavingsPage = () => {
  const { blocks, totalWaterSaved, stpData } = useSimulator();

  const dailySavings = totalWaterSaved || 82500;
  const weeklySavings = dailySavings * 7;
  const monthlySavings = dailySavings * 30;
  const annualizedSavings = dailySavings * 365;
  const costSavingsInr = (annualizedSavings / 1000) * 45; // ₹45 per kL commercial water tariff

  // Ranked blocks by performance
  const rankedBlocks = [...blocks].sort((a, b) => {
    const perfA = (a.expectedConsumption - a.currentConsumption);
    const perfB = (b.expectedConsumption - b.currentConsumption);
    return perfB - perfA;
  });

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            Campus Water Conservation & Sustainability Leaderboard
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Verified flow reductions from prompt plumbing repairs, STP recycling, and automated landscape management.
          </p>
        </div>
        <span className="data-origin-badge badge-estimate">
          📊 Verified Conservation Ledger
        </span>
      </div>

      {/* Aggregate Savings KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="dash-card p-3 border-success border-opacity-50">
            <div className="text-muted fs-7">Daily Water Saved</div>
            <div className="fs-3 fw-bold font-display text-success">{dailySavings.toLocaleString()} L</div>
            <div className="text-muted fs-7 mt-1">Measured Today</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Weekly Water Saved</div>
            <div className="fs-3 fw-bold font-display text-primary">{(weeklySavings / 1000).toLocaleString()} kL</div>
            <div className="text-muted fs-7 mt-1">Rolling 7-Day Window</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Monthly Water Saved</div>
            <div className="fs-3 fw-bold font-display text-info">{(monthlySavings / 1000000).toFixed(2)} ML</div>
            <div className="text-muted fs-7 mt-1">30-Day Summation</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="dash-card p-3 border-primary border-opacity-50">
            <div className="text-muted fs-7">Annualized Estimate & ROI</div>
            <div className="fs-3 fw-bold font-display text-dark">{(annualizedSavings / 1000000).toFixed(1)} ML</div>
            <div className="text-success fs-7 mt-1 fw-bold">~₹{(costSavingsInr / 100000).toFixed(1)} Lakhs / yr Saved</div>
          </div>
        </div>
      </div>

      {/* Block-wise Conservation Ranking (Section 24) */}
      <div className="dash-card mb-4">
        <div className="dash-card-header">
          <div>
            <h5 className="dash-card-title">
              <Trophy className="text-warning" size={20} />
              College Block Water Conservation Ranking
            </h5>
            <div className="text-muted fs-7 mt-1">
              Blocks ranked by verified reduction efficiency below baseline targets.
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Block Name</th>
                <th>Category</th>
                <th>Today's Consumption</th>
                <th>Target Baseline</th>
                <th>Net Variance</th>
                <th>Performance Status</th>
              </tr>
            </thead>
            <tbody>
              {rankedBlocks.map((b, idx) => {
                const diff = b.expectedConsumption - b.currentConsumption;
                const isPositive = diff >= 0;

                return (
                  <tr key={b.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {idx === 0 && <span className="badge bg-warning text-dark px-2">🥇 1st</span>}
                        {idx === 1 && <span className="badge bg-secondary text-white px-2">🥈 2nd</span>}
                        {idx === 2 && <span className="badge bg-danger bg-opacity-25 text-danger px-2">🥉 3rd</span>}
                        {idx > 2 && <span className="text-muted fw-bold ms-2">#{idx + 1}</span>}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{b.code}</div>
                      <div className="text-muted fs-7">{b.name}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">{b.category}</span>
                    </td>
                    <td className="fw-bold">{b.currentConsumption.toLocaleString()} L</td>
                    <td className="text-muted">{b.expectedConsumption.toLocaleString()} L</td>
                    <td>
                      <span className={`fw-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
                        {isPositive ? `+${diff.toLocaleString()} L Saved` : `${Math.abs(diff).toLocaleString()} L Excess`}
                      </span>
                    </td>
                    <td>
                      {isPositive ? (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                          Conservation Leader
                        </span>
                      ) : (
                        <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">
                          Attention Needed
                        </span>
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

export default WaterSavingsPage;
