import React, { useState } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  Moon, 
  Lightbulb, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Sliders, 
  Layers,
  ArrowRight,
  ShieldAlert,
  Zap,
  Clock
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

const AIModelsHub = () => {
  const { activeLeak, activeScenario } = useSimulator();
  const [selectedModel, setSelectedModel] = useState('ISOLATION_FOREST');

  const models = [
    {
      id: 'ISOLATION_FOREST',
      name: 'Isolation Forest (IF)',
      badge: 'Unsupervised ML',
      tagline: 'Multi-Variate Anomaly & Outlier Scorer',
      status: activeLeak ? 'Anomaly Flagged' : 'Normal',
      statusTone: activeLeak ? 'danger' : 'success',
      accuracy: '98.4% Precision',
      features: ['Flow L/min', 'Riser Pressure', 'Pump State', 'Occupancy Index'],
      currentScore: activeLeak ? '-0.74 (Outlier)' : '+0.22 (Inlier)',
      summary: 'Partitions continuous flow vectors across 100 decision trees to isolate abnormal sustained spikes in college blocks.',
      icon: ShieldAlert,
      latency: '14 ms',
    },
    {
      id: 'PROPHET_FORECAST',
      name: 'Prophet Demand Forecaster',
      badge: 'Time-Series Regression',
      tagline: 'Diurnal & Academic Calendar Predictor',
      status: 'Active Continuous',
      statusTone: 'info',
      accuracy: 'MAPE: 3.2%',
      features: ['Hour-of-Day', 'Day-of-Week', 'Exam Schedule', 'Weather/Rainfall'],
      currentScore: '1.39 ML Expected (Tomorrow)',
      summary: 'Decomposes trend, weekly academic cycles, and seasonal holiday variations with a 95% confidence uncertainty interval.',
      icon: TrendingUp,
      latency: '22 ms',
    },
    {
      id: 'NIGHT_CLASSIFIER',
      name: 'Night-Flow Classifier',
      badge: 'Chrono-Surveillance',
      tagline: 'Nocturnal Micro-Leakage Identifier (12-5 AM)',
      status: activeLeak ? 'High Risk' : 'Optimal',
      statusTone: activeLeak ? 'danger' : 'success',
      accuracy: '99.1% True Positives',
      features: ['Standby Baseline (100-300 L/h)', 'Pressure Gradient', 'Zero-Occupancy Check'],
      currentScore: activeLeak ? '2,100 L/h (+1,850 L/h Excess)' : '180 L/h (Normal)',
      summary: 'Surveys campus water risers when classrooms are closed to detect silent flush leaks, valve cracks, and pipe seepage.',
      icon: Moon,
      latency: '8 ms',
    },
    {
      id: 'PRESCRIPTIVE_ENGINE',
      name: 'Prescriptive Root-Cause Engine',
      badge: 'Expert Inference',
      tagline: 'Automated Diagnostic & Ticket Generator',
      status: activeLeak ? 'Action Dispatched' : 'Standing By',
      statusTone: activeLeak ? 'warning' : 'info',
      accuracy: '94.8% Match Rate',
      features: ['Failure Taxonomy', 'Component Cost Model', 'Hydraulic Impact Matrix'],
      currentScore: activeLeak ? 'Flush Valve Failure (94% Conf.)' : 'Zero Dispatches',
      summary: 'Maps anomaly signatures to probable mechanical root causes and auto-assembles technician maintenance workorders.',
      icon: Lightbulb,
      latency: '36 ms',
    },
  ];

  const currentModelData = models.find(m => m.id === selectedModel) || models[0];

  return (
    <div className="ai-hub-card mb-4 animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 pb-3 mb-3" style={{ borderBottom: '1px solid rgba(186, 230, 253, 0.3)' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center" 
               style={{ background: 'linear-gradient(135deg, #0284C7, #4F46E5)', width: '44px', height: '44px', boxShadow: '0 4px 16px rgba(2, 132, 199, 0.3)' }}>
            <Cpu size={22} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h5 className="fw-bold text-dark mb-0 font-display" style={{ fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                Integrated AI Model Intelligence Center
              </h5>
              <span className="data-origin-badge badge-ai">
                <Sparkles size={11} className="me-1" /> 4 Engines Active
              </span>
            </div>
            <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
              Multi-model ensemble: anomaly isolation, Prophet forecasting, night surveillance, and prescriptive dispatching.
            </div>
          </div>
        </div>

        <span className="badge px-3 py-2 fw-semibold"
              style={{ background: 'rgba(2, 132, 199, 0.06)', color: '#0284C7', border: '1px solid rgba(2, 132, 199, 0.15)', borderRadius: '50px', fontSize: '0.74rem' }}>
          FastAPI + Scikit-Learn + Prophet
        </span>
      </div>

      {/* Model Selection Tabs */}
      <div className="row g-2 mb-3">
        {models.map((m) => {
          const ModelIcon = m.icon;
          return (
            <div key={m.id} className="col-12 col-sm-6 col-xl-3">
              <div
                className={`ai-model-tab ${selectedModel === m.id ? 'active' : ''}`}
                onClick={() => setSelectedModel(m.id)}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge fw-semibold" 
                        style={{ fontSize: '0.66rem', background: 'rgba(100, 116, 139, 0.06)', color: '#64748B', border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: '20px' }}>
                    {m.badge}
                  </span>
                  <div className="d-flex align-items-center gap-1">
                    <span className={`ai-status-dot ${m.statusTone}`}></span>
                    <span className={`fw-bold text-${m.statusTone}`} style={{ fontSize: '0.7rem' }}>{m.status}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <ModelIcon size={16} className="text-primary flex-shrink-0" />
                  <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.84rem' }}>{m.name}</div>
                </div>
                <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>{m.tagline}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Model Deep-Dive Card */}
      <div className="ai-deep-dive">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-7">
            <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <currentModelData.icon size={20} className="text-primary" />
                <h6 className="fw-bold mb-0 font-display" style={{ fontSize: '1.05rem', color: '#0284C7' }}>
                  {currentModelData.name}
                </h6>
              </div>
              <span className="badge px-3 py-2 fw-semibold"
                    style={{ background: 'rgba(16, 185, 129, 0.06)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '50px', fontSize: '0.72rem' }}>
                ✓ {currentModelData.accuracy}
              </span>
            </div>
            <p className="text-muted mb-3" style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>
              {currentModelData.summary}
            </p>

            <div className="mb-0">
              <span className="text-dark fw-bold" style={{ fontSize: '0.78rem' }}>Input Feature Vectors:</span>
              <div className="d-flex flex-wrap gap-1 mt-2">
                {currentModelData.features.map((feat, idx) => (
                  <span key={idx} className="badge fw-medium" 
                        style={{ fontSize: '0.72rem', background: 'rgba(248, 250, 252, 0.8)', color: '#475569', border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: '20px', padding: '0.3rem 0.6rem' }}>
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-5">
            <div className="p-3 rounded-3" style={{ background: 'linear-gradient(180deg, rgba(248,250,252,0.8) 0%, rgba(255,255,255,0.9) 100%)', border: '1px solid var(--border-light)' }}>
              <div className="text-muted" style={{ fontSize: '0.76rem' }}>Current Model Diagnostic Output:</div>
              <div className="font-display text-dark mt-2 mb-2" style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                {currentModelData.currentScore}
              </div>
              <div className="d-flex justify-content-between align-items-center pt-2 text-muted" style={{ fontSize: '0.72rem', borderTop: '1px solid rgba(226, 232, 240, 0.5)' }}>
                <span className="d-flex align-items-center gap-1">
                  <Clock size={12} /> Latency: <strong>{currentModelData.latency}</strong>
                </span>
                <span className="d-flex align-items-center gap-1 text-success fw-semibold">
                  <Zap size={12} /> Online Synced
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelsHub;
