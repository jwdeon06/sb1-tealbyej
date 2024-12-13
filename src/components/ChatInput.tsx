import { FC, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-primary-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;