import type { FC } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../utils/date';

interface CarePlan {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  startDate: string;
}

interface CarePlanListProps {
  plans: CarePlan[];
  onViewPlan: (planId: string) => void;
}

const CarePlanList: FC<CarePlanListProps> = ({ plans, onViewPlan }) => {
  const getDifficultyColor = (difficulty: CarePlan['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-4">
      {plans.map(plan => (
        <Card key={plan.id}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">{plan.title}</h3>
                <Badge variant={getDifficultyColor(plan.difficulty)}>
                  {plan.difficulty}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <p className="text-sm text-gray-500">
                Started {formatDate(plan.startDate)}
              </p>
            </div>
            <Button onClick={() => onViewPlan(plan.id)}>
              View Plan
            </Button>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{plan.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${plan.progress}%` }}
              />
            </div>
          </div>
        </Card>
      ))}

      {plans.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              You haven't started any care plans yet.
            </p>
            <Button onClick={() => onViewPlan('browse')}>
              Browse Care Plans
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CarePlanList;