import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SectionHero from '../components/SectionHero';
import PetCard from '../components/PetCard';
import api from '../api';

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoritePets = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/pets/saved');
        setFavoritePets(response.data);
      } catch (err) {
        console.error('Error fetching favorite pets:', err);
        setError('Failed to load favorite pets');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePets();
  }, [user]);

  if (loading) {
    return (
      <div className="page">
        <SectionHero
          badge={<span>Saved</span>}
          title="My Favorite Pets"
          subtitle="Pets you've saved for later. Keep track of the ones you love!"
        />
        <section className="page-section">
          <div className="surface-card" style={{ textAlign: 'center' }}>
            <p>Loading your favorite pets...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <SectionHero
          badge={<span>Saved</span>}
          title="My Favorite Pets"
          subtitle="Pets you've saved for later. Keep track of the ones you love!"
        />
        <section className="page-section">
          <div className="surface-card" style={{ textAlign: 'center' }}>
            <p>{error}</p>
            <Link to="/pets" className="site-button site-button--primary" style={{ marginTop: '10px' }}>
              Browse Pets
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <SectionHero
        badge={<span>Saved</span>}
        title="My Favorite Pets"
        subtitle="Pets you've saved for later. Keep track of the ones you love!"
      />

      {favoritePets.length === 0 ? (
        <section className="page-section">
          <div className="surface-card" style={{ textAlign: 'center' }}>
            <h3>No favorite pets yet</h3>
            <p>Start browsing pets and add them to your favorites!</p>
            <Link to="/pets" className="site-button site-button--primary" style={{ marginTop: '10px' }}>
              Browse Pets
            </Link>
          </div>
        </section>
      ) : (
        <section className="page-section">
          <div className="section-grid section-grid--fixed-four">
            {favoritePets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
