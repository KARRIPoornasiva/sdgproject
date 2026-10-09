import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Building,
  Radio,
  Cylinder,
  Zap,
  Drill,
  Recycle,
  Droplet,
  CloudRain,
  Trees,
  SearchAlert,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Wrench,
  Award,
  FileSpreadsheet,
  BellRing,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sliders,
  ShieldAlert
} from 'lucide-react';

const navItems = [
  { group: "Overview", items: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "College Campus", path: "/campus", icon: Building2 },
    { name: "College Blocks", path: "/blocks", icon: Building },
  ]},
  { group: "Infrastructure & IoT", items: [
    { name: "Sensors", path: "/sensors", icon: Radio },
    { name: "Water Tanks", path: "/tanks", icon: Cylinder },
    { name: "Pumps", path: "/pumps", icon: Zap },
    { name: "Borewells", path: "/borewells", icon: Drill },
  ]},
  { group: "Water Treatment & Eco", items: [
    { name: "STP Management", path: "/stp", icon: Recycle },
    { name: "RO Water", path: "/ro-water", icon: Droplet },
    { name: "Rainwater Harvesting", path: "/rainwater", icon: CloudRain },
    { name: "Gardens", path: "/gardens", icon: Trees },
  ]},
  { group: "AI & Incident Mgmt", items: [
    { name: "Leak Detection", path: "/leak-detection", icon: SearchAlert },
    { name: "AI Predictions", path: "/ai-predictions", icon: TrendingUp },
    { name: "AI Anomalies", path: "/ai-anomalies", icon: AlertTriangle },
    { name: "AI Recommendations", path: "/ai-recommendations", icon: Lightbulb },
  ]},
  { group: "Operations & Audits", items: [
    { name: "Maintenance", path: "/maintenance", icon: Wrench },
    { name: "Water Problems", path: "/water-problems", icon: ShieldAlert },
    { name: "Water Savings", path: "/water-savings", icon: Award },
    { name: "Reports", path: "/reports", icon: FileSpreadsheet },
    { name: "Alerts", path: "/alerts", icon: BellRing },
    { name: "Simulator", path: "/simulator", icon: Sliders },
    { name: "Settings", path: "/settings", icon: Settings },
  ]}
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <aside className={`sidebar-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <div className="rounded-circle d-flex align-items-center justify-content-center" 
               style={{ minWidth: '36px', height: '36px', background: 'linear-gradient(135deg, #0284C7, #06B6D4)' }}>
            <Droplet size={20} className="text-white fill-white" />
          </div>
          {!isCollapsed && (
            <div className="text-truncate">
              <div className="fw-bold text-white fs-6 lh-sm">Smart WaterGuard</div>
              <div className="text-info fs-7" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>AI CAMPUS SUITE</div>
            </div>
          )}
        </div>
        <button 
          className="btn btn-sm btn-link text-secondary p-0 d-flex align-items-center"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Scroll */}
      <div className="sidebar-scroll">
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="mb-2">
            {!isCollapsed && (
              <div className="sidebar-section-title">{group.group}</div>
            )}
            {group.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon size={18} style={{ minWidth: '18px' }} />
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-top border-secondary border-opacity-25" style={{ background: '#081220' }}>
          <div className="d-flex align-items-center justify-content-between text-muted fs-7" style={{ fontSize: '0.72rem' }}>
            <span>Campus Scope:</span>
            <span className="badge bg-secondary bg-opacity-50 text-light">College Only</span>
          </div>
          <div className="text-muted text-truncate mt-1" style={{ fontSize: '0.68rem' }}>
            SDG 6: Clean Water & San.
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
