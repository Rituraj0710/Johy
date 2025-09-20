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
      goToProcessing('Validating your form...');
      
      // Validate form data before submission
      if (!data) {
        throw new Error('No form data provided');
      }

      // Basic validation based on form type
      switch (formType) {
        case 'trust-deed':
          if (!data.trustees || data.trustees.length === 0) {
            throw new Error('At least one trustee is required');
          }
          if (!data.trustName) {
            throw new Error('Trust name is required');
          }
          if (!data.trustAddress) {
            throw new Error('Trust address is required');
          }
          break;
        case 'sale-deed':
          if (!data.sellers || data.sellers.length === 0) {
            throw new Error('At least one seller is required');
          }
          if (!data.buyers || data.buyers.length === 0) {
            throw new Error('At least one buyer is required');
          }
          break;
        case 'will-deed':
          if (!data.testator || !data.testator.name) {
            throw new Error('Testator information is required');
          }
          if (!data.beneficiaries || data.beneficiaries.length === 0) {
            throw new Error('At least one beneficiary is required');
          }
          break;
      }

      goToProcessing('Form validated! Redirecting to payment...');
      
      // Go directly to payment without backend submission
      // Backend submission will happen during payment processing
      setTimeout(() => {
        goToPayment({
          formId: `temp-${Date.now()}`,
          amount: data.amount || 1000,
          formType: formType,
          formData: data
        });
      }, 1500);
      
    } catch (error) {
      console.error('Form validation error:', error);
      goToProcessing(`❌ ${error.message}. Please check your form and try again.`);
      
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
