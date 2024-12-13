import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormInput } from '../forms/FormInput';
import { FormTextArea } from '../forms/FormTextArea';
import { FormSelect } from '../forms/FormSelect';

const careRecipientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  relationship: z.string().min(1, 'Relationship is required'),
  age: z.string().min(1, 'Age is required'),
  primaryConditions: z.string().min(1, 'Primary conditions are required'),
  careNeeds: z.string().min(1, 'Care needs are required'),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional()
});

type CareRecipientFormData = z.infer<typeof careRecipientSchema>;

interface CareRecipientFormProps {
  defaultValues?: Partial<CareRecipientFormData>;
  onSubmit: (data: CareRecipientFormData) => void;
  onCancel: () => void;
}

const CareRecipientForm: FC<CareRecipientFormProps> = ({ defaultValues, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CareRecipientFormData>({
    resolver: zodResolver(careRecipientSchema),
    defaultValues
  });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Care Recipient's Name"
          name="name"
          register={register}
          error={errors.name?.message}
          required
        />

        <FormSelect
          label="Relationship"
          name="relationship"
          register={register}
          options={[
            { value: 'parent', label: 'Parent' },
            { value: 'spouse', label: 'Spouse' },
            { value: 'sibling', label: 'Sibling' },
            { value: 'friend', label: 'Friend' },
            { value: 'other', label: 'Other' }
          ]}
          error={errors.relationship?.message}
          required
        />

        <FormInput
          label="Age"
          name="age"
          type="number"
          register={register}
          error={errors.age?.message}
          required
        />

        <FormTextArea
          label="Primary Conditions"
          name="primaryConditions"
          register={register}
          error={errors.primaryConditions?.message}
          placeholder="List primary medical conditions..."
          required
        />

        <FormTextArea
          label="Care Needs"
          name="careNeeds"
          register={register}
          error={errors.careNeeds?.message}
          placeholder="Describe daily care needs..."
          required
        />

        <FormTextArea
          label="Medications"
          name="medications"
          register={register}
          error={errors.medications?.message}
          placeholder="List current medications..."
        />

        <FormTextArea
          label="Allergies"
          name="allergies"
          register={register}
          error={errors.allergies?.message}
          placeholder="List any allergies..."
        />

        <FormInput
          label="Emergency Contact"
          name="emergencyContact"
          register={register}
          error={errors.emergencyContact?.message}
          placeholder="Name and phone number"
        />

        <FormTextArea
          label="Additional Notes"
          name="notes"
          register={register}
          error={errors.notes?.message}
          placeholder="Any additional information..."
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CareRecipientForm;