import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SectionHero from '../components/SectionHero';
import { submitAdoptionApplication } from '../services/adoptionService';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { unslugifyPetName } from '../utils/petSlug';
import '../styles/forms.css';

const DEFAULT_FORM = {
  message: '',
  housingType: '',
  householdSize: '',
  hasOtherPets: 'no',
  otherPetsDetails: '',
  experienceLevel: '',
  dailySchedule: '',
  lifestyleNotes: '',
  adoptionTimeline: 'Within 2 weeks',
  preferredVisitWindow: '',
  contactPhone: '',
  contactEmail: '',
  addressLine: '',
  city: '',
  state: '',
  postalCode: ''
};

export default function AdoptionForm() {
  const { petSlug } = useParams();
  const petName = unslugifyPetName(petSlug || '');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [pet, setPet] = useState(null);
  const [petId, setPetId] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadPet = async () => {
      try {
        const { data } = await api.get(`/pets/name/${encodeURIComponent(petName)}`);
        setPet(data);
        setPetId(data.id);
        setForm(prev => ({
          ...prev,
          contactEmail: user?.email || '',
          contactPhone: user?.phone || '',
          city: data.location || ''
        }));
      } catch (err) {
        console.error('Failed to load pet', err);
        setError('We could not load this pet profile. Try again or pick another friend.');
      } finally {
        setLoading(false);
      }
    };

    if (petName) {
      loadPet();
    } else {
      setLoading(false);
      setError('Invalid pet reference.');
    }
  }, [petName, user]);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (!petId) {
        setError('Pet information is missing. Please reload and try again.');
        setSubmitting(false);
        return;
      }
      await submitAdoptionApplication({
        ...form,
        petId: Number(petId),
        householdSize: form.householdSize ? Number(form.householdSize) : null,
        hasOtherPets: form.hasOtherPets === 'yes'
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/applications', { state: { recentPetId: Number(petId) } });
      }, 1500);
    } catch (err) {
      console.error('Failed to submit adoption form', err);
      setError(err?.response?.data?.message || 'Unable to submit the application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <SectionHero title="Loading application" subtitle="Preparing the adoption form..." />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="page">
        <SectionHero title="Pet not found" subtitle="We could not locate this pet listing." />
      </div>
    );
  }

  return (
    <div className="page">
      <SectionHero
        badge={<span>Adoption form</span>}
        title={`Apply for ${pet.name}`}
        subtitle="Share a few details about your home so the shelter team can approve your match."
      />

      <section className="page-section">
        <div className="surface-card">
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Why is this a great match?</label>
              <textarea
                name="message"
                rows="3"
                placeholder="Tell the shelter how your lifestyle, routine, or family aligns with this pet."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Housing type</label>
              <select name="housingType" value={form.housingType} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Townhome">Townhome</option>
                <option value="Condo">Condo</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Household size</label>
              <input
                type="number"
                name="householdSize"
                min="1"
                placeholder="How many humans live with you?"
                value={form.householdSize}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Other pets at home?</label>
              <div className="form-chip-group" style={{ marginTop: '0.5rem' }}>
                {['no', 'yes'].map(option => (
                  <label key={option} className={`form-chip ${form.hasOtherPets === option ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="hasOtherPets"
                      value={option}
                      checked={form.hasOtherPets === option}
                      onChange={handleChange}
                    />
                    {option === 'yes' ? 'Yes' : 'No'}
                  </label>
                ))}
              </div>
            </div>

            {form.hasOtherPets === 'yes' && (
              <div className="form-field">
                <label>Tell us about your current pets</label>
                <textarea
                  name="otherPetsDetails"
                  rows="2"
                  placeholder="Names, species, temperament, how they respond to new friends..."
                  value={form.otherPetsDetails}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="form-field">
              <label>Experience level</label>
              <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="First-time adopter">First-time adopter</option>
                <option value="Some experience">Some experience</option>
                <option value="Very experienced">Very experienced</option>
              </select>
            </div>

            <div className="form-field">
              <label>Weekly routine</label>
              <textarea
                name="dailySchedule"
                rows="2"
                placeholder="Share work hours, travel, or help at home."
                value={form.dailySchedule}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Lifestyle notes</label>
              <textarea
                name="lifestyleNotes"
                rows="2"
                placeholder="Yard access, nearby parks, training preferences, etc."
                value={form.lifestyleNotes}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Ideal adoption timeline</label>
              <select name="adoptionTimeline" value={form.adoptionTimeline} onChange={handleChange}>
                <option value="Within 2 weeks">Within 2 weeks</option>
                <option value="Within a month">Within a month</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div className="form-field">
              <label>Preferred meet time</label>
              <input
                type="text"
                name="preferredVisitWindow"
                placeholder="e.g., Weeknights after 6PM, Sunday mornings"
                value={form.preferredVisitWindow}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Contact phone</label>
              <input
                type="tel"
                name="contactPhone"
                placeholder="(555) 123-4567"
                value={form.contactPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Contact email</label>
              <input
                type="email"
                name="contactEmail"
                placeholder="you@email.com"
                value={form.contactEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field form-field--full">
              <label>Pickup address</label>
              <input
                type="text"
                name="addressLine"
                placeholder="Street and unit"
                value={form.addressLine}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label>State</label>
              <input type="text" name="state" value={form.state} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label>Postal code</label>
              <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} required />
            </div>

            {error && (
              <div className="form-field form-field--full">
                <div className="alert alert--error">{error}</div>
              </div>
            )}

            {success && (
              <div className="form-field form-field--full">
                <div className="alert alert--success">
                  Application submitted! The shelter team will follow up shortly.
                </div>
              </div>
            )}

            <div className="form-actions form-field--full" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="site-button site-button--secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button
                type="submit"
                className="site-button site-button--primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit adoption application'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
