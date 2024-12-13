import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CareRecipientData } from '../components/profile/CareRecipientInfo';
import toast from 'react-hot-toast';

export async function getCareRecipient(userId: string): Promise<CareRecipientData | null> {
  try {
    const docRef = doc(db, 'users', userId, 'careRecipients', 'primary');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as CareRecipientData;
    }
    return null;
  } catch (error) {
    console.error('Error loading care recipient:', error);
    toast.error('Failed to load care recipient information');
    return null;
  }
}

export async function updateCareRecipient(userId: string, data: CareRecipientData): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'careRecipients', 'primary');
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    toast.success('Care recipient information saved');
  } catch (error) {
    console.error('Error saving care recipient:', error);
    toast.error('Failed to save care recipient information');
    throw error;
  }
}