import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleRedirect() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;

  const role = (user.role || '').toString().toLowerCase();
  switch (role) {
    case 'shelter':
      return <Navigate to="/shelter-dashboard" />;
    case 'adopter':
      return <Navigate to="/adopter-dashboard" />;
    case 'admin':
    case 'superadmin':
      return <Navigate to="/admin-dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
}

// Component to redirect from /dashboard to role-specific dashboard
export function DashboardRedirect() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;

  const role = (user.role || '').toString().toLowerCase();
  switch (role) {
    case 'shelter':
      return <Navigate to="/shelter-dashboard" />;
    case 'adopter':
      return <Navigate to="/adopter-dashboard" />;
    case 'admin':
    case 'superadmin':
      return <Navigate to="/admin-dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
}
