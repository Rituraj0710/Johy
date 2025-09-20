"use client";

import React from "react";
import LanguageSelectorDropdown from "./LanguageSelectorDropdown";

const ResponsiveFormWrapper = ({ 
  children, 
  title, 
  showLanguageSelector = true,
  className = "" 
}) => {
  return (
    <div className={`w-full min-h-screen bg-gray-50 py-4 ${className}`}>
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          {/* Language Selector */}
          {showLanguageSelector && (
            <div className="flex justify-end mb-4">
              <LanguageSelectorDropdown />
            </div>
          )}
          
          {/* Form Title */}
          {title && (
            <h1 className="text-xl lg:text-2xl font-bold text-center mb-6 text-gray-800 border-b-2 border-blue-500 pb-3">
              {title}
            </h1>
          )}

          {/* Form Content */}
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveFormWrapper;
