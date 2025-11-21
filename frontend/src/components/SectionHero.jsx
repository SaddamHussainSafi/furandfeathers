import React from 'react';

// Reusable hero/section header using the same look as AddPet form hero
export default function SectionHero({
  badge,
  title,
  subtitle,
  actions,
  className = '',
}) {
  return (
    <div className={`form-hero glass-ribbon ${className}`}>
      {badge && <div className="form-hero__badge">{badge}</div>}
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
      {actions}
    </div>
  );
}

