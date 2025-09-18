"use client"

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FooterPage from '@/components/Footer';

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600">
                Your form has been submitted successfully and payment has been processed.
              </p>
            </div>
            
            {/* Transaction Details */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Transaction Details
              </h3>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">TXN{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>₹1,180.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600 font-semibold">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                What's Next?
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• You will receive a confirmation email shortly</p>
                <p>• Your document will be processed within 2-3 business days</p>
                <p>• You can track your order status in your account</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/user/profile"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                View My Orders
              </Link>
              
              <Link
                href="/"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <FooterPage />
    </div>
  );
};

export default PaymentSuccessPage;
