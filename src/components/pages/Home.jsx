import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [showFilters, setShowFilters] = useState(false);

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
            <JobList searchTerm={searchTerm} filters={filters} />
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