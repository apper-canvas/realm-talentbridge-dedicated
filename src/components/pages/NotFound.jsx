import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl mx-auto text-center p-12">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full flex items-center justify-center">
          <ApperIcon name="Search" className="w-12 h-12 text-primary" />
        </div>
        
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track to finding your perfect placement opportunity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            size="lg"
          >
            <ApperIcon name="Home" className="w-5 h-5 mr-2" />
            Browse Jobs
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <ApperIcon name="Search" className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Search Jobs</h3>
            <p className="text-sm text-gray-600">Find opportunities that match your skills</p>
          </div>
          
          <div className="p-4">
            <ApperIcon name="User" className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Build Profile</h3>
            <p className="text-sm text-gray-600">Create your professional profile</p>
          </div>
          
          <div className="p-4">
            <ApperIcon name="FileText" className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Track Applications</h3>
            <p className="text-sm text-gray-600">Monitor your application progress</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;