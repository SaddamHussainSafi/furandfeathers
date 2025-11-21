import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

const TopBar = ({ user }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-topbar px-6 py-4 flex items-center justify-between"
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 glass-button rounded-xl text-white hover:bg-white/20 transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white font-medium text-sm">
              {user?.name || 'User'}
            </p>
            <p className="text-white/60 text-xs capitalize">
              {user?.role?.toLowerCase() || 'user'}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopBar;