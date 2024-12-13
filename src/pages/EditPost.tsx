import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPost } from '../services/posts';
import PostEditor from '../components/PostEditor';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Post } from '../types';
import toast from 'react-hot-toast';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    if (!id) return;
    try {
      const fetchedPost = await getPost(id);
      if (!fetchedPost) {
        toast.error('Post not found');
        navigate('/library');
        return;
      }
      setPost(fetchedPost);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load post');
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  if (userProfile?.role !== 'admin') {
    return (
      <Card className="text-center p-8">
        <p className="text-red-600 text-lg mb-4">
          You don't have permission to edit posts.
        </p>
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PostEditor
        post={post}
        onSave={() => navigate('/library')}
        onCancel={() => navigate('/library')}
        categories={[]}
      />
    </div>
  );
}