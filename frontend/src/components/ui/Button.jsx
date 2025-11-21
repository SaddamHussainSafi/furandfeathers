import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon: Icon,
  loading,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-neon-purple focus:ring-primary-500',
    secondary: 'glass-button text-white hover:scale-105 focus:ring-white/50',
    success: 'bg-success hover:bg-success/90 text-white shadow-lg focus:ring-success',
    danger: 'bg-danger hover:bg-danger/90 text-white shadow-lg focus:ring-danger',
    ghost: 'bg-transparent hover:bg-white/10 text-white border border-white/20 focus:ring-white/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={clsx(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : Icon && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      )}
      {children}
    </motion.button>
  );
};

export default Button;