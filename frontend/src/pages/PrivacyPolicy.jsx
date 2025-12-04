import React from 'react';
import '../styles/legal.css';

const DATA_POINTS = [
  {
    title: 'Information we collect',
    items: [
      'Account details you provide such as name, email, and city.',
      'Adoption preferences, saved pets, and submitted applications.',
      'Technical analytics to keep Fur & Feathers secure and reliable.'
    ]
  },
  {
    title: 'How we use it',
    items: [
      'Match you with pets and coordinate with shelters or rescues.',
      'Notify you about status changes, reminders, and scheduled meetups.',
      'Improve product reliability, prevent fraud, and ship new features.'
    ]
  },
  {
    title: 'What we do not do',
    items: [
      'We do not sell your data to third parties.',
      'We do not train external AI models on your private messages.',
      'We do not use your photos or videos without consent.'
    ]
  }
];

const CONTROLS = [
  'Update profile details or delete your account anytime from Profile.',
  'Download a copy of your data by emailing privacy@furandfeathers.com.',
  'Control email preferences in Settings or from any email footer.'
];

const SECURITY = [
  'Data encrypted in transit and at rest.',
  'Access limited to vetted team members supporting your adoption.',
  'Incident response targets acknowledgement within one business day.'
];

const RETENTION = [
  'Adoption records retained for 24 months to honor shelter agreements.',
  'If you delete your account, we remove personal data not required for legal obligations.',
  'Backups cycle regularly; removal may take up to 30 days to complete.'
];

export default function PrivacyPolicy() {
  return (
    <div className="page legal">
      <section className="page-section legal-hero">
        <div className="legal-hero__badge-row">
          <span className="badge">Privacy policy</span>
          <span className="legal-chip legal-chip--calm">No data selling</span>
          <span className="legal-chip legal-chip--focus">User controlled</span>
        </div>
        <h1 className="section-heading">Your trust fuels our community</h1>
        <p className="section-subheading">
          We collect only the details needed to connect people and pets. You own your data, and you decide how
          we use it.
        </p>

        <div className="legal-highlight-grid">
          <article className="legal-highlight">
            <p className="legal-eyebrow">Data portability</p>
            <strong>Request and export</strong>
            <small>Contact privacy@furandfeathers.com to download your records.</small>
          </article>
          <article className="legal-highlight">
            <p className="legal-eyebrow">Control</p>
            <strong>Delete anytime</strong>
            <small>Remove your account in Profile. We confirm once backups clear.</small>
          </article>
          <article className="legal-highlight">
            <p className="legal-eyebrow">Transparency</p>
            <strong>Plain language</strong>
            <small>No legal maze. Just what we collect, why, and how to opt out.</small>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="legal-grid">
          {DATA_POINTS.map(block => (
            <article key={block.title} className="surface-card legal-card">
              <div className="legal-card__header">
                <h3>{block.title}</h3>
              </div>
              <ul className="legal-list">
                {block.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section page-section--muted">
        <div className="legal-grid legal-grid--wide">
          <article className="surface-card legal-card">
            <p className="legal-eyebrow">Your controls</p>
            <h3>Manage how we use your information</h3>
            <ul className="legal-list">
              {CONTROLS.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="legal-callout">
              <p>Questions? Email <a href="mailto:privacy@furandfeathers.com">privacy@furandfeathers.com</a>. We respond within one business day.</p>
            </div>
          </article>

          <article className="surface-card legal-card">
            <p className="legal-eyebrow">Security</p>
            <h3>How we protect data</h3>
            <ul className="legal-list">
              {SECURITY.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="legal-callout legal-callout--soft">
              <strong>Incident response</strong>
              <p>We notify affected users if we ever detect unauthorized access.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="legal-grid legal-grid--wide">
          <article className="surface-card legal-card">
            <p className="legal-eyebrow">Retention</p>
            <h3>How long we keep information</h3>
            <ul className="legal-list">
              {RETENTION.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="surface-card legal-card">
            <p className="legal-eyebrow">Third parties & AI</p>
            <h3>Limited, transparent sharing</h3>
            <ul className="legal-list">
              <li>Vendors that support hosting, email, payments, or analytics must meet our security standards.</li>
              <li>We do not sell personal data or allow third parties to market to you without consent.</li>
              <li>Models we run are tuned only on anonymized or aggregated data to protect your identity.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="page-section page-section--muted">
        <div className="surface-card legal-card legal-card--stack">
          <div>
            <p className="legal-eyebrow">Talk to a human</p>
            <h3>Privacy questions, requests, or feedback</h3>
            <p>We keep our process straightforward. Reach out anytime and we will guide you through requests or concerns.</p>
          </div>
          <div className="legal-actions">
            <a className="site-button site-button--secondary" href="mailto:privacy@furandfeathers.com">
              Email privacy@furandfeathers.com
            </a>
            <a className="site-button site-button--primary" href="mailto:support@furandfeathers.com">
              Contact support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
