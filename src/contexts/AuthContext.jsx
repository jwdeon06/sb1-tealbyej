import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser?.email);
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userDoc);
          
          if (userSnap.exists()) {
            const profileData = userSnap.data();
            console.log('User profile loaded:', profileData);
            setUserProfile(profileData);
          } else {
            console.log('Creating new user profile');
            const defaultProfile = {
              email: currentUser.email,
              role: 'admin', // Set as admin for testing
              createdAt: new Date().toISOString()
            };
            await setDoc(userDoc, defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUserProfile(null);
        }
      } else {
        console.log('No user, clearing profile');
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const signUp = async (email, password, displayName) => {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', newUser.uid), {
        email,
        displayName,
        role: 'admin', // Set as admin for testing
        createdAt: new Date().toISOString()
      });
      
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