import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { normalizeMediaUrl } from '../utils/mediaUrl';
import { unslugifyPetName, slugifyPetName } from '../utils/petSlug';
import SectionHero from '../components/SectionHero';
import PetCard from '../components/PetCard';
import PetLocationMap from '../components/map/PetLocationMap';
import '../styles/forms.css';
import '../styles/ui.css';

const RELATED_SLOT_COUNT = 4;

export default function PetDetails() {
  const { name: petSlug } = useParams();
  const name = unslugifyPetName(petSlug);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [relatedPets, setRelatedPets] = useState([]);
  const [storyMode, setStoryMode] = useState('human');
  const [likes, setLikes] = useState({ count: 0, liked: false });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const relatedSlots = Array.from({ length: RELATED_SLOT_COUNT }, (_, index) => relatedPets[index] || null);

  useEffect(() => {
    const loadPet = async () => {
      try {
        const res = await api.get(`/pets/name/${encodeURIComponent(name)}`);
        setPet(res.data);
        const petsRes = await api.get('/pets');
        setRelatedPets(
          petsRes.data
            .filter((p) => p.id !== res.data.id && p.breed === res.data.breed)
            .slice(0, 4)
        );

        const petId = res.data.id;
        const likesRes = await api.get(`/pets/${petId}/likes`);
        setLikes(likesRes.data);
        const commentsRes = await api.get(`/pets/${petId}/comments`);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Failed to load pet details', error);
      }
    };
    loadPet();
  }, [name]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await api.delete(`/pets/${pet?.id}`);
        navigate('/pets');
      } catch {
        alert('Failed to delete pet');
      }
    }
  };

  const handleMessageOwner = () => {
    if (pet?.owner) {
      navigate('/messages', { state: { startConversationWith: pet.owner } });
    }
  };

  const handleAdopt = () => {
    // Use the current slug from the URL to avoid mismatches with special characters
    if (!user) {
      navigate('/login');
      return;
    }
    if (pet?.name) {
      const targetSlug = petSlug || slugifyPetName(pet.name);
      navigate(`/adopt/${encodeURIComponent(targetSlug)}`);
    }
  };

  const handleManagePet = () => {
    if (!pet?.id) return;
    navigate(`/edit-pet/${pet.id}`);
  };

  const handleLike = async () => {
    try {
      await api.post(`/pets/${pet?.id}/like`);
      const res = await api.get(`/pets/${pet?.id}/likes`);
      setLikes(res.data);
    } catch {
      alert('Failed to toggle like');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/pets/${pet?.id}/comments`, { content: newComment.trim() });
      setNewComment('');
      const res = await api.get(`/pets/${pet?.id}/comments`);
      setComments(res.data);
    } catch {
      alert('Failed to add comment');
    }
  };

  if (!pet) {
    return (
      <div className="page">
        <SectionHero title="Loading pet details" subtitle="Fetching this pet's story..." />
      </div>
    );
  }

  const isOwner = user && pet.owner && Number(user.id) === Number(pet.owner.id);
  const canManage = isOwner && ['SHELTER', 'ADMIN', 'SUPERADMIN'].includes(user.role);
  const storyCopy =
    storyMode === 'human'
      ? pet.story ||
        `Meet ${pet.name}. This ${pet.age}-year-old ${pet.breed} is looking for a calm home to match their temperament.`
      : `Woof! I'm ${pet.name}, a ${pet.age}-year-old ${pet.breed}. I love ${pet.personality || 'long naps and crunchy treats'}.`;

  return (
    <div className="page">
      <SectionHero
        badge={<span>{pet.status || 'Available'}</span>}
        title={pet.name}
        subtitle={[pet.age && `${pet.age} years`, pet.breed, pet.location].filter(Boolean).join(' • ')}
        actions={
          <div className="form-hero__actions">
            <button type="button" className="site-button site-button--secondary" onClick={handleMessageOwner}>
              Message shelter
            </button>
            <button type="button" className="site-button site-button--primary" onClick={handleAdopt}>
              Apply to adopt
            </button>
            {canManage && (
              <>
                <button type="button" className="site-button site-button--secondary" onClick={handleManagePet}>
                  Manage this pet
                </button>
                <button type="button" className="site-button site-button--secondary" onClick={handleDelete}>
                  Delete listing
                </button>
              </>
            )}
          </div>
        }
      />

      <section className="page-section">
        <div className="section-grid section-grid--two">
          <article className="surface-card">
            <div className="form-preview" style={{ marginTop: 0 }}>
              <img src={normalizeMediaUrl(pet.imageUrl || pet.image || '/placeholder.jpg')} alt={pet.name} />
              <span>{pet.status || 'Available'}</span>
            </div>
          </article>

          <article className="surface-card">
            <div className="section-grid">
              <div>
                <h3>Details</h3>
                <ul>
                  <li>
                    <strong>Species:</strong> {pet.species || 'Unknown'}
                  </li>
                  <li>
                    <strong>Gender:</strong> {pet.gender || 'Unknown'}
                  </li>
                  <li>
                    <strong>Temperament:</strong> {pet.temperament || 'Not specified'}
                  </li>
                  <li>
                    <strong>Applications:</strong> {pet.applications?.length || pet.applications || 0}
                  </li>
                </ul>
              </div>
              <div>
                <h3>Actions</h3>
                <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                  <button className="site-button site-button--secondary" onClick={handleLike}>
                    {likes.liked ? 'Liked' : 'Like'} ({likes.count || 0})
                  </button>
                  <button className="site-button site-button--secondary" onClick={handleMessageOwner}>
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="surface-card">
          <div className="form-chip-group" role="tablist" aria-label="Story mode" style={{ marginBottom: '1rem' }}>
            {[
              { value: 'human', label: 'Shelter notes' },
              { value: 'pet', label: "Pet's perspective" }
            ].map((mode) => (
              <label
                key={mode.value}
                className={`form-chip ${storyMode === mode.value ? 'is-selected' : ''}`}
                onClick={() => setStoryMode(mode.value)}
              >
                {mode.label}
              </label>
            ))}
          </div>
          <p>{storyCopy}</p>
        </div>
      </section>

      {pet.location && (
        <section className="page-section">
          <div className="surface-card">
            <PetLocationMap address={pet.location} petName={pet.name} />
          </div>
        </section>
      )}

      {relatedPets.length > 0 && (
        <section className="page-section">
          <h2 className="section-heading">Related friends</h2>
          <div className="section-grid section-grid--fixed-four" style={{ gridAutoRows: '1fr' }}>
            {relatedSlots.map((rp, index) =>
              rp ? (
                <PetCard key={rp.id} pet={rp} />
              ) : (
                <article
                  key={`related-placeholder-${index}`}
                  className="surface-card related-card related-card--empty"
                  aria-hidden="true"
                >
                  <div className="related-card__placeholder">Awaiting new friend</div>
                </article>
              )
            )}
          </div>
        </section>
      )}

      <section className="page-section">
        <div className="surface-card">
          <h3>Comments</h3>
          <div className="form-fields">
            <textarea
              className="form-group"
              rows="3"
              placeholder="Share advice or ask a question..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="form-actions" style={{ justifyContent: 'flex-end' }}>
              <button className="site-button site-button--primary" onClick={handleAddComment}>
                Post comment
              </button>
            </div>
          </div>

          <div className="section-grid" style={{ marginTop: '1.5rem' }}>
            {comments.length === 0 ? (
              <p>No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment) => (
                <article key={comment.id} className="surface-card">
                  <strong>{comment.user?.name || 'Community member'}</strong>
                  <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
                  <p>{comment.content}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


