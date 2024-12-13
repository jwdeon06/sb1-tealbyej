import { useState, useEffect, useRef } from 'react';
import type { Message } from '../types/messages';
import { useAuth } from '../contexts/AuthContext';
import { createThread, sendMessage } from '../services/openai';
import toast from 'react-hot-toast';

export default function Guide() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const initThread = async () => {
      try {
        const newThreadId = await createThread();
        setThreadId(newThreadId);
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Failed to initialize chat');
      }
    };
    initThread();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !threadId || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(threadId, input);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-500 mb-6">
          Partner in Aging Guide
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your trusted companion in the caregiving journey. Get immediate assistance with caregiving questions, resources, and support.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-primary-50 border-b border-primary-100">
          <h2 className="text-xl font-semibold text-primary-700">
            AI Caregiving Assistant
          </h2>
          <p className="text-sm text-gray-600">
            Ask any questions about caregiving, and get immediate assistance
          </p>
        </div>

        <div className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-gray-500 italic">Assistant is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-primary-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="brand-button"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}