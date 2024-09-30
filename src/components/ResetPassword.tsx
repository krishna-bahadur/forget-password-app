import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/api';
import { MdError } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";


const ResetPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const email = query.get('e');
  const token = query.get('t');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isTokenValid, setIsValidToken] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, {
        email,
        token,
        newPassword
      });
      if (response.status === 200) {
        setIsSubmitted(true);
      } 
      else {
        setMessage('Opps! something went wrong, please try again later.');
        setIsSubmitted(false);
      }
    } catch (error) {
      setMessage('Error resetting password');
      setIsSubmitted(false);
    }
  };

  const validateToken = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/validate-token`, {
        email,
        token
      });
      console.log(response)

      if (response.status === 200) {
        setIsValidToken(true);
      } 
      else {
        setMessage('Opps! something went wrong, please try again later.');
        setIsValidToken(false);
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400 && error.response.data) {
          const errorData = error.response.data;
          if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
            const message = errorData.message;
            setMessage(Array.isArray(message) ? message[0] : message.toString());
          } else {
            setMessage('Invalid response format from server.');
          }
        } else {
          setMessage('Oops! Something went wrong. Please try again later.');
        }

        //console.error('Token validation error:', error.message);
      } else {
        setMessage('An unexpected error occurred. Please try again.');
        //console.error('Unexpected error:', error);
      }
    }
    finally{
      setIsLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one digit.');
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }

    return errors;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordErrors(validatePassword(password));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== newPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  useEffect(() => {
    const validate = async () => {
      await validateToken();
    };

    validate();
  }, []);


  return (
    <div className='flex items-center justify-center min-h-screen bg-gary-100'>
      <div className='bg-white sm:p-8 p-4 rounded-lg max-w-xl w-full m-2 shadow-2xl'>
        {isLoading ?  <div className='text-center'>Loading..</div> : <>
        
        
      {isTokenValid ? (
        <>
        {!isSubmitted ? (        
        <form onSubmit={handleSubmit} className="mt-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reset Password</h2>
          <div className="mb-5 mt-4">
            <label className="block text-md text-gray-700">New Password</label>
            <input
              type="password"
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-300 focus:border-green-300 sm:text-sm"
              value={newPassword}
              onChange={handlePasswordChange}
              required
            />
            {passwordErrors.length > 0 && (
                <ul className="text-red-400 text-sm mt-2">
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
          </div>
          <div className="mb-5 mt-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-300 focus:border-green-300 sm:text-sm"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
             {passwordMatchError && <p className="text-sm mt-2 text-red-400">{passwordMatchError}</p>}
          </div>
         
          <button type='submit'
            className='w-full bg-green-700 text-white mt-4 py-3 px-4 rounded-md font-semibold text-md'>
             Continue 
            </button>
        </form>
        ): (
          <>
          <BsCheckCircleFill className="mx-auto text-gray-600 text-6xl" />
           <p className="mt-8 text-md text-center">
            Password changes successfully.
          </p>
          <div className='mt-6 text-center'>
          <Link to="/login" className="bg-green-700 text-white text-sm p-2 rounded-md">
            Return to Home page
          </Link>
        </div>
          </>
        )}
        </>

      ) : (
        <div className='text-center'>
        <MdError className='mx-auto text-gray-600 text-6xl' />
        <p className="mt-4 mb-5 text-md text-green-800 text-center">{message}</p>
        <Link to="/" className='text-green-500 hover:text-green-700 text-sm'>
            Try resetting your password again.
          </Link>
        </div>
      )}
      </>}

    </div>
    </div>

  );
};

export default ResetPassword;
