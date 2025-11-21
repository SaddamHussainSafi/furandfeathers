import React, { useContext, useEffect, useMemo, useState } from 'react';
import SectionHero from '../components/SectionHero';
import { AuthContext } from '../context/AuthContext';
import {
  fetchManageAdoptions,
  updateAdoptionStatus
} from '../services/adoptionService';
import '../styles/forms.css';

const STATUS_OPTIONS = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
const STATUS_COLORS = {
  PENDING: '#f97316',
  UNDER_REVIEW: '#6366f1',
  APPROVED: '#22c55e',
  REJECTED: '#ef4444'
};

export default function ManageAdoptions() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState('');

  const canManage = user && (user.role === 'admin' || user.role === 'superadmin');

  useEffect(() => {
    const load = async () => {
      if (!canManage) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchManageAdoptions();
        setApplications(data);
      } catch (err) {
        console.error('Failed to load adoption applications', err);
        setError('Unable to load applications right now.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [canManage]);

  const filteredApplications = useMemo(() => {
    if (statusFilter === 'all') return applications;
    return applications.filter(app => app.status === statusFilter);
  }, [applications, statusFilter]);

  const handleStatusUpdate = async (application, status) => {
    setUpdatingStatus(true);
    try {
      const updated = await updateAdoptionStatus(application.id, {
        status,
        adminNotes: application.adminNotes
      });
      setApplications(prev => prev.map(app => (app.id === updated.id ? updated : app)));
      setSelected(updated);
    } catch (err) {
      console.error('Failed to update status', err);
      setError(err?.response?.data?.message || 'Unable to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!canManage) {
    return (
      <div className="page">
        <SectionHero
          badge={<span>Restricted</span>}
          title="Manage adoptions"
          subtitle="Only admin and super admin accounts can review adoption applications."
        />
      </div>
    );
  }

  return (
    <div className="page">
      <SectionHero
        badge={<span>Workflow</span>}
        title="Manage adopter applications"
        subtitle="Review adopter details, follow up with candidates, and approve the perfect match."
      />

      <section className="page-section">
        <div className="surface-card">
          <div className="form-actions" style={{ justifyContent: 'space-between' }}>
            <div className="form-field" style={{ maxWidth: 240 }}>
              <label>Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All</option>
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            {error && <div className="alert alert--error">{error}</div>}
          </div>

          {loading ? (
            <p>Loading applications...</p>
          ) : filteredApplications.length === 0 ? (
            <p>No adoption applications to review.</p>
          ) : (
            <div className="section-grid">
              {filteredApplications.map(app => (
                <article key={app.id} className="surface-card">
                  <div className="card-headline">
                    <div>
                      <strong>{app.petName}</strong>
                      <p>Applicant: {app.applicantName}</p>
                    </div>
                    <span
                      className="status-pill"
                      style={{
                        background: `${STATUS_COLORS[app.status] || '#94a3b8'}20`,
                        color: STATUS_COLORS[app.status] || '#475569'
                      }}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="muted-text">
                    Applied on {new Date(app.createdAt).toLocaleDateString()} • {app.petLocation || 'Location TBD'}
                  </p>
                  <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                    <button className="site-button site-button--secondary" onClick={() => setSelected(app)}>
                      View application
                    </button>
                    <button
                      className="site-button site-button--primary"
                      onClick={() => handleStatusUpdate(app, 'APPROVED')}
                      disabled={updatingStatus}
                    >
                      Approve
                    </button>
                    <button
                      className="site-button site-button--secondary"
                      onClick={() => handleStatusUpdate(app, 'REJECTED')}
                      disabled={updatingStatus}
                    >
                      Decline
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <section className="page-section">
          <div className="surface-card">
            <div className="card-headline">
              <div>
                <h3>Application details</h3>
                <p>
                  {selected.applicantName} for {selected.petName}
                </p>
              </div>
              <button className="site-button site-button--secondary" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

            <div className="section-grid section-grid--two" style={{ marginTop: '1.5rem' }}>
              <article className="surface-card">
                <h4>Applicant profile</h4>
                <ul>
                  <li>
                    <strong>Email:</strong> {selected.applicantEmail}
                  </li>
                  <li>
                    <strong>Phone:</strong> {selected.contactPhone || 'Not provided'}
                  </li>
                  <li>
                    <strong>Household size:</strong> {selected.householdSize || 'N/A'}
                  </li>
                  <li>
                    <strong>Housing:</strong> {selected.housingType || 'N/A'}
                  </li>
                  <li>
                    <strong>Other pets:</strong> {selected.hasOtherPets ? 'Yes' : 'No'}
                  </li>
                </ul>
              </article>

              <article className="surface-card">
                <h4>Application notes</h4>
                <p><strong>Message:</strong> {selected.message || '—'}</p>
                <p><strong>Routine:</strong> {selected.dailySchedule || '—'}</p>
                <p><strong>Lifestyle:</strong> {selected.lifestyleNotes || '—'}</p>
                <p><strong>Timeline:</strong> {selected.adoptionTimeline || '—'}</p>
              </article>
            </div>

            <div className="form-field form-field--full" style={{ marginTop: '1.5rem' }}>
              <label>Admin notes</label>
              <textarea
                rows="3"
                value={selected.adminNotes || ''}
                onChange={event =>
                  setSelected(prev => ({
                    ...prev,
                    adminNotes: event.target.value
                  }))
                }
                placeholder="Document why you approved or declined this application."
              />
            </div>

            <div className="form-actions" style={{ marginTop: '1rem' }}>
              <button
                className="site-button site-button--primary"
                onClick={() => handleStatusUpdate(selected, 'APPROVED')}
                disabled={updatingStatus}
              >
                Approve adoption
              </button>
              <button
                className="site-button site-button--secondary"
                onClick={() => handleStatusUpdate(selected, 'REJECTED')}
                disabled={updatingStatus}
              >
                Reject application
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
