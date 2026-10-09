import React from 'react';
import { 
  Droplet, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  Layers,
  Cpu,
  Gauge,
  Activity,
  Waves,
  BarChart3,
  Zap,
  Recycle
} from 'lucide-react';
import KpiCards from '../components/dashboard/KpiCards';
import AIModelsHub from '../components/dashboard/AIModelsHub';
import RealtimeWaterChart from '../components/dashboard/RealtimeWaterChart';
import BlockConsumptionBar from '../components/dashboard/BlockConsumptionBar';
import BlockStatusTable from '../components/dashboard/BlockStatusTable';
import AILeakDetectionPanel from '../components/dashboard/AILeakDetectionPanel';
import NightLeakageDetection from '../components/dashboard/NightLeakageDetection';
import OverheadTankMonitoring from '../components/dashboard/OverheadTankMonitoring';
import { useSimulator } from '../context/SimulatorContext';

const DashboardPage = ({ onOpenSimulator }) => {
  const { 
    activeScenario, 
    totalConsumptionToday, 
    totalRecycledWater, 
    totalWaterSaved, 
    activeLeakageCount,
    blocks 
  } = useSimulator();

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const heroStats = [
    { 
      icon: Waves, 
      label: 'Total Flow Today', 
      value: `${((totalConsumptionToday || 1420000) / 1000000).toFixed(2)} ML`,
      color: '#38BDF8'
    },
    { 
      icon: Recycle, 
      label: 'Recycled', 
      value: `${((totalRecycledWater || 650000) / 1000).toFixed(0)}K L`,
      color: '#2DD4BF'
    },
    { 
      icon: TrendingDown, 
      label: 'Water Saved', 
      value: `${((totalWaterSaved || 82500) / 1000).toFixed(1)}K L`,
      color: '#34D399'
    },
    { 
      icon: Gauge, 
      label: 'Active Blocks', 
      value: `${blocks?.length || 10}`,
      color: '#A78BFA'
    },
  ];

  return (
    <div className="page-container">
      {/* ── Premium Hero Banner ───────────────────────────── */}
      <div className="dashboard-hero animate-fade-in">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 position-relative" style={{ zIndex: 2 }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge px-3 py-2 fw-semibold" 
                    style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#7DD3FC', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.72rem', borderRadius: '50px' }}>
                <span className="pulse-dot me-1" style={{ width: 6, height: 6 }}></span>
                LIVE CAMPUS TELEMETRY
              </span>
              {activeScenario !== 'NORMAL' && (
                <span className="badge px-3 py-2 fw-semibold"
                      style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#C4B5FD', border: '1px solid rgba(139, 92, 246, 0.2)', fontSize: '0.72rem', borderRadius: '50px' }}>
                  ⚡ Simulator Active
                </span>
              )}
            </div>
            <h1 className="font-display text-white mb-1" style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)', letterSpacing: '-0.03em' }}>
              {greeting}, Water Manager 👋
            </h1>
            <p className="mb-0" style={{ color: 'rgba(148, 163, 184, 0.85)', fontSize: '0.88rem', maxWidth: '550px' }}>
              Executive Command Center for college campus water telemetry, AI predictions, and conservation insights.
            </p>
            <p className="mb-0 mt-1" style={{ color: 'rgba(100, 116, 139, 0.7)', fontSize: '0.76rem' }}>
              📅 {dateStr}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button 
              className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
              style={{ 
                background: 'rgba(124, 58, 237, 0.15)', 
                color: '#C4B5FD', 
                border: '1px solid rgba(124, 58, 237, 0.25)', 
                borderRadius: '50px',
                fontSize: '0.82rem',
                backdropFilter: 'blur(8px)'
              }}
              onClick={onOpenSimulator}
            >
              <Sliders size={15} />
              Virtual ESP32
              <span className="badge ms-1 px-2" 
                    style={{ background: 'rgba(124, 58, 237, 0.3)', color: '#DDD6FE', fontSize: '0.65rem', borderRadius: '20px' }}>
                {activeScenario === 'NORMAL' ? 'Ready' : 'Active'}
              </span>
            </button>
          </div>
        </div>

        {/* Hero Quick Stats */}
        <div className="d-flex flex-wrap gap-2 mt-3 position-relative" style={{ zIndex: 2 }}>
          {heroStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="hero-stat-pill">
                <Icon size={15} style={{ color: stat.color }} />
                <span style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '0.76rem' }}>{stat.label}:</span>
                <span className="hero-stat-value" style={{ color: stat.color }}>{stat.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── KPI Cards Grid ────────────────────────────────── */}
      <KpiCards />

      {/* ── Section Divider: AI Intelligence ──────────────── */}
      <div className="section-divider">
        <Cpu size={14} className="text-muted" />
        <span className="section-divider-label">AI Intelligence Hub</span>
        <div className="section-divider-line"></div>
      </div>

      {/* ── Multi-AI Model Hub ────────────────────────────── */}
      <AIModelsHub />

      {/* ── Section Divider: Leak Detection ───────────────── */}
      <div className="section-divider">
        <ShieldCheck size={14} className="text-muted" />
        <span className="section-divider-label">Leak Detection & Safety</span>
        <div className="section-divider-line"></div>
      </div>

      {/* ── AI Leak Detection Panel ───────────────────────── */}
      <AILeakDetectionPanel />

      {/* ── Section Divider: Analytics ─────────────────────── */}
      <div className="section-divider">
        <Activity size={14} className="text-muted" />
        <span className="section-divider-label">Real-Time Analytics</span>
        <div className="section-divider-line"></div>
      </div>

      {/* ── Real-Time Chart ───────────────────────────────── */}
      <RealtimeWaterChart />

      {/* ── 2-Column: Block Bar + Night Leak ──────────────── */}
      <div className="row g-4 mb-2">
        <div className="col-12 col-xl-7">
          <BlockConsumptionBar />
        </div>
        <div className="col-12 col-xl-5">
          <NightLeakageDetection />
        </div>
      </div>

      {/* ── Section Divider: Infrastructure ────────────────── */}
      <div className="section-divider">
        <BarChart3 size={14} className="text-muted" />
        <span className="section-divider-label">Infrastructure Monitoring</span>
        <div className="section-divider-line"></div>
      </div>

      {/* ── Overhead Tank Monitoring ──────────────────────── */}
      <OverheadTankMonitoring />

      {/* ── Block Status Table ────────────────────────────── */}
      <BlockStatusTable />
    </div>
  );
};

export default DashboardPage;
