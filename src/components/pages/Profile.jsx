import React, { useEffect, useState } from "react";
import { candidateService } from "@/services/api/candidateService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import ProfileSection from "@/components/molecules/ProfileSection";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";


const Profile = () => {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingSections, setEditingSections] = useState({});
  const [formData, setFormData] = useState({});
  const [resumeFile, setResumeFile] = useState(null);

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const profile = await candidateService.getProfile();
      if (profile) {
        setCandidate(profile);
        setFormData(profile);
      } else {
        // Create initial profile
        const initialProfile = {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          skills: [],
          experience: [],
          education: [],
          preferredJobTypes: [],
          resumeUrl: ""
        };
        setCandidate(initialProfile);
        setFormData(initialProfile);
      }
    } catch (err) {
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleEdit = (section) => {
    setEditingSections({ ...editingSections, [section]: true });
  };

  const handleCancel = (section) => {
    setEditingSections({ ...editingSections, [section]: false });
    setFormData({ ...candidate });
  };

  const handleSave = async (section) => {
    try {
      const updatedCandidate = await candidateService.update(candidate.Id || 1, formData);
      setCandidate(updatedCandidate);
      setEditingSections({ ...editingSections, [section]: false });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleArrayAdd = (field, item) => {
    if (!item.trim()) return;
    const currentArray = formData[field] || [];
    setFormData({
      ...formData,
      [field]: [...currentArray, item]
    });
  };

  const handleArrayRemove = (field, index) => {
    const currentArray = formData[field] || [];
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index)
    });
  };

  const handleExperienceAdd = (experience) => {
    const currentExperience = formData.experience || [];
    setFormData({
      ...formData,
      experience: [...currentExperience, experience]
    });
  };

  const handleExperienceRemove = (index) => {
    const currentExperience = formData.experience || [];
    setFormData({
      ...formData,
      experience: currentExperience.filter((_, i) => i !== index)
    });
  };

  const handleEducationAdd = (education) => {
    const currentEducation = formData.education || [];
    setFormData({
      ...formData,
      education: [...currentEducation, education]
    });
  };

  const handleEducationRemove = (index) => {
    const currentEducation = formData.education || [];
    setFormData({
      ...formData,
      education: currentEducation.filter((_, i) => i !== index)
    });
  };

  const handleResumeUpload = async (file) => {
    if (file) {
      // Simulate file upload and resume parsing
      const resumeUrl = `uploads/${file.name}`;
      
      // Simulate resume parsing with auto-population
      const parsedData = {
        resumeUrl,
        fullName: formData.fullName || "John Doe", // Would be extracted from resume
        email: formData.email || "john.doe@email.com", // Would be extracted from resume
        phone: formData.phone || "+1 (555) 123-4567", // Would be extracted from resume
        location: formData.location || "New York, NY", // Would be extracted from resume
        skills: formData.skills.length > 0 ? formData.skills : ["JavaScript", "React", "Node.js"], // Would be extracted from resume
        experience: formData.experience.length > 0 ? formData.experience : [
          {
            company: "Tech Corp",
            position: "Software Developer",
            duration: "2020 - 2023",
            description: "Developed web applications using React and Node.js"
          }
        ],
        education: formData.education.length > 0 ? formData.education : [
          {
            institution: "University of Technology",
            degree: "Bachelor of Computer Science",
            year: "2020",
            gpa: "3.8"
          }
        ]
      };
      
      setFormData({ ...formData, ...parsedData });
      toast.success("Resume uploaded and profile auto-populated!");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorView
            title="Unable to load profile"
            message={error}
            onRetry={loadProfile}
          />
        </div>
      </div>
    );
  }

  const profileCompleteness = () => {
    if (!candidate) return 0;
    let completed = 0;
    let total = 8;

    if (candidate.fullName) completed++;
    if (candidate.email) completed++;
    if (candidate.phone) completed++;
    if (candidate.location) completed++;
    if (candidate.profileSummary) completed++;
    if (candidate.skills && candidate.skills.length > 0) completed++;
    if (candidate.experience && candidate.experience.length > 0) completed++;
    if (candidate.education && candidate.education.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
            <div className="flex flex-col items-center gap-2">
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompleteness()}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {profileCompleteness()}% Complete
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {/* Personal Information */}
            <ProfileSection
              title="Personal Information"
              icon="User"
              isEditing={editingSections.personal}
              onEdit={() => handleEdit("personal")}
              onSave={() => handleSave("personal")}
              onCancel={() => handleCancel("personal")}
            >
              {editingSections.personal ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={formData.fullName || ""}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                  <Input
                    label="Phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  <Input
                    label="Location"
                    value={formData.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900 mt-1">{candidate?.fullName || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900 mt-1">{candidate?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900 mt-1">{candidate?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900 mt-1">{candidate?.location || "Not provided"}</p>
                  </div>
                </div>
              )}
            </ProfileSection>

            {/* Resume Upload */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="FileText" className="w-5 h-5 mr-2 text-primary" />
                  Resume & Auto-Population
                </h3>
                
                {formData?.resumeUrl ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <ApperIcon name="File" className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-green-900">Resume uploaded & parsed</p>
                        <p className="text-sm text-green-700">{formData.resumeUrl}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ApperIcon name="Upload" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your resume</h3>
                    <p className="text-gray-600 mb-4">PDF files only, max 10MB. We'll automatically populate your profile!</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleResumeUpload(e.target.files[0])}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload">
                      <Button as="span" className="cursor-pointer">
                        <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </Card>

            {/* Profile Summary */}
            <ProfileSection
              title="Profile Summary"
              icon="FileText"
              isEditing={editingSections.summary}
              onEdit={() => handleEdit("summary")}
              onSave={() => handleSave("summary")}
              onCancel={() => handleCancel("summary")}
            >
              {editingSections.summary ? (
                <Textarea
                  label="About You"
                  value={formData.profileSummary || ""}
                  onChange={(e) => handleInputChange("profileSummary", e.target.value)}
                  placeholder="Write a brief summary about yourself, your experience, and career goals..."
                  rows={6}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {candidate?.profileSummary || "No profile summary added yet."}
                </p>
              )}
            </ProfileSection>

            {/* Skills */}
            <ProfileSection
              title="Skills"
              icon="Award"
              isEditing={editingSections.skills}
              onEdit={() => handleEdit("skills")}
              onSave={() => handleSave("skills")}
              onCancel={() => handleCancel("skills")}
            >
              {editingSections.skills ? (
                <SkillsEditor
                  skills={formData.skills || []}
                  onAdd={(skill) => handleArrayAdd("skills", skill)}
                  onRemove={(index) => handleArrayRemove("skills", index)}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {candidate?.skills && candidate.skills.length > 0 ? (
                    candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills added yet.</p>
                  )}
                </div>
              )}
            </ProfileSection>

            {/* Experience */}
            <ProfileSection
              title="Work Experience"
              icon="Briefcase"
              isEditing={editingSections.experience}
              onEdit={() => handleEdit("experience")}
              onSave={() => handleSave("experience")}
              onCancel={() => handleCancel("experience")}
            >
              {editingSections.experience ? (
                <ExperienceEditor
                  experience={formData.experience || []}
                  onAdd={handleExperienceAdd}
                  onRemove={handleExperienceRemove}
                />
              ) : (
                <div className="space-y-6">
                  {candidate?.experience && candidate.experience.length > 0 ? (
                    candidate.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                        <p className="text-primary font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700">{exp.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No work experience added yet.</p>
                  )}
                </div>
              )}
            </ProfileSection>

            {/* Education */}
            <ProfileSection
              title="Education"
              icon="GraduationCap"
              isEditing={editingSections.education}
              onEdit={() => handleEdit("education")}
              onSave={() => handleSave("education")}
              onCancel={() => handleCancel("education")}
            >
              {editingSections.education ? (
                <EducationEditor
                  education={formData.education || []}
                  onAdd={handleEducationAdd}
                  onRemove={handleEducationRemove}
                />
              ) : (
                <div className="space-y-4">
                  {candidate?.education && candidate.education.length > 0 ? (
                    candidate.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-primary font-medium">{edu.institution}</p>
                        <p className="text-sm text-gray-600">
                          {edu.field} • {edu.graduationYear}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No education information added yet.</p>
                  )}
                </div>
              )}
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skills Editor Component
const SkillsEditor = ({ skills, onAdd, onRemove }) => {
  const [newSkill, setNewSkill] = useState("");

  const handleAdd = () => {
    if (newSkill.trim()) {
      onAdd(newSkill.trim());
      setNewSkill("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a skill"
          className="flex-1"
        />
        <Button onClick={handleAdd} disabled={!newSkill.trim()}>
          <ApperIcon name="Plus" className="w-4 h-4" />
        </Button>
      </div>
<div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="flex items-center">
            {skill}
            <button
              type="button"
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => onRemove(index)}
            >
              <ApperIcon name="X" className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

// Experience Editor Component
const ExperienceEditor = ({ experience, onAdd, onRemove }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.company && formData.position && formData.startDate) {
      onAdd(formData);
      setFormData({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
      });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {experience.map((exp, index) => (
<div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{exp.position}</h4>
            <p className="text-primary font-medium">{exp.company}</p>
            <p className="text-sm text-gray-600 mb-2">
              {exp.startDate} - {exp.current ? "Present" : exp.endDate}
            </p>
            {exp.description && (
              <p className="text-gray-700 text-sm">{exp.description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-error hover:text-error hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
            <Input
              label="Position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
            <Input
              label="Start Date"
              type="month"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            {!formData.current && (
              <Input
                label="End Date"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="current"
              checked={formData.current}
              onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="current" className="text-sm text-gray-700">I currently work here</label>
          </div>
          <Textarea
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your role and achievements..."
            rows={3}
          />
          <div className="flex gap-2">
            <Button type="submit">Add Experience</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      )}
    </div>
  );
};

// Education Editor Component
const EducationEditor = ({ education, onAdd, onRemove }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
    graduationYear: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.institution && formData.degree && formData.field) {
      onAdd(formData);
      setFormData({
        institution: "",
        degree: "",
        field: "",
        graduationYear: ""
      });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
<div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
            <p className="text-primary font-medium">{edu.institution}</p>
            <p className="text-sm text-gray-600">
              {edu.field} • {edu.graduationYear}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-error hover:text-error hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Institution"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
            />
            <Input
              label="Degree"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              required
            />
            <Input
              label="Field of Study"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              required
            />
            <Input
              label="Graduation Year"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Add Education</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      )}
    </div>
  );
};

export default Profile;