import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="page">
      <section className="page-section">
        <span className="badge">Privacy policy</span>
        <h1 className="section-heading">Your trust fuels our community</h1>
        <p className="section-subheading">
          We collect only the information required to match pets with loving homes, and we never sell your
          data. This summary highlights the most important points.
        </p>
        <div className="section-grid section-grid--two">
          <article className="surface-card">
            <h3>Information we collect</h3>
            <ul>
              <li>Account details you provide such as name, email, and location.</li>
              <li>Adoption preferences, saved pets, and submitted applications.</li>
              <li>Technical analytics to keep Fur &amp; Feathers secure and reliable.</li>
            </ul>
          </article>
          <article className="surface-card">
            <h3>How information is used</h3>
            <ul>
              <li>Power matchmaking, shelter communication, and status updates.</li>
              <li>Improve platform features and detect unusual or fraudulent activity.</li>
              <li>Send optional adoption resources you can unsubscribe from anytime.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="page-section page-section--muted">
        <h2 className="section-heading">Your controls</h2>
        <div className="surface-card">
          <ul>
            <li>Update profile information or delete your account from the Profile page.</li>
            <li>Download a copy of your data by emailing <a href="mailto:privacy@furandfeathers.com">privacy@furandfeathers.com</a>.</li>
            <li>We retain adoption records for 24 months to comply with shelter agreements.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
