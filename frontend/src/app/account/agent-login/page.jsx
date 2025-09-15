"use client"
import React from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import {loginSchema} from "@/validations/schemas"
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useLoginAgentMutation } from '@/lib/services/auth';

const initialValues = {
  email: "",
  password: "",
};
const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [serverSuccessMessage, setServerSuccessMessage] = useState('');
  const [loginUser] = useLoginAgentMutation()
   const {values,errors, handleChange, handleSubmit} = useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: async(values, action) => {
        setLoading(true);
        try {
          const response = await loginUser(values);
          if(response.data && response.data.status === 'success'){
           setServerSuccessMessage(response.data.message);
           setServerErrorMessage('')
           action.resetForm();
           setLoading(false);
           router.push('/')
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
        <h2 className='text-2xl font-bold mb-6 text-center'>Agent Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>

            <label htmlFor="email" className='block font-medium mb-2'>Email</label>
            <input type="email" id='email' name='email' value={values.email} onChange={handleChange} className='w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2' placeholder='Enter your Email'/>
            {errors.email && <div className='text-sm text-red-500 px-2'>{errors.email}</div>}

            <label htmlFor="password" className='block font-medium mb-2'>Password</label>
            <input type="password" id='password' name='password' value={values.password} onChange={handleChange} className='w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2' placeholder='Enter your Password'/>
            {errors.password && <div className='text-sm text-red-500 px-2'>{errors.password}</div>}

          </div>
          <p className='text-sm text-gray-600 p-1'><Link href="/account/reset-password-link" className='text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out '>Forgot Password</Link> </p>
          <button type='submit' className='w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 disabled:bg-gray-400' disabled={loading}>
            Login
          </button>
        </form>

        <p className='text-sm text-gray-600 p-1'>Don't have an account? <Link href="/account/agent-register" className='text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out '>Create your account</Link> </p>
        {serverSuccessMessage && <div className='text-lg text-green-500 font-semibold text-center px-2'>{serverSuccessMessage}</div>}
        {serverErrorMessage && <div className='text-lg text-red-500 font-semibold text-center px-2'>{serverErrorMessage}</div>}

      </div>
    </div>  )
}

export default Login;