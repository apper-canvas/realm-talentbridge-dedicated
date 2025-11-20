import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-card">
        <div className="relative">
          <div className="w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
        </div>
        <div className="space-y-2">
<h3 className="text-xl font-semibold text-gray-900">Loading Placement Services</h3>
          <p className="text-gray-600">Connecting opportunities...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;