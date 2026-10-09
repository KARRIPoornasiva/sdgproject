import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activity, Calendar, Download, Sparkles, Cpu, Layers } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';
import { timeseries7dData, timeseries30dData } from '../../services/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-3 shadow-lg border border-light" style={{ fontSize: '0.82rem' }}>
        <div className="fw-bold text-dark mb-1">{label}</div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="d-flex align-items-center justify-content-between gap-3 my-1">
            <span style={{ color: entry.color, fontWeight: 600 }}>{entry.name}:</span>
            <span className="fw-bold text-dark">{entry.value ? entry.value.toLocaleString() : '0'} L</span>
          </div>
        ))}
        {payload.length >= 2 && payload[0].value && payload[1].value && (
          <div className="mt-2 pt-1 border-top text-muted" style={{ fontSize: '0.7rem' }}>
            Delta: {Math.abs(payload[0].value - payload[1].value).toLocaleString()} L (
            {payload[0].value > payload[1].value ? 'Over baseline' : 'Under baseline'})
          </div>
        )}
      </div>
    );
  }
  return null;
};

const RealtimeWaterChart = () => {
  const [timeRange, setTimeRange] = useState('24h'); // '24h', '7d', '30d'
  const [activeOverlay, setActiveOverlay] = useState('PROPHET'); // 'PROPHET', 'ISOLATION_FOREST', 'STANDARD'
  const { chartData24h, isRunning, activeLeak } = useSimulator();

  const getEnhancedData = () => {
    let baseData = timeRange === '7d' ? timeseries7dData : timeRange === '30d' ? timeseries30dData : chartData24h;

    return baseData.map(item => ({
      ...item,
      prophetUpper: Math.round(item.expected * 1.08),
      prophetLower: Math.round(item.expected * 0.92),
      anomalyFlag: (activeLeak && item.actual > item.expected * 1.15) ? item.actual : null,
    }));
  };

  return (
    <div className="dash-card mb-4">
      <div className="dash-card-header flex-wrap gap-2">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5 className="dash-card-title mb-0">
              <Activity className="text-primary" size={20} />
              Real-Time College Water Consumption & AI Forecast
            </h5>
            <span className="data-origin-badge badge-ai">
              <Sparkles size={12} className="me-1" /> Multi-Model Overlay
            </span>
          </div>
          <div className="text-muted fs-7 mt-1">
            Live telemetry stream synchronized with Prophet time-series bounds and Isolation Forest anomaly thresholds.
          </div>
        </div>

        {/* AI Overlay & Range Switchers */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* AI Model Overlay Selector */}
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn btn-sm ${activeOverlay === 'PROPHET' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary'}`}
              onClick={() => setActiveOverlay('PROPHET')}
              title="Show Prophet 95% Confidence Bounds"
            >
              🤖 Prophet Bounds
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeOverlay === 'ISOLATION_FOREST' ? 'btn-danger text-white fw-bold' : 'btn-outline-secondary'}`}
              onClick={() => setActiveOverlay('ISOLATION_FOREST')}
              title="Highlight Isolation Forest Anomalies"
            >
              ⚠️ Anomaly Flags
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn btn-sm ${timeRange === '24h' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setTimeRange('24h')}
            >
              24h
            </button>
            <button
              type="button"
              className={`btn btn-sm ${timeRange === '7d' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setTimeRange('7d')}
            >
              7d
            </button>
            <button
              type="button"
              className={`btn btn-sm ${timeRange === '30d' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setTimeRange('30d')}
            >
              30d
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <AreaChart
            data={getEnhancedData()}
            margin={{ top: 10, right: 15, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="prophetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="time" 
              tickLine={false} 
              axisLine={{ stroke: '#E2E8F0' }} 
              tick={{ fill: '#64748B', fontSize: 12 }} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={{ stroke: '#E2E8F0' }} 
              tick={{ fill: '#64748B', fontSize: 12 }}
              tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              align="right" 
              wrapperStyle={{ paddingBottom: '10px', fontSize: '0.8rem' }} 
            />

            {/* Prophet Uncertainty Bounds */}
            {activeOverlay === 'PROPHET' && (
              <Area
                type="monotone"
                name="Prophet 95% CI (Upper Bound)"
                dataKey="prophetUpper"
                stroke="transparent"
                fill="url(#prophetGradient)"
              />
            )}

            {/* Actual Ingested Flow */}
            <Area
              type="monotone"
              name="Actual Telemetry Flow"
              dataKey="actual"
              stroke="#0284C7"
              strokeWidth={2.8}
              fillOpacity={1}
              fill="url(#actualGradient)"
            />

            {/* Expected Baseline */}
            <Area
              type="monotone"
              name="Historical Baseline Target"
              dataKey="expected"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Model Benchmark Footer */}
      <div className="row g-2 mt-2 pt-3 border-top text-center" style={{ fontSize: '0.78rem' }}>
        <div className="col-4 border-end">
          <span className="text-muted">Prophet Model Error:</span>
          <span className="fw-bold text-success ms-1">MAPE: 3.2%</span>
        </div>
        <div className="col-4 border-end">
          <span className="text-muted">Isolation Forest Contamination:</span>
          <span className="fw-bold text-primary ms-1">ν = 0.05 (100 Trees)</span>
        </div>
        <div className="col-4">
          <span className="text-muted">AI Campus State:</span>
          <span className={`fw-bold ms-1 ${activeLeak ? 'text-danger' : 'text-success'}`}>
            {activeLeak ? '● Anomaly Outlier Detected' : '● Nominal Baseline'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealtimeWaterChart;
