import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button
              variant="secondary"
              onClick={onClose}
              className="!p-1"
            >
              ×
            </Button>
          </div>

          <div className="p-4">
            {children}
          </div>

          {footer && (
            <div className="border-t p-4 flex justify-end space-x-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}