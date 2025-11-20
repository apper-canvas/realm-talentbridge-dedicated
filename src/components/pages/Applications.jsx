import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApplicationCard from "@/components/molecules/ApplicationCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { applicationService } from "@/services/api/applicationService";
import { jobService } from "@/services/api/jobService";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const [applicationsData, jobsData] = await Promise.all([
        applicationService.getAll(),
        jobService.getAll()
      ]);
      
      setApplications(applicationsData);
      setJobs(jobsData);
    } catch (err) {
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    let filtered = [...applications];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    
    setFilteredApplications(filtered);
  }, [applications, statusFilter]);

  const getJobById = (jobId) => {
    return jobs.find(job => job.Id.toString() === jobId.toString());
  };

  const getStatusCounts = () => {
    return {
      all: applications.length,
      applied: applications.filter(app => app.status === "applied").length,
      "under-review": applications.filter(app => app.status === "under-review").length,
      interview: applications.filter(app => app.status === "interview").length,
      accepted: applications.filter(app => app.status === "accepted").length,
      rejected: applications.filter(app => app.status === "rejected").length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorView
            title="Unable to load applications"
            message={error}
            onRetry={loadApplications}
          />
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600">Track your job applications and their status</p>
          </div>
          
          <Empty
            icon="FileText"
            title="No applications yet"
            message="You haven't applied to any jobs yet. Start exploring opportunities and submit your first application!"
            actionLabel="Browse Jobs"
            onAction={() => window.location.href = "/"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
              <p className="text-gray-600">Track your job applications and their status</p>
            </div>
            <Button onClick={() => window.location.href = "/"} variant="outline">
              <ApperIcon name="Search" className="w-4 h-4 mr-2" />
              Browse More Jobs
            </Button>
          </div>

          {/* Status Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-card border-l-4 border-primary">
              <div className="text-2xl font-bold text-primary">{statusCounts.all}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-card border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.applied}</div>
              <div className="text-sm text-gray-600">Applied</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-card border-l-4 border-warning">
              <div className="text-2xl font-bold text-warning">{statusCounts["under-review"]}</div>
              <div className="text-sm text-gray-600">Under Review</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-card border-l-4 border-accent">
              <div className="text-2xl font-bold text-accent">{statusCounts.interview}</div>
              <div className="text-sm text-gray-600">Interview</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-card border-l-4 border-success">
              <div className="text-2xl font-bold text-success">{statusCounts.accepted}</div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-card border-l-4 border-error">
              <div className="text-2xl font-bold text-error">{statusCounts.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-48"
              >
                <option value="all">All Applications ({statusCounts.all})</option>
                <option value="applied">Applied ({statusCounts.applied})</option>
                <option value="under-review">Under Review ({statusCounts["under-review"]})</option>
                <option value="interview">Interview ({statusCounts.interview})</option>
                <option value="accepted">Accepted ({statusCounts.accepted})</option>
                <option value="rejected">Rejected ({statusCounts.rejected})</option>
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredApplications.length} of {applications.length} applications
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Empty
            icon="Filter"
            title="No applications found"
            message="No applications match the selected filter. Try changing the filter to see more results."
            actionLabel="Clear Filter"
            onAction={() => setStatusFilter("all")}
          />
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => {
              const job = getJobById(application.jobId);
              return job ? (
                <ApplicationCard 
                  key={application.Id} 
                  application={application} 
                  job={job} 
                />
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;