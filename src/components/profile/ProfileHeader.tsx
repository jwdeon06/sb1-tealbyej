import type { FC } from 'react';
import type { UserProfile } from '../../types/index';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/date';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditClick?: () => void;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ profile, onEditClick }) => {
  return (
    <Card className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {profile.displayName || profile.email}
          </h2>
          <p className="text-gray-500">
            Member since {formatDate(profile.createdAt)}
          </p>
          {profile.role === 'admin' && (
            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full">
              Admin
            </span>
          )}
        </div>
        {onEditClick && (
          <Button variant="outline" onClick={onEditClick}>
            Edit Profile
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProfileHeader;