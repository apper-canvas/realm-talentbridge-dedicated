import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const ProfileSection = ({ 
  title, 
  icon, 
  children, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel,
  className 
}) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {icon && (
            <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name={icon} className="w-5 h-5 text-primary" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        {!isEditing && onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
        
        {isEditing && (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={onSave}>
              <ApperIcon name="Check" className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>
      
      {children}
    </Card>
  );
};

export default ProfileSection;