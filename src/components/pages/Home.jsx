import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { recommendationService } from "@/services/api/recommendationService";
import ApperIcon from "@/components/ApperIcon";
import FilterPanel from "@/components/molecules/FilterPanel";
import SearchBar from "@/components/molecules/SearchBar";
import Profile from "@/components/pages/Profile";
import JobList from "@/components/organisms/JobList";
import Button from "@/components/atoms/Button";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experienceLevel: "",
    salaryRange: ""
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
// Load personalized recommendations
  const loadRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const [recs, isComplete] = await Promise.all([
        recommendationService.getRecommendations(6),
        recommendationService.isProfileCompleteForRecommendations()
      ]);
      setRecommendations(recs);
      setProfileComplete(isComplete);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      location: "",
      jobType: "",
      experienceLevel: "",
      salaryRange: ""
    });
    setSearchTerm("");
  };

return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary via-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
              Find Your Perfect Job
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Connect with top employers and discover opportunities that match your skills and aspirations
              Connect with top employers and discover opportunities that match your skills and aspirations
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">1000+</div>
              <div className="text-sm text-blue-100">Active Jobs</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">500+</div>
              <div className="text-sm text-blue-100">Companies</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">5000+</div>
              <div className="text-sm text-blue-100">Job Seekers</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold mb-1">95%</div>
              <div className="text-sm text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Filter Panel */}
            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-1 min-w-0">
{/* Recommendations Section */}
            {(recommendations.length > 0 || !profileComplete) && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ApperIcon name="Target" className="w-6 h-6 mr-2 text-primary" />
                    Jobs Recommended for You
                  </h2>
                  {profileComplete && recommendations.length > 0 && (
                    <button 
                      onClick={loadRecommendations}
                      className="text-primary hover:text-orange-600 text-sm font-medium flex items-center"
                    >
                      <ApperIcon name="RefreshCw" className="w-4 h-4 mr-1" />
                      Refresh
                    </button>
                  )}
                </div>

                {!profileComplete ? (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6 text-center">
                    <ApperIcon name="User" className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">Complete Your Profile for Better Recommendations</h3>
                    <p className="text-orange-700 mb-4">
                      Add your skills, experience, and preferences to get personalized job recommendations that match your career goals.
                    </p>
                    <button 
                      onClick={() => navigate('/profile')}
                      className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Complete Profile
                    </button>
                  </div>
                ) : (
                  <div>
                    {loadingRecommendations ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-20 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    ) : recommendations.length > 0 ? (
                      <JobList jobs={recommendations} isRecommendationMode={true} />
                    ) : (
                      <div className="text-center py-12">
                        <ApperIcon name="Target" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Available</h3>
                        <p className="text-gray-600">
                          Update your profile with more skills and preferences to get better job recommendations.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* All Jobs Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ApperIcon name="Briefcase" className="w-6 h-6 mr-2 text-primary" />
                All Available Jobs
              </h2>
              <JobList searchTerm={searchTerm} filters={filters} />
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Create your profile and start applying to jobs that match your career goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
<Button
              size="lg"
              onClick={() => navigate("/profile")}
              className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <ApperIcon name="User" className="mr-2" size={20} />
              Complete Your Profile
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/post-job")}
              className="border-white text-white hover:bg-white hover:text-gray-900"
            >
              <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
              Post a Job
            </Button>
          </div>
        </div>
      </div>
</>
  );
};

export default Home;