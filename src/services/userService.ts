import { doc, updateDoc, getDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types/index';
import toast from 'react-hot-toast';

export async function updateUserRole(userId: string, newRole: 'admin' | 'member'): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Check if there are any existing admin users
      const adminsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'admin')
      );
      const adminsSnapshot = await getDocs(adminsQuery);

      // If no admins exist, allow creation of first admin
      const isFirstAdmin = adminsSnapshot.empty;

      // Create new user profile with appropriate role
      const newUserProfile: UserProfile = {
        uid: userId,
        email: '', // Will be updated after creation
        role: isFirstAdmin ? 'admin' : newRole,
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, newUserProfile);
    } else {
      // Update existing user's role
      await updateDoc(userRef, {
        role: newRole
      });
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    toast.error('Failed to update user role');
    throw error;
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id
    })) as UserProfile[];
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error('Failed to load users');
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    toast.error('Failed to load user profile');
    throw error;
  }
}

export async function initializeUserAsAdmin(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new admin user
      await setDoc(userRef, {
        uid: userId,
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      toast.success('Admin account created');
    } else {
      // Update existing user to admin
      await updateDoc(userRef, { role: 'admin' });
      toast.success('Account updated to admin');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
    toast.error('Failed to initialize admin account');
    throw error;
  }
}