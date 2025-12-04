import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/hero-banner.css";

const HERO_VIDEO = '/uploads/logo/Main_banner_video.mp4';

const HeroBanner = () => {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="hero-banner" aria-label="Fur & Feathers mission">
      <video
        className={`hero-banner__video${videoReady ? " is-visible" : ""}`}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setVideoReady(true)}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      <div className="hero-banner__overlay" />

      <div className="hero-banner__content">
        <div className="hero-banner__glass">
          <p className="hero-banner__overline">Compassion in motion</p>
          <h1 className="hero-banner__headline">
            <span>Connecting Hearts, Homes & Paws</span>
            <span>Because Every Pet Deserves a Family.</span>
          </h1>
          <p className="hero-banner__description">
            Discover loving pets near you and start a new friendship today.
            <br />
            Adopt, care, and create lifelong memories — all in one place.
          </p>
          <div className="hero-banner__actions">
            <Link to="/pets" className="site-button site-button--primary hero-banner__cta">
              Find companions
            </Link>
            <Link to="/about" className="site-button site-button--secondary hero-banner__cta">
              See how it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
