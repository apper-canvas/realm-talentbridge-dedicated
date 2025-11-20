import React, { useEffect, useState } from "react";
import { jobService } from "@/services/api/jobService";
import { savedJobService } from "@/services/api/savedJobService";
import ApperIcon from "@/components/ApperIcon";
import JobCard from "@/components/molecules/JobCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";

const JobList = ({ searchTerm, filters, onRemoveFromSaved, savedJobs }) => {
const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const jobsPerPage = 9;

  const loadJobs = async () => {
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
    loadJobs();
  }, []);

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
  }, [jobs, searchTerm, filters]);

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

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

  if (filteredJobs.length === 0 && jobs.length > 0) {
    return (
      <Empty
        icon="Search"
        title="No jobs found"
        message="We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms."
        actionLabel="Clear Filters"
        onAction={() => window.location.reload()}
      />
    );
  }

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
          Showing {((currentPage - 1) * jobsPerPage) + 1}-{Math.min(currentPage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
        </div>
        {(searchTerm || Object.values(filters).some(f => f && f !== "all")) && (
          <div className="text-sm text-gray-600">
            {searchTerm && (
              <span>Search: "{searchTerm}" </span>
            )}
            {Object.values(filters).some(f => f && f !== "all") && (
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
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobList;