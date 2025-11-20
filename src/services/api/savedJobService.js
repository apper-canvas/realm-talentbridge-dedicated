const STORAGE_KEY = 'placement_services_saved_jobs';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SavedJobService {
  constructor() {
    this.loadSavedJobs();
  }

  loadSavedJobs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      this.savedJobIds = saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
      this.savedJobIds = [];
    }
  }

saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.savedJobIds));
    } catch (error) {
      console.error('Failed to save jobs:', error);
    }
  }

  async getAll() {
    await delay(100);
    return [...this.savedJobIds];
  }

  async save(jobId) {
    await delay(200);
    if (!this.savedJobIds.includes(jobId)) {
      this.savedJobIds.push(jobId);
      this.saveToStorage();
    }
    return true;
  }

  async unsave(jobId) {
    await delay(200);
    const index = this.savedJobIds.indexOf(jobId);
    if (index > -1) {
      this.savedJobIds.splice(index, 1);
      this.saveToStorage();
    }
    return true;
  }

  async isSaved(jobId) {
    await delay(50);
    return this.savedJobIds.includes(jobId);
  }

  async clear() {
    await delay(100);
    this.savedJobIds = [];
    this.saveToStorage();
    return true;
  }
}

export const savedJobService = new SavedJobService();