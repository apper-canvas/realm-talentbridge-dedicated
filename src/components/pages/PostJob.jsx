import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Card from "@/components/atoms/Card";
import { jobService } from "@/services/api/jobService";
import { toast } from "react-toastify";

const PostJob = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "full-time",
    experienceLevel: "mid",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: ""
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Job title is required";
      if (!formData.company.trim()) newErrors.company = "Company name is required";
      if (!formData.location.trim()) newErrors.location = "Location is required";
    }

    if (step === 2) {
      if (!formData.description.trim()) newErrors.description = "Job description is required";
      if (!formData.requirements.trim()) newErrors.requirements = "Requirements are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setSubmitting(true);

    try {
      const jobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        salaryRange: {
          min: formData.salaryMin ? parseInt(formData.salaryMin) : null,
          max: formData.salaryMax ? parseInt(formData.salaryMax) : null
        },
        description: formData.description.trim(),
        requirements: formData.requirements.split("\n").filter(req => req.trim()),
        responsibilities: formData.responsibilities.split("\n").filter(resp => resp.trim()),
        benefits: formData.benefits.split("\n").filter(benefit => benefit.trim()),
        applicationCount: 0
      };

      await jobService.create(jobData);
      toast.success("Job posted successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to post job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStepTitle = (step) => {
    switch (step) {
      case 1:
        return "Basic Information";
      case 2:
        return "Job Details";
      case 3:
        return "Additional Information";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Find the perfect candidate for your open position</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded ${
                      i + 1 < currentStep ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <ApperIcon name="Briefcase" className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  <p className="text-gray-600">Start with the essential details about your job opening</p>
                </div>

                <Input
                  label="Job Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  error={errors.title}
                  required
                />

                <Input
                  label="Company Name"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Your company name"
                  error={errors.company}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g. New York, NY or Remote"
                    error={errors.location}
                    required
                  />

                  <Select
                    label="Job Type"
                    value={formData.jobType}
                    onChange={(e) => handleInputChange("jobType", e.target.value)}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Select
                    label="Experience Level"
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </Select>

                  <Input
                    label="Minimum Salary ($)"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                    placeholder="50000"
                  />

                  <Input
                    label="Maximum Salary ($)"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                    placeholder="80000"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Job Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <ApperIcon name="FileText" className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
                  <p className="text-gray-600">Describe the role and what you're looking for</p>
                </div>

                <Textarea
                  label="Job Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Provide a detailed description of the role, company culture, and what makes this opportunity unique..."
                  rows={6}
                  error={errors.description}
                  required
                />

                <Textarea
                  label="Requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  placeholder="List the required skills, experience, and qualifications (one per line)..."
                  rows={6}
                  error={errors.requirements}
                  helperText="Enter each requirement on a new line"
                  required
                />

                <Textarea
                  label="Responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => handleInputChange("responsibilities", e.target.value)}
                  placeholder="Describe the key responsibilities and duties (one per line)..."
                  rows={6}
                  helperText="Enter each responsibility on a new line"
                />
              </div>
            )}

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <ApperIcon name="Star" className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
                  <p className="text-gray-600">Add benefits and perks to attract top talent</p>
                </div>

                <Textarea
                  label="Benefits & Perks"
                  value={formData.benefits}
                  onChange={(e) => handleInputChange("benefits", e.target.value)}
                  placeholder="List the benefits, perks, and compensation details (one per line)..."
                  rows={6}
                  helperText="Enter each benefit on a new line (optional but recommended)"
                />

                {/* Preview */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{formData.title || "Job Title"}</h4>
                      <p className="text-primary font-medium">{formData.company || "Company Name"}</p>
                      <p className="text-gray-600">{formData.location || "Location"} • {formData.jobType}</p>
                    </div>
                    
                    {(formData.salaryMin || formData.salaryMax) && (
                      <div className="text-lg font-semibold text-primary">
                        {formData.salaryMin && formData.salaryMax
                          ? `$${parseInt(formData.salaryMin).toLocaleString()} - $${parseInt(formData.salaryMax).toLocaleString()}`
                          : formData.salaryMin
                          ? `$${parseInt(formData.salaryMin).toLocaleString()}+`
                          : `Up to $${parseInt(formData.salaryMax).toLocaleString()}`
                        }
                      </div>
                    )}

                    <div className="text-sm text-gray-600 line-clamp-3">
                      {formData.description || "Job description will appear here..."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={currentStep === 1 ? "invisible" : ""}
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                      Post Job
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default PostJob;