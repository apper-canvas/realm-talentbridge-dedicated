import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { formatDistanceToNow } from "date-fns";

const ApplicationCard = ({ application, job }) => {
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    switch (status) {
      case "applied":
        return "primary";
      case "under-review":
        return "warning";
      case "interview":
        return "accent";
      case "accepted":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "applied":
        return "Send";
      case "under-review":
        return "Clock";
      case "interview":
        return "Calendar";
      case "accepted":
        return "CheckCircle";
      case "rejected":
        return "XCircle";
      default:
        return "FileText";
    }
  };

  const formatStatus = (status) => {
    return status.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const handleViewJob = () => {
    navigate(`/jobs/${job.Id}`);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {job.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <ApperIcon name="Building2" className="w-4 h-4 mr-2" />
                <span className="font-medium">{job.company}</span>
                <span className="mx-2">•</span>
                <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant={getStatusVariant(application.status)}>
              <ApperIcon name={getStatusIcon(application.status)} className="w-3 h-3 mr-1" />
              {formatStatus(application.status)}
            </Badge>
            <div className="text-sm text-gray-500">
              Applied {formatDistanceToNow(new Date(application.appliedDate), { addSuffix: true })}
            </div>
            {application.lastUpdated && application.lastUpdated !== application.appliedDate && (
              <div className="text-sm text-gray-500">
                Updated {formatDistanceToNow(new Date(application.lastUpdated), { addSuffix: true })}
              </div>
            )}
          </div>

          {application.coverLetter && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter Preview</h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {application.coverLetter}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-row lg:flex-col gap-2 lg:ml-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewJob}
            className="flex-1 lg:flex-none"
          >
            <ApperIcon name="ExternalLink" className="w-4 h-4 mr-2" />
            View Job
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationCard;