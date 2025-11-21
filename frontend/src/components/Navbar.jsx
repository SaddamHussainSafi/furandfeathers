import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DesktopNavbar from './DesktopNavbar';
import Sidebar from './Sidebar';
import '../styles/layout.css';

const HEADER_LOGO = 'http://localhost:8080/uploads/logo/Logo.svg';

const NAV_SECTIONS = [
  {
    label: 'Adopt',
    items: [
      { label: 'Browse', to: '/pets' },
      { label: 'Saved', to: '/favorites' }
    ]
  },
  {
    label: 'Tools',
    items: [
      { label: 'Detect', to: '/pet-detection' },
      { label: 'History', to: '/pet-detection-history' },
      { label: 'Chat', to: '/furly-chat' },
      { label: 'Msgs', to: '/messages' }
    ]
  },
  {
    label: 'About',
    items: [
      { label: 'Story', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Policy', to: '/privacy' },
      { label: 'Terms', to: '/terms' }
    ]
  }
];

const useMediaQuery = (query) => {
  const getMatch = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener ? media.addEventListener('change', listener) : media.addListener(listener);
    return () => {
      media.removeEventListener ? media.removeEventListener('change', listener) : media.removeListener(listener);
    };
  }, [query]);

  return matches;
};

export default function Navbar() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return isDesktop ? <DesktopNavbar /> : <MobileNavbar />;
}

function MobileNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderChevron = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <Link className="site-header__brand" to="/">
          <img
            src={HEADER_LOGO}
            alt="Fur & Feathers"
            className="site-header__logo"
            loading="lazy"
          />
        </Link>

        <button
          type="button"
          className="site-nav__toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sections={NAV_SECTIONS}
          user={user}
          accountMenuRef={accountMenuRef}
          accountMenuOpen={accountMenuOpen}
          onToggleAccountMenu={() => setAccountMenuOpen((prev) => !prev)}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          renderChevron={renderChevron}
          handleLogout={handleLogout}
        />
      </div>
    </header>
  );
}

