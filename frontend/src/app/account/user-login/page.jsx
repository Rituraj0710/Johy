"use client"
import React from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import {loginSchema} from "@/validations/schemas"
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useLoginUserMutation } from '@/lib/services/auth';
import FormInput from '@/components/ui/FormInput';
import SubmitButton from '@/components/ui/SubmitButton';

const initialValues = {
  email: "",
  password: "",
};
const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [serverSuccessMessage, setServerSuccessMessage] = useState('');
  const [loginUser] = useLoginUserMutation()
   const {values,errors, touched, handleChange, handleBlur, handleSubmit} = useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: async(values, action) => {
        setLoading(true);
        try {
          const response = await loginUser(values);
          if(response.data && response.data.status === 'success'){
           const { access_token, refresh_token, user } = response.data;
           if (typeof window !== 'undefined'){
             if (access_token) localStorage.setItem('access_token', access_token);
             if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
             if (user?.roles) localStorage.setItem('role', user.roles);
             if (user?.email) localStorage.setItem('user_email', user.email);
             if (user?.id) localStorage.setItem('user_id', user.id);
             if (user?.name) localStorage.setItem('user_name', user.name);
             if (user?.phone) localStorage.setItem('user_phone', user.phone);
             localStorage.setItem('is_auth', 'true');
           }
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
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            error={touched.password && errors.password}
            required
          />

          <div className="text-right">
            <Link 
              href="/account/reset-password-link" 
              className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          <SubmitButton
            loading={loading}
            loadingText="Signing in..."
            variant="indigo"
          >
            Sign In
          </SubmitButton>
        </form>

        <p className='text-sm text-gray-600 p-1'>Don't have an account? <Link href="/account/user-register" className='text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out '>Create your account</Link> </p>
        {serverSuccessMessage && <div className='text-lg text-green-500 font-semibold text-center px-2'>{serverSuccessMessage}</div>}
        {serverErrorMessage && <div className='text-lg text-red-500 font-semibold text-center px-2'>{serverErrorMessage}</div>}

      </div>
    </div>  )
}

export default Login;