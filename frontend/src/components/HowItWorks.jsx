import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const STEP_DATA = [
  {
    title: 'Browse & Discover',
    description:
      'Explore thousands of pets waiting for homes. Use smart filters to find your perfect match based on breed, age, location, and personality.',
    image:
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Adopter browsing pets on a tablet'
  },
  {
    title: 'Connect & Apply',
    description:
      'Chat directly with shelters and submit your adoption application. Get all your questions answered in real-time.',
    image:
      'https://www.ovrs.com/blog/wp-content/uploads/2023/08/OVRS-connect-shutterstock_2132259743.jpeg',
    alt: 'Shelter team member connecting with an adopter on a tablet'
  },
  {
    title: 'Adopt & Bring Home',
    description:
      'Complete the adoption process and welcome your new family member. We guide you through every step until you’re home together.',
    image:
      'https://cdn.shopify.com/s/files/1/1652/1243/files/health-benefit-dog-owners.jpg?v=1641886006',
    alt: 'Pet parent holding their dog happily after adoption'
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveStep(index);
          }
        });
      },
      { threshold: 0.25 }
    );

    stepRefs.current.forEach(step => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="adoption-process">
      <div className="adoption-process__container">
        <div className="adoption-process__heading">
          <span className="badge">Our Process</span>
          <h2 className="section-heading">How adoption works</h2>
          <p className="section-subheading section-subheading--center">
            Three guided steps that keep every adoption intuitive, transparent, and full of heart.
          </p>
        </div>

        <div className="adoption-process__grid">
          <div className="process-panel">
            <div className="process-panel__timeline" aria-live="polite">
              {STEP_DATA.map((step, index) => (
                <article
                  key={step.title}
                  data-index={index}
                  ref={el => (stepRefs.current[index] = el)}
                  className={`process-step${activeStep === index ? ' is-active' : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="process-step__marker">
                    <span className="process-step__dot">
                      <span className="process-step__number">{index + 1}</span>
                    </span>
                    {index !== STEP_DATA.length - 1 && (
                      <span className="process-step__connector" aria-hidden="true" />
                    )}
                  </div>
                  <div className="process-step__body">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <Link to="/contact" className="process-panel__cta">
              <span>Talk to an adoption guide</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="adoption-process__visual">
            {STEP_DATA.map((step, index) => (
              <img
                key={step.title}
                src={step.image}
                alt={step.alt}
                className={`adoption-process__image${activeStep === index ? ' is-active' : ''}`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ))}
            <div className="adoption-process__visual-overlay" />
          </div>
        </div>
      </div>
    </section>
  );
}
