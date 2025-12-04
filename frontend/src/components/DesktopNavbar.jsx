import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserInitials } from "../utils/userDisplay";
import "../styles/layout.css";

const HEADER_LOGO = '/uploads/logo/Logo.svg';

const DESKTOP_SECTIONS = [
  {
    label: "Adopt",
    items: [
      { label: "Browse Pets", to: "/pets" },
      { label: "Favorites", to: "/favorites" },
      { label: "Applications", to: "/applications" },
      { label: "My Pets", to: "/my-pets" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "AI Detect", to: "/pet-detection" },
      { label: "Detections", to: "/pet-detection-history" },
      { label: "Furly Chat", to: "/furly-chat" },
      { label: "Messages", to: "/messages" },
    ],
  },
  {
    label: "About",
    items: [
      { label: "Story", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "FAQ", to: "/faq" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

const DesktopNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [ctaActive, setCtaActive] = useState("join");
  const [navHighlight, setNavHighlight] = useState({ left: 0, width: 0, visible: false });
  const navListRef = useRef(null);
  const closeDropdownTimer = useRef(null);

  const isSectionActive = (section) =>
    section.items?.some((item) => location.pathname.startsWith(item.to));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const setHighlightForTarget = (target) => {
    if (!target || !navListRef.current) return;
    const listRect = navListRef.current.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    setNavHighlight({
      left: rect.left - listRect.left,
      width: rect.width,
      visible: true,
    });
  };

  const setHighlightToActive = () => {
    if (!navListRef.current) return;
    const activeEl =
      navListRef.current.querySelector(".site-nav__link.active, .site-nav__dropdown-toggle.active") ||
      navListRef.current.querySelector(".site-nav__link, .site-nav__dropdown-toggle");
    if (!activeEl) return;
    setHighlightForTarget(activeEl);
  };

  const handleNavEnter = (event) => {
    setHighlightForTarget(event.currentTarget);
  };

  const handleNavFocus = (event) => {
    setHighlightForTarget(event.currentTarget);
  };

  const handleNavLeave = () => {
    setHighlightToActive();
  };

  const openDropdown = (index) => {
    if (closeDropdownTimer.current) clearTimeout(closeDropdownTimer.current);
    setActiveDropdown(index);
  };

  const scheduleCloseDropdown = () => {
    if (closeDropdownTimer.current) clearTimeout(closeDropdownTimer.current);
    closeDropdownTimer.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setActiveDropdown(null);
    setAccountMenuOpen(false);
    setHighlightToActive();
    return () => {
      if (closeDropdownTimer.current) clearTimeout(closeDropdownTimer.current);
    };
  }, [location.pathname]);

  useEffect(() => {
    setHighlightToActive();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderChevron = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-header__brand" to="/">
          <img src={HEADER_LOGO} alt="Fur & Feathers" className="site-header__logo" loading="lazy" />
        </Link>

        <nav className="site-nav site-nav--desktop">
          <ul className="site-nav__list" ref={navListRef} onMouseLeave={handleNavLeave}>
            <span
              className={`site-nav__highlight ${navHighlight.visible ? "is-visible" : ""}`}
              style={{
                width: navHighlight.width || 0,
                transform: `translateX(${navHighlight.left}px) translateY(-50%)`,
              }}
              aria-hidden="true"
            />
            <li className="site-nav__item">
              <NavLink
                to="/"
                className={({ isActive }) => `site-nav__link${isActive ? " active" : ""}`}
                onMouseEnter={handleNavEnter}
                onFocus={handleNavFocus}
              >
                Home
              </NavLink>
            </li>

            {DESKTOP_SECTIONS.map((section, index) => (
              <li
                key={section.label}
                className={`site-nav__item${activeDropdown === index ? " is-open" : ""}`}
                onMouseEnter={() => openDropdown(index)}
                onMouseLeave={scheduleCloseDropdown}
              >
                <button
                  type="button"
                  className={`site-nav__dropdown-toggle${isSectionActive(section) ? " active" : ""}`}
                  onClick={() => openDropdown(index)}
                  aria-expanded={activeDropdown === index}
                  onMouseEnter={handleNavEnter}
                  onFocus={handleNavFocus}
                  onBlur={scheduleCloseDropdown}
                >
                  {section.label}
                  {renderChevron()}
                </button>
                <div
                  className="site-nav__dropdown"
                  onMouseEnter={() => openDropdown(index)}
                  onMouseLeave={scheduleCloseDropdown}
                >
                  <div className="site-nav__dropdown-list">
                    {section.items.map((item) => (
                      <Link key={item.to} to={item.to} className="site-nav__dropdown-link">
                        <span>{item.label}</span>
                        {item.description && <small>{item.description}</small>}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {user ? (
            <div className="site-nav__account">
              <button
                type="button"
                className="site-nav__avatar-button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                aria-expanded={accountMenuOpen}
              >
                <div className="site-nav__avatar site-nav__avatar--frame">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name || "User avatar"} referrerPolicy="no-referrer" />
                  ) : (
                    <span>{getUserInitials(user?.name) || (user?.email?.[0] || "F").toUpperCase()}</span>
                  )}
                </div>
                <span>{user.name || "Community member"}</span>
                {renderChevron()}
              </button>
              <div className={`site-nav__account-menu ${accountMenuOpen ? "is-open" : ""}`}>
                <div className="site-nav__account-summary">
                  <strong>{user.name || "Fur & Feathers member"}</strong>
                  {user.email && <small>{user.email}</small>}
                </div>
                <Link to="/profile">Profile</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/applications">Applications</Link>
                <Link to="/pet-detection-history">Detection history</Link>
                {(user.role === "admin" || user.role === "superadmin" || user.role === "shelter") && <Link to="/manage-pets">Manage Pets</Link>}
                {(user.role === "admin" || user.role === "superadmin") && <Link to="/manage-adoptions">Manage adoptions</Link>}
                {(user.role === "admin" || user.role === "superadmin") && <Link to="/pet-approvals">Pet approvals</Link>}
                <button type="button" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`site-nav__cta ${ctaActive === "signin" ? "is-signin" : "is-join"}`}
              onMouseLeave={() => setCtaActive("join")}
            >
              <Link
                to="/login"
                className="site-button site-button--ghost"
                onMouseEnter={() => setCtaActive("signin")}
                onFocus={() => setCtaActive("signin")}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="site-button site-button--primary"
                onMouseEnter={() => setCtaActive("join")}
                onFocus={() => setCtaActive("join")}
              >
                Join the community
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default DesktopNavbar;
