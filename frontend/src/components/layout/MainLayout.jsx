import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ScrollToTop from '../ScrollToTop';

const MainLayout = ({ children, fullWidth = false }) => {
  const containerClasses = fullWidth
    ? 'w-full px-0 py-8'
    : 'container mx-auto px-4 sm:px-6 lg:px-8 py-8';

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main className="main-content">
        <div className={containerClasses}>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
