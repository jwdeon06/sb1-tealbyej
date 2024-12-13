import { 
  collection, 
  addDoc,
  updateDoc,
  doc,
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';
import type { CarePlan } from '../types/index';

export async function createCarePlan(plan: Omit<CarePlan, 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'carePlans'), {
      ...plan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { id: docRef.id, ...plan };
  } catch (error) {
    console.error('Error creating care plan:', error);
    toast.error('Failed to create care plan');
    throw error;
  }
}

export async function updateCarePlan(id: string, updates: Partial<CarePlan>) {
  try {
    const docRef = doc(db, 'carePlans', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating care plan:', error);
    toast.error('Failed to update care plan');
    throw error;
  }
}

export async function getPublishedCarePlans() {
  try {
    const q = query(
      collection(db, 'carePlans'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting published care plans:', error);
    toast.error('Failed to load care plans');
    return [];
  }
}

export async function getUserCarePlans(userId: string) {
  try {
    const q = query(
      collection(db, `users/${userId}/carePlans`),
      orderBy('startDate', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user care plans:', error);
    toast.error('Failed to load care plans');
    return [];
  }
}

export async function assignCarePlan(userId: string, planId: string) {
  try {
    const docRef = doc(db, `users/${userId}/carePlans/${planId}`);
    await addDoc(collection(db, `users/${userId}/carePlans`), {
      planId,
      startDate: new Date().toISOString(),
      progress: 0
    });
    toast.success('Care plan assigned successfully');
  } catch (error) {
    console.error('Error assigning care plan:', error);
    toast.error('Failed to assign care plan');
    throw error;
  }
}