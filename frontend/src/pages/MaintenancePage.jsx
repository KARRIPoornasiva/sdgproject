import React, { useState } from 'react';
import {
  Wrench, AlertOctagon, CheckCircle2, Clock, User, Building2, MapPin,
  Droplets, TrendingDown, Cpu, ChevronDown, ChevronUp, Plus, ArrowRight,
  RefreshCw, X, ShieldAlert, Zap
} from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const priorityMap = {
  Critical: { cls: 'ticket-priority-critical', badge: 'severity-critical', dot: '#EF4444' },
  High: { cls: 'ticket-priority-high', badge: 'severity-high', dot: '#F59E0B' },
  Medium: { cls: 'ticket-priority-medium', badge: 'severity-medium', dot: '#3B82F6' },
  Low: { cls: 'ticket-priority-low', badge: 'severity-low', dot: '#10B981' },
};

const statusConfig = {
  'In Progress': { color: '#D97706', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: RefreshCw },
  'Assigned': { color: '#2563EB', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', icon: User },
  'Closed': { color: '#059669', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: CheckCircle2 },
  'Resolved': { color: '#059669', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: CheckCircle2 },
  'Open': { color: '#DC2626', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: AlertOctagon },
};

const TicketCard = ({ ticket, onResolve }) => {
  const [expanded, setExpanded] = useState(false);
  const pri = priorityMap[ticket.priority] || priorityMap.Medium;
  const st = statusConfig[ticket.status] || statusConfig['Open'];
  const StatusIcon = st.icon;
  const isClosed = ticket.status === 'Closed' || ticket.status === 'Resolved';

  return (
    <div className={`ticket-card ${pri.cls} mb-3`}>
      {/* Header */}
      <div className="ticket-card-header">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-bold text-dark font-display" style={{ fontSize: '0.88rem', letterSpacing: '-0.01em' }}>
            {ticket.id}
          </span>
          <span className={`severity-badge ${pri.badge}`}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: pri.dot, display: 'inline-block' }}></span>
            {ticket.priority}
          </span>
          <span className="badge fw-semibold"
                style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: '50px', fontSize: '0.7rem', padding: '0.3rem 0.7rem' }}>
            <StatusIcon size={11} className="me-1" />
            {ticket.status}
          </span>
        </div>
        <span className="text-muted" style={{ fontSize: '0.73rem', whiteSpace: 'nowrap' }}>
          <Clock size={12} className="me-1" />{ticket.createdTime}
        </span>
      </div>

      {/* Body */}
      <div className="ticket-card-body">
        <div className="d-flex align-items-start gap-3 mb-2">
          <div className="p-2 rounded-3 flex-shrink-0"
               style={{ background: 'rgba(2,132,199,0.08)' }}>
            <Building2 size={16} style={{ color: '#0284C7' }} />
          </div>
          <div>
            <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>
              {ticket.block} — {ticket.floor}
            </div>
            <div className="d-flex align-items-center gap-1 text-muted mt-0.5" style={{ fontSize: '0.75rem' }}>
              <MapPin size={11} /> {ticket.location}
            </div>
          </div>
        </div>

        <p className="text-muted mb-3" style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>{ticket.problem}</p>

        <div className="d-flex flex-wrap gap-2 mb-2">
          <span className="impact-chip danger">
            <Cpu size={12} /> AI Risk: {ticket.aiRisk}
          </span>
          <span className="impact-chip warning">
            <Droplets size={12} /> Excess: {ticket.estimatedExcess}
          </span>
          <span className="impact-chip info">
            <User size={12} /> {ticket.assignedTechnician}
          </span>
        </div>

        {/* Water impact before/after */}
        {ticket.waterSavedAfterRepair && (
          <div className="d-flex align-items-center gap-2 p-2 rounded-3 mt-2"
               style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <CheckCircle2 size={15} style={{ color: '#059669' }} />
            <span style={{ fontSize: '0.79rem', color: '#065F46' }}>
              <strong>{ticket.waterSavedAfterRepair.toLocaleString()} L/day</strong> recovered after repair · Before: {ticket.beforeRepairDailyFlow.toLocaleString()} L → After: {ticket.afterRepairDailyFlow?.toLocaleString()} L
            </span>
          </div>
        )}
      </div>

      {/* Footer with actions */}
      <div className="ticket-card-footer">
        <button className="btn-ghost" style={{ fontSize: '0.78rem' }}
                onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide details' : 'View workflow steps'}
        </button>

        <div className="d-flex gap-2">
          {!isClosed && (
            <>
              <button className="btn-water" style={{ padding: '0.4rem 1rem', fontSize: '0.78rem' }}>
                <User size={13} /> Reassign
              </button>
              <button
                className="btn-success-solid"
                style={{ padding: '0.4rem 1rem', fontSize: '0.78rem' }}
                onClick={() => onResolve(ticket.id, ticket.beforeRepairDailyFlow * 0.8, Math.round(ticket.beforeRepairDailyFlow * 0.2))}
              >
                <CheckCircle2 size={13} /> Mark Resolved
              </button>
            </>
          )}
          {isClosed && (
            <span className="impact-chip">
              <CheckCircle2 size={12} /> Resolved: {ticket.resolvedTime}
            </span>
          )}
        </div>
      </div>

      {/* Expandable workflow steps */}
      {expanded && (
        <div className="px-3 pb-3 pt-1 animate-fade-in">
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <div className="fw-semibold text-dark mb-2" style={{ fontSize: '0.82rem' }}>Maintenance Workflow</div>
            {[
              { label: 'Issue Detected by AI / IoT Sensor', done: true },
              { label: 'Ticket Created & Priority Assigned', done: true },
              { label: 'Technician Assigned & Dispatched', done: ticket.status !== 'Open' },
              { label: 'On-Site Inspection & Repair', done: ticket.status === 'In Progress' || isClosed },
              { label: 'Water Savings Verified & Ticket Closed', done: isClosed },
            ].map((step, i) => (
              <div key={i} className={`workflow-step ${step.done ? 'done' : ''}`}>
                <div className="workflow-step-num"
                     style={{ background: step.done ? 'linear-gradient(135deg,#059669,#10B981)' : '#CBD5E1' }}>
                  {step.done ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span style={{ fontSize: '0.82rem', color: step.done ? '#065F46' : '#64748B' }}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MaintenancePage = () => {
  const { maintenanceTickets, createTicket, resolveTicket } = useSimulator();
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ block: '', floor: '', location: '', problem: '', priority: 'High' });

  const filtered = maintenanceTickets.filter(t =>
    statusFilter === 'all' ||
    (statusFilter === 'open' && t.status !== 'Closed' && t.status !== 'Resolved') ||
    (statusFilter === 'closed' && (t.status === 'Closed' || t.status === 'Resolved'))
  );

  const openCount = maintenanceTickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length;
  const closedCount = maintenanceTickets.filter(t => t.status === 'Closed' || t.status === 'Resolved').length;
  const totalSaved = maintenanceTickets
    .filter(t => t.waterSavedAfterRepair)
    .reduce((a, t) => a + t.waterSavedAfterRepair, 0);

  const handleCreate = () => {
    if (!newTicket.block || !newTicket.problem) return;
    createTicket({
      id: `TICK-2026-${Math.floor(Math.random() * 900 + 100)}`,
      block: newTicket.block,
      floor: newTicket.floor || 'Ground Floor',
      location: newTicket.location || 'To be inspected',
      problem: newTicket.problem,
      priority: newTicket.priority,
      aiRisk: 'Manual',
      estimatedExcess: 'TBD',
      assignedTechnician: 'Pending Assignment',
      status: 'Open',
      createdTime: 'Just now',
      resolvedTime: null,
      beforeRepairDailyFlow: 0,
      afterRepairDailyFlow: null,
      waterSavedAfterRepair: null,
    });
    setNewTicket({ block: '', floor: '', location: '', problem: '', priority: 'High' });
    setShowNewForm(false);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header d-flex flex-wrap justify-content-between align-items-start gap-3">
        <div>
          <h1 className="page-header-title d-flex align-items-center gap-2">
            <Wrench size={24} className="text-primary" />
            Maintenance Ticket Manager
          </h1>
          <p className="page-header-sub">
            AI-generated and manually raised repair tickets for campus water infrastructure — with workflow tracking and water savings audit.
          </p>
        </div>
        <button className="btn-water" onClick={() => setShowNewForm(!showNewForm)}>
          {showNewForm ? <X size={16} /> : <Plus size={16} />}
          {showNewForm ? 'Cancel' : 'Raise New Ticket'}
        </button>
      </div>

      {/* Stat strip */}
      <div className="stat-strip animate-fade-in">
        <div className="stat-strip-item">
          <div className="stat-strip-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <AlertOctagon size={20} style={{ color: '#DC2626' }} />
          </div>
          <div>
            <div className="stat-strip-value text-danger">{openCount}</div>
            <div className="stat-strip-label">Open Tickets</div>
          </div>
        </div>
        <div className="stat-strip-item">
          <div className="stat-strip-icon" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <CheckCircle2 size={20} style={{ color: '#059669' }} />
          </div>
          <div>
            <div className="stat-strip-value text-success">{closedCount}</div>
            <div className="stat-strip-label">Resolved</div>
          </div>
        </div>
        <div className="stat-strip-item">
          <div className="stat-strip-icon" style={{ background: 'rgba(2,132,199,0.1)' }}>
            <Droplets size={20} style={{ color: '#0284C7' }} />
          </div>
          <div>
            <div className="stat-strip-value text-primary">{(totalSaved / 1000).toFixed(1)}K L</div>
            <div className="stat-strip-label">Water Saved/day</div>
          </div>
        </div>
        <div className="stat-strip-item">
          <div className="stat-strip-icon" style={{ background: 'rgba(139,92,246,0.1)' }}>
            <Cpu size={20} style={{ color: '#7C3AED' }} />
          </div>
          <div>
            <div className="stat-strip-value" style={{ color: '#7C3AED' }}>
              {maintenanceTickets.filter(t => t.aiRisk && t.aiRisk !== 'Manual').length}
            </div>
            <div className="stat-strip-label">AI Dispatched</div>
          </div>
        </div>
      </div>

      {/* New ticket form */}
      {showNewForm && (
        <div className="dash-card mb-4 animate-fade-in" style={{ border: '1px solid rgba(2,132,199,0.25)', background: 'linear-gradient(180deg,rgba(239,246,255,0.6),#fff)' }}>
          <h6 className="fw-bold mb-3 font-display d-flex align-items-center gap-2">
            <Plus size={16} className="text-primary" /> Raise New Maintenance Ticket
          </h6>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>College Block *</label>
              <select className="form-select form-select-sm" value={newTicket.block}
                      onChange={e => setNewTicket(p => ({ ...p, block: e.target.value }))}>
                <option value="">Select Block</option>
                {['Bhaskar Bhavan','Bill Gates Bhavan','Abdul Kalam Bhavan','Ratan Tata Bhavan','Incubation Centre','B-School','Einstein Bhavan','Pharmacy-I','Cotton Bhavan','Pharmacy-II','K. L. Rao Bhavan','Edison Bhavan','Dining Halls','Main Gate'].map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>Floor</label>
              <input className="form-control form-control-sm" placeholder="e.g. 2nd Floor" value={newTicket.floor}
                     onChange={e => setNewTicket(p => ({ ...p, floor: e.target.value }))} />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>Priority *</label>
              <select className="form-select form-select-sm" value={newTicket.priority}
                      onChange={e => setNewTicket(p => ({ ...p, priority: e.target.value }))}>
                {['Critical', 'High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>Location</label>
              <input className="form-control form-control-sm" placeholder="e.g. Ground Floor Washroom East Wing"
                     value={newTicket.location}
                     onChange={e => setNewTicket(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ fontSize: '0.8rem' }}>Problem Description *</label>
              <textarea className="form-control form-control-sm" rows={2} placeholder="Describe the water issue..."
                        value={newTicket.problem}
                        onChange={e => setNewTicket(p => ({ ...p, problem: e.target.value }))} />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn-water" onClick={handleCreate} disabled={!newTicket.block || !newTicket.problem}>
              <Plus size={15} /> Create Ticket
            </button>
            <button className="btn-ghost" onClick={() => setShowNewForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="tab-bar mb-4">
        <button className={`btn-tab ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
          All Tickets ({maintenanceTickets.length})
        </button>
        <button className={`btn-tab ${statusFilter === 'open' ? 'active-danger' : ''}`} onClick={() => setStatusFilter('open')}>
          Open ({openCount})
        </button>
        <button className={`btn-tab ${statusFilter === 'closed' ? 'active-success' : ''}`} onClick={() => setStatusFilter('closed')}>
          Resolved ({closedCount})
        </button>
      </div>

      {/* Ticket list */}
      {filtered.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} onResolve={resolveTicket} />
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-5 text-muted">
          <CheckCircle2 size={40} className="text-success mb-3" />
          <div className="fw-semibold">No tickets in this category.</div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
