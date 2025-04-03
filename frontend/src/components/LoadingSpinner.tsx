import React from 'react';
import {RiLoader4Line} from "@remixicon/react";

const LoadingSpinner = ({cn}: {
  cn?: string;
}) => {
  return (
    <RiLoader4Line className={`animate-spin ${cn}`} />
  );
};

export default LoadingSpinner;