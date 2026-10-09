import React from 'react';
import { Lightbulb, CheckSquare, AlertTriangle, ArrowRight, ShieldCheck, Wrench, Clock } from 'lucide-react';
import { useSimulator } from '../context/SimulatorContext';

const AIRecommendationsPage = () => {
  const { recommendations, activeLeak } = useSimulator();

  return (
    <div className="page-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-0 font-display fw-bold text-dark">
            AI Prescriptive Recommendation Engine
          </h1>
          <p className="text-muted fs-7 mb-0 mt-1">
            Automated root-cause diagnoses, prioritization matrix, and step-by-step engineering action plans.
          </p>
        </div>
        <span className="data-origin-badge badge-ai">
          🤖 Prescriptive Expert System
        </span>
      </div>

      {/* Grid of Recommendations */}
      <div className="row g-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="col-12 col-xl-6">
            <div className={`dash-card h-100 ${rec.recommendedPriority === 'HIGH' ? 'border-danger' : 'border-warning'}`}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className={`p-2 rounded-3 ${rec.recommendedPriority === 'HIGH' ? 'bg-danger text-white' : 'bg-warning text-dark'}`}>
                    <Lightbulb size={20} />
                  </div>
                  <div>
                    <h5 className="fw-bold text-dark mb-0 font-display">{rec.block}</h5>
                    <div className="text-muted fs-7">Recommendation ID: {rec.id}</div>
                  </div>
                </div>

                <span className={`badge ${rec.recommendedPriority === 'HIGH' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                  Priority: {rec.recommendedPriority}
                </span>
              </div>

              {/* Problem statement */}
              <div className="bg-light p-3 rounded-3 mb-3">
                <div className="text-muted fs-7 fw-semibold">IDENTIFIED PROBLEM:</div>
                <div className="fw-bold text-dark fs-7 mt-1">{rec.problem}</div>
              </div>

              {/* Probable Causes */}
              <div className="mb-3">
                <div className="text-muted fs-7 fw-bold mb-2">POSSIBLE ROOT CAUSES:</div>
                <ul className="list-unstyled space-y-1 mb-0" style={{ fontSize: '0.8rem' }}>
                  {rec.possibleCauses.map((cause, cIdx) => (
                    <li key={cIdx} className="d-flex align-items-start gap-2 mb-1">
                      <span className="badge bg-secondary rounded-circle p-1 mt-1" style={{ width: '6px', height: '6px' }}></span>
                      <span className="text-dark">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Actions Checklist */}
              <div className="mb-3 p-3 bg-white border rounded-3 shadow-sm">
                <div className="text-primary fs-7 fw-bold mb-2 d-flex align-items-center gap-1">
                  <CheckSquare size={16} /> RECOMMENDED ACTION CHECKLIST:
                </div>
                <div className="space-y-1" style={{ fontSize: '0.8rem' }}>
                  {rec.recommendedActions.map((action, aIdx) => (
                    <div key={aIdx} className="d-flex align-items-center gap-2 py-1 border-bottom border-light">
                      <span className="text-success fw-bold">✓</span>
                      <span className="text-dark fw-medium">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Impact */}
              <div className="d-flex justify-content-between align-items-center pt-2 border-top text-muted fs-7">
                <span>Estimated Impact: <strong className="text-success">{rec.estimatedImpact}</strong></span>
                <span className="badge bg-light text-dark border">{rec.verificationStatus}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationsPage;
