import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

const ForgotPassword = () => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReSend, setIsResend] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/forget-password`, {
        email
      });

      if(response.status === 200){
        setMessage(response.data[0]);
        setIsSubmitted(true);
      }

    } catch (error) {
      setMessage('Opps! something went wrong, please try again later.');
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    setIsResend(true);
    await handleSubmit(e);
  };

  const handleDifferentEmail = () => {
    setIsSubmitted(false); 
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gary-100'>
      <div className='bg-white p-8 sm:p-4 rounded-lg max-w-xl w-full m-2 shadow-2xl'>
      {isSubmitted ? ( 
        <div className='p-8'>
          <h2 className="text-2xl font-semibold text-gray-800">Check your email</h2>
          <p className="my-5 text-wrap">Thanks! If <b>{email}</b> matches an email we have on file, then we've sent you an email containing further instructions for resetting your password.</p>
          <p className="mt-8 text-justify text-sm">
            If you haven't received an email in 5 minutes, check your spam.
          </p>
          <p className='text-sm'>
            {!isReSend && (<><button onClick={handleResend} className="text-blue-600"> resend</button>, or </>)}
            <button onClick={handleDifferentEmail} className="text-blue-600"> try a different email</button>.
          </p>
        </div>
      ) : (
        <>
        
        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
          Reset your password
        </h2>
        <p className='text-sm text-gray-600 text-justify mb-6'>
        Enter the email address associated with your account and we’ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <label htmlFor='email' className='block text-md font-medium text-gray-700'>
              Email
            </label>
            <input
            id='email'
            type='email'
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            className='mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-300 focus:border-green-300 sm:text-sm'
            placeholder="you@example.com"
            required
            />
            <button type='submit'
            className='w-full bg-green-700 text-white mt-4 py-3 px-4 rounded-md font-semibold text-md'>
             Continue 
            </button>
          </div>
        </form>
        <div className='mt-6 text-center'>
          <Link to="/login" className='text-green-700 hover:text-green-500 text-sm'>
            Return to sign in
          </Link>
        </div>
        </>
      )}
      </div>
    </div>
  );
};

export default ForgotPassword;
