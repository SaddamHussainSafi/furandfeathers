import React, { useEffect, useState } from 'react';
import {
  CalendarClock,
  FileText,
  Heart,
  Inbox,
  MessageSquare,
  PawPrint,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { fetchCurrentUser } from '../../utils/fetchUser';
import { fetchMyAdoptions } from '../../services/adoptionService';

const DashboardAdopter = () => {
  const [user, setUser] = useState(null);
  const [adoptionApplications, setAdoptionApplications] = useState([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCurrentUser().then((latest) => latest && setUser(latest));
    }
  }, []);

  useEffect(() => {
    const loadAdoptions = async () => {
      try {
        const data = await fetchMyAdoptions();
        setAdoptionApplications(data);
      } catch (err) {
        console.error('Failed to load adoption applications', err);
      } finally {
        setIsLoadingApplications(false);
      }
    };
    loadAdoptions();
  }, []);

  const heroMetrics = [
    { label: 'Adoption journey', value: '65%', helper: 'Progress to your next forever friend' },
    { label: 'Upcoming meeting', value: 'Luna ΓÇó Thu 3:00 PM', helper: 'With Happy Paws Shelter' },
    { label: 'Saved pets', value: '8 favorites', helper: 'Personalized recommendations ready' },
  ];

  const adoptionStatus = [
    { label: 'Profile completeness', value: 85, helper: 'Add a short introduction video' },
    { label: 'Active applications', value: 2, helper: 'Buddy ΓÇó River' },
    { label: 'Meetings scheduled', value: 1, helper: 'Luna on Thursday' },
    { label: 'Ready for home check', value: 0, helper: 'Pending after next meeting' },
  ];

  const nextSteps = [
    { label: 'Complete reference checks', description: 'Reach out to your two listed contacts for responses.' },
    { label: 'Schedule home visit', description: 'Choose a time that works for the shelter team.' },
    { label: 'Upload required documents', description: 'Proof of residence and pet policy confirmation.' },
    { label: 'Review adoption agreement', description: 'Understand expectations before final approval.' },
  ];

  const petConnections = [
    { label: 'Favorite pets', value: '8' },
    { label: 'Active applications', value: '2' },
    { label: 'Previous adoptions', value: '1' },
    { label: 'Saved searches', value: '3' },
  ];

  const communications = [
    { label: 'Happy Paws Shelter', value: 'Today' },
    { label: 'Pet Rescue Center', value: 'Yesterday' },
    { label: 'Animal Haven', value: '2 days ago' },
    { label: 'Paws & Claws', value: '3 days ago' },
  ];

  const learningCenter = [
    { label: 'Articles read', value: '12 / 20' },
    { label: 'Videos watched', value: '8 / 15' },
    { label: 'Quizzes completed', value: '3 / 5' },
    { label: 'Adoption readiness', value: '75%' },
  ];

  const highlightedApplications = adoptionApplications.slice(0, 3);
  const approvedApplication = adoptionApplications.find((app) => app.status === 'APPROVED');

  const achievements = [
    { label: 'Profile Completer', description: 'All required profile sections ready.' },
    { label: 'First Application', description: 'Submitted to Happy Paws Shelter.' },
    { label: 'Community Helper', description: 'Shared three pets on social media.' },
    { label: 'Education Seeker', description: 'Complete 2 more learning modules to unlock.' },
  ];

  const journeyHighlights = [
    {
      title: 'Discovery phase',
      description: 'Browse curated matches, set alerts, and explore shelter spotlights tailored to your lifestyle.',
    },
    {
      title: 'Application phase',
      description: 'Submit detailed applications with guidance for references, living situations, and experience.',
    },
    {
      title: 'Communication phase',
      description: 'Chat with shelters, share updates, and coordinate meetings with ease.',
    },
    {
      title: 'Approval phase',
      description: 'Complete documents, home checks, and training readiness tasks.',
    },
    {
      title: 'Adoption phase',
      description: 'Finalize the match, share your story, and receive post-adoption support resources.',
    },
  ];

  const journeyTools = [
    {
      title: 'Progress indicators',
      description: 'Visualize every milestone with automatic reminders and celebratory animations.',
    },
    {
      title: 'Checklist tracking',
      description: 'Keep tasks organized with due dates, helpful context, and attachable documents.',
    },
    {
      title: 'Time estimates',
      description: 'Understand how long each step usually takes so you can plan with confidence.',
    },
    {
      title: 'Milestone celebrations',
      description: 'Unlock badges, confetti moments, and personalized encouragement when you move forward.',
    },
  ];

  const communicationTools = [
    {
      title: 'Integrated messaging',
      description: 'Reach every shelter from one inbox with message read receipts and quick replies.',
    },
    {
      title: 'Meeting scheduler',
      description: 'Pick times, send invites, and sync to your calendar automatically.',
    },
    {
      title: 'Document vault',
      description: 'Securely upload and share forms, home photos, and references for quick approvals.',
    },
    {
      title: 'Notification controls',
      description: 'Choose how you receive updates and pause communications when needed.',
    },
  ];

  const personalization = [
    {
      title: 'Pet matching',
      description: 'Receive smart suggestions based on lifestyle, preferences, and compatibility.',
    },
    {
      title: 'Learning journeys',
      description: 'Get curated resources and tips that align with your adoption stage.',
    },
    {
      title: 'Custom checklists',
      description: 'Add personal tasks, reminders, and notes for your household.',
    },
    {
      title: 'Communication templates',
      description: 'Share thoughtful updates with shelters using customizable prompts.',
    },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="spinner" aria-label="Loading adopter dashboard" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__intro">
        <Sparkles size={16} /> Welcome back, {user?.name || 'Adopter'}
      </div>

      <section className="dashboard-hero">
        <div className="dashboard-hero__heading">
          <div className="dashboard-status">
            <span className="status-dot" aria-hidden="true" /> Journey status: Inspired
          </div>
          <h1>Adopter Dashboard</h1>
          <p>
            Follow every step of your adoption adventure, stay connected with shelters, and celebrate the moments
            that lead to a perfect match.
          </p>
          <div className="dashboard-hero__actions">
            {[{ icon: PawPrint, label: 'Browse recommended pets' }, { icon: Heart, label: 'View favorites' }, { icon: MessageSquare, label: 'Catch up on messages' }].map(({ icon: Icon, label }) => (
              <span key={label} className="dashboard-pill">
                <Icon size={16} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="dashboard-hero__metrics">
          {heroMetrics.map((metric) => (
            <div key={metric.label} className="dashboard-hero__metric-card">
              <div>
                <h3>{metric.label}</h3>
                <strong>{metric.value}</strong>
                <small>{metric.helper}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="dashboard-columns dashboard-columns--3">
        <div className="dashboard-column">
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>≡ƒÄ» My Adoption Status</h3>
            </div>
            <ul className="metric-list metric-list--vertical">
              {adoptionStatus.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <div className={`dashboard-progress ${item.value >= 70 ? 'dashboard-progress--success' : ''}`}>
                    <span style={{ width: `${Math.min(item.value, 100)}%` }} />
                  </div>
                  <p>{item.helper}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h3>≡ƒô¥ Next Steps</h3>
            </div>
            <div className="flow-steps">
              {nextSteps.map((step) => (
                <div key={step.label} className="flow-step">
                  <strong>{step.label}</strong>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-card dashboard-card--accent">
            <div className="dashboard-card__header">
              <h3>≡ƒÆû My Pets &amp; Applications</h3>
            </div>
            <ul className="metric-list">
              {petConnections.map((item) => (
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
                <Inbox size={18} className="inline mr-2 align-middle text-white/60" /> Recent Communications
              </h3>
            </div>
            <ul className="metric-list">
              {communications.map((item) => (
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
                <FileText size={18} className="inline mr-2 align-middle text-white/60" /> Learning Center
              </h3>
            </div>
            <ul className="metric-list">
              {learningCenter.map((item) => (
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
                <Star size={18} className="inline mr-2 align-middle text-white/60" /> Achievements
              </h3>
            </div>
            <ul className="metric-list metric-list--vertical">
              {achievements.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="dashboard-columns dashboard-columns--3">
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Adoption Journey Flow</h3>
            <p>See where you are and what comes next</p>
          </div>
          <div className="flow-steps">
            {journeyHighlights.map((step) => (
              <div key={step.title} className="flow-step">
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Helpful Navigation</h3>
            <p>Jump right into the next best action</p>
          </div>
          <div className="dashboard-tablist">
            {['Adoption Journey', 'My Pets', 'Messages', 'Documents', 'Resources', 'Community'].map((label) => (
              <span key={label} className="dashboard-tab">
                {label}
              </span>
            ))}
          </div>
          <div className="dashboard-alerts">
            <div className="dashboard-alert dashboard-alert--info">
              <CalendarClock size={16} /> Confirm your meeting with Luna by tomorrow
            </div>
            <div className="dashboard-alert">
              <Users size={16} /> Shelter feedback requested on your profile update
            </div>
          </div>
          {!isLoadingApplications && highlightedApplications.length > 0 && (
            <ul className="metric-list metric-list--vertical">
              {highlightedApplications.map((app) => (
                <li key={app.id}>
                  <strong>{app.petName}</strong>
                  <p>
                    {app.status} • submitted {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {approvedApplication && (
            <div className="dashboard-alert dashboard-alert--info">
              🎉 Your application for {approvedApplication.petName} has been approved. Visit{' '}
              {approvedApplication.petLocation || 'the shelter'} and expect a call at{' '}
              {approvedApplication.contactPhone || approvedApplication.contactEmail} to schedule pickup.
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h3>Home-Ready Checklist</h3>
            <p>Because the little things matter</p>
          </div>
          <ul className="metric-list metric-list--vertical">
            <li>
              <strong>Space preparation</strong>
              <p>Set up a cozy area with bedding, toys, and fresh water.</p>
            </li>
            <li>
              <strong>Household alignment</strong>
              <p>Chat with your household about roles, routines, and responsibilities.</p>
            </li>
            <li>
              <strong>Supply checklist</strong>
              <p>Food, treats, ID tags, and a vet introduction appointment.</p>
            </li>
            <li>
              <strong>Welcome plan</strong>
              <p>Plan your first week of bonding, training, and quiet time.</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <h3>Key Features &amp; Interactions</h3>
          <p>Everything designed to make adoption joyful</p>
        </div>
        <div className="dashboard-card__grid dashboard-card__grid--two">
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-2">Journey Tracking</h4>
            <div className="dashboard-feature-grid">
              {journeyTools.map((item) => (
                <div key={item.title} className="dashboard-feature">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-2">Communication Tools</h4>
            <div className="dashboard-feature-grid">
              {communicationTools.map((item) => (
                <div key={item.title} className="dashboard-feature">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-2">Personalization</h4>
            <div className="dashboard-feature-grid">
              {personalization.map((item) => (
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

export default DashboardAdopter;
