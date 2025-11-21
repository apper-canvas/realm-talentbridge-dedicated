import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class SavedJobService {
  constructor() {
    this.tableName = "saved_jobs_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
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

      // Extract job IDs for compatibility with existing code
      return (response.data || []).map(saved => saved.jobId_c?.Id || saved.jobId_c);
    } catch (error) {
      console.error("Error fetching saved jobs:", error?.response?.data?.message || error);
      return [];
    }
  }

  async save(jobId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Check if already saved
      const existing = await this.isSaved(jobId);
      if (existing) {
        return true;
      }

      // Prepare data with only updateable fields
      const preparedData = {
        Name: `Saved Job ${jobId}`,
        jobId_c: parseInt(jobId)
      };

      const params = {
        records: [preparedData]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to save ${failed.length} jobs:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error saving job:", error?.response?.data?.message || error);
      return false;
    }
  }

  async unsave(jobId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Find the saved job record
      const params = {
        fields: [{"field": {"Name": "Name"}}],
        where: [{
          "FieldName": "jobId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(jobId)]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data?.length) {
        return true; // Already not saved
      }

      const recordIds = response.data.map(record => record.Id);

      const deleteParams = {
        RecordIds: recordIds
      };

      const deleteResponse = await apperClient.deleteRecord(this.tableName, deleteParams);

      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        toast.error(deleteResponse.message);
        return false;
      }

      if (deleteResponse.results) {
        const successful = deleteResponse.results.filter(r => r.success);
        const failed = deleteResponse.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to unsave ${failed.length} jobs:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error unsaving job:", error?.response?.data?.message || error);
      return false;
    }
  }

  async isSaved(jobId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [{"field": {"Name": "Name"}}],
        where: [{
          "FieldName": "jobId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(jobId)]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return false;
      }

      return (response.data || []).length > 0;
    } catch (error) {
      console.error("Error checking if job is saved:", error?.response?.data?.message || error);
      return false;
    }
  }

  async clear() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Get all saved jobs first
      const params = {
        fields: [{"field": {"Name": "Name"}}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data?.length) {
        return true; // Already cleared
      }

      const recordIds = response.data.map(record => record.Id);

      const deleteParams = {
        RecordIds: recordIds
      };

      const deleteResponse = await apperClient.deleteRecord(this.tableName, deleteParams);

      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        toast.error(deleteResponse.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error clearing saved jobs:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const savedJobService = new SavedJobService();