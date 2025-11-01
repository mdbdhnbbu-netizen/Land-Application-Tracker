import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      <p className="ml-4 text-xl text-slate-700">লোড হচ্ছে...</p>
    </div>
  );
};

export default LoadingSpinner;
