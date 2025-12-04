import React from 'react';
import { Link } from 'react-router-dom';
import { slugifyPetName } from '../utils/petSlug';
import '../styles/pet-card.css';
import { normalizeMediaUrl } from '../utils/mediaUrl';

const placeholderImage = 'https://place-puppy.com/400x400';

const truncateWords = (text, limit) => {
  if (!text) return '';
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= limit) return words.join(' ');
  return `${words.slice(0, limit).join(' ')}...`;
};

const resolveImageSrc = (...sources) => {
  for (const value of sources) {
    if (!value) continue;
    if (typeof value === 'string' && value.trim().length > 0) {
      const trimmed = value.trim();
      const sanitized = trimmed.replace(/\\/g, '/');
      const normalized = normalizeMediaUrl(sanitized);
      if (normalized) return normalized;
    }
  }
  return null;
};

const getCityFromLocation = (value) => {
  if (!value || typeof value !== 'string') return null;
  const [city] = value.split(',');
  return city?.trim() || value.trim();
};

const PetCard = ({ pet }) => {
  const imgSrc =
    resolveImageSrc(pet.imageUrl, pet.imagePath, pet.image, pet.image_url) || placeholderImage;

  const descriptionText = pet.description || `${pet.breed || pet.category || 'A companion'} looking for a home.`;
  const shortDesc = truncateWords(descriptionText, 5);
  const metaPrimary = pet.breed || pet.species || pet.category || 'Mixed companion';
  const metaSecondary = pet.age ? `${pet.age} yrs old` : null;
  const locationLabel =
    getCityFromLocation(pet.location) || pet.shelter || 'City shared after match';

  const slug = slugifyPetName(pet.name);

  return (
    <Link to={`/pet/${slug}`} className="pet-card pet-card--clickable" aria-label={`View ${pet.name}`}>
      <div className="pet-card__media">
        <img src={imgSrc} alt={pet.name} loading="lazy" />
        {pet.status && (
          <>
            <div className="pet-card__status-pill">
              <span
                className={`pet-card__status-dot pet-card__status-dot--${pet.status.toLowerCase()}`}
                aria-hidden="true"
              />
              <span className="pet-card__status-text">{pet.status}</span>
            </div>
            {pet.gender && (
              <span className="pet-card__gender-badge" title="Gender">
                {pet.gender}
              </span>
            )}
          </>
        )}
      </div>

      <div className="pet-card__body">
        <div className="pet-card__meta">
          <span>{metaPrimary}</span>
          {metaSecondary && (
            <>
              <span className="pet-card__dot" aria-hidden="true" />
              <span>{metaSecondary}</span>
            </>
          )}
        </div>

        <h3 className="pet-card__name">{pet.name}</h3>
        <span className="pet-card__location pet-card__location--subtle">{locationLabel}</span>
        {shortDesc && <p className="pet-card__desc">{shortDesc}</p>}
      </div>

      <div className="pet-card__footer">
        <span className="pet-card__cta">View profile</span>
      </div>
    </Link>
  );
};

export default PetCard;
