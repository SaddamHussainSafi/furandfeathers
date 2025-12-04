import React, { useCallback, useEffect, useRef, useState } from 'react';

const TESTIMONIALS = [
  {
    name: 'Mei Alvarez',
    role: 'Product researcher',
    location: 'Austin, TX',
    badge: 'Adopter',
    highlight: 'Matched Harper in 5 days',
    rating: 5,
    quote:
      '"Fur & Feathers turned our wish list into a living profile. The AI explained why each match fit and sounded human."',
    summary:
      'Weekly nudges, video notes, and the handoff checklist meant pick-up day felt calm instead of chaotic.',
    tags: ['Calm energy fit', 'Home check concierge', 'Behavior coach'],
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    pet: 'Harper • Husky mix'
  },
  {
    name: 'Noah Fadel',
    role: 'Shelter partnerships lead',
    location: 'Denver, CO',
    badge: 'Shelter partner',
    highlight: '15% faster placements',
    rating: 5,
    quote:
      '"Applicants arrived already knowing our pets. Intake teams finally stopped pasting the same answers into emails."',
    summary:
      'Availability synced with our shelter software, so every adopter saw real-time care plans and transport slots.',
    tags: ['Availability sync', 'Health records', 'Smart reminders'],
    avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600&q=80',
    pet: 'Mountain Tails • Shelter network'
  },
  {
    name: 'Gia Patel',
    role: 'Foster coordinator',
    location: 'Seattle, WA',
    badge: 'Foster hero',
    highlight: 'Every foster matched',
    rating: 5,
    quote:
      '"The slider cards feel tactile. Families swipe, learn, and schedule without me nudging every hour."',
    summary:
      'Behavior clips, vet notes, and follow-up prompts sit in one lane, so I spend time matchmaking instead of emailing PDFs.',
    tags: ['Follow-up plan', 'Video snippets', 'Shared timeline'],
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80',
    pet: 'Luna • Senior tabby'
  },
  {
    name: 'Ruben Castillo',
    role: 'Behavior coach',
    location: 'Portland, OR',
    badge: 'Coach',
    highlight: 'Stress-free transitions',
    rating: 5,
    quote:
      '"Families see why a dog needs decompression before they leave the shelter. That context used to take hours of calls."',
    summary:
      'I drop notes once, and adopters replay them as cards glide by. Engagement scores doubled on day-one trainings.',
    tags: ['Decompression plan', 'Coach notes', 'Progress check-ins'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    pet: 'Finley • Cattle dog'
  },
  {
    name: 'Lena Brooks',
    role: 'UX writer & cat mom',
    location: 'Raleigh, NC',
    badge: 'Adopter',
    highlight: 'Inbox calm again',
    rating: 5,
    quote:
      '"Gliding through the cards felt luxurious. We compared care needs, budget, and vibes faster than any spreadsheet."',
    summary:
      'The UI mirrored our project boards, and even the reminders used our tone. We adopted Kiwi with zero second-guessing.',
    tags: ['Budget cues', 'Tone-matched nudges', 'Post-adoption tips'],
    avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    pet: 'Kiwi • Flame point'
  }
];

const STAR_TOTAL = 5;

export default function TestimonialStack() {
  const sliderRef = useRef(null);
  const shellRef = useRef(null);
  const programmaticRef = useRef(false);
  const programmaticTimerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToCard = useCallback((index, behavior = 'smooth') => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cards = slider.querySelectorAll('.testimonial-card');
    const card = cards[index];
    if (!card) return;
    const target = card.offsetLeft - (slider.offsetWidth - card.offsetWidth) / 2;
    slider.scrollTo({
      left: target,
      behavior
    });
  }, []);

  const goToIndex = useCallback(
    (nextIndex, behavior = 'smooth') => {
      if (!sliderRef.current || !TESTIMONIALS.length) return;
      const length = TESTIMONIALS.length;
      const safeIndex = ((nextIndex % length) + length) % length;
      programmaticRef.current = true;
      if (programmaticTimerRef.current) {
        clearTimeout(programmaticTimerRef.current);
      }
      programmaticTimerRef.current = setTimeout(() => {
        programmaticRef.current = false;
      }, behavior === 'auto' ? 0 : 480);
      setActiveIndex(safeIndex);
      scrollToCard(safeIndex, behavior);
    },
    [scrollToCard]
  );

  useEffect(() => {
    const initialIndex = TESTIMONIALS.length > 1 ? 1 : 0;
    goToIndex(initialIndex, 'auto');
    return () => {
      if (programmaticTimerRef.current) {
        clearTimeout(programmaticTimerRef.current);
      }
    };
  }, [goToIndex]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isPointerDown = false;
    let startX = 0;
    let startScroll = 0;

    const handlePointerDown = event => {
      isPointerDown = true;
      slider.classList.add('is-dragging');
      startX = event.clientX;
      startScroll = slider.scrollLeft;
      slider.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = event => {
      if (!isPointerDown) return;
      const delta = event.clientX - startX;
      slider.scrollLeft = startScroll - delta;
    };

    const handlePointerUp = event => {
      if (!isPointerDown) return;
      isPointerDown = false;
      slider.classList.remove('is-dragging');
      if (event.pointerId && slider.hasPointerCapture?.(event.pointerId)) {
        slider.releasePointerCapture(event.pointerId);
      }
    };

    slider.addEventListener('pointerdown', handlePointerDown);
    slider.addEventListener('pointermove', handlePointerMove);
    slider.addEventListener('pointerup', handlePointerUp);
    slider.addEventListener('pointerleave', handlePointerUp);
    slider.addEventListener('pointercancel', handlePointerUp);

    return () => {
      slider.removeEventListener('pointerdown', handlePointerDown);
      slider.removeEventListener('pointermove', handlePointerMove);
      slider.removeEventListener('pointerup', handlePointerUp);
      slider.removeEventListener('pointerleave', handlePointerUp);
      slider.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      if (programmaticRef.current) return;
      const cards = slider.querySelectorAll('.testimonial-card');
      if (!cards.length) return;
      const sliderCenter = slider.scrollLeft + slider.offsetWidth / 2;
      let closestIndex = 0;
      let smallestDelta = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const delta = Math.abs(cardCenter - sliderCenter);
        if (delta < smallestDelta) {
          smallestDelta = delta;
          closestIndex = index;
        }
      });

      setActiveIndex(prev => (prev === closestIndex ? prev : closestIndex));
    };

    slider.addEventListener('scroll', handleScroll, { passive: true });
    return () => slider.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    let frame;

    const setPointerProgress = value => {
      shell.style.setProperty('--pointer-progress', value.toFixed(3));
    };

    const handleMove = event => {
      const rect = shell.getBoundingClientRect();
      const progress = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPointerProgress(progress));
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPointerProgress(0.5));
    };

    setPointerProgress(0.5);
    shell.addEventListener('pointermove', handleMove);
    shell.addEventListener('pointerleave', reset);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      shell.removeEventListener('pointermove', handleMove);
      shell.removeEventListener('pointerleave', reset);
    };
  }, []);

  const handlePrev = () => goToIndex(activeIndex - 1);
  const handleNext = () => goToIndex(activeIndex + 1);

  return (
    <section className="testimonial-showcase">
      <div className="testimonial-showcase__halo" aria-hidden="true" />
      <div className="testimonial-showcase__shell" ref={shellRef}>
        <header className="testimonial-showcase__intro">
          <span className="badge">Our community</span>
          <h2>Stories that glide right with you</h2>
          <p>
            Real adopters, coaches, and shelters share how Fur &amp; Feathers keeps every match transparent,
            warm, and on-brand with our light, optimistic experience.
          </p>
          <div className="testimonial-showcase__avatars" role="tablist" aria-label="Featured reviewers">
            {TESTIMONIALS.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={`avatar-chip${index === activeIndex ? ' is-active' : ''}`}
                onClick={() => goToIndex(index)}
                aria-pressed={index === activeIndex}
                aria-label={`Show testimonial from ${item.name}`}
              >
                <img src={item.avatar} alt={`Avatar of ${item.name}`} loading={index <= 1 ? 'eager' : 'lazy'} />
              </button>
            ))}
          </div>
        </header>

        <div className="testimonial-slider">
          <div
            className="testimonial-slider__viewport"
            ref={sliderRef}
            role="region"
            aria-label="Adopter testimonials carousel"
            tabIndex={0}
          >
            {TESTIMONIALS.map((item, index) => (
              <article
                key={item.name}
                className={`testimonial-card${index === activeIndex ? ' is-active' : ''}`}
                aria-label={`${item.name} shares their Fur & Feathers experience`}
              >
                <header className="testimonial-card__top">
                  <div className="testimonial-card__badge-row">
                    <span className="pill">{item.badge}</span>
                    <span className="pill pill--muted">{item.highlight}</span>
                  </div>
                  <div className="testimonial-card__identity">
                    <div className="testimonial-card__avatar">
                      <img src={item.avatar} alt={`${item.name} avatar`} loading={index <= 1 ? 'eager' : 'lazy'} />
                    </div>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.role}</p>
                      <small>{item.location}</small>
                    </div>
                  </div>
                </header>

                <div className="testimonial-card__rating" aria-label={`${item.rating} out of ${STAR_TOTAL} stars`}>
                  <div className="stars" aria-hidden="true">
                    {Array.from({ length: STAR_TOTAL }).map((_, starIndex) => (
                      <span
                        key={`${item.name}-star-${starIndex}`}
                        className={`star${starIndex < item.rating ? ' is-filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="testimonial-card__pet">{item.pet}</span>
                </div>

                <blockquote>{item.quote}</blockquote>

                <ul className="testimonial-card__tags">
                  {item.tags.map(tag => (
                    <li key={`${item.name}-${tag}`}>{tag}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="testimonial-slider__nav" aria-label="Carousel controls">
            <button type="button" onClick={handlePrev} aria-label="Show previous testimonial">
              <span aria-hidden="true">←</span>
            </button>
            <div className="testimonial-slider__position">
              {activeIndex + 1}/{TESTIMONIALS.length}
            </div>
            <button type="button" onClick={handleNext} aria-label="Show next testimonial">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
