import React from 'react';
import LoadingSpinner from "@/components/LoadingSpinner";

const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center text-accent">
      <LoadingSpinner cn="size-16"/>
    </div>
  );
};

export default LoadingScreen;