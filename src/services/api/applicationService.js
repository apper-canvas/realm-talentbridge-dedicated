import applications from "@/services/mockData/applications.json";
import { notificationService } from "@/services/api/notificationService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ApplicationService {
  constructor() {
    this.applications = [...applications];
  }

  async getAll() {
    await delay(300);
    return [...this.applications];
  }

  async getById(id) {
    await delay(200);
    return this.applications.find(application => application.Id === id) || null;
  }

  async getByCandidateId(candidateId) {
    await delay(250);
    return this.applications.filter(app => app.candidateId === candidateId.toString());
  }

  async getByJobId(jobId) {
    await delay(250);
    return this.applications.filter(app => app.jobId === jobId.toString());
  }

  async create(applicationData) {
    await delay(400);
    const newApplication = {
      ...applicationData,
      Id: Math.max(...this.applications.map(a => a.Id)) + 1,
      appliedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    this.applications.push(newApplication);
    return { ...newApplication };
  }

async update(id, applicationData) {
    await delay(300);
    const index = this.applications.findIndex(application => application.Id === id);
    if (index === -1) throw new Error("Application not found");
    
    const oldStatus = this.applications[index].status;
    this.applications[index] = { 
      ...this.applications[index], 
      ...applicationData,
      lastUpdated: new Date().toISOString()
    };
    
    // Create notification if status changed
    if (applicationData.status && applicationData.status !== oldStatus) {
      try {
        // Import jobService dynamically to avoid circular dependency
        const { jobService } = await import("@/services/api/jobService");
        const job = await jobService.getById(this.applications[index].jobId);
        
        if (job) {
          await notificationService.createStatusChangeNotification(
            id,
            job.Id,
            applicationData.status,
            job.title,
            job.company
          );
        }
      } catch (error) {
        console.error('Error creating status change notification:', error);
      }
    }
    
    return { ...this.applications[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.applications.findIndex(application => application.Id === id);
    if (index === -1) throw new Error("Application not found");
    
    const deletedApplication = this.applications.splice(index, 1)[0];
    return { ...deletedApplication };
  }
}

export const applicationService = new ApplicationService();