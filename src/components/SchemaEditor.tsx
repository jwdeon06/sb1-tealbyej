import { useState, type FC } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { FormInput } from './forms/FormInput';
import { FormSelect } from './forms/FormSelect';
import toast from 'react-hot-toast';

interface SchemaField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'select' | 'multiselect' | 'date' | 'textarea' | 'checkbox' | 'radio';
  required: boolean;
  options?: string[];
  validation?: Record<string, any>;
}

interface Schema {
  fields: SchemaField[];
}

interface SortableFieldProps {
  field: SchemaField;
  onEdit: (field: SchemaField) => void;
  onDelete: (id: string) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'Multi-Select' },
  { value: 'date', label: 'Date' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' }
] as const;

const INITIAL_FIELD: Omit<SchemaField, 'id'> = {
  name: '',
  label: '',
  type: 'text',
  required: false,
  options: [],
};

function SortableField({ field, onEdit, onDelete }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-medium">{field.label}</h4>
          <p className="text-sm text-gray-500">
            Name: {field.name} | Type: {field.type}
            {field.required && ' | Required'}
          </p>
          {field.options?.length > 0 && (
            <p className="text-sm text-gray-500">
              Options: {field.options.join(', ')}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => onEdit(field)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(field.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SchemaEditorProps {
  schema: Schema;
  onSave: (schema: Schema) => void;
}

const SchemaEditor: FC<SchemaEditorProps> = ({ schema, onSave }) => {
  const [fields, setFields] = useState<SchemaField[]>(schema?.fields || []);
  const [editingField, setEditingField] = useState<SchemaField | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<SchemaField, 'id'>>(INITIAL_FIELD);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.label) {
      toast.error('Name and label are required');
      return;
    }

    if (!formData.name.match(/^[a-zA-Z][a-zA-Z0-9]*$/)) {
      toast.error('Field name must start with a letter and contain only letters and numbers');
      return;
    }

    const newField = editingField 
      ? { ...editingField, ...formData }
      : { ...formData, id: Date.now().toString() };

    if (editingField) {
      setFields(fields.map(f => f.id === editingField.id ? newField : f));
    } else {
      setFields([...fields, newField]);
    }

    setEditingField(null);
    setShowForm(false);
    setFormData(INITIAL_FIELD);
    toast.success(editingField ? 'Field updated' : 'Field added');
  };

  const handleSaveSchema = () => {
    if (fields.length === 0) {
      toast.error('You must have at least one field in the schema');
      return;
    }
    onSave({ fields });
  };

  const needsOptions = ['select', 'multiselect', 'radio'].includes(formData.type);

  return (
    <Card>
      {/* Add/Edit Field Form */}
      {(showForm || editingField) && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingField ? 'Edit Field' : 'Add New Field'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Field Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., phoneNumber"
              required
            />

            <FormInput
              label="Display Label"
              name="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g., Phone Number"
              required
            />

            <FormSelect
              label="Field Type"
              name="type"
              value={formData.type}
              onChange={(e) => setFormData({ 
                ...formData, 
                type: e.target.value as SchemaField['type'],
                options: e.target.value === formData.type ? formData.options : []
              })}
              options={FIELD_TYPES}
              required
            />

            {needsOptions && (
              <FormInput
                label="Options (comma-separated)"
                name="options"
                value={formData.options?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                })}
                placeholder="option1, option2, option3"
              />
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Required Field
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingField(null);
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingField ? 'Update Field' : 'Add Field'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Add Field Button */}
      {!showForm && !editingField && (
        <Button
          onClick={() => setShowForm(true)}
          className="mb-8"
        >
          Add New Field
        </Button>
      )}

      {/* Field List */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Schema Fields</h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  onEdit={() => setEditingField(field)}
                  onDelete={(id) => {
                    if (window.confirm('Are you sure you want to delete this field?')) {
                      setFields(fields.filter(f => f.id !== id));
                      toast.success('Field deleted');
                    }
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {fields.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No fields defined yet. Add your first field to get started.</p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSchema}>
          Save Schema
        </Button>
      </div>
    </Card>
  );
}