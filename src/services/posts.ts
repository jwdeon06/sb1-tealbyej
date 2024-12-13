import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Post } from '../types/index';
import toast from 'react-hot-toast';

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    console.log('Fetching published posts...');
    const q = query(
      collection(db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    
    console.log(`Found ${posts.length} published posts`);
    return posts;
  } catch (error) {
    console.error('Error getting published posts:', error);
    toast.error('Failed to load posts');
    return [];
  }
}

export async function createPost(postData: Omit<Post, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updatePost(id: string, updates: Partial<Post>): Promise<void> {
  try {
    const docRef = doc(db, 'posts', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'posts', id));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

export async function getPost(id: string): Promise<Post | null> {
  try {
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Post;
  } catch (error) {
    console.error('Error getting post:', error);
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    console.log('Fetching all posts...');
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    
    console.log(`Found ${posts.length} posts`);
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    toast.error('Failed to load posts');
    return [];
  }
}