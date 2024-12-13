import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '../types/index';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { FormInput } from './forms/FormInput';
import { FormTextArea } from './forms/FormTextArea';
import { FormSelect } from './forms/FormSelect';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.enum(['Product', 'Service'], { required_error: 'Category is required' }),
  subcategory: z.string().min(1, 'Subcategory is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative')
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductEditorProps {
  product: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const SUBCATEGORIES = {
  Product: ['Care Packages', 'Books', 'Medical Supplies', 'Safety Equipment'],
  Service: ['Consultations', 'Planning', 'Support Groups', 'Training']
} as const;

const ProductEditor: FC<ProductEditorProps> = ({ product, onSave, onCancel }) => {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory,
      stock: product.stock
    } : {
      category: 'Product',
      stock: 0
    }
  });

  const category = watch('category');
  const currentSubcategories = SUBCATEGORIES[category];

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    // Set high stock for services
    if (data.category === 'Service') {
      data.stock = 999;
    }

    setLoading(true);
    try {
      // Handle form submission
      onSave();
      toast.success(product ? 'Product updated successfully' : 'Product created successfully');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Name"
          name="name"
          register={register}
          error={errors.name?.message}
          required
        />

        <FormTextArea
          label="Description"
          name="description"
          register={register}
          error={errors.description?.message}
          required
        />

        <FormInput
          label="Price"
          name="price"
          type="number"
          step="0.01"
          register={register}
          error={errors.price?.message}
          required
        />

        <FormSelect
          label="Category"
          name="category"
          register={register}
          options={[
            { value: 'Product', label: 'Product' },
            { value: 'Service', label: 'Service' }
          ]}
          error={errors.category?.message}
          required
        />

        <FormSelect
          label="Subcategory"
          name="subcategory"
          register={register}
          options={currentSubcategories.map(sub => ({
            value: sub,
            label: sub
          }))}
          error={errors.subcategory?.message}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <div className="space-y-4">
            <ImageUpload onImageUploaded={(url) => setImages([...images, url])} />
            <div className="grid grid-cols-3 gap-4">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {category === 'Product' && (
          <FormInput
            label="Stock"
            name="stock"
            type="number"
            register={register}
            error={errors.stock?.message}
            required
          />
        )}

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
            isLoading={loading}
          >
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Card>
  );
}