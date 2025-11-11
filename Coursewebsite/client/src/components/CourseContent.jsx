import React from 'react';

const CourseContent = () => {
  // Sample course content data
  const modules = [
    {
      id: 1,
      title: 'Introduction to Web Development',
      lessons: [
        { id: 1, title: 'HTML Basics' },
        { id: 2, title: 'CSS Fundamentals' },
        { id: 3, title: 'JavaScript Introduction' }
      ]
    },
    {
      id: 2,
      title: 'Frontend Frameworks',
      lessons: [
        { id: 4, title: 'React Basics' },
        { id: 5, title: 'Component Architecture' },
        { id: 6, title: 'State Management' }
      ]
    },
    {
      id: 3,
      title: 'Backend Development',
      lessons: [
        { id: 7, title: 'Node.js Fundamentals' },
        { id: 8, title: 'Express.js Framework' },
        { id: 9, title: 'Database Integration' }
      ]
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Course Content</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What you'll learn
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            This comprehensive course covers everything you need to know to become a full-stack web developer.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {modules.map((module) => (
              <div key={module.id} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <span className="text-lg font-bold">{module.id}</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                  <ul className="mt-2 space-y-2">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-500">{lesson.title}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;