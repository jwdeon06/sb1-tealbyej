import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostEditor from '../components/PostEditor';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function CreatePost() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  if (userProfile?.role !== 'admin') {
    return (
      <Card className="text-center p-8">
        <p className="text-red-600 text-lg mb-4">
          You don't have permission to create posts.
        </p>
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PostEditor
        post={null}
        onSave={() => navigate('/library')}
        onCancel={() => navigate('/library')}
        categories={[]}
      />
    </div>
  );
}