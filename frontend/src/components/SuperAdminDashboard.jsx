import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  FileText,
  GaugeCircle,
  Home,
  Layers3,
  LineChart as LineChartIcon,
  PieChart as PieIcon,
  Radar,
  Server,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import StatCard from './cards/StatCard';
import ChartCard from './cards/ChartCard';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import API from '../services/api';
import '../styles/dashboard.css';

const formatNumber = (value, options) => {
  if (value === null || value === undefined) return '0';
  if (typeof value === 'number') return value.toLocaleString('en-US', options);
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
      label: 'Active users',
      value: formatNumber(stats?.activeUsers ?? 2847),
      helper: 'Live across the platform',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Server uptime',
      value: `${formatNumber(stats?.uptime ?? 99.98)}%`,
      helper: 'Across all regions',
      icon: Server,
      color: 'green',
    },
    {
      label: 'Monthly revenue',
      value: `$${formatNumber(stats?.revenue?.month ?? 72184)}`,
      helper: 'Updated 2 min ago',
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  const platformHealthMetrics = [
    { label: 'Server uptime', value: `${formatNumber(stats?.uptime ?? 99.98)}%` },
    { label: 'Response time', value: `${formatNumber(stats?.responseTime ?? 128)}ms` },
    { label: 'Error rate', value: `${formatNumber(stats?.errorRate ?? 0.02)}%` },
    { label: 'API success', value: `${formatNumber(stats?.apiSuccess ?? 99.8)}%` },
  ];

  const revenueMetrics = [
    { label: 'Today', value: `$${formatNumber(stats?.revenue?.today ?? 2847)}` },
    { label: 'This week', value: `$${formatNumber(stats?.revenue?.week ?? 18492)}` },
    { label: 'This month', value: `$${formatNumber(stats?.revenue?.month ?? 72184)}` },
    { label: 'Year to date', value: `$${formatNumber(stats?.revenue?.ytd ?? 489227)}` },
  ];

  const userAnalytics = [
    { label: 'New registrations', value: `${formatNumber(stats?.registrations?.today ?? 142)} today` },
    { label: 'Active users', value: `${formatNumber(stats?.activeUsers ?? 1847)} (65%)` },
    { label: 'User retention', value: `${formatNumber(stats?.retention ?? 78)}%` },
    { label: 'Growth rate', value: `${formatNumber(stats?.growthRate ?? 12)}% MoM` },
  ];

  const engagementMetrics = [
    { label: 'Avg session', value: `${formatNumber(stats?.engagement?.session ?? 8.2)} mins` },
    { label: 'Pages / session', value: formatNumber(stats?.engagement?.pages ?? 6.4) },
    { label: 'Feature adoption', value: `${formatNumber(stats?.engagement?.adoption ?? 72)}%` },
    { label: 'Satisfaction', value: `${formatNumber(stats?.engagement?.satisfaction ?? 4.6)}/5` },
  ];

  const platformGrowth = [
    { label: 'Total pets listed', value: formatNumber(stats?.totalPets ?? 12847) },
    { label: 'Successful adoptions', value: formatNumber(stats?.totalAdoptions ?? 8492) },
    { label: 'Adoption success rate', value: `${formatNumber(stats?.adoptionSuccess ?? 66)}%` },
    { label: 'Shelter partnerships', value: formatNumber(stats?.shelterPartners ?? 284) },
  ];

  const alerts = [
    { label: 'System updates required', value: '2' },
    { label: 'Pending major decisions', value: '3' },
    { label: 'Security alerts', value: '0' },
    { label: 'Performance issues', value: '1' },
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
    { title: 'Quick scan', description: 'Review critical alerts and system status at a glance.' },
    { title: 'Deep dive', description: 'Investigate financials, users, or system performance.' },
    { title: 'Action', description: 'Deploy decisions, feature flags, or communications.' },
    { title: 'Monitor', description: 'Set alerts and watch outcomes in real time.' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="spinner" aria-label="Loading SuperAdmin dashboard" />
      </div>
    );
  }

  return (
    <div className="page">
      <section className="surface-card dashboard-nav-card">
        <div>
          <p className="dashboard-nav-card__eyebrow">Control center</p>
          <h2>Platform Console</h2>
          <p className="dashboard-nav-card__subtitle">
            Navigate between governance, revenue, and system insights without leaving your workspace.
          </p>
        </div>
        <div className="dashboard-tablist dashboard-tablist--interactive">
          {navigationTabs.map((tab) => (
            <span key={tab.label} className="dashboard-tab">
              <BarChart3 size={16} />
              <div>
                <strong>{tab.label}</strong>
                <small>{tab.description}</small>
              </div>
            </span>
          ))}
        </div>
      </section>

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
              Guide the entire Fur &amp; Feathers ecosystem with live insights, governance tools, and predictive intelligence
              crafted for strategic decisions.
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

        <div className="dashboard-columns dashboard-columns--4">
          <div className="dashboard-column">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h3>Platform status</h3>
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
                  <GaugeCircle size={18} className="inline mr-2 align-middle text-white/60" /> Performance metrics
                </h3>
              </div>
              <ul className="metric-list">
                {[
                  { label: 'Page load speed', value: `${formatNumber(stats?.pageSpeed ?? 1.2)}s` },
                  { label: 'DB queries', value: `${formatNumber(stats?.databaseQueries ?? 245)}/sec` },
                  { label: 'Memory usage', value: `${formatNumber(stats?.memoryUsage ?? 68)}%` },
                ].map((metric) => (
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
                <h3>Revenue dashboard</h3>
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
                  <FileText size={18} className="inline mr-2 align-middle text-white/60" /> Transaction breakdown
                </h3>
              </div>
              <ul className="metric-list">
                {[
                  { label: 'Adoption fees', value: '65%' },
                  { label: 'Premium features', value: '20%' },
                  { label: 'Donations', value: '10%' },
                  { label: 'Other', value: '5%' },
                ].map((item) => (
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
                  <LineChartIcon size={18} className="inline mr-2 align-middle text-white/60" /> User analytics
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
                  <Activity size={18} className="inline mr-2 align-middle text-white/60" /> Engagement metrics
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
                <h3>Platform growth</h3>
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
                  <AlertCircle size={18} className="inline mr-2 align-middle text-white/60" /> Alerts &amp; notifications
                </h3>
              </div>
              <div className="dashboard-alerts">
                {alerts.map((alert) => (
                  <div key={alert.label} className="dashboard-alert dashboard-alert--info">
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
              <h3>User growth</h3>
              <p>Monthly registration trends</p>
            </div>
            <div className="dashboard-chart">
              <LineChart data={userGrowthData} color="#8b5cf6" height={280} />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>Role distribution</h3>
              <p>Users by role type</p>
            </div>
            <div className="dashboard-chart">
              <PieChart data={roleDistributionData} height={280} />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>Pet status</h3>
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
                <Layers3 size={18} className="inline mr-2 align-middle text-white/60" /> Primary navigation
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
                <Radar size={18} className="inline mr-2 align-middle text-white/60" /> Working flow
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
                <Home size={18} className="inline mr-2 align-middle text-white/60" /> Recent activity
              </h3>
            </div>
            <ul className="metric-list metric-list--vertical">
              {[
                { label: 'New shelter registered: Happy Paws', time: '2 hours ago' },
                { label: 'Adoption completed for River', time: '4 hours ago' },
                { label: 'User account reinstated after review', time: '1 day ago' },
                { label: 'New pet listed: Maple the Husky', time: '2 days ago' },
              ].map((activity) => (
                <li key={activity.label}>
                  <strong>{activity.label}</strong>
                  <p>{activity.time}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
