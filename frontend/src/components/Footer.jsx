import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/layout.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <h3>Fur &amp; Feathers</h3>
          <p>
            We help compassionate humans and remarkable animals find one another.
            From discovery to adoption day, Fur &amp; Feathers keeps every step kind,
            transparent, and joyful.
          </p>
          <div className="site-footer__social">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Visit our Instagram">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="20" height="20" loading="lazy" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Visit our Facebook">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="20" height="20" loading="lazy" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="Visit our LinkedIn">
              <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn" width="20" height="20" loading="lazy" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="site-footer__heading">Explore</h4>
          <ul className="site-footer__nav">
            <li><Link to="/pets">Browse pets</Link></li>
            <li><Link to="/favorites">Saved favorites</Link></li>
            <li><Link to="/applications">Adoption applications</Link></li>
            <li><Link to="/my-pets">My pets</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="site-footer__heading">Resources</h4>
          <ul className="site-footer__nav">
            <li><Link to="/pet-detection">AI pet detection</Link></li>
            <li><Link to="/pet-detection-history">Detection history</Link></li>
            <li><Link to="/furly-chat">Furly chat assistant</Link></li>
            <li><Link to="/messages">Secure messaging</Link></li>
          </ul>
        </div>

        <div className="site-footer__cta">
          <h4 className="site-footer__heading">Stay in the loop</h4>
          <p>Get monthly adoption tips, success stories, and platform updates.</p>
          <a className="site-button site-button--secondary" href="mailto:hello@furandfeathers.com">
            hello@furandfeathers.com
          </a>
          <Link to="/register" className="site-button site-button--primary">
            Join the community
          </Link>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>&copy; {currentYear} Fur &amp; Feathers. All rights reserved.</span>
        <div className="site-footer__bottom-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
