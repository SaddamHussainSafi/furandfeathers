import React from 'react';
import { User, Shield, Package, Heart, AlertCircle } from 'lucide-react';

const ActivityCard = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'user':
        return User;
      case 'shelter':
        return Shield;
      case 'pet':
        return Package;
      case 'approval':
        return Heart;
      case 'rejection':
        return AlertCircle;
      default:
        return User;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'user':
        return 'text-blue-400';
      case 'shelter':
        return 'text-green-400';
      case 'pet':
        return 'text-purple-400';
      case 'approval':
        return 'text-success';
      case 'rejection':
        return 'text-danger';
      default:
        return 'text-white/60';
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-white/60 text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity, idx) => {
            const Icon = getIcon(activity.type);
            const iconColor = getColor(activity.type);

            return (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition">
                <div className={`p-2 rounded-lg bg-white/10 ${iconColor}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-white/40 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityCard;