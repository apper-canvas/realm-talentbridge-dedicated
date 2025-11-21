import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class NotificationService {
  constructor() {
    this.tableName = "notifications_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "isRead_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "actionUrl_c"}},
          {"field": {"Name": "applicationId_c"}},
          {"field": {"Name": "jobId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{
          "fieldName": "createdAt_c",
          "sorttype": "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching notifications:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getUnreadCount() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [{"field": {"Name": "Id", "Function": "Count"}}],
        where: [{
          "FieldName": "isRead_c",
          "Operator": "EqualTo",
          "Values": [false]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return 0;
      }

      return response.total || 0;
    } catch (error) {
      console.error("Error fetching unread count:", error?.response?.data?.message || error);
      return 0;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "isRead_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "actionUrl_c"}},
          {"field": {"Name": "applicationId_c"}},
          {"field": {"Name": "jobId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async markAsRead(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const preparedData = {
        Id: parseInt(id),
        isRead_c: true
      };

      const params = {
        records: [preparedData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to mark ${failed.length} notifications as read:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error marking notification as read:", error?.response?.data?.message || error);
      return null;
    }
  }

  async markAllAsRead() {
    try {
      // Get all unread notifications first
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [{"field": {"Name": "Name"}}],
        where: [{
          "FieldName": "isRead_c",
          "Operator": "EqualTo",
          "Values": [false]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data?.length) {
        return { success: true, count: 0 };
      }

      // Update all unread notifications
      const updateRecords = response.data.map(notification => ({
        Id: notification.Id,
        isRead_c: true
      }));

      const updateParams = {
        records: updateRecords
      };

      const updateResponse = await apperClient.updateRecord(this.tableName, updateParams);

      if (!updateResponse.success) {
        console.error(updateResponse.message);
        toast.error(updateResponse.message);
        return { success: false, count: 0 };
      }

      const successful = updateResponse.results?.filter(r => r.success) || [];
      return { success: true, count: successful.length };
    } catch (error) {
      console.error("Error marking all notifications as read:", error?.response?.data?.message || error);
      return { success: false, count: 0 };
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} notifications:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting notification:", error?.response?.data?.message || error);
      return false;
    }
  }

  async create(notificationData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Prepare data with only updateable fields
      const preparedData = {
        Name: notificationData.title || "Notification",
        title_c: notificationData.title,
        message_c: notificationData.message,
        type_c: notificationData.type || 'general',
        priority_c: notificationData.priority || 'medium',
        isRead_c: false,
        createdAt_c: new Date().toISOString(),
        actionUrl_c: notificationData.actionUrl || '/'
      };

      if (notificationData.applicationId) {
        preparedData.applicationId_c = parseInt(notificationData.applicationId);
      }
      if (notificationData.jobId) {
        preparedData.jobId_c = parseInt(notificationData.jobId);
      }

      const params = {
        records: [preparedData]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} notifications:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating notification:", error?.response?.data?.message || error);
      return null;
    }
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
      actionUrl: `/jobs/${jobId}`,
      priority: matchScore >= 90 ? 'high' : 'medium'
    });
  }

  async getNotificationsByType(type) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "isRead_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "actionUrl_c"}},
          {"field": {"Name": "applicationId_c"}},
          {"field": {"Name": "jobId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "type_c",
          "Operator": "EqualTo",
          "Values": [type]
        }],
        orderBy: [{
          "fieldName": "createdAt_c",
          "sorttype": "DESC"
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching notifications by type:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getRecentNotifications(limit = 5) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "message_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "isRead_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "actionUrl_c"}},
          {"field": {"Name": "applicationId_c"}},
          {"field": {"Name": "jobId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{
          "fieldName": "createdAt_c",
          "sorttype": "DESC"
        }],
        pagingInfo: {
          "limit": limit,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent notifications:", error?.response?.data?.message || error);
      return [];
    }
  }

  async clearAllNotifications() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Get all notifications first
      const params = {
        fields: [{"field": {"Name": "Name"}}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data?.length) {
        return { success: true, cleared: 0 };
      }

      const recordIds = response.data.map(notification => notification.Id);

      const deleteParams = {
        RecordIds: recordIds
      };

      const deleteResponse = await apperClient.deleteRecord(this.tableName, deleteParams);

      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        return { success: false, cleared: 0 };
      }

      const successful = deleteResponse.results?.filter(r => r.success) || [];
      return { success: true, cleared: successful.length };
    } catch (error) {
      console.error("Error clearing all notifications:", error?.response?.data?.message || error);
      return { success: false, cleared: 0 };
    }
  }
}

export const notificationService = new NotificationService();