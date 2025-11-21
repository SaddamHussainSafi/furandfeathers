

import React, { useContext, useEffect, useState } from 'react';
import SectionHero from '../components/SectionHero';
import { AuthContext } from '../context/AuthContext';
import { fetchMyAdoptions } from '../services/adoptionService';

const STATUS_STYLES = {
  PENDING: '#f97316',
  UNDER_REVIEW: '#6366f1',
  APPROVED: '#22c55e',
  REJECTED: '#ef4444'
};

export default function Applications() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchMyAdoptions();
        setApplications(
          data.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadApplications();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="page">
        <SectionHero
          badge={<span>My journey</span>}
          title="Adoption applications"
          subtitle="Sign in to follow the progress of your pet applications."
        />
      </div>
    );
  }

  return (
    <div className="page">
      <SectionHero
        badge={<span>My journey</span>}
        title="My adoption applications"
        subtitle="Track the status of every pet application and prepare for meet-and-greets."
      />
      <section className="page-section">
        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>You have not submitted any adoption applications yet.</p>
        ) : (
          <div className="section-grid">
            {applications.map(app => (
              <article key={app.id} className="surface-card">
                <div className="card-headline">
                  <div>
                    <h3>{app.petName}</h3>
                    <p className="muted-text">
                      Applied {new Date(app.createdAt).toLocaleDateString()} • {app.petLocation || 'Shelter TBD'}
                    </p>
                  </div>
                  <span
                    className="status-pill"
                    style={{
                      background: `${STATUS_STYLES[app.status] || '#94a3b8'}20`,
                      color: STATUS_STYLES[app.status] || '#475569'
                    }}
                  >
                    {app.status}
                  </span>
                </div>

                <p><strong>Why this match works:</strong> {app.message || '—'}</p>
                <p><strong>Household:</strong> {app.householdSize || '—'} people • {app.housingType || '—'}</p>
                <p><strong>Timeline:</strong> {app.adoptionTimeline || '—'}</p>

                {app.status === 'APPROVED' && (
                  <div className="alert alert--success" style={{ marginTop: '1rem' }}>
                    Your application for {app.petName} has been approved! Visit the {app.petLocation || 'shelter'} address and our team
                    will reach out at {app.contactPhone || app.contactEmail} to finalize the adoption.
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
