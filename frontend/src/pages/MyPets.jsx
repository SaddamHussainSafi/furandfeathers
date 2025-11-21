import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import PetCard from '../components/PetCard';
import SectionHero from '../components/SectionHero';

const MyPets = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyPets = async () => {
      try {
        let endpoint = '/pets/my-pets';
        if (user?.role !== 'shelter') {
          endpoint = '/applications/my-applications';
        }
        const response = await api.get(endpoint);
        setPets(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError('Failed to load your pets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyPets();
  }, [user]);

  if (!user) {
    return (
      <div className="page">
        <SectionHero title="Please sign in to view your pets" subtitle="You need to be logged in to access your pets." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <SectionHero title="My Pets" subtitle="Loading your pets..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <SectionHero title="My Pets" subtitle={error} />
      </div>
    );
  }

  return (
    <div className="page">
      <SectionHero
        badge={<span>Overview</span>}
        title={user.role === 'shelter' ? 'My Shelter Pets' : 'My Pet Applications'}
        subtitle={user.role === 'shelter' ? 'Manage the pets at your shelter' : 'Track your pet adoption applications and adopted pets'}
      />

      {pets.length === 0 ? (
        <section className="page-section">
          <div className="surface-card" style={{ textAlign: 'center' }}>
            <h3>No pets found</h3>
            <p>
              {user.role === 'shelter'
                ? "You haven't added any pets yet. Start by adding your first pet!"
                : "You haven't applied for any pets yet. Browse available pets to get started!"}
            </p>
          </div>
        </section>
      ) : (
        <section className="page-section">
          <div className="section-grid section-grid--two">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MyPets;
