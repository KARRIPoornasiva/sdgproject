import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, AlertCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

const NightLeakageDetection = () => {
  const { nightLeak, activeLeak } = useSimulator();
  const navigate = useNavigate();

  return (
    <div className="dash-card mb-4" style={{ background: '#0F172A', color: '#F8FAFC' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-circle" style={{ background: '#1E293B' }}>
            <Moon size={20} className="text-cyan" style={{ color: '#38BDF8' }} />
          </div>
          <div>
            <h5 className="mb-0 text-white font-display fs-6">
              🌙 Night-Time Leakage Monitoring
            </h5>
            <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
              Autonomous baseline surveillance window: <strong>12:00 AM – 5:00 AM</strong>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-dark border border-secondary text-info" style={{ fontSize: '0.7rem' }}>
            Low Occupancy Period
          </span>
        </div>
      </div>

      <div className="row g-3 align-items-center">
        <div className="col-12 col-md-3">
          <div className="p-3 rounded-3" style={{ background: '#1E293B', border: '1px solid #334155' }}>
            <div className="text-secondary fs-7">Monitored Target:</div>
            <div className="text-white fw-bold fs-6">{nightLeak.block}</div>
            <div className="text-info fs-7 mt-1">IT & Labs Complex</div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="p-3 rounded-3" style={{ background: '#1E293B', border: '1px solid #334155' }}>
            <div className="text-secondary fs-7">Expected Night Flow:</div>
            <div className="text-white fw-bold fs-6">{nightLeak.expectedNightFlow}</div>
            <div className="text-secondary fs-7 mt-1">Standby base load</div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="p-3 rounded-3" style={{ background: activeLeak ? 'rgba(239, 68, 68, 0.15)' : '#1E293B', border: activeLeak ? '1px solid #EF4444' : '1px solid #334155' }}>
            <div className="text-secondary fs-7">Actual Night Flow:</div>
            <div className={`fw-bold fs-6 ${activeLeak ? 'text-danger' : 'text-white'}`}>
              {activeLeak ? nightLeak.actualNightFlow : '180 L/hour'}
            </div>
            <div className="text-danger fs-7 mt-1 fw-semibold">
              {activeLeak ? `+${nightLeak.excessRate} Excess` : 'Normal baseline'}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="p-3 rounded-3 d-flex flex-column justify-content-between h-100" style={{ background: '#1E293B', border: '1px solid #334155' }}>
            <div>
              <div className="text-secondary fs-7">AI Diagnostic Result:</div>
              <div className="fw-bold fs-7 d-flex align-items-center gap-1 mt-1 text-warning">
                <AlertCircle size={14} />
                <span>{activeLeak ? nightLeak.aiResult : 'Baseline Stable'}</span>
              </div>
            </div>
            
            <button 
              className="btn btn-sm btn-info text-dark fw-bold mt-2 d-flex align-items-center justify-content-center gap-1"
              onClick={() => navigate('/leak-detection')}
            >
              <span>Investigate</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between text-secondary" style={{ fontSize: '0.7rem' }}>
        <span>Note: AI identifies <em>Possible Leakage</em>; physical visual inspection is mandatory prior to valve isolation.</span>
        <span className="text-info">Surveillance Active</span>
      </div>
    </div>
  );
};

export default NightLeakageDetection;
