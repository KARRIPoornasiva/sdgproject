import React, { useState } from 'react';
import { BellRing, AlertOctagon, AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const initialAlerts = [
  {
    id: "ALT-901",
    type: "Critical",
    title: "Continuous High Flow / Active Leakage",
    block: "Block G",
    location: "Ground Floor Washroom",
    details: "Flow rate 85 L/min sustained for > 40 minutes. AI risk confidence: 94%.",
    timestamp: "42 mins ago",
    status: "Active",
  },
  {
    id: "ALT-902",
    type: "Critical",
    title: "Tank Overflow Hazard",
    block: "Block G",
    location: "Overhead Tank #4",
    details: "Water level reached 97% while feed pump status is ON.",
    timestamp: "15 mins ago",
    status: "Active",
  },
  {
    id: "ALT-903",
    type: "High",
    title: "Elevated Night Baseline Flow",
    block: "Block B",
    location: "2nd Floor Laboratory Line",
    details: "Nocturnal flow at 480 L/h vs 160 L/h expected standby load.",
    timestamp: "Yesterday, 03:14 AM",
    status: "Acknowledged",
  },
  {
    id: "ALT-904",
    type: "Medium",
    title: "RO Reject Stream Water Wastage",
    block: "Central RO Plant",
    location: "Brine Discharge Line",
    details: "8,000 L of secondary reject unrecovered. Opportunity to divert to bus wash sump.",
    timestamp: "2 hours ago",
    status: "Pending Review",
  },
  {
    id: "ALT-905",
    type: "Information",
    title: "STP Recycled Water Quality Optimal",
    block: "STP Complex",
    location: "Clarifier Basin #2",
    details: "BOD at 8.5 mg/L and pH at 7.3. Non-potable reuse safety certified.",
    timestamp: "4 hours ago",
    status: "Logged",
  },
];

const AlertsPage = () => {
  const [filterType, setFilterType] = useState('ALL');
  const [alerts, setAlerts] = useState(initialAlerts);

  const filteredAlerts = alerts.filter(a => {
    if (filterType === 'ALL') return true;
    return a.type.toUpperCase() === filterType;
  });

  const getAlertIcon = (type) => {
    switch (type) {
      case 'Critical':
        return <AlertOctagon size={20} className="text-danger" />;
      case 'High':
        return <AlertTriangle size={20} className="text-warning" />;
      case 'Medium':
        return <AlertCircle size={20} className="text-primary" />;
      case 'Information':
      default:
        return <Info size={20} className="text-info" />;
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'Critical': return 'bg-danger';
      case 'High': return 'bg-warning text-dark';
      case 'Medium': return 'bg-primary';
      case 'Information': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            Real-Time Alert & Incident Dispatch Center
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Categorized alarms across Critical, High, Medium, and Informational campus water events.
          </p>
        </div>
        <span className="data-origin-badge badge-live">
          <span className="pulse-dot"></span> Live Alert Broker
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="dash-card mb-4 p-3">
        <div className="d-flex gap-2 flex-wrap">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFORMATION'].map((type) => (
            <button
              key={type}
              className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-light border'}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className={`dash-card mb-3 p-3 ${alert.type === 'Critical' ? 'border-danger bg-danger-subtle bg-opacity-10' : ''}`}>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div className="d-flex align-items-start gap-3">
                <div className="p-2 bg-white rounded-circle border shadow-sm mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className={`badge ${getBadgeClass(alert.type)}`}>{alert.type}</span>
                    <h6 className="fw-bold text-dark mb-0">{alert.title}</h6>
                  </div>
                  <div className="text-dark fs-7 mb-1">{alert.details}</div>
                  <div className="text-muted fs-7">
                    Location: <strong>{alert.block} ({alert.location})</strong> • {alert.timestamp}
                  </div>
                </div>
              </div>

              <div className="text-end">
                <span className="badge bg-light text-secondary border">{alert.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;
