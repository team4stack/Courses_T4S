import React from 'react';
import HeroSection from '../components/HeroSection';
import CourseContent from '../components/CourseContent';
import EnrollButton from '../components/EnrollButton';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <CourseContent />
      <EnrollButton />
    </div>
  );
};

export default LandingPage;