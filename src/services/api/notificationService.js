import notifications from "@/services/mockData/notifications.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NotificationService {
  constructor() {
    this.notifications = [...notifications];
    this.nextId = Math.max(...this.notifications.map(n => n.Id)) + 1;
  }

  async getAll() {
    await delay(300);
    return [...this.notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getUnreadCount() {
    await delay(150);
    return this.notifications.filter(n => !n.isRead).length;
  }

  async getById(id) {
    await delay(200);
    const notification = this.notifications.find(n => n.Id === parseInt(id));
    return notification ? { ...notification } : null;
  }

  async markAsRead(id) {
    await delay(250);
    const index = this.notifications.findIndex(n => n.Id === parseInt(id));
    if (index === -1) throw new Error("Notification not found");
    
    this.notifications[index] = {
      ...this.notifications[index],
      isRead: true
    };
    
    return { ...this.notifications[index] };
  }

  async markAllAsRead() {
    await delay(300);
    this.notifications = this.notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    
    return { success: true, count: this.notifications.length };
  }

  async delete(id) {
    await delay(200);
    const index = this.notifications.findIndex(n => n.Id === parseInt(id));
    if (index === -1) throw new Error("Notification not found");
    
    this.notifications.splice(index, 1);
    return { success: true };
  }

  async create(notificationData) {
    await delay(250);
    const newNotification = {
      Id: this.nextId++,
      type: notificationData.type || 'general',
      title: notificationData.title,
      message: notificationData.message,
      applicationId: notificationData.applicationId || null,
      jobId: notificationData.jobId || null,
      isRead: false,
      createdAt: new Date().toISOString(),
      actionUrl: notificationData.actionUrl || '/',
      priority: notificationData.priority || 'medium'
    };
    
    this.notifications.unshift(newNotification);
    return { ...newNotification };
  }

  async createStatusChangeNotification(applicationId, jobId, status, jobTitle, companyName) {
    const statusMessages = {
      'applied': `Your application for ${jobTitle} at ${companyName} has been submitted successfully.`,
      'under-review': `Great news! Your application for ${jobTitle} at ${companyName} is now under review by the hiring team.`,
      'interview': `Your application for ${jobTitle} at ${companyName} has been moved to Interview stage.`,
      'accepted': `Congratulations! Your application for ${jobTitle} at ${companyName} has been accepted. The team will contact you soon.`,
      'rejected': `Unfortunately, your application for ${jobTitle} at ${companyName} was not selected. Keep exploring other opportunities!`
    };

    const priorityMap = {
      'accepted': 'high',
      'interview': 'high', 
      'under-review': 'medium',
      'applied': 'medium',
      'rejected': 'low'
    };

    return await this.create({
      type: 'status_change',
      title: 'Application Status Updated',
      message: statusMessages[status] || `Your application status has been updated to ${status}.`,
      applicationId: applicationId,
      jobId: jobId,
      actionUrl: '/applications',
      priority: priorityMap[status] || 'medium'
    });
  }

  async createJobMatchNotification(jobId, jobTitle, companyName, matchScore) {
    const matchLevel = matchScore >= 90 ? 'Perfect' : matchScore >= 80 ? 'Great' : 'Good';
    const title = `${matchLevel} Match Available`;
    const message = `New opportunity: ${jobTitle} at ${companyName} matches ${matchScore}% of your criteria.`;

    return await this.create({
      type: 'job_match',
      title: title,
      message: message,
      jobId: jobId,
      actionUrl: `/job/${jobId}`,
      priority: matchScore >= 90 ? 'high' : 'medium'
    });
  }

  async getNotificationsByType(type) {
    await delay(250);
    return this.notifications
      .filter(n => n.type === type)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(n => ({ ...n }));
  }

  async getRecentNotifications(limit = 5) {
    await delay(200);
    return [...this.notifications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  async clearAllNotifications() {
    await delay(300);
    const count = this.notifications.length;
    this.notifications = [];
    return { success: true, cleared: count };
  }
}

export const notificationService = new NotificationService();