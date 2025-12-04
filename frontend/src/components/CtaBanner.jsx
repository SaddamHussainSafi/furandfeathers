import React from 'react';
import { Link } from 'react-router-dom';

const CTA_BG =
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80';

export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="cta-banner__bg" aria-hidden="true" />
      <div className="cta-banner__overlay" />

      <div className="cta-banner__shell">
        <div className="cta-banner__content">
          <div className="cta-banner__text">
            <p className="badge">Ready to meet your match?</p>
            <h2>Adopt without limits</h2>
            <p className="cta-banner__subtitle">
              Find the right companion for your lifestyle, submit your application, and start planning day one together.
            </p>
          </div>

          <div className="cta-banner__form">
            <label className="cta-banner__label" htmlFor="cta-preference">
              Your preference
            </label>
            <div className="cta-banner__inputs">
              <select id="cta-preference" className="cta-banner__select" defaultValue="dog">
                <option value="dog">Dogs &amp; puppies</option>
                <option value="cat">Cats &amp; kittens</option>
                <option value="other">Small &amp; exotic friends</option>
              </select>
              <input
                type="text"
                className="cta-banner__input"
                placeholder="Enter your city"
                aria-label="Enter your city"
              />
              <Link to="/pets" className="cta-banner__button">
                Browse pets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
