import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  FileText,
  Heart,
  MessageSquare,
  PawPrint,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/cards/StatCard';
import { fetchCurrentUser } from '../../utils/fetchUser';
import { fetchMyAdoptions } from '../../services/adoptionService';
import '../../styles/dashboard.css';

const DashboardAdopter = () => {
  const [user, setUser] = useState(null);
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCurrentUser().then((latest) => latest && setUser(latest));
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyAdoptions();
        setAdoptions(data || []);
      } catch (err) {
        console.error('Failed to load adoption applications', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const summary = { total: adoptions.length, approved: 0, pending: 0, meetings: 0 };
    adoptions.forEach((app) => {
      const status = (app.status || '').toUpperCase();
      if (status === 'APPROVED') summary.approved += 1;
      else summary.pending += 1;
      if (status === 'UNDER_REVIEW' || status === 'PENDING') {
        summary.meetings += 1;
      }
    });
    return summary;
  }, [adoptions]);

  const navigationTabs = [
    { id: 'overview', label: 'Dashboard', description: 'Journey status and insights', icon: PawPrint, to: '/adopter-dashboard' },
    { id: 'applications', label: 'Applications', description: 'Track every step', icon: FileText, to: '/applications' },
    { id: 'messages', label: 'Messages', description: 'Stay in touch with shelters', icon: MessageSquare, to: '/messages' },
    { id: 'favorites', label: 'Favorites', description: 'Saved companions', icon: Heart, to: '/favorites' },
    { id: 'my-pets', label: 'My Pets', description: 'Manage companions', icon: PawPrint, to: '/my-pets' },
  ];

  const heroActions = [
    { icon: PawPrint, label: 'Browse pets', to: '/pets' },
    { icon: Heart, label: 'View favorites', to: '/favorites' },
    { icon: MessageSquare, label: 'Open messages', to: '/messages' },
  ];

  const quickLinks = [
    { label: 'Adoption Journey', to: '/applications' },
    { label: 'My Pets', to: '/my-pets' },
    { label: 'Messages', to: '/messages' },
    { label: 'Resources', to: '/faq' },
  ];

  const nextSteps = [
    { title: 'Complete profile', detail: 'Add a quick intro and home details to speed reviews.' },
    { title: 'Share availability', detail: 'Offer meeting windows that work for you this week.' },
    { title: 'Upload documents', detail: 'Proof of residence or pet policy to avoid delays.' },
  ];

  const journeyUpdates = adoptions.slice(0, 3).map((app) => ({
    title: app.petName || 'Pet application',
    detail: `${app.status || 'Pending'} - ${new Date(app.createdAt).toLocaleDateString()}`,
  }));

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="spinner" aria-label="Loading adopter dashboard" />
      </div>
    );
  }

  return (
    <div className="page">
      <section className="surface-card dashboard-nav-card">
        <div>
          <p className="dashboard-nav-card__eyebrow">Journey hub</p>
          <h2>Adopter Console</h2>
          <p className="dashboard-nav-card__subtitle">
            Follow your adoption path, keep shelters in the loop, and celebrate milestones without leaving this workspace.
          </p>
        </div>
        <div className="dashboard-tablist dashboard-tablist--interactive">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.to) navigate(tab.to);
                }}
                className={`dashboard-tab ${isActive ? 'is-active' : ''}`}
              >
                <Icon size={16} />
                <div>
                  <strong>{tab.label}</strong>
                  <small>{tab.description}</small>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="dashboard-page">
        <div className="dashboard-page__intro">
          <Sparkles size={16} /> Welcome back, {user?.name || 'Adopter'}
        </div>

        <section className="dashboard-hero">
          <div className="dashboard-hero__heading">
            <div className="dashboard-status">
              <span className="status-dot" aria-hidden="true" /> Journey status: {stats.approved ? 'Approved path' : 'In review'}
            </div>
            <h1>Adopter Dashboard</h1>
            <p>
              Stay focused on the next best action: keep your applications moving, reply faster to shelters, and see your
              progress at a glance.
            </p>
            <div className="dashboard-hero__actions">
              {heroActions.map(({ icon: Icon, label, to }) => (
                <Link key={label} to={to} className="dashboard-pill dashboard-pill--link">
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="dashboard-hero__metrics">
            <StatCard
              icon={CheckCircle2}
              title="Applications"
              value={stats.total}
              trend={`${stats.approved} approved`}
              color="green"
            />
            <StatCard
              icon={CalendarClock}
              title="Meetings / follow-ups"
              value={stats.meetings}
              trend="Keep availability updated"
              color="blue"
            />
            <StatCard
              icon={Heart}
              title="Favorites"
              value={Math.max(stats.total * 2, 3)}
              trend="Curated recommendations ready"
              color="orange"
            />
          </div>
        </section>

        <div className="dashboard-columns dashboard-columns--3">
          <div className="dashboard-column">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h3>Next steps</h3>
              </div>
              <div className="flow-steps">
                {nextSteps.map((step) => (
                  <div key={step.title} className="flow-step">
                    <strong>{step.title}</strong>
                    <p>{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h3>
                  <Users size={18} className="inline mr-2 align-middle text-white/60" /> Shelter connections
                </h3>
              </div>
              <ul className="metric-list">
                <li>
                  <span>Active conversations</span>
                  <strong>{Math.max(stats.meetings, 1)}</strong>
                </li>
                <li>
                  <span>Awaiting your reply</span>
                  <strong>{stats.pending || 0}</strong>
                </li>
                <li>
                  <span>Upcoming meetings</span>
                  <strong>{stats.meetings}</strong>
                </li>
              </ul>
            </div>
          </div>

          <div className="dashboard-column">
            <div className="dashboard-card dashboard-card--accent">
              <div className="dashboard-card__header">
                <h3>Applications</h3>
                <Link to="/applications" className="text-sm text-white/80 underline">
                  Manage all
                </Link>
              </div>
              <ul className="metric-list metric-list--vertical">
                {loading && <li>Loading your applications...</li>}
                {!loading && adoptions.length === 0 && (
                  <li>
                    <strong>No applications yet</strong>
                    <p>Start an application to see statuses and notes.</p>
                  </li>
                )}
                {!loading &&
                  adoptions.slice(0, 4).map((app) => (
                    <li key={app.id}>
                      <strong>{app.petName || 'Pet application'}</strong>
                      <p>
                        {app.status || 'Pending'} - submitted {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h3>Recent updates</h3>
              </div>
              <ul className="metric-list metric-list--vertical">
                {journeyUpdates.length === 0 && (
                  <li>
                    <strong>Stay tuned</strong>
                    <p>Updates will appear once you start an application.</p>
                  </li>
                )}
                {journeyUpdates.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="dashboard-column">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h3>
                  <Sparkles size={18} className="inline mr-2 align-middle text-white/60" /> Helpful quick links
                </h3>
              </div>
              <div className="dashboard-tablist">
                {quickLinks.map((link) => (
                  <Link key={link.label} to={link.to} className="dashboard-tab dashboard-tab--compact">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="dashboard-alerts">
                <div className="dashboard-alert dashboard-alert--info">
                  <CalendarClock size={16} /> Confirm your next meeting slot
                </div>
                <div className="dashboard-alert">
                  <MessageSquare size={16} /> Reply to shelter feedback to stay in queue
                </div>
              </div>
            </div>

            <div className="dashboard-card dashboard-card--success">
              <div className="dashboard-card__header">
                <h3>Home-ready checklist</h3>
              </div>
              <ul className="metric-list metric-list--vertical">
                <li>
                  <strong>Space prep</strong>
                  <p>Bedding, toys, fresh water area set.</p>
                </li>
                <li>
                  <strong>Household alignment</strong>
                  <p>Roles and routines confirmed.</p>
                </li>
                <li>
                  <strong>Supplies</strong>
                  <p>Food, ID tags, vet intro scheduled.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdopter;

