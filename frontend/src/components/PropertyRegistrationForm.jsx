'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const PropertyRegistrationForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Initial form values
  const initialValues = {
    seller_name: '',
    seller_father_name: '',
    seller_address: '',
    seller_aadhaar: '',
    seller_mobile: '',
    buyer_name: '',
    buyer_father_name: '',
    buyer_address: '',
    buyer_aadhaar: '',
    buyer_mobile: '',
    property_address: '',
    property_type: '',
    area_sqm: '',
    sale_price: '',
    registration_date: '',
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    seller_name: Yup.string().required('विक्रेता का नाम आवश्यक है।'),
    seller_father_name: Yup.string().required('विक्रेता के पिता/पति का नाम आवश्यक है।'),
    seller_address: Yup.string().required('विक्रेता का पता आवश्यक है।'),
    seller_aadhaar: Yup.string()
      .required('विक्रेता का आधार नंबर आवश्यक है।')
      .matches(/^[0-9]{12}$/, 'आधार नंबर 12 अंकों का होना चाहिए।'),
    seller_mobile: Yup.string()
      .required('विक्रेता का मोबाइल नंबर आवश्यक है।')
      .matches(/^[0-9]{10}$/, 'मोबाइल नंबर 10 अंकों का होना चाहिए।'),
    buyer_name: Yup.string().required('खरीदार का नाम आवश्यक है।'),
    buyer_father_name: Yup.string().required('खरीदार के पिता/पति का नाम आवश्यक है।'),
    buyer_address: Yup.string().required('खरीदार का पता आवश्यक है।'),
    buyer_aadhaar: Yup.string()
      .required('खरीदार का आधार नंबर आवश्यक है।')
      .matches(/^[0-9]{12}$/, 'आधार नंबर 12 अंकों का होना चाहिए।'),
    buyer_mobile: Yup.string()
      .required('खरीदार का मोबाइल नंबर आवश्यक है।')
      .matches(/^[0-9]{10}$/, 'मोबाइल नंबर 10 अंकों का होना चाहिए।'),
    property_address: Yup.string().required('संपत्ति का पता आवश्यक है।'),
    property_type: Yup.string().required('संपत्ति का प्रकार चुनना आवश्यक है।'),
    area_sqm: Yup.string().required('क्षेत्रफल आवश्यक है।'),
    sale_price: Yup.string().required('बिक्री मूल्य आवश्यक है।'),
    registration_date: Yup.date().required('पंजीकरण की तिथि आवश्यक है।'),
  });

  // Handle form submission
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/property-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'संपत्ति पंजीकरण सफलतापूर्वक जमा हो गया!' });
        toast.success('संपत्ति पंजीकरण सफलतापूर्वक जमा हो गया!');
        resetForm();
        // Optionally redirect after successful submission
        // setTimeout(() => router.push('/'), 2000);
      } else {
        throw new Error(data.message || 'सबमिशन में त्रुटि हुई');
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error.message || 'सबमिशन में त्रुटि हुई। कृपया पुनः प्रयास करें।';
      setSubmitStatus({ type: 'error', message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-4">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <h1 className="text-xl lg:text-2xl font-bold text-center mb-6 text-gray-800 border-b-2 border-blue-500 pb-3">
            उत्तर प्रदेश संपत्ति पंजीकरण फॉर्म
          </h1>

          {submitStatus && (
            <div className={`mb-4 p-3 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {submitStatus.message}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="space-y-4">
                {/* Seller Details Section */}
                <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
                  <h3 className="text-base lg:text-lg font-semibold mb-3 text-gray-700">विक्रेता/मकान मालिक का विवरण</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        विक्रेता का नाम *
                      </label>
                      <Field
                        type="text"
                        name="seller_name"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="विक्रेता का नाम दर्ज करें"
                      />
                      <ErrorMessage name="seller_name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        पिता/पति का नाम *
                      </label>
                      <Field
                        type="text"
                        name="seller_father_name"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="पिता/पति का नाम दर्ज करें"
                      />
                      <ErrorMessage name="seller_father_name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        आधार संख्या *
                      </label>
                      <Field
                        type="tel"
                        name="seller_aadhaar"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="12 अंकों का आधार नंबर"
                      />
                      <ErrorMessage name="seller_aadhaar" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        मोबाइल नंबर *
                      </label>
                      <Field
                        type="tel"
                        name="seller_mobile"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="10 अंकों का मोबाइल नंबर"
                      />
                      <ErrorMessage name="seller_mobile" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="sm:col-span-2 xl:col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        पूरा पता *
                      </label>
                      <Field
                        as="textarea"
                        name="seller_address"
                        rows="3"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="विक्रेता का पूरा पता दर्ज करें"
                      />
                      <ErrorMessage name="seller_address" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                {/* Buyer Details Section */}
                <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
                  <h3 className="text-base lg:text-lg font-semibold mb-3 text-gray-700">खरीदार का विवरण</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        खरीदार का नाम *
                      </label>
                      <Field
                        type="text"
                        name="buyer_name"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="खरीदार का नाम दर्ज करें"
                      />
                      <ErrorMessage name="buyer_name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        पिता/पति का नाम *
                      </label>
                      <Field
                        type="text"
                        name="buyer_father_name"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="पिता/पति का नाम दर्ज करें"
                      />
                      <ErrorMessage name="buyer_father_name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        आधार संख्या *
                      </label>
                      <Field
                        type="tel"
                        name="buyer_aadhaar"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="12 अंकों का आधार नंबर"
                      />
                      <ErrorMessage name="buyer_aadhaar" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        मोबाइल नंबर *
                      </label>
                      <Field
                        type="tel"
                        name="buyer_mobile"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="10 अंकों का मोबाइल नंबर"
                      />
                      <ErrorMessage name="buyer_mobile" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="sm:col-span-2 xl:col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        पूरा पता *
                      </label>
                      <Field
                        as="textarea"
                        name="buyer_address"
                        rows="3"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="खरीदार का पूरा पता दर्ज करें"
                      />
                      <ErrorMessage name="buyer_address" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                {/* Property Details Section */}
                <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
                  <h3 className="text-base lg:text-lg font-semibold mb-3 text-gray-700">संपत्ति का विवरण</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
                    <div className="sm:col-span-2 xl:col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        संपत्ति का पूरा पता *
                      </label>
                      <Field
                        as="textarea"
                        name="property_address"
                        rows="3"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="संपत्ति का पूरा पता दर्ज करें"
                      />
                      <ErrorMessage name="property_address" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        संपत्ति का प्रकार *
                      </label>
                      <Field
                        as="select"
                        name="property_type"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">चुनें</option>
                        <option value="आवासीय">आवासीय</option>
                        <option value="व्यावसायिक">व्यावसायिक</option>
                        <option value="कृषि">कृषि</option>
                      </Field>
                      <ErrorMessage name="property_type" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        क्षेत्रफल (वर्ग मीटर में) *
                      </label>
                      <Field
                        type="text"
                        name="area_sqm"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="क्षेत्रफल दर्ज करें"
                      />
                      <ErrorMessage name="area_sqm" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        बिक्री मूल्य (₹ में) *
                      </label>
                      <Field
                        type="text"
                        name="sale_price"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="बिक्री मूल्य दर्ज करें"
                      />
                      <ErrorMessage name="sale_price" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        पंजीकरण की तिथि *
                      </label>
                      <Field
                        type="date"
                        name="registration_date"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <ErrorMessage name="registration_date" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded-lg font-medium text-white transition-colors text-sm ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isSubmitting ? 'जमा हो रहा है...' : 'फॉर्म जमा करें'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

        </div>
      </div>
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default PropertyRegistrationForm;
