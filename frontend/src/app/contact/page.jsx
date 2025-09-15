"use client"

import React, { useState } from "react";
import Link from 'next/link'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation';
import { useContactUsMutation } from "@/lib/services/auth";
import { contactUsSchema } from "@/validations/schemas";

const initialValues = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

const ContactUs = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [serverSuccessMessage, setServerSuccessMessage] = useState('');
  const [contactUs] = useContactUsMutation()
  const {values,errors, handleChange, handleSubmit} = useFormik({
      initialValues,
      validationSchema: contactUsSchema,
      onSubmit: async(values, action) => {
        setLoading(true);
        try {
          const response = await contactUs(values);
          if(response.data && response.data.status === 'success'){
           setServerSuccessMessage(response.data.message);
           setServerErrorMessage('')
           action.resetForm();
           setLoading(false);
           router.push('/contact');
          }
          if(response.error && response.error.data.status === 'failed'){
           setServerErrorMessage(response.error.data.message);
           setServerSuccessMessage('')
           setLoading(false);
          }
        } catch (error) {
         console.log(error);
         setLoading(false);
        }
      }
  
    })
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-400">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Phone</span>
            </label>
            <input
              type="number"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="Enter your Phone"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Subject</span>
            </label>
            <input
              type="text"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your Message</span>
            </label>
            <textarea
              name="message"
              value={values.message}
              onChange={handleChange}
              placeholder="Write your message here"
              className="textarea textarea-bordered w-full"
              rows="5"
              required
            ></textarea>
          </div>
          <div className="form-control mt-4">
            <button type="submit" className="btn btn-primary w-full"disabled={loading}>
              Send Message
            </button>
          </div>
        </form>
        {serverSuccessMessage && <div className='text-lg text-green-500 font-semibold text-center px-2'>{serverSuccessMessage}</div>}
        {serverErrorMessage && <div className='text-lg text-red-500 font-semibold text-center px-2'>{serverErrorMessage}</div>}
      </div>
    </div>
  );
};

export default ContactUs;
