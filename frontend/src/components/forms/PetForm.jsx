import React, { useEffect, useMemo, useState } from 'react';
import { PawPrint, Sparkles, UploadCloud, Info } from 'lucide-react';
import AddressPicker from '../map/AddressPicker';
import '../../styles/forms.css';

const DEFAULT_PET = {
  name: '',
  species: '',
  breed: '',
  age: '',
  gender: '',
  location: '',
  description: '',
  status: 'Available',
  image: null,
};

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Reptile', 'Small animal', 'Farm animal', 'Other'];
const GENDER_OPTIONS = ['Male', 'Female', 'Unknown'];
const STATUS_OPTIONS = ['Available', 'Pending', 'Adopted'];

const normaliseStatus = (value) => {
  if (!value) return 'Available';
  const lower = String(value).toLowerCase();
  const match = STATUS_OPTIONS.find((option) => option.toLowerCase() === lower);
  return match || value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const getPreviewFromPet = (data) => {
  if (!data) return null;
  if (data.image instanceof File) return URL.createObjectURL(data.image);
  if (typeof data.image === 'string') return data.image;
  if (data.imageUrl) return data.imageUrl;
  if (data.image_url) return data.image_url;
  return null;
};

const buildFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (['id', 'createdAt', 'updatedAt', 'image_url', 'imageUrl', 'applications'].includes(key)) {
      return;
    }

    if (value === undefined || value === null || value === '') {
      return;
    }

    if (key === 'image') {
      if (value instanceof File) {
        formData.append(key, value);
      }
      return;
    }

    formData.append(key, value);
  });
  return formData;
};

function PetFormSection({ icon: Icon, title, description, children }) {
  return (
    <section className="form-shell">
      <header className="form-shell__header">
        <div className="form-shell__icon">
          <Icon size={22} />
        </div>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

export default function PetForm({
  headline = 'Tell us about this pet',
  subline = 'Share as much as you can so adopters fall in love before they even meet.',
  initialPet,
  onSubmit,
  submitLabel = 'Save pet',
  secondaryAction,
  onSuccess,
}) {
  const [pet, setPet] = useState(() => ({
    ...DEFAULT_PET,
    ...initialPet,
    status: normaliseStatus(initialPet?.status || DEFAULT_PET.status),
  }));
  const [preview, setPreview] = useState(() => getPreviewFromPet(initialPet));
  const [descriptionCount, setDescriptionCount] = useState(() => pet.description?.length || 0);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPet((prev) => ({
      ...DEFAULT_PET,
      ...initialPet,
      status: normaliseStatus(initialPet?.status || prev.status),
    }));
    setPreview((previousPreview) => {
      if (previousPreview && previousPreview.startsWith('blob:')) {
        URL.revokeObjectURL(previousPreview);
      }
      return getPreviewFromPet(initialPet);
    });
    setDescriptionCount(initialPet?.description?.length || 0);
  }, [initialPet]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const ageDisplay = useMemo(() => {
    const value = pet.age;
    if (!value) return 'Age in years';
    return /year/i.test(value) ? value : `${value} years`;
  }, [pet.age]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files && files[0]) {
      const file = files[0];
      setPet((prev) => ({ ...prev, [name]: file }));
      const nextPreview = URL.createObjectURL(file);
      setPreview((previousPreview) => {
        if (previousPreview && previousPreview.startsWith('blob:')) {
          URL.revokeObjectURL(previousPreview);
        }
        return nextPreview;
      });
      return;
    }

    const nextValue = name === 'status' ? normaliseStatus(value) : value;
    setPet((prev) => ({ ...prev, [name]: nextValue }));

    if (name === 'description') {
      setDescriptionCount(nextValue.length);
    }
  };

  const handleAddressChange = (address) => {
    setPet((prev) => ({
      ...prev,
      location: address
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const formData = buildFormData(pet);
      const result = await onSubmit(formData, pet);
      setFeedback({ type: 'success', message: result?.message || 'Pet saved successfully.' });
      if (!initialPet) {
        setPet({ ...DEFAULT_PET });
        setPreview((previousPreview) => {
          if (previousPreview && previousPreview.startsWith('blob:')) {
            URL.revokeObjectURL(previousPreview);
          }
          return null;
        });
        setDescriptionCount(0);
      }
      if (onSuccess) {
        onSuccess(result, pet);
      }
    } catch (error) {
      const apiMessage = error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
      setFeedback({ type: 'error', message: apiMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-hero glass-ribbon">
        <div className="form-hero__badge">
          <Sparkles size={16} />
          Curated for every role
        </div>
        <h1>{headline}</h1>
        <p>{subline}</p>
        {secondaryAction}
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <PetFormSection
          icon={PawPrint}
          title="Pet identity"
          description="Basics that help adopters find the right companion quickly."
        >
          <div className="form-fields form-fields--two">
            <label className="form-group">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={pet.name}
                onChange={handleChange}
                placeholder="Luna, Cooper, Mochi..."
                required
              />
            </label>
            <label className="form-group">
              <span>Species</span>
              <select name="species" value={pet.species} onChange={handleChange} required>
                <option value="" disabled>
                  Select species
                </option>
                {SPECIES_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-group">
              <span>Breed</span>
              <input
                type="text"
                name="breed"
                value={pet.breed}
                onChange={handleChange}
                placeholder="Australian shepherd mix"
                required
              />
            </label>
            <label className="form-group">
              <span>Gender</span>
              <div className="form-chip-group">
                {GENDER_OPTIONS.map((option) => {
                  const id = `gender-${option.toLowerCase()}`;
                  const checked = pet.gender?.toLowerCase() === option.toLowerCase();
                  return (
                    <label key={option} htmlFor={id} className={`form-chip ${checked ? 'is-selected' : ''}`}>
                      <input
                        id={id}
                        type="radio"
                        name="gender"
                        value={option}
                        checked={checked}
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            </label>
            <label className="form-group">
              <span>Age</span>
              <input
                type="text"
                name="age"
                value={pet.age}
                onChange={handleChange}
                placeholder="3"
                inputMode="numeric"
                aria-describedby="age-helper"
                required
              />
              <small id="age-helper" className="form-helper">
                {ageDisplay}
              </small>
            </label>
            <div className="form-group">
              <AddressPicker
                label="Home address"
                value={pet.location}
                onChange={handleAddressChange}
                placeholder="123 Grayson St, Austin, TX"
                required
                helperText="Your full address stays private. Only the city shows publicly."
              />
            </div>
          </div>
        </PetFormSection>

        <PetFormSection
          icon={Info}
          title="Adoption profile"
          description="Set expectations about availability and personality."
        >
          <div className="form-fields">
            <label className="form-group">
              <span>Current status</span>
              <div className="form-status">
                {STATUS_OPTIONS.map((option) => {
                  const value = option;
                  const isActive = pet.status?.toLowerCase() === option.toLowerCase();
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`status-pill ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleChange({ target: { name: 'status', value } })}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </label>

            <label className="form-group">
              <span>Description</span>
              <textarea
                name="description"
                value={pet.description}
                onChange={handleChange}
                rows={6}
                placeholder="Share temperament, favourite activities, and the ideal home."
              />
              <div className="form-helper form-helper--counter">
                <span>{descriptionCount} characters</span>
                <span>Keep it friendly and honest.</span>
              </div>
            </label>
          </div>
        </PetFormSection>

        <PetFormSection
          icon={UploadCloud}
          title="Visuals"
          description="A clear photo makes the profile sparkle."
        >
          <div className="form-fields">
            <label className="form-group">
              <span>Featured image</span>
              <div className="file-drop">
                <input type="file" accept="image/*" name="image" onChange={handleChange} />
                <div className="file-drop__content">
                  <UploadCloud size={24} />
                  <p>
                    Drag and drop or <span>browse</span>
                  </p>
                  <small>High-resolution JPG or PNG, up to 10 MB.</small>
                </div>
              </div>
            </label>
            {preview && (
              <div className="form-preview">
                <img src={preview} alt={pet.name || 'Pet preview'} />
                <span>Preview</span>
              </div>
            )}
          </div>
        </PetFormSection>

        {feedback && (
          <div className={`form-feedback form-feedback--${feedback.type}`}>
            {feedback.message}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="site-button site-button--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
          <button
            type="reset"
            className="site-button site-button--secondary"
            onClick={() => {
              setPet({
                ...DEFAULT_PET,
                ...initialPet,
                status: normaliseStatus(initialPet?.status || DEFAULT_PET.status),
              });
              setPreview((previousPreview) => {
                if (previousPreview && previousPreview.startsWith('blob:')) {
                  URL.revokeObjectURL(previousPreview);
                }
                return getPreviewFromPet(initialPet);
              });
              setDescriptionCount(initialPet?.description?.length || 0);
            }}
            disabled={isSubmitting}
          >
            Reset form
          </button>
        </div>
      </form>
    </div>
  );
}

