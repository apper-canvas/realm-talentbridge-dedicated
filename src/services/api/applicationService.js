import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class ApplicationService {
  constructor() {
    this.tableName = "applications_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "coverLetter_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "appliedDate_c"}},
          {"field": {"Name": "lastUpdated_c"}},
          {"field": {"Name": "candidateId_c"}},
          {"field": {"Name": "jobId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching applications:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "coverLetter_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "appliedDate_c"}},
          {"field": {"Name": "lastUpdated_c"}},
          {"field": {"Name": "candidateId_c"}},
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
      console.error(`Error fetching application ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByCandidateId(candidateId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "coverLetter_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "appliedDate_c"}},
          {"field": {"Name": "lastUpdated_c"}},
          {"field": {"Name": "candidateId_c"}},
          {"field": {"Name": "jobId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "candidateId_c",
          "Operator": "EqualTo", 
          "Values": [parseInt(candidateId)]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching applications by candidate:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByJobId(jobId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "coverLetter_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "appliedDate_c"}},
          {"field": {"Name": "lastUpdated_c"}},
          {"field": {"Name": "candidateId_c"}},
          {"field": {"Name": "jobId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "jobId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(jobId)]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching applications by job:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(applicationData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Prepare data with only updateable fields
      const preparedData = {
        Name: applicationData.Name || "Application",
        coverLetter_c: applicationData.coverLetter_c || applicationData.coverLetter || "",
        status_c: applicationData.status_c || applicationData.status || "applied",
        appliedDate_c: applicationData.appliedDate_c || applicationData.appliedDate || new Date().toISOString(),
        lastUpdated_c: new Date().toISOString(),
        candidateId_c: parseInt(applicationData.candidateId_c || applicationData.candidateId),
        jobId_c: parseInt(applicationData.jobId_c || applicationData.jobId)
      };

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
          console.error(`Failed to create ${failed.length} applications:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating application:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, applicationData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Get current application to check status change
      const currentApplication = await this.getById(id);
      const oldStatus = currentApplication?.status_c;

      // Prepare data with only updateable fields
      const preparedData = { Id: parseInt(id) };
      if (applicationData.Name !== undefined) preparedData.Name = applicationData.Name;
      if (applicationData.coverLetter_c !== undefined || applicationData.coverLetter !== undefined) preparedData.coverLetter_c = applicationData.coverLetter_c || applicationData.coverLetter;
      if (applicationData.status_c !== undefined || applicationData.status !== undefined) preparedData.status_c = applicationData.status_c || applicationData.status;
      if (applicationData.appliedDate_c !== undefined || applicationData.appliedDate !== undefined) preparedData.appliedDate_c = applicationData.appliedDate_c || applicationData.appliedDate;
      if (applicationData.lastUpdated_c !== undefined || applicationData.lastUpdated !== undefined) preparedData.lastUpdated_c = applicationData.lastUpdated_c || applicationData.lastUpdated;
      if (applicationData.candidateId_c !== undefined || applicationData.candidateId !== undefined) preparedData.candidateId_c = parseInt(applicationData.candidateId_c || applicationData.candidateId);
      if (applicationData.jobId_c !== undefined || applicationData.jobId !== undefined) preparedData.jobId_c = parseInt(applicationData.jobId_c || applicationData.jobId);

      preparedData.lastUpdated_c = new Date().toISOString();

      const params = {
        records: [preparedData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      let updatedApplication = null;
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} applications:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        updatedApplication = successful.length > 0 ? successful[0].data : null;
      }

      // Create notification if status changed
      const newStatus = preparedData.status_c;
      if (newStatus && newStatus !== oldStatus) {
        try {
          // Import services dynamically to avoid circular dependency
          const { jobService } = await import("@/services/api/jobService");
          const { notificationService } = await import("@/services/api/notificationService");
          
          const jobId = preparedData.jobId_c || currentApplication?.jobId_c;
          const job = await jobService.getById(jobId);
          
          if (job) {
            await notificationService.createStatusChangeNotification(
              id,
              job.Id,
              newStatus,
              job.title_c || job.Name,
              job.company_c
            );
          }
        } catch (error) {
          console.error('Error creating status change notification:', error);
        }
      }

      return updatedApplication;
    } catch (error) {
      console.error("Error updating application:", error?.response?.data?.message || error);
      return null;
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
          console.error(`Failed to delete ${failed.length} applications:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting application:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const applicationService = new ApplicationService();