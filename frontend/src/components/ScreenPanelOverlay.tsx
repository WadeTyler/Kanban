import React from 'react';

const ScreenPanelOverlay = ({children}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full h-screen fixed top-0 left-0 bg-black/50 z-40 flex items-center justify-center">
      {children}
    </div>
  );
};

export default ScreenPanelOverlay;