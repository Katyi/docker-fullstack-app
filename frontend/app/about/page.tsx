'use client';

import React from 'react';
import useAuthStore from '../store/authStore';
import Loader from '@/components/loader/loader';

const About = () => {
  const { user, error, isLoading } = useAuthStore();

  if (error) {
    return (
      <div className="pageContainer justify-center">
        <p className="text-red-500 font-bold">Error loading users: {error}</p>
      </div>
    );
  }

  return isLoading ? (
    <Loader />
  ) : (
    <main className="pageContainer">
      <div className="w-full min-h-[calc(100vh-188px-90px-32px)] md:min-h-[calc(100vh-155px-90px-32px)] bg-white p-5">
        <h1 className="text-xl font-bold text-gray-600">About Postcrossing</h1>
        <p className="text-sm text-gray-400 mt-4">
          Sorry, there is nothing here yet
        </p>
      </div>
    </main>
  );
};

export default About;
