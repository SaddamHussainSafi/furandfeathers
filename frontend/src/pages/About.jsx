import React from 'react';

const VALUES = [
  {
    title: 'Compassion first',
    description: 'Every feature is designed to prioritize animal welfare and adopter readiness.'
  },
  {
    title: 'Trusted partnerships',
    description: 'We collaborate with shelters and rescues who share our standards for care.'
  },
  {
    title: 'Technology with heart',
    description: 'Smart tools streamline the logistics so humans can focus on connection.'
  }
];

const MILESTONES = [
  {
    year: '2022',
    detail: 'Fur & Feathers launched with a mission to modernize ethical pet adoption.'
  },
  {
    year: '2023',
    detail: 'Introduced AI-powered pet detection and matchmaking dashboards for shelters.'
  },
  {
    year: '2024',
    detail: 'Community surpassed 50,000 successful matches across 200+ partner rescues.'
  }
];

export default function About() {
  return (
    <div className="page">
      <section className="page-section">
        <span className="badge">Our mission</span>
        <h1 className="section-heading">A kinder adoption journey for every animal lover</h1>
        <p className="section-subheading">
          Fur &amp; Feathers brings transparency and delight to the adoption process. We build tools that
          empower shelters, inform adopters, and create lifelong matches.
        </p>
        <div className="section-grid section-grid--three">
          {VALUES.map((value) => (
            <article key={value.title} className="surface-card">
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section page-section--muted">
        <h2 className="section-heading">Milestones that shaped us</h2>
        <div className="section-grid section-grid--two">
          {MILESTONES.map((milestone) => (
            <article key={milestone.year} className="surface-card">
              <h4>{milestone.year}</h4>
              <p>{milestone.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <h2 className="section-heading">Meet the humans behind Fur &amp; Feathers</h2>
        <p className="section-subheading">
          We are designers, engineers, rescuers, and adopters united by the belief that technology can
          simplify care. Together we volunteer over 1,200 hours each year to support adoption events,
          transport initiatives, and foster programs.
        </p>
        <div className="surface-card">
          <p>
            Want to collaborate or feature your shelter? Email us at{' '}
            <a href="mailto:partners@furandfeathers.com">partners@furandfeathers.com</a> and we will reach out
            within two business days.
          </p>
        </div>
      </section>
    </div>
  );
}
