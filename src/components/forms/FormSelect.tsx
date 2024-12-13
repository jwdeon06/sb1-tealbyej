import type { FC } from 'react';
import { UseFormRegister, Path, FieldValues } from 'react-hook-form';

interface FormSelectProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register?: UseFormRegister<T>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  className?: string;
}

export const FormSelect = <T extends FieldValues>({
  label,
  name,
  register,
  value,
  onChange,
  options,
  error,
  required = false,
  className = ''
}: FormSelectProps<T>): JSX.Element => {
  const selectProps = register 
    ? { ...register(name) }
    : { value, onChange };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...selectProps}
        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${className}`}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormSelect;