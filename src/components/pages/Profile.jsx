import React, { useEffect, useState } from "react";
import { candidateService } from "@/services/api/candidateService";
import { toast } from "react-toastify";
import ApperFileFieldComponent from "@/components/atoms/FileUploader";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ProfileSection from "@/components/molecules/ProfileSection";

const Profile = () => {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSections, setEditingSections] = useState({});
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeFiles, setResumeFiles] = useState([]);
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
fullName_c: "",
          email_c: "",
          phone_c: "",
          location_c: "",
          skills_c: "",
          experience_c: "",
          education_c: "",
          preferredJobTypes_c: "",
          resumeUrl_c: []
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
// Get files from file uploader if resume section is being edited
      if (editingSections.resume && window.ApperSDK?.ApperFileUploader) {
        try {
          const files = await window.ApperSDK.ApperFileUploader.FileField.getFiles('resumeUrl_c');
          if (files && files.length > 0) {
            formData.resumeUrl_c = files;
          }
        } catch (fileError) {
          console.error('Error getting files:', fileError);
        }
      }

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
      // Store the actual file for download functionality
      setResumeFiles([file]);
      
      // Simulate file upload and resume parsing
      const resumeUrl = `uploads/${file.name}`;
      
      // Simulate resume parsing with auto-population
      const parsedData = {
        resumeUrl,
        fullName: formData.fullName || "John Doe", // Would be extracted from resume
        email: formData.email || "john.doe@email.com", // Would be extracted from resume
        phone: formData.phone || "+1 (555) 123-4567", // Would be extracted from resume
        location: formData.location || "New York, NY", // Would be extracted from resume
        skills: formData.skills?.length > 0 ? formData.skills : ["JavaScript", "React", "Node.js"], // Would be extracted from resume
        experience: formData.experience?.length > 0 ? formData.experience : [
          {
            company: "Tech Corp",
            position: "Software Developer",
            duration: "2020 - 2023",
            description: "Developed web applications using React and Node.js"
          }
        ],
        education: formData.education?.length > 0 ? formData.education : [
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

const handleResumeDownload = () => {
    try {
      if (resumeFiles && resumeFiles.length > 0) {
        // Create blob URL and trigger download for uploaded file
        const file = resumeFiles[0];
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Resume downloaded successfully!");
      } else if (formData?.resumeUrl) {
        // Fallback for existing resume URL
        const link = document.createElement('a');
        link.href = formData.resumeUrl;
        link.download = formData.resumeUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Resume downloaded successfully!");
      } else {
        toast.error("No resume available for download");
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download resume. Please try again.");
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

if (candidate.fullName_c || candidate.fullName) completed++;
    if (candidate.email_c || candidate.email) completed++;
    if (candidate.phone_c || candidate.phone) completed++;
    if (candidate.location_c || candidate.location) completed++;
    if (candidate.profileSummary_c || candidate.profileSummary) completed++;
    
    const skills = candidate.skills_c || candidate.skills;
    if (skills && (Array.isArray(skills) ? skills.length > 0 : skills.trim().length > 0)) completed++;
    
    const experience = candidate.experience_c || candidate.experience;
    if (experience && (Array.isArray(experience) ? experience.length > 0 : experience.trim().length > 0)) completed++;
    
    const education = candidate.education_c || candidate.education;
    if (education && (Array.isArray(education) ? education.length > 0 : education.trim().length > 0)) completed++;

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
                    value={formData.fullName_c || formData.fullName || ""}
                    onChange={(e) => handleInputChange("fullName_c", e.target.value)}
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email_c || formData.email || ""}
                    onChange={(e) => handleInputChange("email_c", e.target.value)}
                    placeholder="Enter your email"
                  />
                  <Input
                    label="Phone"
                    value={formData.phone_c || formData.phone || ""}
                    onChange={(e) => handleInputChange("phone_c", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  <Input
                    label="Location"
                    value={formData.location_c || formData.location || ""}
                    onChange={(e) => handleInputChange("location_c", e.target.value)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900 mt-1">{candidate?.fullName_c || candidate?.fullName || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900 mt-1">{candidate?.email_c || candidate?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900 mt-1">{candidate?.phone_c || candidate?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900 mt-1">{candidate?.location_c || candidate?.location || "Not provided"}</p>
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
                
                <ApperFileFieldComponent
                  elementId="resumeUrl_c"
                  config={{
                    fieldName: 'resumeUrl_c',
                    fieldKey: 'resumeUrl_c',
                    tableName: 'candidates_c',
                    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
                    existingFiles: candidate?.resumeUrl_c || [],
                    fileCount: Array.isArray(candidate?.resumeUrl_c) ? candidate.resumeUrl_c.length : 0
                  }}
                />
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
                  value={formData.profileSummary_c || formData.profileSummary || ""}
                  onChange={(e) => handleInputChange("profileSummary_c", e.target.value)}
                  placeholder="Write a brief summary about yourself, your experience, and career goals..."
                  rows={6}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {candidate?.profileSummary_c || candidate?.profileSummary || "No profile summary added yet."}
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
                  skills={(() => {
                    const skills = formData.skills_c || formData.skills;
                    if (typeof skills === 'string') {
                      return skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
                    }
                    return Array.isArray(skills) ? skills : [];
                  })()}
                  onAdd={(skill) => {
                    const currentSkills = (() => {
                      const skills = formData.skills_c || formData.skills;
                      if (typeof skills === 'string') {
                        return skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
                      }
                      return Array.isArray(skills) ? skills : [];
                    })();
                    const newSkills = [...currentSkills, skill];
                    handleInputChange("skills_c", newSkills.join(","));
                  }}
                  onRemove={(index) => {
                    const currentSkills = (() => {
                      const skills = formData.skills_c || formData.skills;
                      if (typeof skills === 'string') {
                        return skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
                      }
                      return Array.isArray(skills) ? skills : [];
                    })();
                    const newSkills = currentSkills.filter((_, i) => i !== index);
                    handleInputChange("skills_c", newSkills.join(","));
                  }}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const skills = candidate?.skills_c || candidate?.skills;
                    if (typeof skills === 'string') {
                      const skillArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
                      return skillArray.length > 0 ? skillArray.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      )) : <p className="text-gray-500">No skills added yet.</p>;
                    } else if (Array.isArray(skills) && skills.length > 0) {
                      return skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ));
                    } else {
                      return <p className="text-gray-500">No skills added yet.</p>;
                    }
                  })()}
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
                <Textarea
                  label="Work Experience"
                  value={formData.experience_c || formData.experience || ""}
                  onChange={(e) => handleInputChange("experience_c", e.target.value)}
                  placeholder="Enter your work experience (one per line)..."
                  rows={6}
                />
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const experience = candidate?.experience_c || candidate?.experience;
                    if (experience && experience.trim().length > 0) {
                      const experienceLines = experience.split('\n').filter(line => line.trim().length > 0);
                      return experienceLines.map((exp, index) => (
                        <div key={index} className="border-l-4 border-primary pl-4">
                          <p className="text-gray-700">{exp}</p>
                        </div>
                      ));
                    } else {
                      return <p className="text-gray-500">No experience added yet.</p>;
                    }
                  })()}
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
                <Textarea
                  label="Education"
                  value={formData.education_c || formData.education || ""}
                  onChange={(e) => handleInputChange("education_c", e.target.value)}
                  placeholder="Enter your education (one per line)..."
                  rows={6}
                />
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const education = candidate?.education_c || candidate?.education;
                    if (education && education.trim().length > 0) {
                      const educationLines = education.split('\n').filter(line => line.trim().length > 0);
                      return educationLines.map((edu, index) => (
                        <div key={index} className="border-l-4 border-primary pl-4">
                          <p className="text-gray-700">{edu}</p>
                        </div>
                      ));
                    } else {
                      return <p className="text-gray-500">No education added yet.</p>;
                    }
                  })()}
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