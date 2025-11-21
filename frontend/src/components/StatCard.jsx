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
    blue: 'stat-card-blue',
    green: 'stat-card-green',
    purple: 'stat-card-purple',
    pink: 'stat-card-pink',
    orange: 'stat-card-orange',
  };

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    orange: 'text-orange-400',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={clsx('glass-card p-6', colorClasses[color], className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-white/60 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-4xl font-bold text-white">{value}</h3>
        </div>
        {Icon && (
          <div className={clsx('p-3 rounded-xl bg-white/10', iconColors[color])}>
            <Icon size={28} />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 mt-4">
          {changeType === 'up' ? (
            <ArrowUp size={16} className="text-success" />
          ) : (
            <ArrowDown size={16} className="text-danger" />
          )}
          <span className={changeType === 'up' ? 'text-success' : 'text-danger'}>
            {Math.abs(change)}%
          </span>
          <span className="text-white/40 text-sm">vs last month</span>
        </div>
      )}

      {trend && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <TrendingUp size={14} />
            <span>{trend}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;