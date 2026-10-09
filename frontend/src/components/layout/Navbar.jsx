import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Radio, 
  ShieldCheck, 
  User, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useSimulator } from '../../context/SimulatorContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, switchRole } = useAuth();
  const { livePulseTimestamp, activeLeak, tankAlertCount, isRunning, simulationSpeed } = useSimulator();
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Update live second counter
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((new Date() - new Date(livePulseTimestamp)) / 1000);
      setSecondsAgo(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [livePulseTimestamp]);

  return (
    <header className="top-navbar">
      {/* Left section: Hamburger & Search */}
      <div className="d-flex align-items-center gap-3">
        <button 
          className="btn btn-sm btn-light border-0 p-2 d-flex align-items-center rounded-circle"
          onClick={toggleSidebar}
          style={{ background: '#F1F5F9' }}
        >
          <Menu size={20} className="text-secondary" />
        </button>
        
        <div className="d-none d-md-flex align-items-center position-relative" style={{ width: '320px' }}>
          <Search size={16} className="position-absolute ms-3 text-muted" />
          <input 
            type="text" 
            className="form-control form-control-sm ps-5 bg-light border-0" 
            placeholder="Search blocks, sensors, tanks, tickets..."
            style={{ borderRadius: '20px', fontSize: '0.85rem', padding: '0.55rem 1rem 0.55rem 2.2rem' }}
          />
        </div>
      </div>

      {/* Center section: Live IoT Status Pulse */}
      <div className="d-none d-lg-flex align-items-center gap-3 px-3 py-1 bg-light rounded-pill border border-light">
        <div className="d-flex align-items-center gap-2">
          <span className="pulse-dot"></span>
          <span className="fw-semibold text-dark fs-7" style={{ fontSize: '0.8rem' }}>IoT System Online</span>
        </div>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>•</span>
        <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.76rem' }}>
          <RefreshCw size={12} className={isRunning ? "text-primary" : "text-muted"} />
          <span>Last Telemetry: <strong className="text-dark">{secondsAgo}s ago</strong></span>
        </div>
        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25" style={{ fontSize: '0.7rem' }}>
          {simulationSpeed}x Stream
        </span>
      </div>

      {/* Right section: Alerts, Role switcher & Profile */}
      <div className="d-flex align-items-center gap-3">
        {/* Notifications Dropdown */}
        <div className="position-relative">
          <button 
            className="btn btn-sm btn-light position-relative p-2 rounded-circle"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} className="text-secondary" />
            {(activeLeak || tankAlertCount > 0) && (
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-3" style={{ width: '320px', zIndex: 1100 }}>
              <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <h6 className="mb-0 fw-bold fs-7">Real-Time Alerts</h6>
                <span className="badge bg-danger">{activeLeak ? '1 Critical' : '0 Alerts'}</span>
              </div>
              {activeLeak ? (
                <div className="p-2 rounded bg-danger-subtle border border-danger-subtle mb-2">
                  <div className="d-flex align-items-start gap-2">
                    <AlertTriangle size={16} className="text-danger mt-1 flex-shrink-0" />
                    <div>
                      <div className="fw-bold text-danger fs-7">Critical Leakage Risk ({activeLeak.riskPercentage}%)</div>
                      <div className="text-muted fs-7">{activeLeak.block} – {activeLeak.location}</div>
                      <div className="text-danger fw-semibold mt-1" style={{ fontSize: '0.72rem' }}>Flow: {activeLeak.flowDetected} L/min (Expected: {activeLeak.expectedFlow})</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-muted fs-7">
                  <CheckCircle2 size={24} className="text-success mx-auto mb-1 d-block" />
                  All college blocks operating normally.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Role Selector */}
        <div className="d-none d-sm-block">
          <select 
            className="form-select form-select-sm border-0 bg-light fw-medium"
            value={user.role}
            onChange={(e) => switchRole(e.target.value)}
            style={{ fontSize: '0.8rem', borderRadius: '12px' }}
          >
            {Object.values(ROLES).map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* User Avatar */}
        <div className="d-flex align-items-center gap-2">
          <div 
            className="rounded-circle overflow-hidden border border-2 border-primary"
            style={{ width: '36px', height: '36px' }}
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-100 h-100 object-fit-cover"
            />
          </div>
          <div className="d-none d-xl-block text-start lh-sm">
            <div className="fw-semibold text-dark fs-7">{user.name}</div>
            <div className="text-muted" style={{ fontSize: '0.68rem' }}>{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
