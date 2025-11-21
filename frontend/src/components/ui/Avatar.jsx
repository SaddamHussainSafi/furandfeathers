import React from 'react';
import clsx from 'clsx';
import { User } from 'lucide-react';

const Avatar = ({ src, alt, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={clsx('rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center', sizes[size], className)}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <User size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 32 : 20} className="text-white" />
      )}
    </div>
  );
};

export default Avatar;