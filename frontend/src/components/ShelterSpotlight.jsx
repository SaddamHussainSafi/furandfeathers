import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function ShelterSpotlight() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await api.get('/shelters?verified=true&limit=10');
        setShelters(response.data);
      } catch (error) {
        console.error('Error fetching shelters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShelters();
  }, []);

  if (loading) {
    return (
      <section style={{ padding: '60px 20px', backgroundColor: '#f0f0f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '40px', color: '#46b5a7' }}>Shelter Spotlight</h2>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '20px' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                minWidth: '150px',
                height: '100px',
                backgroundColor: '#eee',
                borderRadius: '10px',
                animation: 'pulse 1.5s infinite'
              }}></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '60px 20px', backgroundColor: '#f0f0f0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '40px', color: '#46b5a7' }}>Shelter Spotlight</h2>
        <div style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          padding: '20px'
        }}>
          {shelters.map(shelter => (
            <div key={shelter.id} style={{
              minWidth: '150px',
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <img src={shelter.logo || '/default-logo.png'} alt={shelter.name} style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                marginBottom: '10px'
              }} />
              <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{shelter.name}</p>
            </div>
          ))}
        </div>
        <Link to="/register?shelter" style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#f7a145',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          Become a Partner Shelter
        </Link>
      </div>
    </section>
  );
}