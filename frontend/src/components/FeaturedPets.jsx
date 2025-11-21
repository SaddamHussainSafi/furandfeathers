import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import PetCard from './PetCard';

export default function FeaturedPets() {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        const response = await api.get('/pets?featured=true&limit=4');
        setPets(response.data);
      } catch (error) {
        console.error('Error fetching featured pets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedPets();
  }, []);

  if (loading) {
    return (
      <section style={{ padding: '60px 20px', backgroundColor: '#f7f8fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#222', fontFamily: 'Kanit, sans-serif' }}>Featured Pets</h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: '2rem',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="pet-card-clean" style={{ background: '#f9f9f9' }}>
                <div className="pet-img-box" style={{ background: '#e0e0e0' }}></div>
                <div className="pet-info" style={{ padding: '1.2rem 1.4rem' }}>
                  <div style={{ height: '20px', background: '#e0e0e0', marginBottom: '0.5rem' }}></div>
                  <div style={{ height: '24px', background: '#e0e0e0', marginBottom: '0.5rem' }}></div>
                  <div style={{ height: '40px', background: '#e0e0e0', marginBottom: '1rem' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ height: '16px', width: '100px', background: '#e0e0e0' }}></div>
                    <div style={{ height: '32px', width: '80px', background: '#e0e0e0', borderRadius: '8px' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (pets.length === 0) {
    return (
      <section style={{ padding: '60px 20px', backgroundColor: '#f7f8fa', textAlign: 'center' }}>
        <h2 style={{ color: '#222', fontFamily: 'Kanit, sans-serif' }}>Featured Pets</h2>
        <p>No featured pets right now.</p>
      </section>
    );
  }

  return (
    <section style={{ padding: '60px 20px', backgroundColor: '#f7f8fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#222', fontFamily: 'Kanit, sans-serif', marginBottom: '0.5rem' }}>
            Featured Pets
          </h2>
          <p style={{ color: '#5d6b82', margin: 0 }}>Fresh profiles added daily by trusted shelters.</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {pets.slice(0, 4).map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            to="/pets"
            className="site-button site-button--primary"
            style={{ paddingInline: '2.25rem' }}
          >
            Explore more pets
          </Link>
        </div>
      </div>
    </section>
  );
}
