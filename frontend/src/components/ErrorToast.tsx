import React from 'react';

const ErrorToast = ({errorMessage}: {
  errorMessage: string;
}) => {
  return (
    <div className="p-2 text-white font-semibold bg-danger rounded-md shadow-lg">
      <span>{errorMessage}</span>
    </div>
  );
};

export default ErrorToast;