import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  ArrowDownRight,
  ArrowUpRight,
  Cpu,
  Cylinder,
  Droplets,
  Recycle,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

// Animated number counter hook
const useAnimatedValue = (target, duration = 600) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return current;
};

const KpiCards = () => {
  const {
    totalConsumptionToday,
    totalRecycledWater,
    totalWaterSaved,
    activeLeakageCount,
    criticalLeakCount,
    tankAlertCount,
    activeLeak,
  } = useSimulator();

  const formatConsumption = (litres) => {
    if (litres >= 1000000) {
      return `${(litres / 1000000).toFixed(2)} ML`;
    }
    return `${litres.toLocaleString()} L`;
  };

  const cards = [
    {
      key: 'consumption',
      label: "Today's Consumption",
      icon: Droplets,
      tone: 'water',
      value: formatConsumption(totalConsumptionToday || 1420000),
      trend: {
        direction: 'down',
        tone: 'success',
        label: '8.4%',
        detail: 'vs yesterday',
        icon: ArrowDownRight,
      },
      footer: {
        badgeClass: 'badge-live',
        badgeText: 'Live IoT',
        meta: 'Campus Total',
      },
      sparkColor: '#0284C7',
    },
    {
      key: 'recycled',
      label: 'Recycled Water',
      icon: Recycle,
      tone: 'recycled',
      value: `${(totalRecycledWater || 650000).toLocaleString()} L`,
      trend: {
        tone: 'info',
        label: 'STP Reuse:',
        detail: 'Gardens, Flush & Bus',
      },
      footer: {
        badgeClass: 'badge-live',
        badgeText: 'Live STP',
        meta: 'Non-Potable',
      },
      sparkColor: '#14B8A6',
    },
    {
      key: 'saved',
      label: 'Water Saved',
      icon: TrendingDown,
      tone: 'saved',
      value: `${(totalWaterSaved || 82500).toLocaleString()} L`,
      trend: {
        tone: 'success',
        label: 'Verified Impact',
        detail: 'Today',
        icon: Sparkles,
      },
      footer: {
        badgeClass: 'badge-estimate',
        badgeText: '📊 Estimate',
        meta: 'Repairs + Eco',
      },
      sparkColor: '#10B981',
    },
    {
      key: 'leaks',
      label: 'Active Leak Risks',
      icon: AlertOctagon,
      tone: 'leak',
      value: activeLeakageCount,
      trend: {
        tone: 'danger',
        label: `${criticalLeakCount} Critical`,
        detail: `${activeLeakageCount - criticalLeakCount} Warning`,
      },
      footer: {
        badgeClass: 'badge-ai',
        badgeText: '🤖 Isolation Forest',
        meta: '',
      },
      valueClass: 'text-danger',
      sparkColor: '#EF4444',
    },
    {
      key: 'tank',
      label: 'Tank Alerts',
      icon: Cylinder,
      tone: 'tank',
      value: tankAlertCount,
      trend: {
        tone: 'warning',
        label: '1 High (97%)',
        detail: '1 Warning',
      },
      footer: {
        badgeClass: 'badge-live',
        badgeText: 'Ultrasonic',
        meta: '',
      },
      valueClass: 'text-warning',
      sparkColor: '#F59E0B',
    },
    {
      key: 'ai',
      label: 'AI Campus Risk',
      icon: Cpu,
      tone: 'ai',
      value: activeLeak ? 'Elevated' : 'Low',
      trend: {
        tone: activeLeak ? 'danger' : 'success',
        label: activeLeak ? 'Block G (94%)' : 'All Zones Balanced',
        detail: activeLeak ? 'High Risk' : '',
      },
      footer: {
        badgeClass: 'badge-ai',
        badgeText: '🤖 Z-Score Model',
        meta: '',
      },
      valueClass: activeLeak ? 'text-danger' : 'text-success',
      sparkColor: '#8B5CF6',
    },
  ];

  // Mini sparkline SVG generator
  const MiniSparkline = ({ color }) => {
    const points = Array.from({ length: 12 }, (_, i) => {
      const y = 20 + Math.sin(i * 0.7 + Date.now() / 2000) * 12 + Math.random() * 4;
      return `${i * 8},${y}`;
    }).join(' ');

    return (
      <svg width="96" height="36" viewBox="0 0 96 36" style={{ opacity: 0.15, position: 'absolute', bottom: '50px', right: '8px' }}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="row g-3 mb-4">
      {cards.map(({ key, label, icon: Icon, tone, value, trend, footer, valueClass, sparkColor }, idx) => (
        <div key={key} className={`col-12 col-sm-6 col-xl-2 animate-fade-in animate-fade-in-delay-${idx + 1}`}>
          <div className={`kpi-card kpi-card-${tone} h-100`}>
            {/* Background sparkline decoration */}
            <MiniSparkline color={sparkColor} />

            <div className="kpi-card-header">
              <span className="kpi-card-label">{label}</span>
              <div className={`kpi-card-icon kpi-card-icon-${tone}`}>
                <Icon size={18} strokeWidth={2.2} />
              </div>
            </div>

            <div className="kpi-card-body">
              <div className={`kpi-value ${valueClass || ''}`}>{value}</div>
              <div className="kpi-card-trend">
                {trend.icon && <trend.icon size={13} className={`kpi-trend-icon ${trend.tone}`} />}
                {trend.direction === 'down' && !trend.icon && <ArrowDownRight size={13} className={`kpi-trend-icon ${trend.tone}`} />}
                {trend.label && <span className={`kpi-trend-label text-${trend.tone || 'muted'} fw-semibold`}>{trend.label}</span>}
                {trend.detail && <span className="kpi-trend-detail">{trend.detail}</span>}
              </div>
            </div>

            <div className="kpi-card-footer">
              <span className={`data-origin-badge ${footer.badgeClass}`}>
                {(footer.badgeText === 'Live IoT' || footer.badgeText === 'Live STP' || footer.badgeText === 'Ultrasonic')
                  ? <span className="pulse-dot" style={{ width: 6, height: 6 }}></span>
                  : null}
                {footer.badgeText}
              </span>
              {footer.meta ? <span className="kpi-card-meta">{footer.meta}</span> : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
