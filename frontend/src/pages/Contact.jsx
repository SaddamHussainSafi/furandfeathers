import React from 'react';

const SUPPORT_CHANNELS = [
  {
    heading: 'Adopter support',
    description: 'Questions about your application, favorites, or adoption prep.',
    email: 'adopt@furandfeathers.com',
    response: 'Response within 1 business day'
  },
  {
    heading: 'Shelter partnerships',
    description: 'Onboarding, training, and integrations for shelter teams.',
    email: 'shelters@furandfeathers.com',
    response: 'Response within 2 business days'
  },
  {
    heading: 'Media & press',
    description: 'Press inquiries, speaking opportunities, or collaborations.',
    email: 'press@furandfeathers.com',
    response: 'Response within 2 business days'
  }
];

export default function Contact() {
  return (
    <div className="page">
      <section className="page-section">
        <span className="badge">We are here to help</span>
        <h1 className="section-heading">Connect with the Fur &amp; Feathers team</h1>
        <p className="section-subheading">
          Whether you are adopting, fostering, or collaborating, we love hearing from you. Choose the channel
          that fits best and our team will follow up shortly.
        </p>
        <div className="section-grid section-grid--three">
          {SUPPORT_CHANNELS.map((channel) => (
            <article key={channel.heading} className="surface-card">
              <h3>{channel.heading}</h3>
              <p>{channel.description}</p>
              <a className="site-button site-button--secondary" href={`mailto:${channel.email}`}>
                {channel.email}
              </a>
              <small>{channel.response}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section page-section--muted">
        <h2 className="section-heading">Visit us IRL</h2>
        <div className="surface-card">
          <p>
            987 Kindred Lane, Suite 204<br />
            San Francisco, CA 94107
          </p>
          <p>
            We host monthly adoption pop-ups and quarterly community roundtables. RSVP to{' '}
            <a href="mailto:events@furandfeathers.com">events@furandfeathers.com</a> to join the next one.
          </p>
        </div>
      </section>
    </div>
  );
}

