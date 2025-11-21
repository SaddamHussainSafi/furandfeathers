import React from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import PetForm from '../components/forms/PetForm';

export default function AddPet() {
  const handleCreate = async (formData) => {
    await api.post('/pets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return {
      message: 'Pet profile published. Head to Manage Pets to fine tune details.',
    };
  };

  return (
    <div className="page">
      <PetForm
        headline="Add a new pet profile"
        subline="A detailed profile helps the right family discover this pet quickly. Photos, personality notes, and status updates guide adopters of every experience level."
        onSubmit={handleCreate}
        submitLabel="Publish pet"
        secondaryAction={(
          <div className="form-hero__actions">
            <Link to="/manage-pets" className="site-button site-button--secondary">
              Go to Manage Pets
            </Link>
            <Link to="/my-pets" className="site-button site-button--primary">
              View my pets
            </Link>
          </div>
        )}
      />
    </div>
  );
}
