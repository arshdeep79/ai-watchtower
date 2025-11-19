import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationButtonProps {
  notificationCount?: number;
  onClick?: () => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  notificationCount = 0,
  onClick
}) => {
  const hasNotifications = notificationCount > 0;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-16 left-10 z-50 bg-blue-600 hover:bg-blue-700 
text-white rounded-full p-4 shadow-lg transition-all duration-200 
hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 
focus:ring-offset-2"
      aria-label="Notifications"
    >
      {/* Bell Icon */}
      <Bell className="w-6 h-6" />

      {/* Notification Bubble with Red Dot */}
      {hasNotifications && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs font-bold shadow-md animate-pulse">
          {notificationCount > 99 ? '99+' : notificationCount}
        </div>
      )}
    </button>
  );
};

export default NotificationButton;
