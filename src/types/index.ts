import type { Message } from './messages';

export type { Message };

export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  date: string;
  isPublic: boolean;
}
export interface CarePlan {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  recommendedFor: string[];
  tasks: Array<{
    title: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'as-needed';
  }>;
  featuredImage?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
  createdAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'member';
  createdAt: string;
  fullName?: string;
  phoneNumber?: string;
  caregiverRole?: string;
  relationship?: string;
  yearsExperience?: string;
  preferredContact?: 'email' | 'phone' | 'both';
  timezone?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Product' | 'Service';
  subcategory: string;
  images: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
  stripeProductId?: string;
  stripePriceId?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  tags: string[];
  featuredImage?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  order: number;
}

export interface LibraryCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}