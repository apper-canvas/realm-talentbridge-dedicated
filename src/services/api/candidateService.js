import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class CandidateService {
  constructor() {
    this.tableName = "candidates_c";
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "fullName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "profileSummary_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "experience_c"}},
          {"field": {"Name": "education_c"}},
          {"field": {"Name": "preferredJobTypes_c"}},
          {"field": {"Name": "resumeUrl_c"}},
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
      console.error("Error fetching candidates:", error?.response?.data?.message || error);
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
          {"field": {"Name": "fullName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "profileSummary_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "experience_c"}},
          {"field": {"Name": "education_c"}},
          {"field": {"Name": "preferredJobTypes_c"}},
          {"field": {"Name": "resumeUrl_c"}},
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
      console.error(`Error fetching candidate ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getProfile() {
    try {
      const candidates = await this.getAll();
      return candidates.length > 0 ? candidates[0] : null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  async create(candidateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Prepare data with only updateable fields
      const preparedData = {};
      if (candidateData.Name) preparedData.Name = candidateData.Name;
      if (candidateData.fullName_c || candidateData.fullName) preparedData.fullName_c = candidateData.fullName_c || candidateData.fullName;
      if (candidateData.email_c || candidateData.email) preparedData.email_c = candidateData.email_c || candidateData.email;
      if (candidateData.phone_c || candidateData.phone) preparedData.phone_c = candidateData.phone_c || candidateData.phone;
      if (candidateData.location_c || candidateData.location) preparedData.location_c = candidateData.location_c || candidateData.location;
      if (candidateData.profileSummary_c || candidateData.profileSummary) preparedData.profileSummary_c = candidateData.profileSummary_c || candidateData.profileSummary;
      if (candidateData.skills_c || candidateData.skills) {
        const skills = candidateData.skills_c || candidateData.skills;
        preparedData.skills_c = Array.isArray(skills) ? skills.join(",") : skills;
      }
      if (candidateData.experience_c || candidateData.experience) preparedData.experience_c = candidateData.experience_c || candidateData.experience;
      if (candidateData.education_c || candidateData.education) preparedData.education_c = candidateData.education_c || candidateData.education;
      if (candidateData.preferredJobTypes_c || candidateData.preferredJobTypes) {
        const jobTypes = candidateData.preferredJobTypes_c || candidateData.preferredJobTypes;
        preparedData.preferredJobTypes_c = Array.isArray(jobTypes) ? jobTypes.join(",") : jobTypes;
      }
      if (candidateData.resumeUrl_c || candidateData.resumeUrl) preparedData.resumeUrl_c = candidateData.resumeUrl_c || candidateData.resumeUrl;

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
          console.error(`Failed to create ${failed.length} candidates:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating candidate:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, candidateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      // Prepare data with only updateable fields
      const preparedData = { Id: parseInt(id) };
      if (candidateData.Name !== undefined) preparedData.Name = candidateData.Name;
      if (candidateData.fullName_c !== undefined || candidateData.fullName !== undefined) preparedData.fullName_c = candidateData.fullName_c || candidateData.fullName;
      if (candidateData.email_c !== undefined || candidateData.email !== undefined) preparedData.email_c = candidateData.email_c || candidateData.email;
      if (candidateData.phone_c !== undefined || candidateData.phone !== undefined) preparedData.phone_c = candidateData.phone_c || candidateData.phone;
      if (candidateData.location_c !== undefined || candidateData.location !== undefined) preparedData.location_c = candidateData.location_c || candidateData.location;
      if (candidateData.profileSummary_c !== undefined || candidateData.profileSummary !== undefined) preparedData.profileSummary_c = candidateData.profileSummary_c || candidateData.profileSummary;
      if (candidateData.skills_c !== undefined || candidateData.skills !== undefined) {
        const skills = candidateData.skills_c || candidateData.skills;
        preparedData.skills_c = Array.isArray(skills) ? skills.join(",") : skills;
      }
      if (candidateData.experience_c !== undefined || candidateData.experience !== undefined) preparedData.experience_c = candidateData.experience_c || candidateData.experience;
      if (candidateData.education_c !== undefined || candidateData.education !== undefined) preparedData.education_c = candidateData.education_c || candidateData.education;
      if (candidateData.preferredJobTypes_c !== undefined || candidateData.preferredJobTypes !== undefined) {
        const jobTypes = candidateData.preferredJobTypes_c || candidateData.preferredJobTypes;
        preparedData.preferredJobTypes_c = Array.isArray(jobTypes) ? jobTypes.join(",") : jobTypes;
      }
      if (candidateData.resumeUrl_c !== undefined || candidateData.resumeUrl !== undefined) preparedData.resumeUrl_c = candidateData.resumeUrl_c || candidateData.resumeUrl;

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
          console.error(`Failed to update ${failed.length} candidates:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating candidate:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} candidates:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting candidate:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const candidateService = new CandidateService();