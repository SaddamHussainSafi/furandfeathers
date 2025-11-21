import React from 'react';
import clsx from 'clsx';

const Badge = ({ children, variant = 'primary', className }) => {
  const variants = {
    primary: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    danger: 'bg-danger/20 text-danger border-danger/30',
    info: 'bg-info/20 text-info border-info/30',
  };

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;