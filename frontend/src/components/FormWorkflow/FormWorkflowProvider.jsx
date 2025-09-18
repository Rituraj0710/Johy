"use client"

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const FormWorkflowContext = createContext();

export const useFormWorkflow = () => {
  const context = useContext(FormWorkflowContext);
  if (!context) {
    throw new Error('useFormWorkflow must be used within a FormWorkflowProvider');
  }
  return context;
};

export const FormWorkflowProvider = ({ children, formType }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('form');
  const [formData, setFormData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Processing your request...');

  const goToPreview = useCallback((data) => {
    setFormData(data);
    setCurrentStep('preview');
  }, []);

  const goToEdit = useCallback(() => {
    setCurrentStep('form');
  }, []);

  const goToProcessing = useCallback((message = 'Processing your request...') => {
    setProcessingMessage(message);
    setCurrentStep('processing');
    setIsProcessing(true);
  }, []);

  const goToPayment = useCallback((paymentData) => {
    setCurrentStep('payment');
    setIsProcessing(false);
  }, []);

  const resetWorkflow = useCallback(() => {
    setCurrentStep('form');
    setFormData(null);
    setIsProcessing(false);
    setProcessingMessage('Processing your request...');
  }, []);

  const submitForm = useCallback(async (endpoint, data) => {
    try {
      goToProcessing('Submitting your form...');
      
      // Actually submit to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        goToProcessing('Form submitted successfully! Redirecting to payment...');
        
        // Simulate processing delay
        setTimeout(() => {
          goToPayment({
            formId: result.data?.id || `temp-${Date.now()}`,
            amount: result.data?.amount || data.amount || 1000,
            formType: formType,
            formData: data,
            ...result.data
          });
        }, 2000);
      } else {
        // Show user-friendly error message
        const errorMessage = result.message || 'Submission failed';
        goToProcessing(`❌ ${errorMessage}. Please check your form and try again.`);
        
        // Reset to form after showing error
        setTimeout(() => {
          resetWorkflow();
        }, 4000);
        return;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      goToProcessing(`❌ Network Error: ${error.message}. Please check your connection and try again.`);
      
      // Reset to form after error
      setTimeout(() => {
        resetWorkflow();
      }, 4000);
    }
  }, [goToProcessing, goToPayment, resetWorkflow, formType]);

  const value = {
    currentStep,
    formData,
    isProcessing,
    processingMessage,
    formType,
    goToPreview,
    goToEdit,
    goToProcessing,
    goToPayment,
    resetWorkflow,
    submitForm,
  };

  return (
    <FormWorkflowContext.Provider value={value}>
      {children}
    </FormWorkflowContext.Provider>
  );
};
