import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ScrollToTop from '../ScrollToTop';

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}