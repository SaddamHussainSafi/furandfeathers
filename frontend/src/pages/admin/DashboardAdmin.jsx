import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  FileWarning,
  MessageCircle,
  Shield,
  Users,
  Wand2,
  Settings,
  UserCheck,
  PawPrint,
} from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import ChartCard from '../../components/cards/ChartCard';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';
import PetApprovalManagement from '../../components/PetApprovalManagement';
import UserManagement from '../../components/UserManagement';
import API from '../../services/api';
import '../../styles/dashboard.css';

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await API.get('/admin/dashboard/stats');
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to mock data if API fails
      setDashboardStats({
        totalUsers: 1247,
        activeUsers: 1189,
        suspendedUsers: 23,
        pendingUsers: 35,
        totalPets: 892,
        approvedPets: 834,
        pendingPets: 58,
        totalShelters: 45,
        activeShelters: 42,
      });
    } finally {
      setLoading(false);
    }
  };

  const heroMetrics = [
    {
      label: 'Pending Pets',
      value: dashboardStats?.pendingPets || '0',
      helper: 'Awaiting approval',
      icon: PawPrint,
      color: 'orange',
      onClick: () => setActiveTab('pet-approval')
    },
    {
      label: 'Total Users',
      value: dashboardStats?.totalUsers || '0',
      helper: 'Registered users',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Active Shelters',
      value: dashboardStats?.activeShelters || '0',
      helper: 'Verified shelters',
      icon: Shield,
      color: 'green'
    },
  ];

  const pendingActions = [
    { label: 'Pending pets', value: `${dashboardStats?.pendingPets || 0} awaiting approval` },
    { label: 'Suspended users', value: `${dashboardStats?.suspendedUsers || 0} accounts` },
    { label: 'Pending users', value: `${dashboardStats?.pendingUsers || 0} verification` },
  ];

  const userOverview = [
    { label: 'Total users', value: dashboardStats?.totalUsers || '0' },
    { label: 'Active users', value: dashboardStats?.activeUsers || '0' },
    { label: 'Suspended accounts', value: dashboardStats?.suspendedUsers || '0' },
    { label: 'Pending verification', value: dashboardStats?.pendingUsers || '0' },
  ];

  const userBreakdown = [
    { label: 'Adopters', value: '72%' },
    { label: 'Shelters', value: '3%' },
    { label: 'Admins', value: '1%' },
  ];

  const qualityMetrics = [
    { label: 'User satisfaction', value: '4.6 / 5' },
    { label: 'Response time', value: '2.1 hours' },
    { label: 'Resolution rate', value: '94%' },
    { label: 'Platform safety', value: '98%' },
  ];

  const contentHealth = [
    { label: 'Pet listing quality', value: '8.2 / 10' },
    { label: 'Review authenticity', value: '92%' },
    { label: 'Spam detection', value: '99.8%' },
    { label: 'Content compliance', value: '99.5%' },
  ];

  // Chart data - using mock data for now
  const userGrowthData = [
    { name: 'Jan', adopters: 1200, shelters: 50, total: 1250 },
    { name: 'Feb', adopters: 1350, shelters: 55, total: 1405 },
    { name: 'Mar', adopters: 1500, shelters: 60, total: 1560 },
    { name: 'Apr', adopters: 1650, shelters: 65, total: 1715 },
    { name: 'May', adopters: 1800, shelters: 70, total: 1870 },
    { name: 'Jun', adopters: 1950, shelters: 75, total: 2025 },
  ];

  const moderationActivityData = [
    { name: 'Mon', reports: 45, resolved: 38 },
    { name: 'Tue', reports: 52, resolved: 47 },
    { name: 'Wed', reports: 38, resolved: 35 },
    { name: 'Thu', reports: 61, resolved: 55 },
    { name: 'Fri', reports: 49, resolved: 44 },
    { name: 'Sat', reports: 33, resolved: 30 },
    { name: 'Sun', reports: 28, resolved: 25 },
  ];

  const userTypeData = [
    { name: 'Adopters', value: 9284, fill: '#3b82f6' },
    { name: 'Shelters', value: 284, fill: '#10b981' },
    { name: 'Admins', value: 12, fill: '#f59e0b' },
  ];

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview and statistics', icon: ClipboardList },
    { id: 'pet-approval', label: 'Pet Approvals', description: 'Review and approve pet listings', icon: PawPrint },
    { id: 'user-management', label: 'User Management', description: 'Account oversight and support', icon: Users },
    { id: 'settings', label: 'System Settings', description: 'Platform configuration', icon: Settings },
  ];

  const dailyWorkflow = [
    { title: 'Morning review', description: 'Check overnight reports and pending actions.' },
    { title: 'Priority sorting', description: 'Triage tasks by urgency and impact.' },
    { title: 'Batch processing', description: 'Handle similar cases together for consistency.' },
    { title: 'Quality checks', description: 'Audit moderation decisions and outcomes.' },
    { title: 'Reporting', description: 'Document actions and publish daily summaries.' },
  ];

  const moderationTools = [
    {
      title: 'Bulk moderation',
      description: 'Process multiple approvals, removals, or warnings in one action with confidence checks.',
    },
    {
      title: 'Advanced filters',
      description: 'Drill down by severity, category, or account status to focus on high-impact cases first.',
    },
    {
      title: 'Escalation paths',
      description: 'Route complex issues to super admins with auto-generated context and history.',
    },
    {
      title: 'Communication templates',
      description: 'Send consistent responses with one-click templates and localized variants.',
    },
  ];

  const userSupportFeatures = [
    {
      title: 'Integrated chat',
      description: 'Respond to shelters and adopters directly from the dashboard with internal notes.',
    },
    {
      title: 'Knowledge base',
      description: 'Surface solutions from curated resources for rapid ticket resolution.',
    },
    {
      title: 'History viewer',
      description: 'See user timelines, previous tickets, and moderation actions for full context.',
    },
    {
      title: 'Recovery tools',
      description: 'Initiate password resets and account recovery flows with audit trails.',
    },
  ];

  const qualityAssurance = [
    {
      title: 'Automated scoring',
      description: 'Generate quality scores for listings, profiles, and interactions automatically.',
    },
    {
      title: 'Satisfaction tracking',
      description: 'Monitor feedback trends across adopters, shelters, and partners in real time.',
    },
    {
      title: 'Moderator analytics',
      description: 'Review productivity, accuracy, and sentiment for every moderator.',
    },
    {
      title: 'Safety monitoring',
      description: 'Track flagged keywords, risky behavior, and regulatory compliance alerts.',
    },
  ];

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="page">
        <div className="surface-card" style={{ display: 'grid', placeItems: 'center', minHeight: '240px' }}>
          <div className="spinner" aria-label="Loading admin dashboard" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="surface-card dashboard-nav-card">
        <div>
          <p className="dashboard-nav-card__eyebrow">Control center</p>
          <h2>Administrator Console</h2>
          <p className="dashboard-nav-card__subtitle">
            Navigate between insights, approvals, and user management without leaving your workspace.
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
                onClick={() => setActiveTab(tab.id)}
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

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div className="dashboard-page">
            <div className="dashboard-page__intro">
              <Shield size={16} /> Operations Command
            </div>

            <section className="dashboard-hero">
              <div className="dashboard-hero__heading">
                <div className="dashboard-status">
                  <span className="status-dot" aria-hidden="true" /> Moderation load: Elevated
                </div>
                <h1>Admin Dashboard</h1>
                <p>
                  Maintain platform quality, guide community standards, and empower users with responsive support across
                  every channel.
                </p>
                <div className="dashboard-hero__actions">
                  {[{ icon: AlertTriangle, label: 'Review flagged content' }, { icon: Users, label: 'Verify new shelters' }, { icon: MessageCircle, label: 'Respond to tickets' }].map(({ icon: Icon, label }) => (
                    <span key={label} className="dashboard-pill">
                      <Icon size={16} />
                      {label}
                    </span>
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
                    onClick={metric.onClick}
                    className={metric.onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
                  />
                ))}
              </div>
            </section>

            <div className="dashboard-columns dashboard-columns--3">
              <div className="dashboard-column">
                <div className="dashboard-card">
                  <div className="dashboard-card__header">
                    <h3>Pending Actions</h3>
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
                      <ClipboardList size={18} className="inline mr-2 align-middle text-white/60" /> User Overview
                    </h3>
                  </div>
                  <ul className="metric-list">
                    {userOverview.map((item) => (
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
                    <h3>User Breakdown</h3>
                  </div>
                  <ul className="metric-list">
                    {userBreakdown.map((item) => (
                      <li key={item.label}>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="dashboard-card dashboard-card--accent">
                  <div className="dashboard-card__header">
                    <h3>Quality Metrics</h3>
                  </div>
                  <ul className="metric-list">
                    {qualityMetrics.map((item) => (
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
                      <CheckCircle2 size={18} className="inline mr-2 align-middle text-white/60" /> Content Health
                    </h3>
                  </div>
                  <ul className="metric-list">
                    {contentHealth.map((item) => (
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
              <ChartCard title="User Growth Trends" subtitle="Monthly user registrations">
                <BarChart data={userGrowthData} dataKey="total" color="#3b82f6" height={300} />
              </ChartCard>
              <ChartCard title="Moderation Activity" subtitle="Reports and resolutions this week">
                <LineChart data={moderationActivityData} dataKey="reports" color="#f59e0b" height={300} />
              </ChartCard>
            </div>
          </div>
      )}

      {activeTab === 'pet-approval' && (
        <section className="page-section dashboard-secondary-panel">
          <PetApprovalManagement />
        </section>
      )}
      {activeTab === 'user-management' && (
        <section className="page-section dashboard-secondary-panel">
          <UserManagement />
        </section>
      )}
      {activeTab === 'settings' && (
        <section className="page-section dashboard-secondary-panel settings-placeholder">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-800">System Settings</h3>
          <p className="mt-2 text-sm text-gray-500">Settings management coming soon...</p>
        </section>
      )}
    </div>
  );
};

export default DashboardAdmin;
