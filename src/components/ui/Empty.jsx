import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Search",
  title = "No results found",
  message = "We couldn't find what you're looking for. Try adjusting your search or filters.",
  actionLabel = "Clear Filters",
  onAction
}) => {
  return (
    <div className="min-h-[400px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center p-8">
      <div className="text-center space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-card max-w-md">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;