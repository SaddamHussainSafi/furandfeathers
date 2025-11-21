import React, { useEffect, useState } from 'react';
import {
  CalendarCheck2,
  DollarSign,
  HeartHandshake,
  Inbox,
  PawPrint,
  PhoneCall,
  PlusCircle,
  Sparkles,
  TrendingUp,
  Users,
  Settings,
  FileText,
  MessageSquare,
  BarChart3,
  Heart,
  Clock,
} from 'lucide-react';
import { fetchCurrentUser } from '../../utils/fetchUser';
import StatCard from '../../components/cards/StatCard';
import ChartCard from '../../components/cards/ChartCard';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import API from '../../services/api';
import '../../styles/dashboard.css';

const DashboardShelter = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCurrentUser().then((latest) => latest && setUser(latest));
    }
  }, []);

  const heroMetrics = [
    { label: 'Active Pets', value: '24', icon: PawPrint, helper: '+12% from last month', color: 'emerald' },
    { label: 'Pending Applications', value: '8', icon: FileText, helper: '3 need review', color: 'amber' },
    { label: 'Successful Adoptions', value: '156', icon: Heart, helper: '+8 this month', color: 'rose' },
    { label: 'Avg Adoption Time', value: '12 days', icon: Clock, helper: '-2 days improvement', color: 'blue' },
  ];

  const petPortfolio = [
    { label: 'Dogs available', value: '12' },
    { label: 'Cats available', value: '8' },
    { label: 'Other pets', value: '4' },
    { label: 'Recently added', value: '3' },
  ];

  const actionRequired = [
    { label: 'Applications to review', value: '5' },
    { label: 'Medical updates needed', value: '2' },
    { label: 'Photo updates required', value: '7' },
    { label: 'Follow-ups due', value: '3' },
  ];

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview and statistics', icon: BarChart3 },
    { id: 'pets', label: 'My Pets', description: 'Manage your pet listings', icon: PawPrint },
    { id: 'applications', label: 'Applications', description: 'Review adoption applications', icon: FileText },
    { id: 'messages', label: 'Messages', description: 'Communicate with adopters', icon: MessageSquare },
    { id: 'settings', label: 'Settings', description: 'Shelter profile and preferences', icon: Settings },
  ];

  const adoptionPipeline = [
    { label: 'New applications', value: '8' },
    { label: 'Under review', value: '12' },
    { label: 'Meetings scheduled', value: '5' },
    { label: 'Ready for adoption', value: '3' },
  ];

  const performanceMetrics = [
    { label: 'Avg response time', value: '6.2 hours' },
    { label: 'Application conversion', value: '42%' },
    { label: 'Adoption success rate', value: '78%' },
    { label: 'User satisfaction', value: '4.7 / 5' },
  ];

  const shelterPerformance = [
    { label: 'Monthly views', value: '2,847' },
    { label: 'Application rate', value: '18%' },
    { label: 'Adoption speed', value: '12 days average' },
    { label: 'Return rate', value: '2%' },
  ];

  const financialOverview = [
    { label: 'Adoption fees', value: '$7,284' },
    { label: 'Donations', value: '$847' },
    { label: 'Fundraising', value: '$361' },
    { label: 'Expenses', value: '$2,184' },
  ];

  // Chart data
  const monthlyAdoptionsData = [
    { name: 'Jan', adoptions: 5, applications: 12 },
    { name: 'Feb', adoptions: 7, applications: 15 },
    { name: 'Mar', adoptions: 6, applications: 18 },
    { name: 'Apr', adoptions: 8, applications: 20 },
    { name: 'May', adoptions: 9, applications: 22 },
    { name: 'Jun', adoptions: 10, applications: 25 },
  ];

  const petStatusData = [
    { name: 'Available', value: 12, fill: '#10b981' },
    { name: 'Pending', value: 8, fill: '#f59e0b' },
    { name: 'Adopted', value: 27, fill: '#3b82f6' },
  ];

  const dailyFlow = [
    { title: 'Review applications', description: 'Start the day triaging new adopters and questions.' },
    { title: 'Update pet statuses', description: 'Keep availability, photos, and notes fresh.' },
    { title: 'Coordinate meetings', description: 'Schedule introductions and virtual visits.' },
    { title: 'Respond to inquiries', description: 'Stay connected with prospective families.' },
    { title: 'Document outcomes', description: 'Complete paperwork and celebrate adoptions.' },
  ];

  const petManagementTools = [
    {
      title: 'Bulk profile editor',
      description: 'Update photos, availability, and traits across multiple pets with a single action.',
    },
    {
      title: 'Medical record tracking',
      description: 'Log vaccinations, wellness checks, and special care details in one secure place.',
    },
    {
      title: 'Photo gallery manager',
      description: 'Drag-and-drop media with instant previews and best-practice prompts.',
    },
    {
      title: 'Schedule planner',
      description: 'Manage foster rotations, meet-and-greets, and adoption days from a shared calendar.',
    },
  ];

  const adoptionWorkflowFeatures = [
    {
      title: 'Application scoring',
      description: 'Rank applicants with custom criteria, references, and home readiness signals.',
    },
    {
      title: 'Communication templates',
      description: 'Send updates, meeting invites, and approvals with pre-built, editable messages.',
    },
    {
      title: 'Meeting coordination',
      description: 'Offer time slots, capture confirmations, and sync to calendars automatically.',
    },
    {
      title: 'Digital paperwork',
      description: 'Collect agreements, payment confirmations, and follow-up tasks electronically.',
    },
  ];

  const performanceOptimization = [
    {
      title: 'Pet popularity insights',
      description: 'Identify which pets resonate most and replicate what works.',
    },
    {
      title: 'Conversion tracking',
      description: 'Understand where adopters drop off and optimize steps for success.',
    },
    {
      title: 'Response coaching',
      description: 'Get suggested replies and tone guidance to keep conversations warm and helpful.',
    },
    {
      title: 'Feedback loops',
      description: 'Capture adopter happiness and highlight testimonials across the community.',
    },
  ];

  if (!user) {
    return (
      <div className="page">
        <div className="surface-card" style={{ minHeight: '320px', display: 'grid', placeItems: 'center' }}>
          <div className="spinner" aria-label="Loading shelter dashboard" />
        </div>
      </div>
    );
  }

  return (
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
            Manage pets, nurture adopter relationships, and celebrate every match with tools built for modern
            shelters of every size.
          </p>
          <div className="dashboard-hero__actions">
            {[{ icon: PlusCircle, label: 'Add a new pet' }, { icon: Inbox, label: 'Review applications' }, { icon: PhoneCall, label: 'Follow up with adopters' }].map((item) => {
              const IconComp = item.icon;
              return (
                <span key={item.label} className="dashboard-pill">
                  <IconComp size={16} />
                  {item.label}
                </span>
              );
            })}
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
              <h3>🐾 Pet Portfolio</h3>
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
                <Sparkles size={18} className="inline mr-2 align-middle text-white/60" /> Action Required
              </h3>
            </div>
            <ul className="metric-list">
              {actionRequired.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-card dashboard-card--accent">
            <div className="dashboard-card__header">
              <h3>📥 Adoption Workflow</h3>
            </div>
            <ul className="metric-list">
              {adoptionPipeline.map((item) => (
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
                <HeartHandshake size={18} className="inline mr-2 align-middle text-white/60" /> Performance Metrics
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
                <TrendingUp size={18} className="inline mr-2 align-middle text-white/60" /> Shelter Analytics
              </h3>
            </div>
            <ul className="metric-list">
              {shelterPerformance.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-card dashboard-card--success">
            <div className="dashboard-card__header">
              <h3>
                <DollarSign size={18} className="inline mr-2 align-middle text-white/60" /> Financial Overview
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
        </div>
      </div>

      <div className="dashboard-columns dashboard-columns--2">
        <ChartCard title="Monthly Adoptions" subtitle="Adoptions vs Applications">
          <BarChart data={monthlyAdoptionsData} dataKey="adoptions" color="#10b981" height={300} />
        </ChartCard>
        <ChartCard title="Pet Status Distribution" subtitle="Current pet portfolio breakdown">
          <PieChart data={petStatusData} dataKey="value" height={300} />
        </ChartCard>
      </div>

      <div className="dashboard-columns dashboard-columns--3">
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Navigation</h3>
            <p>Everything you need in one place</p>
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
            <h3>Daily Operations</h3>
            <p>Keep every pet and adopter moving forward</p>
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
            <h3>Alerts &amp; Celebrations</h3>
          </div>
          <div className="dashboard-alerts">
            <div className="dashboard-alert dashboard-alert--info">
              <CalendarCheck2 size={16} /> Home visit scheduled for Luna tomorrow
            </div>
            <div className="dashboard-alert">
              <Users size={16} /> 3 adopters waiting on follow-up
            </div>
            <div className="dashboard-alert dashboard-alert--info">
              <HeartHandshake size={16} /> New partnership inquiry from City Humane Society
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <h3>Key Features &amp; Interactions</h3>
          <p>Grow your impact with powerful shelter-first tools</p>
        </div>
        <div className="dashboard-card__grid dashboard-card__grid--two">
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-2">Pet Management</h4>
            <div className="dashboard-feature-grid">
              {petManagementTools.map((item) => (
                <div key={item.title} className="dashboard-feature">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-2">Adoption Workflow</h4>
            <div className="dashboard-feature-grid">
              {adoptionWorkflowFeatures.map((item) => (
                <div key={item.title} className="dashboard-feature">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-2">Performance Optimization</h4>
            <div className="dashboard-feature-grid">
              {performanceOptimization.map((item) => (
                <div key={item.title} className="dashboard-feature">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShelter;
