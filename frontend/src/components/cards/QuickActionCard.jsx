import React from 'react';
import { Plus, Users, FileText, BarChart3 } from 'lucide-react';
import Button from '../ui/Button';

const QuickActionCard = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Add New Pet',
      description: 'List a new pet for adoption',
      color: 'success',
      path: '/add-pet'
    },
    {
      icon: Users,
      label: 'Manage Users',
      description: 'View and manage user accounts',
      color: 'primary',
      path: '/users'
    },
    {
      icon: FileText,
      label: 'View Reports',
      description: 'Generate and view reports',
      color: 'info',
      path: '/reports'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      description: 'View platform analytics',
      color: 'warning',
      path: '/analytics'
    }
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => window.location.href = action.path}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-${action.color}/20 text-${action.color} group-hover:bg-${action.color}/30 transition`}>
                  <Icon size={18} />
                </div>
                <h4 className="text-white font-medium text-sm">{action.label}</h4>
              </div>
              <p className="text-white/60 text-xs">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionCard;