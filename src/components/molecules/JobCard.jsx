import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import { formatDistanceToNow } from "date-fns";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job.Id}`);
  };

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

  return (
    <Card hover className="p-6">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <ApperIcon name="Building2" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <ApperIcon name="MapPin" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{job.location}</span>
            </div>
          </div>
          <div className="ml-4 text-right">
            <div className="text-lg font-semibold text-primary mb-1">
              {formatSalary(job.salaryRange)}
            </div>
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={getJobTypeVariant(job.jobType)}>
            {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1).replace('-', ' ')}
          </Badge>
          <Badge variant={getExperienceVariant(job.experienceLevel)}>
            {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
          </Badge>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3 flex-1">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.requirements?.slice(0, 3).map((requirement, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {requirement}
            </span>
          ))}
          {job.requirements?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
              +{job.requirements.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="Users" className="w-4 h-4 mr-1" />
            <span>{job.applicationCount || 0} applicants</span>
          </div>
          <Button onClick={handleViewDetails} size="sm">
            View Details
            <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;