import React, { useEffect, useState } from 'react';
import { notificationService } from '../services/notification-service';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(({ message, type }) => {
      const id = Date.now().toString();
      setNotifications(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {notifications.map(({ id, message, type }) => (
        <div
          key={id}
          className={`p-4 rounded shadow-lg ${
            type === 'error' ? 'bg-red-500' :
            type === 'success' ? 'bg-green-500' :
            'bg-blue-500'
          } text-white`}
        >
          {message}
        </div>
      ))}
    </div>
  );
} 