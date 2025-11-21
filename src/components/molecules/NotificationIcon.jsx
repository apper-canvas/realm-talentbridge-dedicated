import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { notificationService } from '@/services/api/notificationService';

const NotificationIcon = ({ onClick, unreadCount = 0 }) => {

  return (
<button
      onClick={onClick}
      className="relative p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-all duration-200"
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