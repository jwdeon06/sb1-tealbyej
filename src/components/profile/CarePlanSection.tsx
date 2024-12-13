import { useState, useEffect, type FC } from 'react';
import type { CarePlan } from '../../types/index';
import { useAuth } from '../../contexts/AuthContext';
import { getPublishedCarePlans, getUserCarePlans } from '../../services/carePlans';
import toast from 'react-hot-toast';

const CarePlanSection: FC = () => {
  const [userPlans, setUserPlans] = useState<CarePlan[]>([]);
  const [availablePlans, setAvailablePlans] = useState<CarePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBrowser, setShowBrowser] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [userPlanData, availablePlanData] = await Promise.all([
        getUserCarePlans(user.uid),
        getPublishedCarePlans()
      ]);
      setUserPlans(userPlanData);
      setAvailablePlans(availablePlanData);
    } catch (error) {
      console.error('Error loading care plans:', error);
      toast.error('Failed to load care plans');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Care Plans</h2>
        <button
          onClick={() => setShowBrowser(!showBrowser)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          {showBrowser ? 'View My Plans' : 'Browse Plans'}
        </button>
      </div>

      {showBrowser ? (
        <div className="space-y-6">
          {availablePlans.map((plan) => (
            <div key={plan.id} className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
              <p className="text-gray-600">{plan.description}</p>
              <div className="mt-4">
                <span className="text-sm text-gray-500">Duration: {plan.duration}</span>
              </div>
            </div>
          ))}

          {availablePlans.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No care plans available at the moment.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {userPlans.map((plan) => (
            <div key={plan.id} className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
              <p className="text-gray-600">{plan.description}</p>
              <div className="mt-4">
                <span className="text-sm text-gray-500">Started: {new Date(plan.startDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}

          {userPlans.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't selected any care plans yet.</p>
              <button
                onClick={() => setShowBrowser(true)}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Browse Available Plans
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarePlanSection;