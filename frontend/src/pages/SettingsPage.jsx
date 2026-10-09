import React from 'react';
import { Settings, Shield, User, Sliders, Database, Key, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            System Settings, Permissions & Governance
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Campus water baselines, alarm thresholds, IoT edge credentials, and role-based access controls.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* User profile & Active Session */}
        <div className="col-12 col-lg-6">
          <div className="dash-card h-100">
            <h5 className="dash-card-title mb-3">
              <User className="text-primary" size={20} />
              Current Authenticated Profile
            </h5>

            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="rounded-circle border" 
                style={{ width: '56px', height: '56px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="fw-bold text-dark mb-0">{user.name}</h6>
                <div className="text-muted fs-7">{user.email}</div>
                <span className="badge bg-primary mt-1">{user.role}</span>
              </div>
            </div>

            <div className="text-muted fs-7">
              Department: <strong>{user.department}</strong>
            </div>
          </div>
        </div>

        {/* Global Alert Thresholds */}
        <div className="col-12 col-lg-6">
          <div className="dash-card h-100">
            <h5 className="dash-card-title mb-3">
              <Sliders className="text-primary" size={20} />
              Campus Water Control Thresholds
            </h5>

            <div className="space-y-3" style={{ fontSize: '0.82rem' }}>
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span>Overhead Tank High Level Cutoff:</span>
                <strong>95%</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span>Overhead Tank Low Level Alarm:</span>
                <strong>20%</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span>Night Leakage Surveillance Window:</span>
                <strong>12:00 AM – 5:00 AM</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span>Commercial Water Tariff Rate:</span>
                <strong>₹45.00 / kL</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Safety & Compliance Constraints (Section 35) */}
        <div className="col-12">
          <div className="dash-card bg-light border">
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <Shield className="text-success" size={18} />
              Project Safety & Non-Harm Rules (Section 35)
            </h6>
            <ul className="mb-0 text-muted fs-7 space-y-1">
              <li>• System never claims 100% autonomous leakage detection; manual verification is required before maintenance sign-off.</li>
              <li>• Automated pump shutdowns are restricted to authorized control interlocks only.</li>
              <li>• Live sensor readings, simulated packets, and statistical predictions are explicitly labeled with data-origin tags.</li>
              <li>• Strictly scoped to college campus & blocks — no hostel or private personal data is collected or tracked.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
