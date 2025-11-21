import React from 'react';
import clsx from 'clsx';

const ChartCard = ({ title, subtitle, children, actions, className }) => {
  return (
    <section className={clsx('dashboard-chart-card', className)}>
      <div className="dashboard-chart-card__header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="dashboard-chart-card__actions">{actions}</div>}
      </div>
      <div className="dashboard-chart-card__body">{children}</div>
    </section>
  );
};

export default ChartCard;
