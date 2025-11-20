const STORAGE_KEY = 'placement_services_saved_jobs';

class SavedJobService {
  constructor() {
    this.savedJobIds = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.savedJobIds));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.savedJobIds];
  }

  async save(jobId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!this.savedJobIds.includes(jobId)) {
      this.savedJobIds.push(jobId);
      this.saveToStorage();
    }
    return true;
  }

  async unsave(jobId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    this.savedJobIds = this.savedJobIds.filter(id => id !== jobId);
    this.saveToStorage();
    return true;
  }

  async isSaved(jobId) {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.savedJobIds.includes(jobId);
  }
}

export const savedJobService = new SavedJobService();