import React from "react";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  className 
}) => {
  const handleFilterChange = (filterKey, value) => {
    onFilterChange({
      ...filters,
      [filterKey]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== "all");

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-primary hover:text-primary/80"
          >
            <ApperIcon name="X" className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Select
          label="Location"
          value={filters.location || "all"}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        >
          <option value="all">All Locations</option>
          <option value="remote">Remote</option>
          <option value="new-york">New York, NY</option>
          <option value="san-francisco">San Francisco, CA</option>
          <option value="los-angeles">Los Angeles, CA</option>
          <option value="chicago">Chicago, IL</option>
          <option value="austin">Austin, TX</option>
          <option value="seattle">Seattle, WA</option>
        </Select>

        <Select
          label="Job Type"
          value={filters.jobType || "all"}
          onChange={(e) => handleFilterChange("jobType", e.target.value)}
        >
          <option value="all">All Job Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
          <option value="internship">Internship</option>
        </Select>

        <Select
          label="Experience Level"
          value={filters.experienceLevel || "all"}
          onChange={(e) => handleFilterChange("experienceLevel", e.target.value)}
        >
          <option value="all">All Experience Levels</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
          <option value="executive">Executive</option>
        </Select>

        <Select
          label="Salary Range"
          value={filters.salaryRange || "all"}
          onChange={(e) => handleFilterChange("salaryRange", e.target.value)}
        >
          <option value="all">All Salary Ranges</option>
          <option value="0-50k">$0 - $50,000</option>
          <option value="50k-75k">$50,000 - $75,000</option>
          <option value="75k-100k">$75,000 - $100,000</option>
          <option value="100k-150k">$100,000 - $150,000</option>
          <option value="150k-200k">$150,000 - $200,000</option>
          <option value="200k+">$200,000+</option>
        </Select>
      </div>
    </Card>
  );
};

export default FilterPanel;