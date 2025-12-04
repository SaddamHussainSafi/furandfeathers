import React from 'react';
import '../styles/legal.css';

const USER_DUTIES = [
  'Provide accurate information when creating an account or submitting an application.',
  'Treat shelters, rescues, adopters, and staff with respect.',
  'Use Fur & Feathers only for lawful purposes tied to animal welfare and adoption.',
  'Comply with local regulations related to animal care, fostering, or adoption.'
];

const PLATFORM_PROMISES = [
  'Maintain platform uptime, monitoring, and encryption.',
  'Give transparent notice before material changes to features or policies.',
  'Investigate reports of misuse or fraud within two business days.',
  'Protect community members from harassment, spam, or discrimination.'
];

const PROHIBITED = [
  'Posting false information about pets, shelters, or adopters.',
  'Attempting to bypass application flows or payment processes.',
  'Sharing another persons private information without consent.',
  'Automating account creation, scraping, or denial-of-service attacks.'
];

const LIABILITY = [
  'We provide the service as-is; shelters retain control over adoption decisions.',
  'Fur & Feathers is not responsible for agreements you make directly with shelters or adopters.',
  'If any part of these terms is invalid, the rest remain enforceable.',
  'Your continued use of the platform means you accept updates after notice.'
];

export default function Terms() {
  return (
    <div className="page legal">
      <section className="page-section legal-hero">
        <div className="legal-hero__badge-row">
          <span className="badge">Terms of service</span>
          <span className="legal-chip legal-chip--focus">Community first</span>
          <span className="legal-chip legal-chip--calm">Plain language</span>
        </div>
        <h1 className="section-heading">Community guidelines and commitments</h1>
        <p className="section-subheading">
          These terms keep Fur & Feathers safe for humans and animals. By using our products you agree to follow them.
        </p>
        <div className="legal-highlight-grid">
          <article className="legal-highlight">
            <p className="legal-eyebrow">Respect</p>
            <strong>Zero harassment</strong>
            <small>We remove users who threaten, harass, or discriminate.</small>
          </article>
          <article className="legal-highlight">
            <p className="legal-eyebrow">Transparency</p>
            <strong>Notice before changes</strong>
            <small>We alert you at least 14 days before material updates.</small>
          </article>
          <article className="legal-highlight">
            <p className="legal-eyebrow">Safety</p>
            <strong>Report and respond</strong>
            <small>Issues are acknowledged within two business days.</small>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="legal-grid legal-grid--wide">
          <article className="surface-card legal-card">
            <p className="legal-eyebrow">Your commitments</p>
            <h3>What you agree to when using Fur & Feathers</h3>
            <ul className="legal-list">
              {USER_DUTIES.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="surface-card legal-card">
            <p className="legal-eyebrow">Our promises</p>
            <h3>How we operate the platform</h3>
            <ul className="legal-list">
              {PLATFORM_PROMISES.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="page-section page-section--muted">
        <div className="legal-grid legal-grid--wide">
          <article className="surface-card legal-card">
            <p className="legal-eyebrow">Not allowed</p>
            <h3>Prohibited activities</h3>
            <ul className="legal-list">
              {PROHIBITED.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="surface-card legal-card">
            <p className="legal-eyebrow">Liability</p>
            <h3>Limits and expectations</h3>
            <ul className="legal-list">
              {LIABILITY.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="legal-callout legal-callout--soft">
              <strong>Updates</strong>
              <p>We will notify you in-app and via email before meaningful changes take effect.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="surface-card legal-card legal-card--stack">
          <div>
            <p className="legal-eyebrow">Need help?</p>
            <h3>Contact us about these terms</h3>
            <p>If you have questions about responsibilities, enforcement, or appeals, reach out and we will respond quickly.</p>
          </div>
          <div className="legal-actions">
            <a className="site-button site-button--secondary" href="mailto:support@furandfeathers.com">
              Email support
            </a>
            <a className="site-button site-button--primary" href="mailto:legal@furandfeathers.com">
              Contact legal
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
