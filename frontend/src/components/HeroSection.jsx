import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function HeroSection() {
  const { user } = useContext(AuthContext);

  const getPrimaryButton = () => {
    if (user) {
      if (user.role === 'shelter' || user.role === 'admin') {
        return { text: 'Manage Pets', link: '/manage-pets' };
      }
      return { text: 'Go to Dashboard', link: '/dashboard' };
    }
    return { text: 'Browse Pets', link: '/pets', icon: 'https://cdn-icons-png.flaticon.com/512/1864/1864514.png' };
  };

  const getSecondaryButton = () => {
    if (!user) {
      return { text: 'Join as Shelter', link: '/register?shelter' };
    }
    return null;
  };

  const primaryBtn = getPrimaryButton();
  const secondaryBtn = getSecondaryButton();

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #46b5a7 0%, #fff8ee 100%)',
      color: '#333',
      padding: '80px 20px 20px',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '50px' }} className="hero-section">
        <div style={{ flex: 1, animation: 'fadeInUp 1s ease-out' }} className="hero-text">
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Adopt Love. Connect Responsibly.
          </h1>
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '40px',
            lineHeight: '1.6',
            opacity: '0.8'
          }}>
            Discover pets from trusted shelters near you.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link
              to={primaryBtn.link}
              style={{
                padding: '15px 30px',
                backgroundColor: '#f7a145',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'transform 0.3s ease',
                boxShadow: '0 4px 15px rgba(247, 161, 69, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              {primaryBtn.icon && (
                <img src={primaryBtn.icon} alt="" width="20" height="20" style={{ verticalAlign: 'middle', marginRight: '10px' }} loading="lazy" />
              )}
              {primaryBtn.text}
            </Link>
            {secondaryBtn && (
              <Link
                to={secondaryBtn.link}
                style={{
                  padding: '15px 30px',
                  backgroundColor: 'transparent',
                  color: '#46b5a7',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  border: '2px solid #46b5a7',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#46b5a7';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#46b5a7';
                }}
              >
                {secondaryBtn.text}
              </Link>
            )}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', animation: 'fadeInRight 1s ease-out' }} className="hero-image">
          <div style={{
            width: '400px',
            height: '400px',
            backgroundColor: '#fff8ee',
            borderRadius: '50%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem'
          }}>
            <img src="https://cdn-icons-png.flaticon.com/512/1864/1864514.png" alt="Paw icon" width="140" height="140" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
