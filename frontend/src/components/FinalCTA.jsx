import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function FinalCTA() {
  const { user } = useContext(AuthContext);

  const getCTAButton = () => {
    if (user) {
      if (user.role === 'shelter' || user.role === 'admin') {
        return { text: 'Manage Your Pets', link: '/manage-pets' };
      } else {
        return { text: 'Browse Available Pets', link: '/pets' };
      }
    }
    return { text: 'Start Adopting', link: '/register' };
  };

  const ctaButton = getCTAButton();
  return (
    <section style={{
      padding: '60px 20px',
      background: 'linear-gradient(135deg, rgba(70, 181, 167, 0.8) 0%, rgba(247, 161, 69, 0.8) 100%)',
      color: 'white',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/owner-pet.jpg)', // placeholder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3,
        zIndex: 1
      }}></div>
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Your new friend is waiting.
        </h2>
        <Link to={ctaButton.link} style={{
          display: 'inline-block',
          padding: '15px 30px',
          backgroundColor: '#f7a145',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '50px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(247, 161, 69, 0.3)',
          transition: 'transform 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
          {ctaButton.text}
        </Link>
      </div>
    </section>
  );
}