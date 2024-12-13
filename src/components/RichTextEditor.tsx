import { FC, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: FC<RichTextEditorProps> = ({ 
  value, 
  onChange,
  placeholder = 'Enter content...'
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`bg-white rounded-lg shadow-md ${isFocused ? 'ring-2 ring-primary-500' : ''}`}>
      <div className="border-b p-2 bg-gray-50">
        <div className="flex space-x-2">
          <button className="p-1 hover:bg-gray-200 rounded">
            B
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            I
          </button>
          <button className="p-1 hover:bg-gray-200 rounded">
            U
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full min-h-[200px] p-4 focus:outline-none resize-y"
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;