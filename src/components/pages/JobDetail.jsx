import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobService } from "@/services/api/jobService";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApplicationModal from "@/components/organisms/ApplicationModal";

// Safe date formatting utility
const safeDateFormat = (dateString) => {
  if (!dateString) return "Recently posted";
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Recently posted";
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Recently posted";
  }
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const loadJob = async () => {
    setLoading(true);
    setError("");
    try {
      const jobData = await jobService.getById(parseInt(id));
      if (!jobData) {
        setError("Job not found");
      } else {
        setJob(jobData);
      }
    } catch (err) {
      setError("Failed to load job details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  const formatSalary = (salaryRange) => {
    if (!salaryRange) return "Salary not disclosed";
    const { min, max } = salaryRange;
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return "Salary not disclosed";
  };

  const getJobTypeVariant = (jobType) => {
    switch (jobType) {
      case "full-time":
        return "primary";
      case "part-time":
        return "accent";
      case "contract":
        return "warning";
      case "freelance":
        return "success";
      default:
        return "default";
    }
  };

  const getExperienceVariant = (level) => {
    switch (level) {
      case "entry":
        return "success";
      case "mid":
        return "primary";
      case "senior":
        return "accent";
      case "executive":
        return "error";
      default:
        return "default";
    }
  };

  const handleApplicationSuccess = () => {
    // Refresh job data to update application count
    loadJob();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorView
            title="Job not found"
            message={error}
            onRetry={loadJob}
          />
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {job.title}
                </h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="Building2" className="w-5 h-5 mr-2" />
                    <span className="font-medium text-lg">{job.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
<span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ApperIcon name="Calendar" className="w-5 h-5 mr-2" />
                    <span>
                      Posted {safeDateFormat(job.postedDate)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant={getJobTypeVariant(job.jobType)} size="lg">
                    {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1).replace('-', ' ')}
                  </Badge>
                  <Badge variant={getExperienceVariant(job.experienceLevel)} size="lg">
                    {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
                  </Badge>
                </div>

                <div className="text-2xl font-bold text-primary mb-2">
                  {formatSalary(job.salaryRange)}
                </div>

                <div className="flex items-center text-gray-600">
                  <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                  <span>{job.applicationCount || 0} applications</span>
                </div>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </Card>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <ApperIcon name="Check" className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <ApperIcon name="ArrowRight" className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <Card className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Benefits & Perks
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <ApperIcon name="Star" className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card className="p-6 sticky top-24">
              <Button
                onClick={() => setShowApplicationModal(true)}
                size="lg"
                className="w-full mb-4"
              >
                <ApperIcon name="Send" className="w-5 h-5 mr-2" />
                Apply Now
              </Button>
              
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                  <span>Quick application process</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Shield" className="w-4 h-4 mr-2" />
                  <span>Your profile stays private</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Bell" className="w-4 h-4 mr-2" />
                  <span>Get status updates</span>
                </div>
              </div>
            </Card>

            {/* Share Card */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Share this job</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ApperIcon name="Link" className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" size="sm">
                  <ApperIcon name="Share2" className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-primary/20">
              <div className="flex items-start">
                <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Application Tip</h3>
                  <p className="text-sm text-gray-700">
                    Complete your profile and tailor your cover letter to this specific role to increase your chances of getting noticed.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          job={job}
          onClose={() => setShowApplicationModal(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default JobDetail;