import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { initializeUserAsAdmin } from '../services/userService';
import { Button } from './ui/Button';
import toast from 'react-hot-toast';

export default function AdminStatus() {
  const { user, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const makeAdmin = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await initializeUserAsAdmin(user.uid);
      // Force reload to update context
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error(error.message || 'Failed to update role');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show the button if user is already admin
  if (!user || userProfile?.role === 'admin') return null;

  return (
    <div className="fixed bottom-4 right-4">
      <Button
        onClick={makeAdmin}
        isLoading={isLoading}
      >
        Make Admin
      </Button>
    </div>
  );
}