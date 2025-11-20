import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { notificationService } from '@/services/api/notificationService';
import { toast } from 'react-toastify';

const NotificationCenter = ({ isOpen, onClose, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
      
      // Update unread count
      const unreadCount = data.filter(n => !n.isRead).length;
      onUnreadCountChange?.(unreadCount);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.Id === notificationId ? { ...n, isRead: true } : n)
      );
      
      // Update unread count
      const unreadCount = notifications.filter(n => n.Id !== notificationId && !n.isRead).length;
      onUnreadCountChange?.(unreadCount);
      
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      onUnreadCountChange?.(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await handleMarkAsRead(notification.Id);
    }
    
    // Navigate to the action URL
    if (notification.actionUrl) {
      onClose();
      navigate(notification.actionUrl);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      setNotifications(prev => prev.filter(n => n.Id !== notificationId));
      
      // Update unread count
      const remainingUnread = notifications.filter(n => n.Id !== notificationId && !n.isRead).length;
      onUnreadCountChange?.(remainingUnread);
      
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status_change':
        return 'FileText';
      case 'job_match':
        return 'Target';
      default:
        return 'Bell';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      
      <div className="absolute right-4 top-16 w-96 max-h-[32rem] bg-white rounded-lg shadow-lg border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-orange-600/5">
          <div>
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-600">
              {notifications.filter(n => !n.isRead).length} unread
            </p>
          </div>
          <div className="flex items-center gap-2">
            {notifications.filter(n => !n.isRead).length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-8">
              <Loading />
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-error text-sm">{error}</p>
              <Button variant="ghost" size="sm" onClick={loadNotifications} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6">
              <Empty
                icon="Bell"
                title="No notifications"
                message="You're all caught up! New notifications will appear here."
              />
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.Id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      !notification.isRead ? 'bg-primary/10' : 'bg-gray-100'
                    }`}>
                      <ApperIcon
                        name={getNotificationIcon(notification.type)}
                        className={`w-4 h-4 ${
                          !notification.isRead ? 'text-primary' : 'text-gray-500'
                        }`}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            <span className={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.Id);
                            }}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                          >
                            <ApperIcon name="X" className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;