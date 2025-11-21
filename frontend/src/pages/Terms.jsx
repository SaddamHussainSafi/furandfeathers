import React from 'react';

const COMMITMENTS = [
  'Provide accurate information when creating an account or submitting an application.',
  'Respect shelters, rescues, adopters, and fellow community members.',
  'Use Fur & Feathers tools for lawful purposes related to animal welfare and adoption.'
];

const PLATFORM_PLEDGES = [
  'Maintain platform uptime, security monitoring, and data encryption.',
  'Offer transparent communication about feature changes or policy updates.',
  'Respond to reports of misconduct or fraud within two business days.'
];

export default function Terms() {
  return (
    <div className="page">
      <section className="page-section">
        <span className="badge">Terms of service</span>
        <h1 className="section-heading">Community guidelines &amp; commitments</h1>
        <p className="section-subheading">
          These terms keep Fur &amp; Feathers safe for humans and animals. By using our products you agree to
          follow them.
        </p>
        <div className="surface-card">
          <h3>Your commitments</h3>
          <ul>
            {COMMITMENTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-section page-section--muted">
        <div className="surface-card">
          <h3>Our promises</h3>
          <ul>
            {PLATFORM_PLEDGES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            We may update these terms as we launch new functionality. When we do, we will notify you in-app
            and by email at least 14 days before changes take effect.
          </p>
        </div>
      </section>
    </div>
  );
}
