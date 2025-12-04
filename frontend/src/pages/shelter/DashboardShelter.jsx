import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  CalendarCheck2,
  DollarSign,
  FileText,
  Heart,
  HeartHandshake,
  Inbox,
  MessageSquare,
  PawPrint,
  PhoneCall,
  PlusCircle,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/cards/StatCard';
import ChartCard from '../../components/cards/ChartCard';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { fetchCurrentUser } from '../../utils/fetchUser';
import '../../styles/dashboard.css';

const DashboardShelter = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCurrentUser().then((latest) => latest && setUser(latest));
    }
  }, []);

  const heroMetrics = [
    { label: 'Active pets', value: '24', helper: '+12% vs last month', icon: PawPrint, color: 'green' },
    { label: 'Pending applications', value: '8', helper: '3 need review', icon: FileText, color: 'orange' },
    { label: 'Adoptions this month', value: '18', helper: '+5 week over week', icon: Heart, color: 'blue' },
    { label: 'Avg adoption time', value: '12 days', helper: '-2 days improvement', icon: CalendarCheck2, color: 'purple' },
  ];

  const pendingActions = [
    { label: 'Applications to review', value: '5' },
    { label: 'Photo updates required', value: '7' },
    { label: 'Medical updates needed', value: '2' },
    { label: 'Follow-ups due', value: '3' },
  ];

  const petPortfolio = [
    { label: 'Dogs available', value: '12' },
    { label: 'Cats available', value: '8' },
    { label: 'Other pets', value: '4' },
    { label: 'Recently added', value: '3' },
  ];

  const performanceMetrics = [
    { label: 'Avg response time', value: '6.2 hours' },
    { label: 'Application conversion', value: '42%' },
    { label: 'Adoption success rate', value: '78%' },
    { label: 'User satisfaction', value: '4.7 / 5' },
  ];

  const financialOverview = [
    { label: 'Adoption fees', value: '$7,284' },
    { label: 'Donations', value: '$847' },
    { label: 'Fundraising', value: '$361' },
    { label: 'Expenses', value: '$2,184' },
  ];

  const monthlyAdoptionsData = [
    { name: 'Jan', adoptions: 5, applications: 12 },
    { name: 'Feb', adoptions: 7, applications: 15 },
    { name: 'Mar', adoptions: 6, applications: 18 },
    { name: 'Apr', adoptions: 8, applications: 20 },
    { name: 'May', adoptions: 9, applications: 22 },
    { name: 'Jun', adoptions: 10, applications: 25 },
  ];

  const petStatusData = [
    { name: 'Available', value: 12, color: '#10b981' },
    { name: 'Pending', value: 8, color: '#f59e0b' },
    { name: 'Adopted', value: 27, color: '#3b82f6' },
  ];

  const dailyFlow = [
    { title: 'Review applications', description: 'Triage new adopters and questions first thing.' },
    { title: 'Update pet statuses', description: 'Keep availability and photos fresh.' },
    { title: 'Coordinate meetings', description: 'Schedule intros and virtual visits.' },
    { title: 'Respond to inquiries', description: 'Stay connected with prospective families.' },
  ];

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview and insights', icon: BarChart3, to: '/shelter-dashboard' },
    { id: 'pets', label: 'My Pets', description: 'Manage listings', icon: PawPrint, to: '/manage-pets' },
    { id: 'applications', label: 'Applications', description: 'Review and approve', icon: FileText, to: '/manage-adoptions' },
    { id: 'messages', label: 'Messages', description: 'Chat with adopters', icon: MessageSquare, to: '/messages' },
    { id: 'settings', label: 'Settings', description: 'Shelter preferences', icon: Settings, to: '/profile' },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="spinner" aria-label="Loading shelter dashboard" />
      </div>
    );
  }

  return (
    <div className="page">
      <section className="surface-card dashboard-nav-card">
        <div>
          <p className="dashboard-nav-card__eyebrow">Control center</p>
          <h2>Shelter Console</h2>
          <p className="dashboard-nav-card__subtitle">
            Manage pets, nurture adopter relationships, and keep every status in sync without leaving this dashboard.
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
          <PawPrint size={16} /> Welcome back, {user?.name || 'Shelter Partner'}
        </div>

        <section className="dashboard-hero">
          <div className="dashboard-hero__heading">
            <div className="dashboard-status">
              <span className="status-dot" aria-hidden="true" /> Community impact: Thriving
            </div>
            <h1>Shelter Dashboard</h1>
            <p>
              Keep pets moving forward, respond faster to adopters, and collaborate with your team in one place.
            </p>
            <div className="dashboard-hero__actions">
              {[{ icon: PlusCircle, label: 'Add a new pet', to: '/add-pet' }, { icon: Inbox, label: 'Review applications', to: '/manage-adoptions' }, { icon: PhoneCall, label: 'Follow up with adopters', to: '/messages' }].map(({ icon: Icon, label, to }) => (
                <Link key={label} to={to} className="dashboard-pill dashboard-pill--link">
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="dashboard-hero__metrics">
            {heroMetrics.map((metric) => (
              <StatCard
                key={metric.label}
                icon={metric.icon}
                title={metric.label}
                value={metric.value}
                trend={metric.helper}
                color={metric.color}
              />
            ))}
          </div>
        </section>

        <div className="dashboard-columns dashboard-columns--3">
          <div className="dashboard-column">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h3>Pending actions</h3>
              </div>
              <ul className="metric-list">
                {pendingActions.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h3>
                  <HeartHandshake size={18} className="inline mr-2 align-middle text-white/60" /> Shelter connections
                </h3>
              </div>
              <ul className="metric-list">
                <li>
                  <span>Active conversations</span>
                  <strong>9</strong>
                </li>
                <li>
                  <span>Awaiting replies</span>
                  <strong>3</strong>
                </li>
                <li>
                  <span>Upcoming meetings</span>
                  <strong>5</strong>
                </li>
              </ul>
            </div>
          </div>

          <div className="dashboard-column">
            <div className="dashboard-card dashboard-card--accent">
              <div className="dashboard-card__header">
                <h3>Pet portfolio</h3>
              </div>
              <ul className="metric-list">
                {petPortfolio.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h3>
                  <Sparkles size={18} className="inline mr-2 align-middle text-white/60" /> Performance metrics
                </h3>
              </div>
              <ul className="metric-list">
                {performanceMetrics.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="dashboard-column">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h3>
                  <TrendingUp size={18} className="inline mr-2 align-middle text-white/60" /> Financial overview
                </h3>
              </div>
              <ul className="metric-list">
                {financialOverview.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h3>
                  <Shield size={18} className="inline mr-2 align-middle text-white/60" /> Safety &amp; quality
                </h3>
              </div>
              <ul className="metric-list">
                <li>
                  <span>Listing quality</span>
                  <strong>8.8 / 10</strong>
                </li>
                <li>
                  <span>Verification status</span>
                  <strong>All shelters verified</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="dashboard-columns dashboard-columns--2">
          <ChartCard title="Monthly adoptions" subtitle="Adoptions vs applications">
            <BarChart data={monthlyAdoptionsData} dataKey="adoptions" color="#38bdf8" height={300} />
          </ChartCard>
          <ChartCard title="Pet status distribution" subtitle="Current portfolio breakdown">
            <PieChart data={petStatusData} dataKey="value" height={300} />
          </ChartCard>
        </div>

        <div className="dashboard-columns dashboard-columns--3">
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>Helpful navigation</h3>
              <p>Jump into your tools</p>
            </div>
            <div className="dashboard-tablist">
              {navigationTabs.map((tab) => (
                <span key={tab.label} className="dashboard-tab">
                  {tab.label}
                </span>
              ))}
            </div>
            <ul className="metric-list metric-list--vertical">
              {navigationTabs.map((tab) => (
                <li key={`${tab.label}-desc`}>
                  <strong>{tab.label}</strong>
                  <p>{tab.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>Daily operations</h3>
              <p>Keep every pet and adopter moving</p>
            </div>
            <div className="flow-steps">
              {dailyFlow.map((step) => (
                <div key={step.title} className="flow-step">
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>Alerts &amp; celebrations</h3>
            </div>
            <div className="dashboard-alerts">
              <div className="dashboard-alert dashboard-alert--info">
                <CalendarCheck2 size={16} /> Home visit scheduled for Luna tomorrow
              </div>
              <div className="dashboard-alert">
                <MessageSquare size={16} /> 3 adopters waiting on follow-up
              </div>
              <div className="dashboard-alert dashboard-alert--info">
                <HeartHandshake size={16} /> New partnership inquiry from City Humane Society
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShelter;
