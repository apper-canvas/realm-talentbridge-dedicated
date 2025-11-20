import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { savedJobService } from "@/services/api/savedJobService";
import { jobService } from "@/services/api/jobService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FilterPanel from "@/components/molecules/FilterPanel";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import JobList from "@/components/organisms/JobList";
const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadSavedJobs();
  }, []);
const loadSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get saved job IDs
      const savedJobIds = await savedJobService.getAll();
      
      if (savedJobIds.length === 0) {
        setSavedJobs([]);
        setAllJobs([]);
        setLoading(false);
        return;
      }

      // Get all jobs and filter to saved ones
      const jobs = await jobService.getAll();
      const savedJobsData = jobs.filter(job => savedJobIds.includes(job.Id));
      
      setSavedJobs(savedJobsData);
      setAllJobs(savedJobsData);
    } catch (err) {
      setError("Failed to load saved jobs. Please try again.");
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

const handleRemoveFromSaved = async (jobId) => {
    try {
      await savedJobService.unsave(jobId);
      setSavedJobs(prev => prev.filter(job => job.Id !== jobId));
      setAllJobs(prev => prev.filter(job => job.Id !== jobId));
      toast.success("Job removed from saved jobs");
    } catch (err) {
      toast.error("Failed to remove job from saved jobs");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
};

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadSavedJobs} />;

if (savedJobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <ApperIcon name="Bookmark" className="text-primary" size={32} />
            Saved Jobs
          </h1>
          <p className="text-gray-600">Jobs you've bookmarked for later review</p>
        </div>
        
        <Empty 
          title="No Saved Jobs Yet"
          description="Start saving jobs you're interested in to build your collection"
          actionLabel="Browse Jobs"
          actionPath="/"
          icon="Bookmark"
        />
      </div>
    );
  }
return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ApperIcon name="Bookmark" className="text-primary" size={32} />
          Saved Jobs ({savedJobs.length})
        </h1>
        <p className="text-gray-600">Jobs you've bookmarked for later review</p>
      </div>

      <JobList 
        jobs={allJobs}
        searchTerm={searchQuery}
        filters={filters}
        savedJobs={true}
        onRemoveFromSaved={handleRemoveFromSaved}
      />
    </div>
  );
};
export default SavedJobs;