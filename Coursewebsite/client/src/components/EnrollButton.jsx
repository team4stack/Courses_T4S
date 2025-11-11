import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnrollButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnroll = async () => {
    setLoading(true);
    
    // TODO: Implement enrollment logic
    console.log('Enrollment request submitted');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Redirect to login page for authentication
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10 sm:pb-6">
            <div className="flex justify-center">
              <span className="inline-flex px-4 py-1 text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600 rounded-full">
                Limited Time Offer
              </span>
            </div>
            <div className="mt-4 flex justify-center">
              <p className="text-4xl font-extrabold text-gray-900">
                $99<span className="text-xl font-medium text-gray-500">/course</span>
              </p>
            </div>
            <p className="mt-5 text-lg text-gray-500">
              Enroll now and get lifetime access to all course materials.
            </p>
          </div>
          <div className="px-6 pt-4 pb-8 sm:px-10 sm:py-6">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-base text-gray-700">Lifetime access to all course materials</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-base text-gray-700">Certificate of completion</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-base text-gray-700">Access to exclusive community</p>
              </li>
            </ul>
            <div className="mt-10">
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="flex items-center justify-center w-full px-6 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <span>Enroll Now</span>
                )}
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollButton;