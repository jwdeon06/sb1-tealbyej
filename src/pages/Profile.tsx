import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CareRecipientInfo, { CareRecipientData } from '../components/profile/CareRecipientInfo';
import { getCareRecipient, updateCareRecipient } from '../services/careRecipient';
import ProfileLayout from '../components/profile/ProfileLayout';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import CarePlanList from '../components/profile/CarePlanList';
import CareRecipientForm from '../components/profile/CareRecipientForm';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Profile() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [careRecipientInfo, setCareRecipientInfo] = useState<CareRecipientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCareRecipient();
    }
  }, [user]);

  const loadCareRecipient = async () => {
    if (!user) return;
    try {
      const data = await getCareRecipient(user.uid);
      setCareRecipientInfo(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInfo = (data: CareRecipientData) => {
    if (!user) return;
    
    updateCareRecipient(user.uid, data)
      .then(() => {
        setCareRecipientInfo(data);
        setIsEditing(false);
      })
      .catch(error => {
        // Error is handled by the service
        console.error('Error saving care recipient:', error);
      });
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Care Plan</h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
              Create Your Account
            </h2>
            <p className="text-blue-800 mb-6">
              Join us to access exclusive features:
            </p>
            <ul className="list-disc list-inside text-blue-800 mb-6 space-y-2">
              <li>Save your AI Guide conversations</li>
              <li>Get personalized caregiving assistance</li>
              <li>Track your interactions</li>
              <li>Access premium content</li>
            </ul>
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 inline-block"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="bg-white text-primary-500 border border-primary-500 px-6 py-3 rounded-lg hover:bg-primary-50 inline-block"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Preview Features
            </h2>
            <p className="text-gray-600 mb-4">
              You can try our AI Guide without an account, but your conversations won't be saved.
            </p>
            <Link
              to="/guide"
              className="text-primary-500 hover:text-primary-600 underline"
            >
              Try the AI Guide →
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ProfileLayout>
      <div className="space-y-8">
        <ProfileHeader
          profile={userProfile}
          onEditClick={() => navigate('/profile/personal')}
        />

        <ProfileStats
          stats={[
            { label: 'Care Plans', value: 2 },
            { label: 'Tasks Completed', value: 24 },
            { label: 'Days Active', value: 45 }
          ]}
        />

        <Card>
          {isEditing ? (
            <CareRecipientForm
              defaultValues={careRecipientInfo || undefined}
              onSubmit={handleSaveInfo}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <CareRecipientInfo
              info={careRecipientInfo}
              loading={loading}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Care Plans</h2>
            <Button onClick={() => navigate('/care-plans')}>
              Browse Plans
            </Button>
          </div>
          <CarePlanList
            plans={[
              {
                id: '1',
                title: 'Basic Care Plan',
                description: 'Essential caregiving tasks and routines',
                difficulty: 'beginner',
                progress: 65,
                startDate: new Date().toISOString()
              }
            ]}
            onViewPlan={(planId) => navigate(`/care-plans/${planId}`)}
          />
        </Card>
      </div>
    </ProfileLayout>
  );
}