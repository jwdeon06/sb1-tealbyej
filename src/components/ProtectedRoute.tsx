import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'member';
}

export default function ProtectedRoute({ children, requireRole = 'member' }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireRole === 'admin' && userProfile?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}