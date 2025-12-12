import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-lampi-offwhite pt-[65px]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <main className="p-5">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;