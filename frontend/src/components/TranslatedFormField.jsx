"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const TranslatedFormField = ({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  className = "",
  labelClassName = "",
  inputClassName = "",
  error,
  touched,
  children,
  ...props
}) => {
  const { t } = useTranslation();

  const getTranslatedLabel = () => {
    if (typeof label === 'string' && label.startsWith('t:')) {
      return t(label.substring(2));
    }
    return label;
  };

  const getTranslatedPlaceholder = () => {
    if (typeof placeholder === 'string' && placeholder.startsWith('t:')) {
      return t(placeholder.substring(2));
    }
    return placeholder;
  };

  const baseInputClasses = "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
  const errorClasses = error && touched ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  const finalInputClasses = `${baseInputClasses} ${errorClasses} ${inputClassName}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {getTranslatedLabel()}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          placeholder={getTranslatedPlaceholder()}
          className={`${finalInputClasses} resize-vertical min-h-[80px]`}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          className={finalInputClasses}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={getTranslatedPlaceholder()}
          className={finalInputClasses}
          {...props}
        />
      )}
      
      {error && touched && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default TranslatedFormField;
