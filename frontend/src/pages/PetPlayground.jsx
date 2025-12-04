import React, { useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import '../styles/pet-playground.css';

const PET_ORBS = [
  {
    name: 'Nova',
    tag: 'Velcro cat · 2y',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=240&q=70',
    top: 18,
    left: 18,
    tone: 'teal'
  },
  {
    name: 'Biscuit',
    tag: 'Confident pup · 1y',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=240&q=70',
    top: 12,
    left: 62,
    tone: 'sunset'
  },
  {
    name: 'Maple',
    tag: 'Adventure buddy · 3y',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=240&q=70',
    top: 56,
    left: 30,
    tone: 'sky'
  },
  {
    name: 'Indie',
    tag: 'Gentle senior · 7y',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=240&q=70',
    top: 58,
    left: 70,
    tone: 'violet'
  }
];

const TEXT_TOKENS = [
  { label: 'Kid-friendly check', sub: 'Tested w/ 8yo+', top: 8, left: 8, tone: 'muted' },
  { label: 'Apartment-ready', sub: 'No loud zoomies', top: 32, left: 82, tone: 'bold' },
  { label: 'Calm energy', sub: 'Loves slow mornings', top: 74, left: 12, tone: 'muted' },
  { label: 'Behavior notes', sub: '3 wins, 1 watch-out', top: 76, left: 62, tone: 'bold' }
];

const INFO_CARDS = [
  {
    title: 'Static anchors',
    body: 'Keep context visible while people play. Great for care plans, meet-up checklists, or adoption timelines.',
    points: ['Pinned glass card stays put', 'Short sentences for quick scanning', 'High contrast for accessibility']
  },
  {
    title: 'Micro-missions',
    body: 'Nudge visitors to drag, swap, and hover so the physics feel purposeful instead of gimmicky.',
    points: ['“Pair the calm pets together” prompt', 'Tap to reveal temperament tags', 'Reset by reloading if needed']
  },
  {
    title: 'Light assets',
    body: 'Orbs use 220px crops masked into circles. First two load eagerly, the rest wait until scrolled into view.',
    points: ['< 200 KB per avatar', 'Rounded masks + soft borders', 'Uses brand teal + coral glows']
  }
];

export default function PetPlayground() {
  const fieldRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const floatMotion = useMemo(
    () => seed => {
      if (prefersReducedMotion) return {};
      const direction = seed % 2 === 0 ? 1 : -1;
      return {
        animate: {
          y: [0, 8 * direction, -6 * direction, 0],
          x: [0, 6 * -direction, 4 * direction, 0],
          rotate: [0, 2 * direction, -2 * direction, 0]
        },
        transition: {
          duration: 7 + seed,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: seed * 0.18
        }
      };
    },
    [prefersReducedMotion]
  );

  return (
    <div className="page pet-playground">
      <section className="page-section pet-playground__section">
        <div className="pet-playground__intro">
          <span className="badge">Playable meets static</span>
          <h1 className="section-heading">Pet Physics Lab</h1>
          <p className="section-subheading">
            Drag lightweight, circular pet avatars while anchored cards hold the story. Built to mirror Fur &amp; Feathers
            palette and glass surfaces so it feels native, not bolted on.
          </p>
        </div>

        <div className="pet-playground__grid">
          <div className="pet-playground__field" ref={fieldRef} aria-label="Interactive pet playground">
            <div className="pet-playground__halo pet-playground__halo--left" aria-hidden="true" />
            <div className="pet-playground__halo pet-playground__halo--right" aria-hidden="true" />
            <div className="pet-playground__legend">
              <span>Drag the orbs</span>
              <span className="dot dot--static" />
              <small>Static anchors</small>
            </div>

            {PET_ORBS.map((pet, index) => {
              const motionProps = floatMotion(index + 1);
              return (
                <motion.div
                  key={pet.name}
                  className={`pet-orb pet-orb--${pet.tone}`}
                  style={{ top: `${pet.top}%`, left: `${pet.left}%` }}
                  drag
                  dragConstraints={fieldRef}
                  dragElastic={0.18}
                  dragMomentum={false}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  {...motionProps}
                  aria-label={`${pet.name}: ${pet.tag}`}
                >
                  <div className="pet-orb__image">
                    <img
                      src={pet.image}
                      alt={`${pet.name} the pet`}
                      loading={index <= 1 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="pet-orb__text">
                    <strong>{pet.name}</strong>
                    <small>{pet.tag}</small>
                  </div>
                </motion.div>
              );
            })}

            {TEXT_TOKENS.map((token, index) => {
              const motionProps = floatMotion(index + 5);
              return (
                <motion.div
                  key={token.label}
                  className={`pet-token pet-token--${token.tone}`}
                  style={{ top: `${token.top}%`, left: `${token.left}%` }}
                  drag
                  dragConstraints={fieldRef}
                  dragElastic={0.14}
                  dragMomentum={false}
                  whileTap={{ scale: 0.94 }}
                  {...motionProps}
                  aria-label={`${token.label} (${token.sub})`}
                >
                  <span>{token.label}</span>
                  <small>{token.sub}</small>
                </motion.div>
              );
            })}

            <div className="pet-playground__static-card">
              <p className="eyebrow">Static note</p>
              <h3>Save the onboarding copy here</h3>
              <ul>
                <li>Leave room for summary text</li>
                <li>Keep bullets short &amp; scannable</li>
                <li>CTA stays pinned for accessibility</li>
              </ul>
              <button type="button" className="site-button site-button--secondary pet-playground__cta">
                Book a meet &amp; greet
              </button>
            </div>
          </div>

          <div className="pet-playground__notes">
            {INFO_CARDS.map(card => (
              <article key={card.title} className="surface-card pet-playground__note">
                <p className="eyebrow">Why it works</p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <ul>
                  {card.points.map(point => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section page-section--muted pet-playground__stack">
        <div className="pet-playground__stack-header">
          <div>
            <span className="badge">Optimized assets</span>
            <h2 className="section-heading">Static + dynamic, same visual language</h2>
            <p className="section-subheading">
              Rounded avatars, pill labels, and glass cards reuse the site colors so the lab page feels like home. Swap
              the data and the layout still holds.
            </p>
          </div>
          <div className="pet-playground__stack-meta">
            <div>
              <p className="eyebrow">Image budget</p>
              <strong>~150 KB</strong>
              <small>per orb @ w=240, q=70</small>
            </div>
            <div>
              <p className="eyebrow">Interaction</p>
              <strong>Drag + hover</strong>
              <small>Framer Motion physics-lite</small>
            </div>
          </div>
        </div>

        <div className="pet-playground__stack-grid">
          <article className="surface-card pet-playground__stack-card">
            <h3>Static rows</h3>
            <p>Use for guarantees, timelines, or care bundles you do not want drifting around.</p>
            <div className="pet-playground__chips">
              <span className="pill">24/7 chat</span>
              <span className="pill pill--muted">Transport ready</span>
              <span className="pill">Coach assigned</span>
            </div>
          </article>
          <article className="surface-card pet-playground__stack-card">
            <h3>Dynamic row</h3>
            <p>Reserve this for playful content: pet moods, adopter badges, or mini-games that invite a drag.</p>
            <div className="pet-playground__chips">
              <span className="pill">Kid tested</span>
              <span className="pill pill--muted">Allergy notes</span>
              <span className="pill">Energy match</span>
            </div>
          </article>
          <article className="surface-card pet-playground__stack-card">
            <h3>Theme fidelity</h3>
            <p>Shadows, borders, and gradients borrow directly from the brand palette so the lab page feels native.</p>
            <div className="pet-playground__chips">
              <span className="pill">Teal glow</span>
              <span className="pill pill--muted">Coral spark</span>
              <span className="pill">Glass edge</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
