import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SuperAdminDashboard from './SuperAdminDashboard';
import authService from '../services/auth';

function AdminApp() {
  const [userRole, setUserRole] = useState('SUPERADMIN');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.data);
        setUserRole(response.data.role);
      } catch (error) {
        console.log('User not authenticated');
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={userRole} onLogout={handleLogout} />
      <div className="flex-1">
        <SuperAdminDashboard />
      </div>
    </div>
  );
}

export default AdminApp;