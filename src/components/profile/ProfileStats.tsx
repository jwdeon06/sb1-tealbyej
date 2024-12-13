import type { FC } from 'react';
import { Card } from '../ui/Card';

interface ProfileStat {
  label: string;
  value: string | number;
  description?: string;
}

interface ProfileStatsProps {
  stats: ProfileStat[];
}

const ProfileStats: FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`
              p-4 text-center
              ${index !== stats.length - 1 ? 'md:border-r border-gray-200' : ''}
            `}
          >
            <dt className="text-sm font-medium text-gray-500">
              {stat.label}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stat.value}
            </dd>
            {stat.description && (
              <p className="mt-1 text-sm text-gray-500">
                {stat.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileStats;