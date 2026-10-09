import React, { useState } from 'react';
import {
  AlertOctagon, Droplets, Wrench, CheckCircle2, TrendingDown, Zap,
  Pipette, FlaskConical, Waves, Gauge, RotateCcw, ShieldAlert,
  Moon, Lightbulb, ClipboardList, DollarSign, Leaf, Settings,
  ChevronDown, ChevronUp, Filter, ArrowRight, Building2, Cpu
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

/* ── Real-world campus water problems dataset ───────── */
const waterProblems = [
  {
    id: 'P001',
    category: 'Leakage & Pipe Failure',
    title: 'Flush Valve & Tap Continuous Leakage',
    building: 'Bhaskar Bhavan – Ground Floor',
    severity: 'critical',
    icon: Pipette,
    iconBg: 'rgba(239,68,68,0.1)',
    iconColor: '#DC2626',
    description:
      'Commercial flush valves stuck in open-run mode and sensor-tap auto-close failure in washroom East Wing. Continuous flow at 85 L/min vs expected 18–25 L/min.',
    realWorldCauses: [
      'Float-valve membrane tear due to hard water mineral deposits',
      'Auto-sensor IR diode failure causing no-close condition',
      'Dual-flush diaphragm cracked under pressure cycling',
      'Corroded valve seat allowing constant bypass flow',
    ],
    aiDetected: true,
    aiModel: 'Isolation Forest (−0.74 score)',
    wasteLitresPerDay: 4640,
    wasteCostPerMonth: 18560,
    solutions: [
      'Immediately isolate the ground floor riser stop-cock valve',
      'Replace dual-flush diaphragm membrane (45-min task)',
      'Calibrate or swap IR sensor module on auto-taps',
      'Install IoT flow-meter on each riser for future early detection',
      'Apply anti-scale filter to inlet line to prevent mineral buildup',
    ],
    resolvedImpact: '4,640 L/day saved · ₹18,560/month recovered',
    status: 'active',
  },
  {
    id: 'P002',
    category: 'Night-Flow Leakage',
    title: 'Nocturnal Silent Leakage (12 AM–5 AM)',
    building: 'Bhaskar Bhavan & Ratan Tata Bhavan',
    severity: 'critical',
    icon: Moon,
    iconBg: 'rgba(99,102,241,0.1)',
    iconColor: '#6366F1',
    description:
      'Night-time baseline flow 2,100 L/h (expected: 100–300 L/h) in Bhaskar Bhavan and 480 L/h in Ratan Tata Bhavan. Buildings unoccupied — no legitimate consumption.',
    realWorldCauses: [
      'Pressurized risers with undetected micro-cracks in internal pipework',
      'Stuck urinal sensor valve on 2nd floor mechanical lab',
      'Overhead tank float valve running without cutoff',
      'No automated zone valve auto-shutoff during night zero-occupancy',
    ],
    aiDetected: true,
    aiModel: 'Night-Flow Classifier (99.1% TP rate)',
    wasteLitresPerDay: 6600,
    wasteCostPerMonth: 26400,
    solutions: [
      'Install automated night-mode zone-valve controller (12AM–5AM cutoff)',
      'Fit thermal-imaging pipe scanner to identify cold-spot micro-cracks',
      'Calibrate and test urinal sensor valves across all blocks monthly',
      'Install IoT flow-alert for readings >300 L/h post-midnight',
      'Implement pressure drop test on all building risers quarterly',
    ],
    resolvedImpact: '6,600 L/day saved · ₹26,400/month recovered',
    status: 'active',
  },
  {
    id: 'P003',
    category: 'RO Water Wastage',
    title: 'RO Reject Water Drain Loss (8,000 L/day)',
    building: 'Central RO Plant',
    severity: 'high',
    icon: FlaskConical,
    iconBg: 'rgba(59,130,246,0.1)',
    iconColor: '#2563EB',
    description:
      '8,000 L/day of RO reject water (TDS: 1,200–1,500 ppm) discharged directly to drain. This water is suitable for gardening and bus washing — a recoverable resource.',
    realWorldCauses: [
      'Secondary divert valve on reject line is closed/missing',
      'No secondary recovery tank connected to reject outlet',
      'TDS of reject water assumed unfit without testing for non-potable use',
      'Pipeline from RO reject to irrigation sump never commissioned',
    ],
    aiDetected: false,
    aiModel: 'Prescriptive Engine (Recommendation REC-02)',
    wasteLitresPerDay: 8000,
    wasteCostPerMonth: 32000,
    solutions: [
      'Install a reject-recovery divert manifold with solenoid valve',
      'Route 8,000 L reject to gardening auxiliary sump (TDS <1,500 ok for landscapes)',
      'Re-pipe reject stream to bus-washing bay — saves borewell extraction',
      'Install TDS inline sensor on reject line for real-time quality monitoring',
      'Optimize RO membrane pressure to improve recovery ratio from 66% → 75%',
    ],
    resolvedImpact: '8,000 L/day recovered · ₹32,000/month saved',
    status: 'open',
  },
  {
    id: 'P004',
    category: 'Overhead Tank Overflow',
    title: 'Tank Overflow & Float Switch Failure',
    building: 'Bhaskar Bhavan OHT (35,000 L capacity)',
    severity: 'critical',
    icon: Gauge,
    iconBg: 'rgba(245,158,11,0.1)',
    iconColor: '#D97706',
    description:
      'Overhead tank at 97% (33,950 L). Float switch miscalibrated — pump continues running past fill threshold. Risk of overflow wasting treated borewell water directly.',
    realWorldCauses: [
      "Float switch ball arm bent — doesn't activate at correct water level",
      'Pump auto-cut controller relay short-circuit',
      'No high-level ultrasonic cutoff backup installed',
      'Manual override left in ON state by maintenance crew',
    ],
    aiDetected: true,
    aiModel: 'Ultrasonic Tank Level Monitor',
    wasteLitresPerDay: 2000,
    wasteCostPerMonth: 8000,
    solutions: [
      'Immediately shut off Bhaskar Bhavan booster pump manually',
      'Replace float ball valve assembly and calibrate at 90% full',
      'Install dual-redundancy ultrasonic cutoff relay as backup',
      'Set SCADA alarm threshold at 92% tank level with pump auto-stop',
      'Schedule monthly float switch inspection across all OHTs',
    ],
    resolvedImpact: '2,000 L/day overflow prevented · ₹8,000/month saved',
    status: 'active',
  },
  {
    id: 'P005',
    category: 'Garden Irrigation Overwatering',
    title: 'Unnecessary Irrigation During Rain / High Soil Moisture',
    building: 'Central Quadrangle & Bhaskar Lawn',
    severity: 'medium',
    icon: Leaf,
    iconBg: 'rgba(16,185,129,0.1)',
    iconColor: '#059669',
    description:
      'Sprinkler system activated on timer even when soil moisture is 78% and active rainfall forecast is positive. Wastes ~12,000 L/day in unnecessary irrigation.',
    realWorldCauses: [
      'Old timer-based irrigation system has no soil moisture integration',
      'Soil moisture sensors not linked to zone valve controller',
      'Gardening staff manually override sensor-off signals',
      'No rain-skip relay installed on master controller',
    ],
    aiDetected: true,
    aiModel: 'Smart Irrigation Controller (SIC-AI)',
    wasteLitresPerDay: 12000,
    wasteCostPerMonth: 48000,
    solutions: [
      'Integrate soil moisture sensor data into irrigation zone controller',
      'Install rain-skip relay — auto-pause when rainfall >5 mm forecast',
      'Replace timer-based with ET (evapotranspiration) model controller',
      'Use STP recycled water (already 280,000 L/day allocated) for all irrigation',
      'Install drip irrigation in Zones 1 & 2 to cut usage by 40%',
    ],
    resolvedImpact: '12,000 L/day saved · ₹48,000/month in water + borewell energy',
    status: 'open',
  },
  {
    id: 'P006',
    category: 'STP Efficiency Loss',
    title: 'STP 5.8% Loss — Untreated Reject in Final Stage',
    building: 'STP Complex (Tertiary Treatment)',
    severity: 'medium',
    icon: RotateCcw,
    iconBg: 'rgba(20,184,166,0.1)',
    iconColor: '#0D9488',
    description:
      'STP inlet: 780,000 L/day, treated output: 650,000 L/day. 130,000 L lost in treatment inefficiency, sludge, and bypass. BOD level 8.5 mg/L (target <10) — tertiary stage underperforming.',
    realWorldCauses: [
      'Aeration tank DO (dissolved oxygen) drop below 2 mg/L during peak inflow',
      'Filter media in tertiary polishing stage requires backwash/replacement',
      'Sludge blanket rising — requires dewatering to maintain efficiency',
      'Inlet flow-rate exceeds rated capacity during lunch-hour peak (12–2 PM)',
    ],
    aiDetected: false,
    aiModel: 'STP Process Monitor',
    wasteLitresPerDay: 130000,
    wasteCostPerMonth: 52000,
    solutions: [
      'Increase aeration blower capacity or add supplemental aerators in tank 2',
      'Schedule tertiary filter backwash every 48 hours with automated controller',
      'Dewater and dispose of sludge bed — restore treatment volume',
      'Install equalization tank to buffer peak-hour inflow spikes',
      'Add real-time DO sensor alert when DO drops below 1.8 mg/L',
    ],
    resolvedImpact: 'Recover 30,000–50,000 L/day from STP · Reduce outsourced water need',
    status: 'open',
  },
  {
    id: 'P007',
    category: 'Borewell Over-extraction',
    title: 'Borewell #1 Continuous Extraction — Water Table Drop Risk',
    building: 'North Campus (near Bill Gates Bhavan)',
    severity: 'high',
    icon: Waves,
    iconBg: 'rgba(139,92,246,0.1)',
    iconColor: '#7C3AED',
    description:
      'Borewell #1 running 5.4 hrs/day extracting 64,800 L. Water table depth: 42 m (was 38 m a year ago — dropping). Excess extraction risks long-term groundwater depletion.',
    realWorldCauses: [
      'High consumption blocks (Bhaskar, Dining Halls) depend entirely on borewell',
      'No rainwater harvesting in north campus to recharge aquifer',
      "STP recycled water pipeline doesn't yet reach north campus sump",
      'No extraction quota enforced per borewell per day',
    ],
    aiDetected: false,
    aiModel: 'Sustainability Audit (SA-01)',
    wasteLitresPerDay: 20000,
    wasteCostPerMonth: 80000,
    solutions: [
      'Limit Borewell #1 to 4 hrs/day maximum — use STP recycled for flush/garden',
      'Build 2 rainwater harvesting pits near BGB block for aquifer recharge',
      'Extend STP recycled distribution pipeline to north campus sump (50m extension)',
      'Install groundwater level sensor with monthly trend reporting',
      'Apply for CGWB (Central Ground Water Board) groundwater audit compliance',
    ],
    resolvedImpact: '20,000 L/day borewell reduction · Long-term groundwater conservation',
    status: 'open',
  },
  {
    id: 'P008',
    category: 'Pump Energy Waste',
    title: 'Booster Pump Running Empty (High Tank Level)',
    building: 'Bhaskar Bhavan Booster Pump',
    severity: 'high',
    icon: Zap,
    iconBg: 'rgba(245,158,11,0.1)',
    iconColor: '#D97706',
    description:
      'Central sump to Bhaskar Bhavan booster pump (7.5 kW) running 4.8 hrs/day even though tank level is at 97%. Wastes 36 kWh/day unnecessarily. Water already at overflow risk.',
    realWorldCauses: [
      'Pump auto-cutoff relay failed — no signal from tank level controller',
      'Manual scheduling override not removed after maintenance',
      'No SCADA pump-tank level interlocking logic configured',
    ],
    aiDetected: true,
    aiModel: 'Pump State Monitor (Real-time)',
    wasteLitresPerDay: 0,
    wasteCostPerMonth: 12960,
    solutions: [
      'Immediately shut pump and set manual stop until relay is replaced',
      'Replace cutoff relay and test pump-level interlock before restart',
      'Configure SCADA rule: auto-stop pump at tank level ≥90%',
      'Schedule pump operational log review weekly to catch anomalies',
    ],
    resolvedImpact: '36 kWh/day energy saved · ₹12,960/month electricity savings',
    status: 'active',
  },
];

/* ── Severity color maps ─────────────────────────────── */
const severityMap = {
  critical: { label: 'Critical', cls: 'severity-critical', dot: '#EF4444' },
  high: { label: 'High', cls: 'severity-high', dot: '#F59E0B' },
  medium: { label: 'Medium', cls: 'severity-medium', dot: '#3B82F6' },
  low: { label: 'Low', cls: 'severity-low', dot: '#10B981' },
};

/* ── Single problem card component ──────────────────── */
const ProblemCard = ({ p }) => {
  const [expanded, setExpanded] = useState(false);
  const sv = severityMap[p.severity];
  const Icon = p.icon;
  const totalWasteMonthly = p.wasteLitresPerDay * 30;

  return (
    <div className={`problem-card ${p.severity} problem-card-${p.severity} mb-3 animate-fade-in`}>
      {/* Card header row */}
      <div className="d-flex align-items-start gap-3 mb-3">
        <div className="problem-icon-wrap" style={{ background: p.iconBg }}>
          <Icon size={22} style={{ color: p.iconColor }} />
        </div>
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            <span className={`severity-badge ${sv.cls}`}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: sv.dot, display: 'inline-block' }}></span>
              {sv.label}
            </span>
            <span className="badge fw-normal text-muted" style={{ background: 'rgba(100,116,139,0.07)', border: '1px solid rgba(226,232,240,0.8)', fontSize: '0.7rem', borderRadius: '20px' }}>
              {p.category}
            </span>
            {p.aiDetected && (
              <span className="data-origin-badge badge-ai">
                <Cpu size={11} className="me-1" /> AI Detected
              </span>
            )}
            <span className={`badge fw-semibold ms-auto ${p.status === 'active' ? 'text-danger' : 'text-success'}`}
                  style={{ background: p.status === 'active' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                           border: `1px solid ${p.status === 'active' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
                           borderRadius: '50px', fontSize: '0.7rem' }}>
              {p.status === 'active' ? '⚠ Active Issue' : '○ Open — Pending'}
            </span>
          </div>
          <h6 className="fw-bold mb-1 font-display" style={{ fontSize: '0.98rem', letterSpacing: '-0.02em' }}>{p.title}</h6>
          <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.76rem' }}>
            <Building2 size={12} /> {p.building}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted mb-3" style={{ fontSize: '0.83rem', lineHeight: 1.6 }}>{p.description}</p>

      {/* Waste metrics strip */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {p.wasteLitresPerDay > 0 && (
          <>
            <span className="impact-chip danger">
              <Droplets size={12} /> {p.wasteLitresPerDay.toLocaleString()} L/day wasted
            </span>
            <span className="impact-chip danger">
              <DollarSign size={12} /> ₹{p.wasteCostPerMonth.toLocaleString()}/month loss
            </span>
          </>
        )}
        {p.wasteCostPerMonth > 0 && p.wasteLitresPerDay === 0 && (
          <span className="impact-chip warning">
            <Zap size={12} /> ₹{p.wasteCostPerMonth.toLocaleString()}/month energy waste
          </span>
        )}
        {p.aiModel && (
          <span className="impact-chip info">
            <Cpu size={12} /> {p.aiModel}
          </span>
        )}
      </div>

      {/* Waste progress bar */}
      {p.wasteLitresPerDay > 0 && (
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.72rem' }}>
            <span className="text-muted fw-semibold">Monthly Waste Volume</span>
            <span className="fw-bold text-danger">{(totalWasteMonthly / 1000).toFixed(0)}K L/month</span>
          </div>
          <div className="waste-meter-bar">
            <div className="waste-meter-fill" style={{ width: `${Math.min(100, (p.wasteLitresPerDay / 15000) * 100)}%` }}></div>
          </div>
        </div>
      )}

      {/* Toggle solutions */}
      <button
        className="collapse-trigger w-100 rounded-3 mb-0"
        style={{ background: expanded ? 'rgba(239,246,255,0.8)' : 'rgba(248,250,252,0.7)', borderRadius: '10px', border: '1px solid var(--border-light)' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="d-flex align-items-center gap-2">
          <Wrench size={14} className="text-primary" />
          <span style={{ fontSize: '0.82rem' }}>AI-Guided Maintenance Solutions ({p.solutions.length} steps)</span>
        </div>
        {expanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
      </button>

      {expanded && (
        <div className="mt-2 p-3 rounded-3 animate-fade-in" style={{ background: 'rgba(239,246,255,0.5)', border: '1px solid rgba(59,130,246,0.15)' }}>
          {p.solutions.map((step, i) => (
            <div key={i} className="solution-step">
              <div className="solution-step-num" style={{ background: `linear-gradient(135deg, ${p.iconColor}, ${p.iconColor}99)`, minWidth: 24 }}>{i + 1}</div>
              <span style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}

          <div className="mt-3 p-2 rounded-3 d-flex align-items-center gap-2"
               style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
            <span className="fw-semibold" style={{ fontSize: '0.78rem', color: '#065F46' }}>
              Projected Impact: {p.resolvedImpact}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Main Page ───────────────────────────────────────── */
const WaterProblemsPage = () => {
  const { activeLeakageCount, criticalLeakCount, totalWaterSaved, maintenanceTickets } = useSimulator();
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(waterProblems.map(p => p.category))];

  const filtered = waterProblems.filter(p => {
    const matchSev = filter === 'all' || p.severity === filter;
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSev && matchCat;
  });

  const totalWasteLitresToday = waterProblems.reduce((a, p) => a + p.wasteLitresPerDay, 0);
  const totalWasteMonthly = waterProblems.reduce((a, p) => a + p.wasteCostPerMonth, 0);
  const activeCount = waterProblems.filter(p => p.status === 'active').length;
  const critCount = waterProblems.filter(p => p.severity === 'critical').length;

  return (
    <div className="page-container">
      {/* ── Hero Band ──────────────────────────────────── */}
      <div className="problems-hero animate-fade-in">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3" style={{ position: 'relative', zIndex: 2 }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span className="badge px-3 py-2 fw-semibold"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.72rem', borderRadius: '50px' }}>
                <span className="pulse-dot pulse-dot-danger me-1" style={{ width: 6, height: 6 }}></span>
                {activeCount} ACTIVE CAMPUS ISSUES
              </span>
              <span className="badge px-3 py-2 fw-semibold"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.72rem', borderRadius: '50px' }}>
                SDG 6 — Clean Water & Sanitation
              </span>
            </div>
            <h1 className="font-display text-white mb-1" style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.75rem)', letterSpacing: '-0.03em' }}>
              🔍 Real-World Water Problems & AI Solutions
            </h1>
            <p className="mb-0" style={{ color: 'rgba(148,163,184,0.85)', fontSize: '0.88rem', maxWidth: 600 }}>
              Live campus water wastage catalog — identified by AI anomaly detection, night surveillance, and prescriptive engine. Each problem includes root-cause analysis and step-by-step maintenance resolution.
            </p>
          </div>
          <div className="d-flex flex-column gap-2 align-items-end">
            <div className="hero-stat-pill">
              <Droplets size={15} style={{ color: '#EF4444' }} />
              <span style={{ color: 'rgba(200,200,200,0.8)', fontSize: '0.74rem' }}>Daily Waste:</span>
              <span style={{ color: '#FCA5A5', fontWeight: 700 }}>{(totalWasteLitresToday / 1000).toFixed(1)}K L</span>
            </div>
            <div className="hero-stat-pill">
              <DollarSign size={15} style={{ color: '#FCD34D' }} />
              <span style={{ color: 'rgba(200,200,200,0.8)', fontSize: '0.74rem' }}>Monthly Loss:</span>
              <span style={{ color: '#FCD34D', fontWeight: 700 }}>₹{(totalWasteMonthly / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Strip ────────────────────────────────── */}
      <div className="stat-strip animate-fade-in">
        <div className="stat-strip-item">
          <div className="stat-strip-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <AlertOctagon size={20} style={{ color: '#DC2626' }} />
          </div>
          <div>
            <div className="stat-strip-value text-danger">{critCount}</div>
            <div className="stat-strip-label">Critical Problems</div>
          </div>
        </div>
        <div className="stat-strip-item">
          <div className="stat-strip-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <ShieldAlert size={20} style={{ color: '#D97706' }} />
          </div>
          <div>
            <div className="stat-strip-value text-warning">{activeCount}</div>
            <div className="stat-strip-label">Active Issues</div>
          </div>
        </div>
        <div className="stat-strip-item">
          <div className="stat-strip-icon" style={{ background: 'rgba(239,68,68,0.08)' }}>
            <Droplets size={20} style={{ color: '#EF4444' }} />
          </div>
          <div>
            <div className="stat-strip-value text-danger">{(totalWasteLitresToday / 1000).toFixed(0)}K</div>
            <div className="stat-strip-label">L/day Wasted</div>
          </div>
        </div>
        <div className="stat-strip-item">
          <div className="stat-strip-icon" style={{ background: 'rgba(245,158,11,0.08)' }}>
            <DollarSign size={20} style={{ color: '#D97706' }} />
          </div>
          <div>
            <div className="stat-strip-value" style={{ color: '#D97706' }}>₹{(totalWasteMonthly / 1000).toFixed(0)}K</div>
            <div className="stat-strip-label">Monthly Loss</div>
          </div>
        </div>
        <div className="stat-strip-item">
          <div className="stat-strip-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <TrendingDown size={20} style={{ color: '#059669' }} />
          </div>
          <div>
            <div className="stat-strip-value text-success">{(totalWaterSaved / 1000).toFixed(1)}K</div>
            <div className="stat-strip-label">L Saved Today</div>
          </div>
        </div>
        <div className="stat-strip-item">
          <div className="stat-strip-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <Cpu size={20} style={{ color: '#2563EB' }} />
          </div>
          <div>
            <div className="stat-strip-value text-primary">{waterProblems.filter(p => p.aiDetected).length}</div>
            <div className="stat-strip-label">AI Detected</div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ────────────────────────────────── */}
      <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
        <div className="tab-bar">
          {['all', 'critical', 'high', 'medium'].map(f => (
            <button key={f} className={`btn-tab ${filter === f ? (f === 'critical' ? 'active-danger' : f === 'high' ? 'active' : 'active') : ''}`}
                    onClick={() => setFilter(f)}>
              {f === 'all' ? '🔍 All Problems' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="tab-bar">
          {categories.slice(0, 4).map(c => (
            <button key={c} className={`btn-tab ${categoryFilter === c ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(c)}>
              {c === 'all' ? 'All Categories' : c.split(' ')[0]}
            </button>
          ))}
        </div>
        <span className="text-muted ms-auto" style={{ fontSize: '0.78rem' }}>
          Showing {filtered.length} of {waterProblems.length} problems
        </span>
      </div>

      {/* ── Problem Cards Grid ────────────────────────── */}
      <div className="row g-3">
        {filtered.map((p, i) => (
          <div key={p.id} className={`col-12 col-xl-6 animate-fade-in animate-fade-in-delay-${(i % 4) + 1}`}>
            <ProblemCard p={p} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-12 text-center py-5 text-muted">
            <CheckCircle2 size={40} className="mb-3 text-success" />
            <div className="fw-semibold">No problems match the current filter.</div>
          </div>
        )}
      </div>

      {/* ── Summary: Total Recoverable Impact ─────────── */}
      <div className="dash-card mt-4">
        <h5 className="dash-card-title mb-3">
          <Lightbulb className="text-warning" size={20} />
          If All Problems Resolved — Projected Monthly Recovery
        </h5>
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="savings-metric-card">
              <div className="savings-metric-value">{(totalWasteLitresToday * 30 / 1000000).toFixed(2)} ML</div>
              <div className="text-muted mt-1" style={{ fontSize: '0.78rem' }}>Water Recovered/Month</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="savings-metric-card">
              <div className="savings-metric-value">₹{(totalWasteMonthly / 1000).toFixed(0)}K</div>
              <div className="text-muted mt-1" style={{ fontSize: '0.78rem' }}>Cost Savings/Month</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="danger-metric-card">
              <div className="danger-metric-value">{(totalWasteLitresToday / 1000).toFixed(0)}K L</div>
              <div className="text-muted mt-1" style={{ fontSize: '0.78rem' }}>Currently Lost/Day</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="danger-metric-card">
              <div className="danger-metric-value">₹{((totalWasteMonthly * 12) / 100000).toFixed(1)}L</div>
              <div className="text-muted mt-1" style={{ fontSize: '0.78rem' }}>Annual Financial Loss</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterProblemsPage;
