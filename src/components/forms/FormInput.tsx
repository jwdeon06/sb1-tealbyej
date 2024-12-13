import type { FC } from 'react';
import { UseFormRegister, Path, FieldValues } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register?: UseFormRegister<T>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  step?: string;
}

export const FormInput = <T extends FieldValues>({
  label,
  name,
  register,
  value,
  onChange,
  type = 'text',
  error,
  placeholder,
  required = false,
  className = '',
  step
}: FormInputProps<T>): JSX.Element => {
  const inputProps = register 
    ? { ...register(name) }
    : { value, onChange };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        {...inputProps}
        placeholder={placeholder}
        step={step}
        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${className}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;