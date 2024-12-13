import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import toast from 'react-hot-toast';

export async function getAllProducts(): Promise<Product[]> {
  try {
    console.log('Fetching all products...');
    const q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    console.log(`Found ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Error loading products:', error);
    toast.error('Failed to load products');
    return [];
  }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error('Error creating product:', error);
    toast.error('Failed to create product');
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Failed to update product');
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Error deleting product:', error);
    toast.error('Failed to delete product');
    throw error;
  }
}