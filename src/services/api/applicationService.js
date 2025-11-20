import applications from "@/services/mockData/applications.json";

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
    
    this.applications[index] = { 
      ...this.applications[index], 
      ...applicationData,
      lastUpdated: new Date().toISOString()
    };
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