import React, { useEffect, useState } from "react";
import { jobService } from "@/services/api/jobService";
import { savedJobService } from "@/services/api/savedJobService";
import ApperIcon from "@/components/ApperIcon";
import JobCard from "@/components/molecules/JobCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const JobList = ({ searchTerm, filters, onRemoveFromSaved, savedJobs, jobs: propJobs, isRecommendationMode = false }) => {
const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = isRecommendationMode ? 6 : 9;
const [savedJobIds, setSavedJobIds] = useState([]);

const loadJobs = async () => {
    if (isRecommendationMode) return; // Don't load when in recommendation mode
    setLoading(true);
    setError("");
    try {
      const jobData = await jobService.getAll();
      setJobs(jobData);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async (jobId) => {
    try {
      if (savedJobIds.includes(jobId)) {
        await savedJobService.unsave(jobId);
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
      } else {
        await savedJobService.save(jobId);
        setSavedJobIds(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error('Failed to toggle saved job:', error);
    }
  };

useEffect(() => {
    if (!savedJobs && !propJobs) {
      loadJobs();
    } else if (propJobs) {
      setJobs(propJobs);
    }
  }, [savedJobs, propJobs, isRecommendationMode]);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const savedJobIds = await savedJobService.getAll();
        setSavedJobIds(savedJobIds);
      } catch (error) {
        console.error('Failed to load saved jobs:', error);
      }
    };
    
loadSavedJobs();
  }, []);

useEffect(() => {
    let filtered = [...jobs];

    // Skip filtering in recommendation mode
    if (isRecommendationMode) {
      setFilteredJobs(filtered);
      return;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements?.some(req => 
          req.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply location filter
    if (filters.location && filters.location !== "all") {
      if (filters.location === "remote") {
        filtered = filtered.filter(job => 
          job.location.toLowerCase().includes("remote")
        );
      } else {
        const locationMap = {
          "new-york": "New York",
          "san-francisco": "San Francisco",
          "los-angeles": "Los Angeles",
          "chicago": "Chicago",
          "austin": "Austin",
          "seattle": "Seattle"
        };
        const locationName = locationMap[filters.location];
        if (locationName) {
          filtered = filtered.filter(job => 
            job.location.toLowerCase().includes(locationName.toLowerCase())
          );
        }
      }
    }

    // Apply job type filter
    if (filters.jobType && filters.jobType !== "all") {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    // Apply experience level filter
    if (filters.experienceLevel && filters.experienceLevel !== "all") {
      filtered = filtered.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    // Apply salary range filter
    if (filters.salaryRange && filters.salaryRange !== "all") {
      filtered = filtered.filter(job => {
        if (!job.salaryRange || !job.salaryRange.min) return false;
        
        const salary = job.salaryRange.min;
        switch (filters.salaryRange) {
          case "0-50k":
            return salary >= 0 && salary <= 50000;
          case "50k-75k":
            return salary > 50000 && salary <= 75000;
          case "75k-100k":
            return salary > 75000 && salary <= 100000;
          case "100k-150k":
            return salary > 100000 && salary <= 150000;
          case "150k-200k":
            return salary > 150000 && salary <= 200000;
          case "200k+":
            return salary > 200000;
          default:
            return true;
        }
      });
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, searchTerm, filters, isRecommendationMode]);

// Calculate pagination
const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
const paginatedJobs = filteredJobs.slice(
(currentPage - 1) * itemsPerPage,
currentPage * itemsPerPage
);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

if (loading) {
return <Loading />;
}

if (error) {
return (
<ErrorView
title="Unable to load jobs"
message={error}
onRetry={loadJobs}
/>
);
}

  if (filteredJobs.length === 0 && jobs.length > 0 && !isRecommendationMode) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600">We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  const displayJobs = isRecommendationMode ? filteredJobs : paginatedJobs;

  return (
    <div className="space-y-6">
      {/* Job Cards Grid */}
      <div className={`grid gap-6 ${isRecommendationMode ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {displayJobs.map(job => (
          <div key={job.Id}>
            {isRecommendationMode ? (
              <RecommendationJobCard 
                job={job}
                onSaveToggle={() => {}}
                isSaved={false}
              />
            ) : (
              <JobCard 
                job={job}
                onSaveToggle={() => {}}
                isSaved={false}
              />
            )}
          </div>
        ))}
      </div>

      {/* Pagination for non-recommendation mode */}
      {!isRecommendationMode && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg ${
                currentPage === page 
                  ? 'bg-primary text-white' 
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Recommendation-specific job card component
const RecommendationJobCard = ({ job, onSaveToggle, isSaved }) => {

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange) return 'Salary not specified';
    if (salaryRange.min && salaryRange.max) {
      return `$${(salaryRange.min / 1000)}k - $${(salaryRange.max / 1000)}k`;
    }
    if (salaryRange.min) {
      return `$${salaryRange.min}/hr`;
    }
    return 'Salary not specified';
  };

  return (
    <Card hover className="h-full">
      <div className="p-6 flex flex-col h-full">
        {/* Match Score Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getMatchScoreColor(job.matchScore)}`}>
            {job.matchScore}% Match
          </div>
          <ApperIcon 
            name={isSaved ? "Heart" : "Heart"} 
            className={`w-5 h-5 cursor-pointer ${isSaved ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`}
            onClick={() => onSaveToggle(job.Id)}
          />
        </div>

        {/* Job Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {job.title}
          </h3>
          <p className="text-primary font-medium mb-2">{job.company}</p>
          <p className="text-sm text-gray-600 mb-4 flex items-center">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            {job.location}
          </p>

          {/* Recommendation Reason */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-start">
              <ApperIcon name="Target" className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>Recommended because: {job.recommendationReason}</span>
            </p>
          </div>

          {/* Job Details */}
          <div className="space-y-2 mb-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {job.jobType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {job.experienceLevel}
              </Badge>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {formatSalary(job.salaryRange)}
            </p>
          </div>

          {/* Job Description Preview */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {job.description}
          </p>
        </div>

{/* Action Button */}
<Button
onClick={() => window.open(`/jobs/${job.Id}`, '_blank')}
className="w-full"
>
View Details
<ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
</Button>
</div>
</Card>
);
};

if (filteredJobs.length === 0) {
return (
<Empty
icon="Briefcase"
title="No jobs available"
message="There are currently no job listings available. Please check back later."
/>
);
}

return (
<div className="space-y-6">
{/* Results Header */}
<div className="flex items-center justify-between">
<div className="text-sm text-gray-600">
Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
</div>
{(searchTerm || Object.values(filters || {}).some(f => f && f !== "all")) && (
<div className="text-sm text-gray-600">
{searchTerm && (
<span>Search: "{searchTerm}" </span>
)}
{Object.values(filters || {}).some(f => f && f !== "all") && (
<span>• Filters applied</span>
)}
</div>
)}
</div>

{/* Job Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
{paginatedJobs.map((job) => (
<JobCard 
key={job.Id} 
job={job} 
isSaved={savedJobIds.includes(job.Id)}
onSaveToggle={handleSaveToggle}
onRemoveFromSaved={onRemoveFromSaved}
showRemoveButton={savedJobs}
/>
))}
</div>

{/* Pagination */}
{totalPages > 1 && (
<div className="flex items-center justify-center space-x-2 pt-8">
<Button
variant="outline"
size="sm"
onClick={() => handlePageChange(currentPage - 1)}
disabled={currentPage === 1}
>
<ApperIcon name="ChevronLeft" className="w-4 h-4" />
</Button>

{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
if (
page === 1 ||
page === totalPages ||
(page >= currentPage - 1 && page <= currentPage + 1)
) {
return (
<Button
key={page}
variant={currentPage === page ? "primary" : "outline"}
size="sm"
onClick={() => handlePageChange(page)}
>
{page}
</Button>
);
} else if (page === currentPage - 2 || page === currentPage + 2) {
return <span key={page} className="px-2 text-gray-500">...</span>;
}
return null;
})}

<Button
variant="outline"
size="sm"
onClick={() => handlePageChange(currentPage + 1)}
disabled={currentPage === totalPages}
>
<ApperIcon name="ArrowRight" className="w-4 h-4" />
</Button>
</div>
)}
</div>
);
};

export default JobList;