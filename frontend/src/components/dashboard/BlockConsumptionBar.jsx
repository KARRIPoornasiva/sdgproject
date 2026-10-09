import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { Building2, TrendingUp, TrendingDown, AlertTriangle, Layers } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const actual = payload.find(p => p.dataKey === 'currentConsumption')?.value || 0;
    const expected = payload.find(p => p.dataKey === 'expectedConsumption')?.value || 0;
    const delta = actual - expected;
    const isExcess = delta > 0;
    const pct = expected ? ((delta / expected) * 100).toFixed(1) : 0;

    return (
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid rgba(226,232,240,0.9)',
        borderRadius: '12px',
        padding: '12px 14px',
        boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
        fontSize: '0.82rem',
        minWidth: 180,
      }}>
        <div className="fw-bold mb-2" style={{ color: '#0F172A', fontSize: '0.88rem', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
          {label}
        </div>
        <div className="d-flex justify-content-between mb-1">
          <span style={{ color: '#0284C7' }}>● Actual:</span>
          <span className="fw-bold">{actual.toLocaleString()} L</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span style={{ color: '#94A3B8' }}>○ Expected:</span>
          <span className="fw-semibold text-muted">{expected.toLocaleString()} L</span>
        </div>
        <div className={`d-flex justify-content-between align-items-center pt-1 border-top fw-bold`}
             style={{ color: isExcess ? '#DC2626' : '#059669', fontSize: '0.84rem' }}>
          {isExcess ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{isExcess ? `+${delta.toLocaleString()} L excess (${pct}%)` : `${Math.abs(delta).toLocaleString()} L saved`}</span>
        </div>
      </div>
    );
  }
  return null;
};

const BlockConsumptionBar = () => {
  const { blocks } = useSimulator();
  const [sortBy, setSortBy] = useState('consumption'); // 'consumption' | 'excess' | 'alpha'

  const sortedBlocks = [...blocks].sort((a, b) => {
    if (sortBy === 'excess') return (b.currentConsumption - b.expectedConsumption) - (a.currentConsumption - a.expectedConsumption);
    if (sortBy === 'alpha') return a.code.localeCompare(b.code);
    return b.currentConsumption - a.currentConsumption;
  });

  const totalActual = blocks.reduce((s, b) => s + b.currentConsumption, 0);
  const totalExpected = blocks.reduce((s, b) => s + b.expectedConsumption, 0);
  const overallExcess = totalActual - totalExpected;

  return (
    <div className="dash-card mb-4">
      <div className="dash-card-header flex-wrap gap-2">
        <div>
          <h5 className="dash-card-title">
            <Building2 className="text-primary" size={20} />
            College Block Consumption (Actual vs Expected)
          </h5>
          <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
            <span className="data-origin-badge badge-live">
              <span className="pulse-dot" style={{ width: 6, height: 6 }}></span> Live IoT
            </span>
            <span className="text-muted" style={{ fontSize: '0.74rem' }}>
              Total: <strong className="text-dark">{(totalActual / 1000).toFixed(0)}K L</strong>
              {overallExcess > 0
                ? <span className="text-danger ms-1">(+{(overallExcess / 1000).toFixed(0)}K L over baseline)</span>
                : <span className="text-success ms-1">({Math.abs(overallExcess / 1000).toFixed(0)}K L under baseline)</span>
              }
            </span>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="tab-bar">
          <button className={`btn-tab ${sortBy === 'consumption' ? 'active' : ''}`} onClick={() => setSortBy('consumption')}>
            By Consumption
          </button>
          <button className={`btn-tab ${sortBy === 'excess' ? 'active-danger' : ''}`} onClick={() => setSortBy('excess')}>
            By Excess
          </button>
          <button className={`btn-tab ${sortBy === 'alpha' ? 'active' : ''}`} onClick={() => setSortBy('alpha')}>
            A–Z
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart
            data={sortedBlocks}
            margin={{ top: 8, right: 8, left: 8, bottom: 30 }}
            barCategoryGap="22%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="shortCode"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
              angle={-25}
              textAnchor="end"
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(241,245,249,0.6)' }} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '0.78rem' }}
            />
            <Bar name="Actual (L)" dataKey="currentConsumption" radius={[5, 5, 0, 0]}>
              {sortedBlocks.map((b, i) => {
                const isOver = b.currentConsumption > b.expectedConsumption * 1.1;
                const isWarn = b.currentConsumption > b.expectedConsumption * 1.02;
                return (
                  <Cell
                    key={i}
                    fill={isOver ? '#EF4444' : isWarn ? '#F59E0B' : '#0284C7'}
                    fillOpacity={0.85}
                  />
                );
              })}
            </Bar>
            <Bar name="Expected Baseline (L)" dataKey="expectedConsumption" fill="#CBD5E1" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend footnote */}
      <div className="d-flex flex-wrap gap-2 pt-2 mt-1 border-top" style={{ fontSize: '0.72rem' }}>
        <span className="d-flex align-items-center gap-1"><span style={{ width: 10, height: 10, borderRadius: 2, background: '#EF4444', display: 'inline-block' }}></span> &gt;10% over baseline</span>
        <span className="d-flex align-items-center gap-1"><span style={{ width: 10, height: 10, borderRadius: 2, background: '#F59E0B', display: 'inline-block' }}></span> 2–10% over baseline</span>
        <span className="d-flex align-items-center gap-1"><span style={{ width: 10, height: 10, borderRadius: 2, background: '#0284C7', display: 'inline-block' }}></span> Normal / Under baseline</span>
      </div>
    </div>
  );
};

export default BlockConsumptionBar;
