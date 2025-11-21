import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class JobService {
  constructor() {
    this.tableName = "jobs_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "jobType_c"}},
          {"field": {"Name": "experienceLevel_c"}},
          {"field": {"Name": "salaryRange_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "requirements_c"}},
          {"field": {"Name": "responsibilities_c"}},
          {"field": {"Name": "benefits_c"}},
          {"field": {"Name": "applicationCount_c"}},
          {"field": {"Name": "postedDate_c"}},
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
      console.error("Error fetching jobs:", error?.response?.data?.message || error);
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "jobType_c"}},
          {"field": {"Name": "experienceLevel_c"}},
          {"field": {"Name": "salaryRange_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "requirements_c"}},
          {"field": {"Name": "responsibilities_c"}},
          {"field": {"Name": "benefits_c"}},
          {"field": {"Name": "applicationCount_c"}},
          {"field": {"Name": "postedDate_c"}},
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
      console.error(`Error fetching job ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(jobData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Prepare data with only updateable fields
      const preparedData = {
        Name: jobData.title_c || jobData.title || "Job",
        title_c: jobData.title_c || jobData.title,
        company_c: jobData.company_c || jobData.company,
        location_c: jobData.location_c || jobData.location,
        jobType_c: jobData.jobType_c || jobData.jobType,
        experienceLevel_c: jobData.experienceLevel_c || jobData.experienceLevel,
        description_c: jobData.description_c || jobData.description,
        applicationCount_c: jobData.applicationCount_c || jobData.applicationCount || 0,
        postedDate_c: jobData.postedDate_c || jobData.postedDate || new Date().toISOString()
      };

      if (jobData.salaryRange_c || jobData.salaryRange) {
        const salaryRange = jobData.salaryRange_c || jobData.salaryRange;
        if (salaryRange.min && salaryRange.max) {
          preparedData.salaryRange_c = `${salaryRange.min}-${salaryRange.max}`;
        }
      }

      if (jobData.requirements_c || jobData.requirements) {
        const requirements = jobData.requirements_c || jobData.requirements;
        preparedData.requirements_c = Array.isArray(requirements) ? requirements.join("\n") : requirements;
      }

      if (jobData.responsibilities_c || jobData.responsibilities) {
        const responsibilities = jobData.responsibilities_c || jobData.responsibilities;
        preparedData.responsibilities_c = Array.isArray(responsibilities) ? responsibilities.join("\n") : responsibilities;
      }

      if (jobData.benefits_c || jobData.benefits) {
        const benefits = jobData.benefits_c || jobData.benefits;
        preparedData.benefits_c = Array.isArray(benefits) ? benefits.join("\n") : benefits;
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
          console.error(`Failed to create ${failed.length} jobs:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating job:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, jobData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Prepare data with only updateable fields
      const preparedData = { Id: parseInt(id) };
      if (jobData.Name !== undefined) preparedData.Name = jobData.Name;
      if (jobData.title_c !== undefined || jobData.title !== undefined) preparedData.title_c = jobData.title_c || jobData.title;
      if (jobData.company_c !== undefined || jobData.company !== undefined) preparedData.company_c = jobData.company_c || jobData.company;
      if (jobData.location_c !== undefined || jobData.location !== undefined) preparedData.location_c = jobData.location_c || jobData.location;
      if (jobData.jobType_c !== undefined || jobData.jobType !== undefined) preparedData.jobType_c = jobData.jobType_c || jobData.jobType;
      if (jobData.experienceLevel_c !== undefined || jobData.experienceLevel !== undefined) preparedData.experienceLevel_c = jobData.experienceLevel_c || jobData.experienceLevel;
      if (jobData.description_c !== undefined || jobData.description !== undefined) preparedData.description_c = jobData.description_c || jobData.description;
      if (jobData.applicationCount_c !== undefined || jobData.applicationCount !== undefined) preparedData.applicationCount_c = jobData.applicationCount_c || jobData.applicationCount;
      if (jobData.postedDate_c !== undefined || jobData.postedDate !== undefined) preparedData.postedDate_c = jobData.postedDate_c || jobData.postedDate;

      if (jobData.salaryRange_c !== undefined || jobData.salaryRange !== undefined) {
        const salaryRange = jobData.salaryRange_c || jobData.salaryRange;
        if (salaryRange && salaryRange.min && salaryRange.max) {
          preparedData.salaryRange_c = `${salaryRange.min}-${salaryRange.max}`;
        }
      }

      if (jobData.requirements_c !== undefined || jobData.requirements !== undefined) {
        const requirements = jobData.requirements_c || jobData.requirements;
        preparedData.requirements_c = Array.isArray(requirements) ? requirements.join("\n") : requirements;
      }

      if (jobData.responsibilities_c !== undefined || jobData.responsibilities !== undefined) {
        const responsibilities = jobData.responsibilities_c || jobData.responsibilities;
        preparedData.responsibilities_c = Array.isArray(responsibilities) ? responsibilities.join("\n") : responsibilities;
      }

      if (jobData.benefits_c !== undefined || jobData.benefits !== undefined) {
        const benefits = jobData.benefits_c || jobData.benefits;
        preparedData.benefits_c = Array.isArray(benefits) ? benefits.join("\n") : benefits;
      }

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
          console.error(`Failed to update ${failed.length} jobs:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating job:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} jobs:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting job:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const jobService = new JobService();