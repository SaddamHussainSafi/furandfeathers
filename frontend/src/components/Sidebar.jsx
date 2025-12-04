import React from "react";
import { Link, NavLink } from "react-router-dom";
import { getUserInitials } from "../utils/userDisplay";

const DEFAULT_LINKS = [
  { label: "Home", to: "/" },
  { label: "Explore pets", to: "/pets" },
];

export default function Sidebar({
  mobileOpen,
  onClose,
  sections,
  user,
  accountMenuRef,
  accountMenuOpen,
  onToggleAccountMenu,
  activeDropdown,
  toggleDropdown,
  renderChevron,
  handleLogout,
}) {
  return (
    <>
      <aside className={`site-nav ${mobileOpen ? "is-open" : ""}`}>
        <div className="sidebar-shell">
          <div className="sidebar-panel">
            <header className="sidebar-panel__header">
              <div>
                <p className="sidebar-panel__eyebrow">Navigation</p>
                <h3>Fur &amp; Feathers</h3>
              </div>
            <button type="button" className="sidebar-panel__close" onClick={onClose} aria-label="Close menu">
              ✕
            </button>
          </header>

          <nav className="sidebar-panel__nav">
            <div className="sidebar-group">
              <p className="sidebar-group__label">Quick links</p>
              <ul className="sidebar-group__list">
                {DEFAULT_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={onClose}
                      className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-group">
              <p className="sidebar-group__label">Pages</p>
              <ul className="sidebar-group__list">
                {sections.map((section, index) => (
                  <li key={section.label} className={`sidebar-section ${activeDropdown === index ? "is-open" : ""}`}>
                    <button
                      type="button"
                      className="sidebar-section__trigger"
                      onClick={() => toggleDropdown(index)}
                      aria-expanded={activeDropdown === index}
                    >
                      <span>{section.label}</span>
                      {renderChevron()}
                    </button>
                    <div className="sidebar-section__items">
                      {section.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="sidebar-section__link"
                          onClick={onClose}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <footer className="sidebar-panel__footer">
            {user ? (
              <div className="sidebar-account" ref={accountMenuRef}>
                <button
                  type="button"
                  className="sidebar-account__trigger"
                  onClick={onToggleAccountMenu}
                  aria-expanded={accountMenuOpen}
                >
                  <div className="sidebar-account__avatar">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name || "User avatar"} referrerPolicy="no-referrer" />
                    ) : (
                      <span>{getUserInitials(user?.name) || (user?.email?.[0] || "F").toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <strong>{user.name || "Community member"}</strong>
                    {user.email && <span>{user.email}</span>}
                  </div>
                  {renderChevron()}
                </button>

                <div className={`sidebar-account__menu ${accountMenuOpen ? "is-open" : ""}`}>
                  <Link to="/profile" onClick={onClose}>
                    Profile
                  </Link>
                  <Link to="/dashboard" onClick={onClose}>
                    Dashboard
                  </Link>
                  <Link to="/applications" onClick={onClose}>
                    Applications
                  </Link>
                  <Link to="/pet-detection-history" onClick={onClose}>
                    Detection history
                  </Link>
                  {(user.role === "admin" || user.role === "superadmin" || user.role === "shelter") && (
                    <Link to="/manage-pets" onClick={onClose}>
                      Manage Pets
                    </Link>
                  )}
                  {(user.role === "admin" || user.role === "superadmin") && (
                    <Link to="/manage-adoptions" onClick={onClose}>
                      Manage adoptions
                    </Link>
                  )}
                  {(user.role === "admin" || user.role === "superadmin") && (
                    <Link to="/pet-approvals" onClick={onClose}>
                      Pet approvals
                    </Link>
                  )}
                  <button type="button" onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="sidebar-auth">
                <Link to="/login" className="site-button site-button--secondary" onClick={onClose}>
                  Sign in
                </Link>
                <Link to="/register" className="site-button site-button--primary" onClick={onClose}>
                  Join the community
                </Link>
              </div>
            )}
          </footer>
          </div>
        </div>
      </aside>

      <div className={`site-nav__backdrop ${mobileOpen ? "is-open" : ""}`} onClick={onClose} aria-hidden="true" />
    </>
  );
}
