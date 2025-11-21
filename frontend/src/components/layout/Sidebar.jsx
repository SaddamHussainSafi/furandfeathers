import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Shield,
  Package,
  BarChart3,
  FileText,
  Settings,
  Heart,
  MessageSquare,
  Calendar,
  TrendingUp,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ userRole, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = {
    SUPERADMIN: [
      { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/superadmin-dashboard' },
      { id: 'users', icon: Users, label: 'Users', path: '/users' },
      { id: 'shelters', icon: Shield, label: 'Shelters', path: '/shelters' },
      { id: 'pets', icon: Package, label: 'Pets', path: '/pets' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
      { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' },
      { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    ],
    ADMIN: [
      { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin-dashboard' },
      { id: 'approvals', icon: Shield, label: 'Approvals', path: '/approvals' },
      { id: 'pets', icon: Package, label: 'Pet Listings', path: '/pets' },
      { id: 'users', icon: Users, label: 'Users', path: '/users' },
      { id: 'reports', icon: BarChart3, label: 'Reports', path: '/reports' },
    ],
    SHELTER: [
      { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/shelter-dashboard' },
      { id: 'my-pets', icon: Package, label: 'My Pets', path: '/my-pets' },
      { id: 'applications', icon: FileText, label: 'Applications', path: '/applications' },
      { id: 'calendar', icon: Calendar, label: 'Calendar', path: '/calendar' },
      { id: 'analytics', icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    ],
    ADOPTER: [
      { id: 'home', icon: Home, label: 'Home', path: '/dashboard' },
      { id: 'browse', icon: Package, label: 'Browse Pets', path: '/pets' },
      { id: 'favorites', icon: Heart, label: 'Favorites', path: '/favorites' },
      { id: 'applications', icon: FileText, label: 'My Applications', path: '/applications' },
      { id: 'messages', icon: MessageSquare, label: 'Messages', path: '/messages' },
    ]
  };

  const items = menuItems[userRole] || menuItems.ADOPTER;

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '80px' }
  };

  const mobileVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
            <Package size={20} className="text-white" />
          </div>
          {!isCollapsed && !mobile && (
            <span className="text-xl font-bold text-white">Fur & Feathers</span>
          )}
        </div>
        {!mobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
        {mobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => mobile && setIsMobileOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white/15 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-white/60 group-hover:text-white'} />
                  {(!isCollapsed || mobile) && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {isCollapsed && !mobile && (
                    <div className="absolute left-20 bg-black/90 text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-red-500/20 transition-all duration-200"
        >
          <X size={20} />
          {(!isCollapsed || mobile) && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-3 glass-card rounded-xl text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <motion.div
        className="hidden lg:flex glass-sidebar flex-col fixed left-0 top-0 h-full z-40"
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              className="lg:hidden fixed left-0 top-0 h-full w-80 glass-sidebar z-50"
              variants={mobileVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <SidebarContent mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;