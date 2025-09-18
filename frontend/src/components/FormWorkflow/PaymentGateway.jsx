"use client"

import React, { useState, useEffect } from 'react';
import { useFormWorkflow } from './FormWorkflowProvider';
import SubmitButton from '../ui/SubmitButton';
import LoadingSpinner from '../ui/LoadingSpinner';

const PaymentGateway = () => {
  const { formData, resetWorkflow, formType } = useFormWorkflow();
  const [paymentMethod, setPaymentMethod] = useState('payu');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // PayU Money configuration with your credentials
  const payuConfig = {
    key: 'gtKFFx', // Your PayU key
    salt: 'eCwWELxi', // Your PayU salt
    amount: formData?.amount || 1000,
    productinfo: `${formType} Form Submission`,
    firstname: formData?.name || 'User',
    email: 'bonehookadvt01@gmail.com', // Your provided email
    phone: formData?.phone || '9999999999',
    surl: `${window.location.origin}/payment/success`,
    furl: `${window.location.origin}/payment/failure`,
    hash: '', // Will be calculated
  };

  const getFormTitle = () => {
    const titles = {
      'will-deed': 'Will Deed',
      'sale-deed': 'Sale Deed',
      'trust-deed': 'Trust Deed',
      'property-registration': 'Property Registration',
      'property-sale-certificate': 'Property Sale Certificate'
    };
    return titles[formType] || 'Form';
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing with longer timeout
      await new Promise(resolve => setTimeout(resolve, 5000)); // Increased to 5 seconds
      
      // In real implementation, you would:
      // 1. Generate PayU hash
      // 2. Submit to PayU gateway
      // 3. Handle response
      
      setPaymentStatus('success');
      setIsProcessing(false);
      
      // Redirect to success page after 5 seconds
      setTimeout(() => {
        window.location.href = '/payment/success';
      }, 5000); // Increased to 5 seconds
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'payu',
      name: 'PayU Money',
      description: 'Pay using PayU Money gateway',
      icon: '💳',
      popular: true
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Pay using Razorpay gateway',
      icon: '🏦',
      popular: false
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using UPI',
      icon: '📱',
      popular: false
    }
  ];

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Your {getFormTitle()} has been submitted successfully.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Transaction ID:</strong> TXN{Date.now()}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Amount:</strong> ₹{payuConfig.amount}
                </p>
              </div>
              
              <p className="text-sm text-gray-600">
                Redirecting to success page...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-600">
                There was an error processing your payment. Please try again.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setPaymentStatus('pending')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={resetWorkflow}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Form
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">
            Secure payment for your {getFormTitle()} submission
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Choose Payment Method
              </h2>
              
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{method.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">
                            {method.name}
                          </h3>
                          {method.popular && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <input
                          type="radio"
                          name="payment-method"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Payment Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{getFormTitle()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-medium">₹{payuConfig.amount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{(payuConfig.amount * 0.18).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>₹{(payuConfig.amount * 1.18).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <SubmitButton
                  onClick={handlePayment}
                  loading={isProcessing}
                  loadingText="Processing Payment..."
                  variant="primary"
                  className="w-full"
                >
                  Pay Now
                </SubmitButton>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={resetWorkflow}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Back to Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Secure Payment
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Your payment information is encrypted and secure. We use industry-standard 
                  security measures to protect your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
