import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import { applicationService } from "@/services/api/applicationService";
import { candidateService } from "@/services/api/candidateService";
import { toast } from "react-toastify";

const ApplicationModal = ({ job, onClose, onSuccess }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get or create candidate profile
      let candidate = await candidateService.getProfile();
      if (!candidate) {
        // Create a basic profile if none exists
        candidate = await candidateService.create({
          fullName: "Job Seeker",
          email: "jobseeker@example.com",
          phone: "",
          location: "",
          profileSummary: "",
          skills: [],
          experience: [],
          education: [],
          preferredJobTypes: []
        });
      }

      // Create application
      const applicationData = {
        candidateId: candidate.Id.toString(),
        jobId: job.Id.toString(),
        coverLetter: coverLetter.trim(),
        status: "applied"
      };

      await applicationService.create(applicationData);
      
      toast.success("Application submitted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Send" className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Apply for Position</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Job Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <ApperIcon name="Building2" className="w-4 h-4 mr-2" />
              <span className="mr-4">{job.company}</span>
              <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
              <span>{job.location}</span>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              label="Cover Letter (Optional)"
              placeholder="Tell the employer why you're the perfect fit for this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              helperText="A well-written cover letter can help your application stand out."
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <ApperIcon name="Info" className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <h4 className="font-medium text-blue-900 mb-1">Application Requirements</h4>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Your profile information will be shared with the employer</li>
                    <li>• Make sure your profile is complete for better chances</li>
                    <li>• You can track your application status in "My Applications"</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationModal;