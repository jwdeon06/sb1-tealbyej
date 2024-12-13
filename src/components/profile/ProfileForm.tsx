import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormInput } from '../forms/FormInput';
import { FormTextArea } from '../forms/FormTextArea';
import { FormSelect } from '../forms/FormSelect';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  caregiverRole: z.enum(['family', 'professional', 'both', 'other']),
  relationship: z.string().optional(),
  yearsExperience: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'both']),
  bio: z.string().optional()
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => void;
  onCancel: () => void;
}

const ProfileForm: FC<ProfileFormProps> = ({ defaultValues, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues
  });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Full Name"
          name="displayName"
          register={register}
          error={errors.displayName?.message}
          required
        />

        <FormInput
          label="Phone Number"
          name="phoneNumber"
          register={register}
          error={errors.phoneNumber?.message}
          type="tel"
        />

        <FormSelect
          label="Caregiver Role"
          name="caregiverRole"
          register={register}
          options={[
            { value: 'family', label: 'Family Caregiver' },
            { value: 'professional', label: 'Professional Caregiver' },
            { value: 'both', label: 'Both' },
            { value: 'other', label: 'Other' }
          ]}
          error={errors.caregiverRole?.message}
          required
        />

        <FormInput
          label="Relationship to Care Recipient"
          name="relationship"
          register={register}
          error={errors.relationship?.message}
        />

        <FormInput
          label="Years of Experience"
          name="yearsExperience"
          register={register}
          error={errors.yearsExperience?.message}
          type="number"
        />

        <FormSelect
          label="Preferred Contact Method"
          name="preferredContact"
          register={register}
          options={[
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
            { value: 'both', label: 'Both' }
          ]}
          error={errors.preferredContact?.message}
          required
        />

        <FormTextArea
          label="Bio"
          name="bio"
          register={register}
          error={errors.bio?.message}
          placeholder="Tell us about yourself..."
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

export default ProfileForm;