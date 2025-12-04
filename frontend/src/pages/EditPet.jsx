import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import PetForm from '../components/forms/PetForm';

export default function EditPet() {
  const { id } = useParams();
  const [initialPet, setInitialPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const fetchPet = async () => {
      try {
        const response = await api.get(`/pets/${id}`);

        if (isActive) {
          setInitialPet(response.data);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || 'Unable to load this pet right now.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchPet();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleUpdate = async (formData, pet) => {
    await api.put(`/pets/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return {
      message: `${pet.name || 'Pet'} updated successfully.`,
    };
  };

  return (
    <div className="page">
      {loading && (
        <section className="form-shell form-shell--loading">
          <div className="form-skeleton">
            <span className="form-skeleton__pulse" />
            <p>Loading pet profile…</p>
          </div>
        </section>
      )}

      {!loading && error && (
        <div className="form-feedback form-feedback--error">
          {error}
        </div>
      )}

      {!loading && !error && initialPet && (
        <PetForm
          initialPet={initialPet}
          headline={`Update ${initialPet.name || 'pet'}'s story`}
          subline="Refresh key details, add new photos, or adjust the adoption status. Changes are reflected instantly for every adopter and admin."
          onSubmit={handleUpdate}
          submitLabel="Save changes"
          secondaryAction={(
            <div className="form-hero__actions">
              <Link to="/manage-pets" className="site-button site-button--secondary">
                Back to Manage Pets
              </Link>
              <Link to="/add-pet" className="site-button site-button--primary">
                Add another pet
              </Link>
            </div>
          )}
        />
      )}
    </div>
  );
}
