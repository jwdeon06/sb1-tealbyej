import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

interface UserProfile {
  email: string;
  role: 'admin' | 'member';
  createdAt: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 Setting up auth listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('👤 Auth state changed:', currentUser?.email);
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userDoc);
          
          if (userSnap.exists()) {
            const profileData = userSnap.data() as UserProfile;
            console.log('📋 User profile loaded:', profileData);
            setUserProfile(profileData);
          } else {
            console.log('🆕 Creating new user profile');
            const defaultProfile: UserProfile = {
              email: currentUser.email!,
              role: 'admin', // Set as admin for testing
              createdAt: new Date().toISOString()
            };
            await setDoc(userDoc, defaultProfile);
            setUserProfile(defaultProfile);
            console.log('✅ Default profile created:', defaultProfile);
          }
        } catch (error) {
          console.error('❌ Error loading user profile:', error);
          setUserProfile(null);
        }
      } else {
        console.log('🚫 No user, clearing profile');
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userProfile: UserProfile = {
        email,
        displayName,
        role: 'admin', // Set as admin for testing
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', newUser.uid), userProfile);
      toast.success('Account created successfully');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}