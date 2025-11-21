import { jobService } from "@/services/api/jobService";
import { candidateService } from "@/services/api/candidateService";
import { notificationService } from "@/services/api/notificationService";

class RecommendationService {
  // Parse skills from database format (comma-separated string to array)
  parseSkills(skillsString) {
    if (!skillsString || typeof skillsString !== 'string') return [];
    return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  }

  // Parse job types from database format (comma-separated string to array)
  parseJobTypes(jobTypesString) {
    if (!jobTypesString || typeof jobTypesString !== 'string') return [];
    return jobTypesString.split(',').map(type => type.trim()).filter(type => type.length > 0);
  }

  // Parse requirements from database format (newline-separated string to array)
  parseRequirements(requirementsString) {
    if (!requirementsString || typeof requirementsString !== 'string') return [];
    return requirementsString.split('\n').map(req => req.trim()).filter(req => req.length > 0);
  }

  // Calculate skill match percentage between candidate and job
  calculateSkillMatch(candidateSkills, jobRequirements) {
    const skills = Array.isArray(candidateSkills) ? candidateSkills : this.parseSkills(candidateSkills);
    const requirements = Array.isArray(jobRequirements) ? jobRequirements : this.parseRequirements(jobRequirements);
    
    if (!skills || skills.length === 0) return 0;
    if (!requirements || requirements.length === 0) return 0;

    const candidateSkillsLower = skills.map(skill => skill.toLowerCase());
    let matches = 0;

    requirements.forEach(requirement => {
      const requirementLower = requirement.toLowerCase();
      candidateSkillsLower.forEach(skill => {
        if (requirementLower.includes(skill) || skill.includes(requirementLower.split(' ')[0])) {
          matches++;
        }
      });
    });

    return Math.min((matches / requirements.length) * 100, 100);
  }

  // Check experience level compatibility
  isExperienceLevelMatch(candidateExperience, jobExperienceLevel) {
    let experienceYears = 0;
    
    // Try to parse experience data
    if (typeof candidateExperience === 'string') {
      // Count number of jobs/positions mentioned
      const positions = candidateExperience.split('\n').filter(line => line.trim().length > 0);
      experienceYears = positions.length;
    } else if (Array.isArray(candidateExperience)) {
      experienceYears = candidateExperience.length;
    }

    if (experienceYears === 0) return 0.5;
    
    switch (jobExperienceLevel) {
      case 'entry':
        return experienceYears <= 2 ? 1 : 0.7;
      case 'mid':
        return experienceYears >= 2 && experienceYears <= 5 ? 1 : 0.6;
      case 'senior':
        return experienceYears >= 4 ? 1 : 0.4;
      default:
        return 0.8;
    }
  }

  // Check location preference match
  isLocationMatch(candidateLocation, candidatePreferences, jobLocation) {
    if (!candidateLocation && !candidatePreferences) return 0.5;

    const jobLocationLower = (jobLocation || '').toLowerCase();
    const preferences = Array.isArray(candidatePreferences) ? candidatePreferences : this.parseJobTypes(candidatePreferences);
    
    // Check if candidate prefers remote and job offers remote
    if (preferences?.includes('remote') && jobLocationLower.includes('remote')) {
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
    const preferences = Array.isArray(candidatePreferences) ? candidatePreferences : this.parseJobTypes(candidatePreferences);
    
    if (!preferences || preferences.length === 0) return 0.7;
    
    return preferences.includes(jobType) ? 1 : 0.5;
  }

  // Calculate overall job match score
  calculateJobScore(candidate, job) {
    // Use database field names with fallbacks to old field names
    const candidateSkills = candidate.skills_c || candidate.skills || '';
    const candidateExperience = candidate.experience_c || candidate.experience || '';
    const candidateLocation = candidate.location_c || candidate.location || '';
    const candidateJobTypes = candidate.preferredJobTypes_c || candidate.preferredJobTypes || '';

    const jobRequirements = job.requirements_c || job.requirements || '';
    const jobExperienceLevel = job.experienceLevel_c || job.experienceLevel || '';
    const jobLocation = job.location_c || job.location || '';
    const jobType = job.jobType_c || job.jobType || '';

    const skillMatch = this.calculateSkillMatch(candidateSkills, jobRequirements);
    const experienceMatch = this.isExperienceLevelMatch(candidateExperience, jobExperienceLevel);
    const locationMatch = this.isLocationMatch(candidateLocation, candidateJobTypes, jobLocation);
    const jobTypeMatch = this.isJobTypeMatch(candidateJobTypes, jobType);

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

      // Create notifications for high-quality matches (85%+)
      const highQualityMatches = recommendations.filter(job => job.matchScore >= 85);
      
      for (const job of highQualityMatches) {
        try {
          // Check if we already have a recent notification for this job
          const existingNotifications = await notificationService.getNotificationsByType('job_match');
          const jobId = job.Id;
          const hasRecentNotification = existingNotifications.some(n => {
            const notificationJobId = n.jobId_c?.Id || n.jobId_c || n.jobId;
            const notificationCreatedAt = n.createdAt_c || n.createdAt || n.CreatedOn;
            return notificationJobId == jobId && 
                   new Date(notificationCreatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000); // Within 24 hours
          });
          
          if (!hasRecentNotification) {
            await notificationService.createJobMatchNotification(
              job.Id,
              job.title_c || job.title || job.Name,
              job.company_c || job.company,
              Math.round(job.matchScore)
            );
          }
        } catch (error) {
          console.error('Error creating job match notification:', error);
        }
      }

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

      // Use database field names with fallbacks
      const skills = candidate.skills_c || candidate.skills;
      const experience = candidate.experience_c || candidate.experience;
      const preferences = candidate.preferredJobTypes_c || candidate.preferredJobTypes;
      const location = candidate.location_c || candidate.location;

      const hasSkills = skills && (Array.isArray(skills) ? skills.length > 0 : skills.trim().length > 0);
      const hasExperience = experience && (Array.isArray(experience) ? experience.length > 0 : experience.trim().length > 0);
      const hasPreferences = preferences && (Array.isArray(preferences) ? preferences.length > 0 : preferences.trim().length > 0);
      const hasLocation = location && location.trim().length > 0;

      // Need at least skills and one other factor for decent recommendations
      return hasSkills && (hasExperience || hasPreferences || hasLocation);
    } catch (error) {
      console.error('Error checking profile completeness:', error);
      return false;
    }
  }
}

export const recommendationService = new RecommendationService();
export const recommendationService = new RecommendationService();