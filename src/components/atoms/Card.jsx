import React from "react";
import { cn } from "@/utils/cn";

const Card = ({ 
  children, 
  className,
  hover = false,
  ...props 
}) => {
  const baseClasses = "bg-white rounded-lg border border-gray-200 shadow-card";
  const hoverClasses = hover ? "transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer" : "";

  return (
    <div 
      className={cn(baseClasses, hoverClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;