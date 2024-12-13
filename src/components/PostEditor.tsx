import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Post } from '../types/index';
import { FormInput } from './forms/FormInput';
import { FormSelect } from './forms/FormSelect';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  published: z.boolean().default(false),
  featuredImage: z.string().optional()
});

type PostFormData = z.infer<typeof postSchema>;

interface PostEditorProps {
  post: Post | null;
  onSave: () => void;
  onCancel: () => void;
  categories: Array<{ id: string; name: string }>;
}

const PostEditor: FC<PostEditorProps> = ({ post, onSave, onCancel, categories }) => {
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: post ? {
      title: post.title,
      content: post.content,
      categoryId: post.categoryId,
      tags: post.tags.join(', '),
      published: post.published,
      featuredImage: post.featuredImage
    } : {
      published: false
    }
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      // Handle form submission
      console.log('Submitting data:', data);
      onSave();
      toast.success(post ? 'Post updated successfully' : 'Post created successfully');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Title"
          name="title"
          register={register}
          error={errors.title?.message}
          required
        />

        <FormSelect
          label="Category"
          name="categoryId"
          register={register}
          error={errors.categoryId?.message}
          required
          options={categories.map(cat => ({
            value: cat.id,
            label: cat.name
          }))}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <ImageUpload
            onImageUploaded={(url) => setValue('featuredImage', url)}
            buttonText="Upload Featured Image"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <RichTextEditor
            value={control._formValues.content}
            onChange={(value) => setValue('content', value)}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <FormInput
          label="Tags (comma-separated)"
          name="tags"
          register={register}
          placeholder="tag1, tag2, tag3"
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('published')}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Publish this post
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit">
            {post ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PostEditor;