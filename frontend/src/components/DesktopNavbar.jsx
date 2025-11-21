import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserInitials } from "../utils/userDisplay";
import "../styles/layout.css";

const HEADER_LOGO = "http://localhost:8080/uploads/logo/Logo.svg";

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
          <ul className="site-nav__list">
            <li className="site-nav__item">
              <NavLink to="/" className={({ isActive }) => `site-nav__link${isActive ? " active" : ""}`}>
                Home
              </NavLink>
            </li>

            {DESKTOP_SECTIONS.map((section, index) => (
              <li
                key={section.label}
                className={`site-nav__item${activeDropdown === index ? " is-open" : ""}`}
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button type="button" className="site-nav__dropdown-toggle" onClick={() => toggleDropdown(index)} aria-expanded={activeDropdown === index}>
                  {section.label}
                  {renderChevron()}
                </button>
                <div className="site-nav__dropdown">
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

          <div className="site-nav__cta">
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
                  <button type="button" onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="site-button site-button--ghost">
                  Sign in
                </Link>
                <Link to="/register" className="site-button site-button--primary">
                  Join the community
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default DesktopNavbar;
