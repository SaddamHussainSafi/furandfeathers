import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleRedirect, { DashboardRedirect } from './pages/RoleRedirect';
import DashboardAdopter from './pages/adopter/DashboardAdopter';
import DashboardShelter from './pages/shelter/DashboardShelter';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import { AuthContext } from './context/AuthContext';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function DashboardLayout({ children }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}

import Pets from './pages/Pets';
import PetDetails from './pages/PetDetails';
import Applications from './pages/Applications';
import Messages from './pages/Messages';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AddPet from './pages/AddPet';
import ManagePets from './pages/ManagePets';
import MyPets from './pages/MyPets';
import EditPet from './pages/EditPet';
import PetDetection from './pages/PetDetection';
import PetDetectionHistory from './pages/PetDetectionHistory';
import FurlyChat from './pages/FurlyChat';
import AdoptionForm from './pages/AdoptionForm';
import ManageAdoptions from './pages/ManageAdoptions';

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app-container">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/redirect" element={<PublicLayout><RoleRedirect /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
        <Route path="/pets" element={<PublicLayout><Pets /></PublicLayout>} />
        <Route path="/pet/:name" element={<PublicLayout><PetDetails /></PublicLayout>} />
        <Route path="/pet-detection" element={<PublicLayout><PetDetection /></PublicLayout>} />
        <Route path="/pet-detection-history" element={<PublicLayout><PetDetectionHistory /></PublicLayout>} />
        <Route path="/furly-chat" element={<PublicLayout><FurlyChat /></PublicLayout>} />
        <Route
          path="/adopt/:petSlug"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <AdoptionForm />
              </PublicLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
        <Route path="/adopter-dashboard" element={<ProtectedRoute><MainLayout><DashboardAdopter /></MainLayout></ProtectedRoute>} />
        <Route path="/shelter-dashboard" element={<ProtectedRoute><MainLayout><DashboardShelter /></MainLayout></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><MainLayout><DashboardAdmin /></MainLayout></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><MainLayout><Applications /></MainLayout></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MainLayout fullWidth><Messages /></MainLayout></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><MainLayout><Favorites /></MainLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
        <Route path="/add-pet" element={<ProtectedRoute><MainLayout><AddPet /></MainLayout></ProtectedRoute>} />
        <Route path="/manage-pets" element={<ProtectedRoute><MainLayout><ManagePets /></MainLayout></ProtectedRoute>} />
        <Route path="/manage-adoptions" element={<ProtectedRoute><MainLayout><ManageAdoptions /></MainLayout></ProtectedRoute>} />
        <Route path="/my-pets" element={<ProtectedRoute><MainLayout><MyPets /></MainLayout></ProtectedRoute>} />
        <Route path="/edit-pet/:id" element={<ProtectedRoute><MainLayout><EditPet /></MainLayout></ProtectedRoute>} />
      </Routes>
    </div>
  );
}
