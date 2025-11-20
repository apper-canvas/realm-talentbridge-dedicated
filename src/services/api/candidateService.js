import candidates from "@/services/mockData/candidates.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CandidateService {
  constructor() {
    this.candidates = [...candidates];
  }

  async getAll() {
    await delay(300);
    return [...this.candidates];
  }

  async getById(id) {
    await delay(200);
    return this.candidates.find(candidate => candidate.Id === id) || null;
  }

  async getProfile() {
    await delay(200);
    // Return the first candidate as the current user's profile
    return this.candidates.length > 0 ? { ...this.candidates[0] } : null;
  }

  async create(candidateData) {
    await delay(400);
    const newCandidate = {
      ...candidateData,
      Id: Math.max(...this.candidates.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    this.candidates.push(newCandidate);
    return { ...newCandidate };
  }

  async update(id, candidateData) {
    await delay(300);
    const index = this.candidates.findIndex(candidate => candidate.Id === id);
    if (index === -1) throw new Error("Candidate not found");
    
    this.candidates[index] = { ...this.candidates[index], ...candidateData };
    return { ...this.candidates[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.candidates.findIndex(candidate => candidate.Id === id);
    if (index === -1) throw new Error("Candidate not found");
    
    const deletedCandidate = this.candidates.splice(index, 1)[0];
    return { ...deletedCandidate };
  }
}

export const candidateService = new CandidateService();