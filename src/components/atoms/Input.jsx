import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error,
  label,
  helperText,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0";
  
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
      <input
        ref={ref}
        type={type}
        className={cn(baseClasses, stateClasses, className)}
        {...props}
      />
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

Input.displayName = "Input";

export default Input;