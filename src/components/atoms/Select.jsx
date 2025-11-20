import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  children,
  error,
  label,
  helperText,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2.5 pr-10 border rounded-lg bg-white text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none";
  
  const stateClasses = error
    ? "border-error focus:border-error focus:ring-error/20"
    : "border-gray-300 focus:border-primary focus:ring-primary/20 hover:border-gray-400";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(baseClasses, stateClasses, className)}
          {...props}
        >
          {children}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" 
        />
      </div>
      {(error || helperText) && (
        <p className={cn(
          "mt-1 text-sm",
          error ? "text-error" : "text-gray-600"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;