"use client"

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FooterPage from '@/components/Footer';

const PaymentFailurePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {/* Failure Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h1>
              <p className="text-gray-600">
                We're sorry, but your payment could not be processed at this time.
              </p>
            </div>
            
            {/* Error Details */}
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Possible Reasons
              </h3>
              <div className="text-sm text-red-700 space-y-1">
                <p>• Insufficient funds in your account</p>
                <p>• Incorrect payment details</p>
                <p>• Network connectivity issues</p>
                <p>• Payment gateway timeout</p>
              </div>
            </div>
            
            {/* Help Section */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Need Help?
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Contact our support team</p>
                <p>• Check your bank account balance</p>
                <p>• Verify your payment details</p>
                <p>• Try a different payment method</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/contact"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Contact Support
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

export default PaymentFailurePage;
