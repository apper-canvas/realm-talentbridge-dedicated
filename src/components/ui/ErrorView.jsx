import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ 
  title = "Something went wrong",
  message = "We encountered an error loading this content. Please try again.",
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="min-h-[400px] bg-gradient-to-br from-red-50 to-pink-50 rounded-xl flex items-center justify-center p-8">
      <div className="text-center space-y-6 bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-card max-w-md">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-red-700"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorView;