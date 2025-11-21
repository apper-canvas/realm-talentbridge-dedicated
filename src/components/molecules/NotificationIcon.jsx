import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { notificationService } from '@/services/api/notificationService';

const NotificationIcon = ({ onClick }) => {
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const loadUnreadCount = async () => {
    setLoading(true);
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnreadCount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-all duration-200"
      disabled={loading}
    >
      <ApperIcon name="Bell" className="w-5 h-5" />
      
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          size="sm"
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs flex items-center justify-center p-1 bg-error text-white"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </button>
  );
};

export default NotificationIcon;