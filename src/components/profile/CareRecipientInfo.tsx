import type { FC } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export interface CareRecipientData {
  name?: string;
  relationship?: string;
  age?: string;
  primaryConditions?: string;
  careNeeds?: string;
  medications?: string;
  allergies?: string;
  emergencyContact?: string;
  notes?: string;
}

interface CareRecipientInfoProps {
  info?: CareRecipientData;
  loading?: boolean;
  onEdit: () => void;
}

const CareRecipientInfo: FC<CareRecipientInfoProps> = ({ info, loading = false, onEdit }) => {
  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (!info) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No care recipient information added yet.</p>
        <Button onClick={onEdit}>
          Add Information
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Care Recipient Information</h2>
          <p className="text-gray-500">Details about the person you're caring for</p>
        </div>
        <Button variant="outline" onClick={onEdit}>
          Edit Information
        </Button>
      </div>

      <div className="space-y-6">
        {info.name && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-gray-900">{info.name}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {info.relationship && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Relationship</h3>
              <p className="mt-1 text-gray-900">{info.relationship}</p>
            </div>
          )}
          {info.age && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Age</h3>
              <p className="mt-1 text-gray-900">{info.age}</p>
            </div>
          )}
        </div>

        {info.primaryConditions && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Primary Conditions</h3>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{info.primaryConditions}</p>
          </div>
        )}

        {info.careNeeds && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Care Needs</h3>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{info.careNeeds}</p>
          </div>
        )}

        {info.medications && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Medications</h3>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{info.medications}</p>
          </div>
        )}

        {info.allergies && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
            <p className="mt-1 text-gray-900">{info.allergies}</p>
          </div>
        )}

        {info.emergencyContact && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Emergency Contact</h3>
            <p className="mt-1 text-gray-900">{info.emergencyContact}</p>
          </div>
        )}

        {info.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{info.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CareRecipientInfo;