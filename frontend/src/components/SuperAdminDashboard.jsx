import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  AlertCircle,
  Bell,
  FileText,
  GaugeCircle,
  Home,
  Layers3,
  LineChart as LineChartIcon,
  Radar,
  Server,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import API from '../services/api';

const formatNumber = (value, options) => {
  if (value === null || value === undefined) {
    return '—';
  }
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', options);
  }
  return value;
};

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get('/superadmin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const userGrowthData = useMemo(
    () => [
      { name: 'Jan', value: 480 },
      { name: 'Feb', value: 620 },
      { name: 'Mar', value: 810 },
      { name: 'Apr', value: 1080 },
      { name: 'May', value: 1240 },
      { name: 'Jun', value: 1385 },
    ],
    []
  );

  const roleDistributionData = useMemo(
    () => [
      { name: 'Adopters', value: stats?.usersByRole?.ADOPTER || 0, color: '#3b82f6' },
      { name: 'Shelters', value: stats?.usersByRole?.SHELTER || 0, color: '#10b981' },
      { name: 'Admins', value: stats?.usersByRole?.ADMIN || 0, color: '#f59e0b' },
      { name: 'SuperAdmin', value: stats?.usersByRole?.SUPERADMIN || 0, color: '#8b5cf6' },
    ],
    [stats]
  );

  const petStatusData = useMemo(
    () => [
      { name: 'Approved', value: stats?.petsByStatus?.APPROVED || 0 },
      { name: 'Pending', value: stats?.petsByStatus?.PENDING || 0 },
      { name: 'Adopted', value: stats?.petsByStatus?.ADOPTED || 0 },
    ],
    [stats]
  );

  const heroMetrics = [
    {
      label: 'Active Users',
      value: formatNumber(stats?.activeUsers ?? 2847),
      helper: 'Live across the platform',
      icon: Users,
    },
    {
      label: 'Server Uptime',
      value: `${formatNumber(stats?.uptime ?? 99.98)}%`,
      helper: 'Across all regions',
      icon: Server,
    },
    {
      label: 'Monthly Revenue',
      value: `$${formatNumber(stats?.revenue?.month ?? 72184)}`,
      helper: 'Updated 2 min ago',
      icon: TrendingUp,
    },
  ];

  const platformHealthMetrics = [
    { label: 'Server Uptime', value: `${formatNumber(stats?.uptime ?? 99.98)}%` },
    { label: 'Response Time', value: `${formatNumber(stats?.responseTime ?? 128)}ms` },
    { label: 'Active Users', value: formatNumber(stats?.activeUsers ?? 2847) },
    { label: 'Error Rate', value: `${formatNumber(stats?.errorRate ?? 0.02)}%` },
  ];

  const performanceMetrics = [
    { label: 'Page Load Speed', value: `${formatNumber(stats?.pageSpeed ?? 1.2)}s` },
    { label: 'API Success Rate', value: `${formatNumber(stats?.apiSuccess ?? 99.8)}%` },
    { label: 'DB Queries', value: `${formatNumber(stats?.databaseQueries ?? 245)}/sec` },
    { label: 'Memory Usage', value: `${formatNumber(stats?.memoryUsage ?? 68)}%` },
  ];

  const revenueMetrics = [
    { label: 'Today', value: `$${formatNumber(stats?.revenue?.today ?? 2847)}` },
    { label: 'This Week', value: `$${formatNumber(stats?.revenue?.week ?? 18492)}` },
    { label: 'This Month', value: `$${formatNumber(stats?.revenue?.month ?? 72184)}` },
    { label: 'Year to Date', value: `$${formatNumber(stats?.revenue?.ytd ?? 489227)}` },
  ];

  const transactionBreakdown = [
    { label: 'Adoption Fees', value: '65%' },
    { label: 'Premium Features', value: '20%' },
    { label: 'Donations', value: '10%' },
    { label: 'Other', value: '5%' },
  ];

  const userAnalytics = [
    { label: 'New Registrations', value: `${formatNumber(stats?.registrations?.today ?? 142)} today` },
    { label: 'Active Users', value: `${formatNumber(stats?.activeUsers ?? 1847)} (65%)` },
    { label: 'User Retention', value: `${formatNumber(stats?.retention ?? 78)}%` },
    { label: 'Growth Rate', value: `${formatNumber(stats?.growthRate ?? 12)}% MoM` },
  ];

  const engagementMetrics = [
    { label: 'Avg Session', value: `${formatNumber(stats?.engagement?.session ?? 8.2)} mins` },
    { label: 'Pages / Session', value: formatNumber(stats?.engagement?.pages ?? 6.4) },
    { label: 'Feature Adoption', value: `${formatNumber(stats?.engagement?.adoption ?? 72)}%` },
    { label: 'Satisfaction', value: `${formatNumber(stats?.engagement?.satisfaction ?? 4.6)}/5` },
  ];

  const platformGrowth = [
    { label: 'Total Pets Listed', value: formatNumber(stats?.totalPets ?? 12847) },
    { label: 'Successful Adoptions', value: formatNumber(stats?.totalAdoptions ?? 8492) },
    { label: 'Adoption Success Rate', value: `${formatNumber(stats?.adoptionSuccess ?? 66)}%` },
    { label: 'Shelter Partnerships', value: formatNumber(stats?.shelterPartners ?? 284) },
  ];

  const alerts = [
    { label: 'System Updates Required', value: '2', tone: 'info' },
    { label: 'Pending Major Decisions', value: '3', tone: 'warning' },
    { label: 'Security Alerts', value: '0', tone: 'info' },
    { label: 'Performance Issues', value: '1', tone: 'warning' },
  ];

  const navigationTabs = [
    { label: 'Dashboard Home', description: 'Overview and key metrics' },
    { label: 'Financial Center', description: 'Monitor revenue and payouts' },
    { label: 'User Management', description: 'Permissions, roles, and status' },
    { label: 'System Administration', description: 'Platform configuration' },
    { label: 'Analytics Hub', description: 'Deep dives and forecasting' },
    { label: 'Security Center', description: 'Access control & audits' },
  ];

  const userJourney = [
    {
      title: 'Login',
      description: 'Land on the command center with a full platform summary.',
    },
    {
      title: 'Quick Scan',
      description: 'Review critical alerts and system status at a glance.',
    },
    {
      title: 'Deep Dive',
      description: 'Investigate financials, users, or system performance.',
    },
    {
      title: 'Action Taking',
      description: 'Deploy decisions, feature flags, or communications.',
    },
    {
      title: 'Monitoring',
      description: 'Set alerts and follow the outcomes in real time.',
    },
  ];

  const realTimeFeatures = [
    {
      title: 'Live activity map',
      description: 'Monitor geographic user activity in real time to spot spikes or anomalies instantly.',
    },
    {
      title: 'Transaction monitoring',
      description: 'Stream adoption fee and donation transactions with automated fraud detection cues.',
    },
    {
      title: 'Critical alerts',
      description: 'Get immediate notifications for outages, escalations, or security events.',
    },
    {
      title: 'Emergency support',
      description: 'Escalate platform-wide incidents with direct access to on-call responders.',
    },
  ];

  const advancedControls = [
    {
      title: 'Global configuration',
      description: 'Adjust platform-wide feature flags, commission rates, and rollout plans instantly.',
    },
    {
      title: 'Backup orchestration',
      description: 'Trigger database backups, restores, and retention policies with audit-ready logs.',
    },
    {
      title: 'Experiment management',
      description: 'Manage A/B and multivariate tests with automated guardrails and success metrics.',
    },
    {
      title: 'Access governance',
      description: 'Assign privileged actions and automate permission reviews across the organization.',
    },
  ];

  const strategicTools = [
    {
      title: 'Predictive growth',
      description: 'Forecast registrations, adoptions, and revenue with machine-learning powered insights.',
    },
    {
      title: 'Market intelligence',
      description: 'Benchmark against industry peers and uncover expansion opportunities by region.',
    },
    {
      title: 'ROI tracking',
      description: 'Model the impact of new features or campaigns before committing resources.',
    },
    {
      title: 'Opportunity radar',
      description: 'Surface under-served pet categories, shelter needs, and adopter demand trends.',
    },
  ];

  const recentActivities = [
    { label: 'New shelter registered: Happy Paws', time: '2 hours ago' },
    { label: 'Adoption completed for Max (Golden Retriever)', time: '4 hours ago' },
    { label: 'User account suspended after security review', time: '1 day ago' },
    { label: 'New pet listed: River the Husky', time: '2 days ago' },
    { label: 'Verified adopter milestone reached', time: '3 days ago' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="spinner" aria-label="Loading SuperAdmin dashboard" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__intro">
        <Sparkles size={16} /> Platform Control Center
      </div>

      <section className="dashboard-hero">
        <div className="dashboard-hero__heading">
          <div className="dashboard-status">
            <span className="status-dot" aria-hidden="true" /> Platform health: Stable
          </div>
          <h1>SuperAdmin Dashboard</h1>
          <p>
            Guide the entire Fur &amp; Feathers ecosystem with live insights, governance tools, and predictive
            intelligence crafted for strategic decision making.
          </p>
          <div className="dashboard-hero__actions">
            {[{ icon: Zap, label: 'Trigger platform alert' }, { icon: Bell, label: 'Configure notifications' }, { icon: ShieldCheck, label: 'Run security audit' }].map(({ icon: Icon, label }) => (
              <span key={label} className="dashboard-pill">
                <Icon size={16} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="dashboard-hero__metrics">
          {heroMetrics.map(({ label, value, helper, icon: Icon }) => (
            <div key={label} className="dashboard-hero__metric-card">
              <div>
                <h3>{label}</h3>
                <strong>{value}</strong>
                <small>{helper}</small>
              </div>
              {Icon && <Icon size={28} className="text-white/70" />}
            </div>
          ))}
        </div>
      </section>

      <div className="dashboard-columns dashboard-columns--4">
        <div className="dashboard-column">
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>🟢 Platform Status</h3>
            </div>
            <ul className="metric-list">
              {platformHealthMetrics.map((metric) => (
                <li key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>
                <GaugeCircle size={18} className="inline mr-2 align-middle text-white/60" /> Performance Metrics
              </h3>
            </div>
            <ul className="metric-list">
              {performanceMetrics.map((metric) => (
                <li key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-card dashboard-card--accent">
            <div className="dashboard-card__header">
              <h3>💰 Revenue Dashboard</h3>
              <p>Real-time overview</p>
            </div>
            <ul className="metric-list">
              {revenueMetrics.map((metric) => (
                <li key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>
                <FileText size={18} className="inline mr-2 align-middle text-white/60" /> Transaction Breakdown
              </h3>
            </div>
            <ul className="metric-list">
              {transactionBreakdown.map((item) => (
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
                <LineChartIcon size={18} className="inline mr-2 align-middle text-white/60" /> User Analytics
              </h3>
            </div>
            <ul className="metric-list">
              {userAnalytics.map((metric) => (
                <li key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>
                <Activity size={18} className="inline mr-2 align-middle text-white/60" /> Engagement Metrics
              </h3>
            </div>
            <ul className="metric-list">
              {engagementMetrics.map((metric) => (
                <li key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-card dashboard-card--success">
            <div className="dashboard-card__header">
              <h3>🚀 Platform Growth</h3>
            </div>
            <ul className="metric-list">
              {platformGrowth.map((metric) => (
                <li key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>
                <AlertCircle size={18} className="inline mr-2 align-middle text-white/60" /> Alerts &amp; Notifications
              </h3>
            </div>
            <div className="dashboard-alerts">
              {alerts.map((alert) => (
                <div
                  key={alert.label}
                  className={`dashboard-alert ${alert.tone === 'info' ? 'dashboard-alert--info' : ''}`}
                >
                  <Bell size={16} /> {alert.label}: <strong className="ml-auto">{alert.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-columns dashboard-columns--3">
        <div className="dashboard-card dashboard-card--accent">
          <div className="dashboard-card__header">
            <h3>📈 User Growth</h3>
            <p>Monthly registration trends</p>
          </div>
          <div className="dashboard-chart">
            <LineChart data={userGrowthData} color="#8b5cf6" height={280} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>🧭 Role Distribution</h3>
            <p>Users by role type</p>
          </div>
          <div className="dashboard-chart">
            <PieChart data={roleDistributionData} height={280} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>🐾 Pet Status</h3>
            <p>Current pet availability</p>
          </div>
          <div className="dashboard-chart">
            <BarChart data={petStatusData} color="#10b981" height={280} />
          </div>
        </div>
      </div>

      <div className="dashboard-columns dashboard-columns--3">
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>
              <Layers3 size={18} className="inline mr-2 align-middle text-white/60" /> Primary Navigation Tabs
            </h3>
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
              <li key={`${tab.label}-details`}>
                <strong>{tab.label}</strong>
                <p>{tab.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>
              <Radar size={18} className="inline mr-2 align-middle text-white/60" /> Working Flow
            </h3>
          </div>
          <div className="flow-steps">
            {userJourney.map((step) => (
              <div key={step.title} className="flow-step">
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>
              <Home size={18} className="inline mr-2 align-middle text-white/60" /> Recent Activity
            </h3>
          </div>
          <ul className="metric-list metric-list--vertical">
            {recentActivities.map((activity) => (
              <li key={activity.label}>
                <strong>{activity.label}</strong>
                <p>{activity.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <h3>Key Features &amp; Interactions</h3>
          <p>Deliver the right tools for every strategic decision</p>
        </div>
        <div className="dashboard-card__grid dashboard-card__grid--two">
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-2">Real-time Data Streams</h4>
            <div className="dashboard-feature-grid">
              {realTimeFeatures.map((feature) => (
                <div key={feature.title} className="dashboard-feature">
                  <strong>{feature.title}</strong>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-2">Advanced Controls</h4>
            <div className="dashboard-feature-grid">
              {advancedControls.map((feature) => (
                <div key={feature.title} className="dashboard-feature">
                  <strong>{feature.title}</strong>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-2">Strategic Tools</h4>
            <div className="dashboard-feature-grid">
              {strategicTools.map((feature) => (
                <div key={feature.title} className="dashboard-feature">
                  <strong>{feature.title}</strong>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
