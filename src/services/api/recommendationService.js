import { jobService } from "@/services/api/jobService";
import { candidateService } from "@/services/api/candidateService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RecommendationService {
  // Calculate skill match percentage between candidate and job
  calculateSkillMatch(candidateSkills, jobRequirements) {
    if (!candidateSkills || candidateSkills.length === 0) return 0;
    if (!jobRequirements || jobRequirements.length === 0) return 0;

    const candidateSkillsLower = candidateSkills.map(skill => skill.toLowerCase());
    let matches = 0;

    jobRequirements.forEach(requirement => {
      const requirementLower = requirement.toLowerCase();
      candidateSkillsLower.forEach(skill => {
        if (requirementLower.includes(skill) || skill.includes(requirementLower.split(' ')[0])) {
          matches++;
        }
      });
    });

    return Math.min((matches / jobRequirements.length) * 100, 100);
  }

  // Check experience level compatibility
  isExperienceLevelMatch(candidateExperience, jobExperienceLevel) {
    if (!candidateExperience || candidateExperience.length === 0) return 0.5;
    
    const yearsOfExperience = candidateExperience.length;
    
    switch (jobExperienceLevel) {
      case 'entry':
        return yearsOfExperience <= 2 ? 1 : 0.7;
      case 'mid':
        return yearsOfExperience >= 2 && yearsOfExperience <= 5 ? 1 : 0.6;
      case 'senior':
        return yearsOfExperience >= 4 ? 1 : 0.4;
      default:
        return 0.8;
    }
  }

  // Check location preference match
  isLocationMatch(candidateLocation, candidatePreferences, jobLocation) {
    if (!candidateLocation && !candidatePreferences) return 0.5;

    const jobLocationLower = jobLocation.toLowerCase();
    
    // Check if candidate prefers remote and job offers remote
    if (candidatePreferences?.includes('remote') && jobLocationLower.includes('remote')) {
      return 1;
    }
    
    // Check if candidate location matches job location
    if (candidateLocation) {
      const candidateLocationLower = candidateLocation.toLowerCase();
      const candidateCity = candidateLocationLower.split(',')[0].trim();
      
      if (jobLocationLower.includes(candidateCity)) {
        return 1;
      }
    }
    
    return 0.3; // Lower score for location mismatch
  }

  // Check job type preference match
  isJobTypeMatch(candidatePreferences, jobType) {
    if (!candidatePreferences || candidatePreferences.length === 0) return 0.7;
    
    return candidatePreferences.includes(jobType) ? 1 : 0.5;
  }

  // Calculate overall job match score
  calculateJobScore(candidate, job) {
    const skillMatch = this.calculateSkillMatch(candidate.skills, job.requirements);
    const experienceMatch = this.isExperienceLevelMatch(candidate.experience, job.experienceLevel);
    const locationMatch = this.isLocationMatch(candidate.location, candidate.preferredJobTypes, job.location);
    const jobTypeMatch = this.isJobTypeMatch(candidate.preferredJobTypes, job.jobType);

    // Weighted scoring system
    const weights = {
      skills: 0.4,     // 40% weight on skills
      experience: 0.25, // 25% weight on experience level
      location: 0.2,    // 20% weight on location
      jobType: 0.15     // 15% weight on job type
    };

    const totalScore = (
      (skillMatch / 100) * weights.skills +
      experienceMatch * weights.experience +
      locationMatch * weights.location +
      jobTypeMatch * weights.jobType
    ) * 100;

    return {
      totalScore: Math.round(totalScore),
      breakdown: {
        skillMatch: Math.round(skillMatch),
        experienceMatch: Math.round(experienceMatch * 100),
        locationMatch: Math.round(locationMatch * 100),
        jobTypeMatch: Math.round(jobTypeMatch * 100)
      }
    };
  }

  // Generate recommendation reason based on match breakdown
  generateRecommendationReason(matchData) {
    const { breakdown } = matchData;
    const reasons = [];

    if (breakdown.skillMatch >= 70) {
      reasons.push(`${breakdown.skillMatch}% skill match`);
    }
    if (breakdown.experienceMatch >= 80) {
      reasons.push('experience level fit');
    }
    if (breakdown.locationMatch >= 80) {
      reasons.push('location preference match');
    }
    if (breakdown.jobTypeMatch >= 80) {
      reasons.push('job type preference');
    }

    if (reasons.length === 0) {
      if (breakdown.skillMatch >= 50) {
        reasons.push('partial skill match');
      } else {
        reasons.push('career growth opportunity');
      }
    }

    return reasons.join(', ');
  }

  // Get personalized job recommendations for a candidate
  async getRecommendations(limit = 6) {
    await delay(400);
    
    try {
      const candidate = await candidateService.getProfile();
      if (!candidate) {
        return [];
      }

      const allJobs = await jobService.getAll();
      
      // Calculate match scores for all jobs
      const jobsWithScores = allJobs.map(job => {
        const matchData = this.calculateJobScore(candidate, job);
        return {
          ...job,
          matchScore: matchData.totalScore,
          matchBreakdown: matchData.breakdown,
          recommendationReason: this.generateRecommendationReason(matchData)
        };
      });

      // Sort by match score (highest first) and limit results
      const recommendations = jobsWithScores
        .filter(job => job.matchScore >= 30) // Only show jobs with reasonable match
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  // Check if user profile is complete enough for good recommendations
  async isProfileCompleteForRecommendations() {
    try {
      const candidate = await candidateService.getProfile();
      if (!candidate) return false;

      const hasSkills = candidate.skills && candidate.skills.length > 0;
      const hasExperience = candidate.experience && candidate.experience.length > 0;
      const hasPreferences = candidate.preferredJobTypes && candidate.preferredJobTypes.length > 0;
      const hasLocation = candidate.location && candidate.location.trim().length > 0;

      // Need at least skills and one other factor for decent recommendations
      return hasSkills && (hasExperience || hasPreferences || hasLocation);
    } catch (error) {
      return false;
    }
  }
}

export const recommendationService = new RecommendationService();