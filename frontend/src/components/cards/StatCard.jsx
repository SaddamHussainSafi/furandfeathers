import React from 'react';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  changeType = 'up',
  trend,
  color = 'blue',
  className
}) => {
  const colorClasses = {
    blue: 'dashboard-stat-card--blue',
    green: 'dashboard-stat-card--green',
    purple: 'dashboard-stat-card--purple',
    pink: 'dashboard-stat-card--pink',
    orange: 'dashboard-stat-card--orange',
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={clsx('dashboard-stat-card', colorClasses[color], className)}
    >
      <div className="dashboard-stat-card__header">
        <div>
          <p className="dashboard-stat-card__label">{title}</p>
          <h3 className="dashboard-stat-card__value">{value}</h3>
        </div>
        {Icon && (
          <div className={clsx('dashboard-stat-card__icon', `dashboard-stat-card__icon--${color}`)}>
            <Icon size={24} />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="dashboard-stat-card__change">
          {changeType === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span className="dashboard-stat-card__change-value">{Math.abs(change)}%</span>
          <span className="dashboard-stat-card__change-helper">vs last month</span>
        </div>
      )}

      {trend && (
        <div className="dashboard-stat-card__trend">
          <TrendingUp size={14} />
          <span>{trend}</span>
        </div>
      )}
    </motion.article>
  );
};

export default StatCard;
