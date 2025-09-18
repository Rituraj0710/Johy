"use client"
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import {registerSchema} from "@/validations/schemas"
import { useCreateUserMutation } from '@/lib/services/auth';
import FormInput from '@/components/ui/FormInput';
import SubmitButton from '@/components/ui/SubmitButton';
const initialValues = {
  name: "",
  phone: "",
  email: "",
  password: "",
  password_confirmation: "",
}

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [serverSuccessMessage, setServerSuccessMessage] = useState('');
  const [createUser] = useCreateUserMutation()

  const {values,errors, touched, handleChange, handleBlur, handleSubmit} = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async(values, action) => {
      setLoading(true);
     try {
       const response = await createUser(values);
       if(response.data && response.data.status === 'success'){
        setServerSuccessMessage(response.data.message);
        setServerErrorMessage('')
        action.resetForm();
        setLoading(false);
        router.push('/account/verify-email')
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
    <div className='flex items-center justify-center h-screen bg-slate-400'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            error={touched.name && errors.name}
            required
          />

          <FormInput
            label="Phone Number"
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your phone number"
            error={touched.phone && errors.phone}
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email address"
            error={touched.email && errors.email}
            required
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Create a strong password"
            error={touched.password && errors.password}
            required
          />

          <FormInput
            label="Confirm Password"
            type="password"
            name="password_confirmation"
            value={values.password_confirmation}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirm your password"
            error={touched.password_confirmation && errors.password_confirmation}
            required
          />

          <SubmitButton
            loading={loading}
            loadingText="Creating account..."
            variant="indigo"
          >
            Create Account
          </SubmitButton>
        </form>

        <p className='text-sm text-gray-600 p-1'>Already an User? <Link href="/account/user-login" className='text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out '>Login</Link> </p>
        {serverSuccessMessage && <div className='text-lg text-green-500 font-semibold text-center px-2'>{serverSuccessMessage}</div>}
        {serverErrorMessage && <div className='text-lg text-red-500 font-semibold text-center px-2'>{serverErrorMessage}</div>}

      </div>
    </div>
  )
}

export default Register;