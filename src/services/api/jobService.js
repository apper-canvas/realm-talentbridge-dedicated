import jobs from "@/services/mockData/jobs.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class JobService {
  constructor() {
    this.jobs = [...jobs];
  }

  async getAll() {
    await delay(300);
    return [...this.jobs];
  }

  async getById(id) {
    await delay(200);
    return this.jobs.find(job => job.Id === id) || null;
  }

  async create(jobData) {
    await delay(400);
    const newJob = {
      ...jobData,
      Id: Math.max(...this.jobs.map(j => j.Id)) + 1,
      postedDate: new Date().toISOString(),
      applicationCount: 0
    };
    this.jobs.push(newJob);
    return { ...newJob };
  }

  async update(id, jobData) {
    await delay(300);
    const index = this.jobs.findIndex(job => job.Id === id);
    if (index === -1) throw new Error("Job not found");
    
    this.jobs[index] = { ...this.jobs[index], ...jobData };
    return { ...this.jobs[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.jobs.findIndex(job => job.Id === id);
    if (index === -1) throw new Error("Job not found");
    
    const deletedJob = this.jobs.splice(index, 1)[0];
    return { ...deletedJob };
  }
}

export const jobService = new JobService();