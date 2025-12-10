import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { normalizeMediaUrl } from '../utils/mediaUrl';

const MATCH_FEATURES = [
  {
    title: 'Learns your preferences',
    description:
      'Tell us about your lifestyle, space, and favorite breeds. The AI refines every signal to get smarter with each interaction.'
  },
  {
    title: 'Understands pets deeply',
    description:
      'We ingest shelter notes, behavior updates, and health records to spot the pets that truly match your energy.'
  },
  {
    title: 'Suggests ideal matches',
    description:
      'Receive curated pairings plus daily nudges when a newly listed pet ticks all your boxes.'
  }
];

const CAT_SOUND_FILENAMES = [
  'cat_sound___1.mp3',
  'cat_sound___2.mp3',
  'cat_sound___3.mp3',
  'cat_sound___4.mp3',
  'cat_sound___5.mp3',
  'cat_sound___6.mp3',
  'cat_sound___7.mp3',
  'cat_sound___8.mp3',
  'cat_sound___9.mp3'
];

export default function AIMatchmaking() {
  const eyesRef = useRef([]);
  const catRef = useRef(null);
  const pyramidRef = useRef(null);
  const isDraggingRef = useRef(false);
  const popupRef = useRef(null);
  const catSoundPool = useRef([]);
  const hasPlayedFirstSound = useRef(false);

  useEffect(() => {
    catSoundPool.current = CAT_SOUND_FILENAMES.map(name => {
      const audio = new Audio(normalizeMediaUrl(`/uploads/sounds/${name}`));
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      audio.volume = 0.8;
      return audio;
    });
  }, []);

  useEffect(() => {
    if (pyramidRef.current) {
      pyramidRef.current.style.animation = 'aiCatSpin 7s linear infinite';
    }
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (catRef.current && catRef.current.contains(event.target)) {
        isDraggingRef.current = true;
      }
    };

    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (pyramidRef.current) {
          pyramidRef.current.style.animationDuration = '7s';
          pyramidRef.current.style.animationDirection = 'normal';
          pyramidRef.current.style.animationPlayState = 'running';
        }
      }
    };

    const handleMove = (event) => {
      const eyes = eyesRef.current;
      eyes.forEach(eye => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);
        const radius = 4;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;
        eye.style.setProperty('--eye-offset-x', `${offsetX}px`);
        eye.style.setProperty('--eye-offset-y', `${offsetY}px`);
      });

      if (catRef.current && pyramidRef.current && isDraggingRef.current) {
        const rect = catRef.current.getBoundingClientRect();
        const relX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const duration = Math.max(4.5, 7 - Math.abs(relX) * 3);
        pyramidRef.current.style.animationDuration = `${duration}s`;
        pyramidRef.current.style.animationDirection = relX < 0 ? 'reverse' : 'normal';
        pyramidRef.current.style.animationPlayState = 'running';
      } else if (pyramidRef.current && !isDraggingRef.current) {
        pyramidRef.current.style.animationPlayState = 'running';
      }
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointerleave', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointerleave', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const POPUP_MESSAGES = [
    "Don't poke me",
    "Easy there",
    "Hiss mode off",
    "Okay okay",
    "Gentle paws please",
    "I'm on break",
    "Respect the whiskers",
    "Nap in progress",
    "Try treats instead",
    "Mood: mysterious",
    "Stalking butterflies"
  ];

  const handleCatClick = () => {
    const pool = catSoundPool.current;
    if (!pool.length) return;
    let audio;
    if (!hasPlayedFirstSound.current) {
      audio = pool[0];
      hasPlayedFirstSound.current = true;
    } else {
      audio = pool[Math.floor(Math.random() * pool.length)];
    }
    try {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {
      // ignore playback errors
    }
    if (popupRef.current) {
      const randomText = POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)];
      popupRef.current.textContent = randomText;
      popupRef.current.classList.remove('is-visible');
      // Force reflow to restart animation
      void popupRef.current.offsetWidth;
      popupRef.current.classList.add('is-visible');
    }
  };

  return (
    <section className="ai-matchmaking">
      <div className="ai-matchmaking__container">
        <div className="ai-matchmaking__intro">
          <span className="badge">Smart Pairings</span>
          <h2 className="section-heading">AI Matchmaking</h2>
          <p className="section-subheading">
            Our pet-matching AI learns your preferences and keeps refining suggestions so every introduction feels tailor-made.
          </p>
        </div>

        <div className="ai-matchmaking__grid">
          {MATCH_FEATURES.map(feature => (
            <article key={feature.title} className="ai-match-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}

          <article className="ai-match-panel">
            <div className="ai-match-panel__content">
              <h3>Real-time pairing engine</h3>
              <p>
                Every time you favorite or skip a pet, the model recalibrates. Expect thoughtful matches, faster applications, and happier
                homes.
              </p>
              <ul>
                <li>Understands 40+ pet attributes</li>
                <li>Adopter DNA profile adapts weekly</li>
                <li>Integrates with shelter availability</li>
              </ul>
              <div className="ai-match-panel__cta">
                <Link to="/pets" className="site-button site-button--primary">
                  Find your right match now...
                </Link>
              </div>
            </div>
            <div className="ai-cat" ref={catRef} onClick={handleCatClick}>
              <div className="ai-cat__ears">
                <span />
                <span />
              </div>
              <div className="ai-cat__head">
                {[0, 1].map(index => (
                  <span
                    key={index}
                    data-index={index}
                    ref={el => (eyesRef.current[index] = el)}
                    className="ai-cat__eye"
                  />
                ))}
                <span className="ai-cat__nose" />
              </div>
              <div className="ai-cat__pyramid" ref={pyramidRef}>
                <span className="ai-cat__side ai-cat__side1" />
                <span className="ai-cat__side ai-cat__side2" />
                <span className="ai-cat__side ai-cat__side3" />
                <span className="ai-cat__side ai-cat__side4" />
                <span className="ai-cat__shadow" />
              </div>
              <div className="ai-cat__popup" ref={popupRef}>
                Don't poke me
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
