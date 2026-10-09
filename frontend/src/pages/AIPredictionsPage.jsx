import React, { useState } from 'react';
import { TrendingUp, Calendar, Cpu, ShieldCheck, HelpCircle, Info } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const forecastData7d = [
  { day: "Mon (Tomorrow)", actual: null, predicted: 1390000, lowerBound: 1320000, upperBound: 1460000 },
  { day: "Tue", actual: null, predicted: 1410000, lowerBound: 1330000, upperBound: 1490000 },
  { day: "Wed", actual: null, predicted: 1430000, lowerBound: 1350000, upperBound: 1510000 },
  { day: "Thu (Lab Day)", actual: null, predicted: 1480000, lowerBound: 1390000, upperBound: 1570000 },
  { day: "Fri", actual: null, predicted: 1400000, lowerBound: 1320000, upperBound: 1480000 },
  { day: "Sat (Half Day)", actual: null, predicted: 520000, lowerBound: 480000, upperBound: 560000 },
  { day: "Sun (Holiday)", actual: null, predicted: 310000, lowerBound: 280000, upperBound: 340000 },
];

const AIPredictionsPage = () => {
  const [horizon, setHorizon] = useState('7d'); // '1h', 'tomorrow', '7d', '30d'

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h1 className="h3 mb-0 font-display fw-bold text-dark">
              AI Water Demand Forecasting Engine
            </h1>
            <span className="data-origin-badge badge-ai">
              🤖 Prophet / Gradient Boosted Model
            </span>
          </div>
          <p className="text-muted fs-7 mb-0 mt-1">
            Predictive demand curves based on historical trends, academic timetable schedules, seasonal climate, and campus events.
          </p>
        </div>

        <div className="btn-group btn-group-sm" role="group">
          {['1h (Next Hour)', 'Tomorrow', '7d (Next 7 Days)', '30d (Next Month)'].map((h, idx) => {
            const key = ['1h', 'tomorrow', '7d', '30d'][idx];
            return (
              <button
                key={key}
                type="button"
                className={`btn ${horizon === key ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setHorizon(key)}
              >
                {h}
              </button>
            );
          })}
        </div>
      </div>

      {/* Forecast Accuracy Notice */}
      <div className="dash-card mb-4 bg-light border">
        <div className="d-flex align-items-center gap-2 text-muted fs-7">
          <Info size={16} className="text-primary flex-shrink-0" />
          <span>
            <strong>Safety & Transparency Notice:</strong> AI predictions represent statistical estimations with uncertainty intervals (95% CI) and are never presented as actual real-time measurements.
          </span>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="dash-card mb-4">
        <div className="dash-card-header">
          <div>
            <h5 className="dash-card-title">
              <TrendingUp className="text-primary" size={20} />
              College Campus Projected Water Demand ({horizon.toUpperCase()})
            </h5>
            <div className="text-muted fs-7 mt-1">
              Solid line indicates expected mean forecast; shaded region bounds the 95% confidence variance.
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <AreaChart data={forecastData7d} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
              <YAxis 
                stroke="#64748B" 
                fontSize={12}
                tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 10 }} />
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="transparent"
                fill="#BAE6FD"
                fillOpacity={0.4}
                name="Confidence Interval (95% CI)"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#0284C7"
                strokeWidth={3}
                fill="transparent"
                name="Predicted Mean Demand (L)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Horizon Summary Grid */}
      <div className="row g-3">
        <div className="col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Next 1 Hour Demand</div>
            <div className="fs-4 fw-bold font-display text-dark">142,500 L</div>
            <div className="text-muted fs-7 mt-1">±4.2% Uncertainty</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">Tomorrow's Forecast</div>
            <div className="fs-4 fw-bold font-display text-primary">1.39 ML</div>
            <div className="text-muted fs-7 mt-1">Working Tuesday Timetable</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">7-Day Total Demand</div>
            <div className="fs-4 fw-bold font-display text-info">8.44 ML</div>
            <div className="text-muted fs-7 mt-1">Includes 2 Weekend Days</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="dash-card p-3">
            <div className="text-muted fs-7">30-Day Monthly Forecast</div>
            <div className="fs-4 fw-bold font-display text-success">38.2 ML</div>
            <div className="text-muted fs-7 mt-1">Pre-Monsoon Base Schedule</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictionsPage;
