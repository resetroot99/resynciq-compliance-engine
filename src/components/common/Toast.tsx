import React, { useEffect, useState } from 'react';
import { XIcon } from '@heroicons/react/solid';

interface Props {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}: Props): React.ReactElement {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  } as const;

  return (
    <div
      className={`
        fixed bottom-4 right-4 flex items-center p-4 rounded-lg text-white
        transform transition-all duration-300
        ${colors[type]}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-3 hover:opacity-75"
      >
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
} 