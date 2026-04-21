import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import Layout from './components/Layout';

// Mock/Pending components - I will create real ones in next step
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StaffAttendance from './pages/StaffAttendance';
import StudentAttendance from './pages/StudentAttendance';
import StudentData from './pages/StudentData';
import UserManagement from './pages/UserManagement';
import RecapSiswa from './pages/RecapSiswa';
import RecapKaryawan from './pages/RecapKaryawan';

function ProtectedRoute({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-brand animate-spin rounded-full" />
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/app" />;
  }

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/app" element={
          <ProtectedRoute roles={['admin', 'guru', 'tenaga_kependidikan']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/app/absensi-karyawan" element={
          <ProtectedRoute roles={['admin', 'guru', 'tenaga_kependidikan']}>
            <StaffAttendance />
          </ProtectedRoute>
        } />

        <Route path="/app/absensi-siswa" element={
          <ProtectedRoute roles={['admin', 'guru']}>
            <StudentAttendance />
          </ProtectedRoute>
        } />

        <Route path="/app/data-siswa" element={
          <ProtectedRoute roles={['admin']}>
            <StudentData />
          </ProtectedRoute>
        } />

        <Route path="/app/user-management" element={
          <ProtectedRoute roles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />

        <Route path="/app/rekap-siswa" element={
          <ProtectedRoute roles={['admin', 'guru']}>
            <RecapSiswa />
          </ProtectedRoute>
        } />

        <Route path="/app/rekap-karyawan" element={
          <ProtectedRoute roles={['admin']}>
            <RecapKaryawan />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}
