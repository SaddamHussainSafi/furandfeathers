import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import CatLoader from '../components/CatLoader';
import FurlyAvatar from '../components/ui/FurlyAvatar';
import { slugifyPetName } from '../utils/petSlug';
import '../styles/furly-chat.css';
import '../styles/furly-chat-hero.css';

export default function FurlyChat() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [furlyMessages, setFurlyMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesRef = useRef(null);
  const composerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const buildMessage = useCallback((text, isUser, recommendations) => {
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text,
      isUser,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendations
    };
  }, []);

  const fetchWelcomeMessage = useCallback(async () => {
    try {
      const response = await api.post('/furly/reset');
      const { response: text, recommendations } = response.data;
      return buildMessage(text, false, recommendations);
    } catch (error) {
      console.error('Error loading initial message:', error);
      return buildMessage(
        "Hi there! I'm Furly, your pet-matching assistant. Tell me about your home, schedule, and dream pet so I can suggest the perfect match.",
        false
      );
    }
  }, [buildMessage]);

  useEffect(() => {
    let isActive = true;
    setInitializing(false); // Start ready, no auto-message

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [furlyMessages, isTyping]);

  const handleViewPet = (pet) => {
    if (!pet) return;
    if (pet.link) {
      window.open(pet.link, '_blank', 'noopener');
      return;
    }
    if (pet.name) {
      navigate(`/pet/${slugifyPetName(pet.name)}`);
    }
  };

  const handleSendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || isTyping) {
      return;
    }

    const outgoing = buildMessage(trimmed, true);
    setFurlyMessages((prev) => [...prev, outgoing]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await api.post('/furly/chat', { message: trimmed });
      const { response: text, recommendations } = response.data;
      const incoming = buildMessage(text, false, recommendations);
      setFurlyMessages((prev) => [...prev, incoming]);
    } catch (error) {
      console.error('Error sending message to Furly:', error);
      setFurlyMessages((prev) => [
        ...prev,
        buildMessage('Oops, something went wrong. Please try again in a moment.', false)
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = useCallback(async () => {
    setMessage('');
    setIsTyping(false);
    setInitializing(true);
    const welcome = await fetchWelcomeMessage();
    if (!mountedRef.current) {
      return;
    }
    setFurlyMessages([welcome]);
    setInitializing(false);
  }, [fetchWelcomeMessage]);

  const handleQuickAction = (prompt) => {
    if (!prompt) return;
    setMessage(prompt);
    composerRef.current?.focus();
  };

  const viewerLabel = user?.name || 'Guest visitor';
  const firstName = viewerLabel.split(' ')[0] || 'friend';
  const viewerInitials =
    viewerLabel
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'FF';

  const quickActions = [
    {
      title: 'Describe my home',
      description: 'Share details about space, schedule, and other pets.',
      prompt: 'I live in a ...'
    },
    {
      title: 'See nearby pets',
      description: 'Request adoptable pets that fit my lifestyle.',
      prompt: 'Show me adoptable pets near me that are ...'
    },
    {
      title: 'Ask anything',
      description: 'Care tips, introductions, and adoption steps.',
      prompt: 'What should I know about adopting a ...'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="furly-chat-experience">
      {furlyMessages.length === 0 ? (
        <div className="furly-chat-hero-centered">
          <div className="furly-chat-hero__avatar">
            <FurlyAvatar size="large" />
          </div>
          <h1 className="furly-chat-hero__title">
            {getGreeting()}, {firstName}
          </h1>
          <h2 className="furly-chat-hero__subtitle">
            How Can I <span>Assist You Today?</span>
          </h2>
          
          <div className="furly-chat-hero__composer">
            <div className="furly-chat-hero__input-wrapper">
              <span className="furly-chat-hero__sparkle">✨</span>
              <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder="Initiate a query or send a command to the AI..."
                autoFocus
              />
            </div>
            <div className="furly-chat-hero__actions">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  className="furly-chat-hero__action-btn"
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  {action.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <section className="furly-chat__panel">
          <header className="furly-chat__window-header">
            <div className="furly-chat__window-title">
              <div className="furly-chat__window-dot" aria-hidden="true" />
              <div>
                <p className="furly-chat__window-eyebrow">Furly assistant</p>
                <h3>AI Adoption Concierge</h3>
              </div>
            </div>
            <div className="furly-chat__window-controls">
              <button
                type="button"
                className="furly-chat__reset"
                onClick={handleResetChat}
                disabled={initializing}
              >
                + New Chat
              </button>
            </div>
          </header>

          <div
            className="furly-chat__messages"
            ref={messagesRef}
            aria-live="polite"
            aria-busy={initializing}
          >
            {initializing && (
              <div className="furly-chat__initializing">
                <CatLoader label="Furly is warming up your matches..." />
              </div>
            )}

            {furlyMessages.map((msg) => (
              <article
                key={msg.id}
                className={`furly-chat__message ${msg.isUser ? 'is-user' : ''}`}
              >
                {!msg.isUser && (
                  <div className="furly-chat__avatar" aria-hidden="true">
                    <FurlyAvatar />
                  </div>
                )}
                <div className="furly-chat__bubble">
                  <p>{msg.text}</p>
                  {Array.isArray(msg.recommendations) && msg.recommendations.length > 0 && (
                    <div className="furly-chat__recommendations">
                      <p className="furly-chat__recommendations-label">Matches to explore</p>
                      <div className="furly-chat__recommendation-grid">
                        {msg.recommendations.map((pet) => (
                          <article
                            key={pet.id || pet.name}
                            className="furly-chat__recommendation-card"
                          >
                            <div className="furly-chat__recommendation-media">
                              <img
                                src={pet.imageUrl || '/placeholder.jpg'}
                                alt={pet.name}
                                loading="lazy"
                              />
                            </div>
                            <div className="furly-chat__recommendation-body">
                              <strong>{pet.name}</strong>
                              <span>
                                {[pet.breed, pet.age && `${pet.age} yrs`, pet.location]
                                  .filter(Boolean)
                                  .join(' | ')}
                              </span>
                              {pet.description && <p>{pet.description}</p>}
                              <button
                                type="button"
                                className="site-button site-button--secondary furly-chat__recommendation-button"
                                onClick={() => handleViewPet(pet)}
                              >
                                View profile
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                  <span className="furly-chat__time">{msg.time}</span>
                </div>
              </article>
            ))}

            {isTyping && (
              <article className="furly-chat__message">
                <div className="furly-chat__avatar" aria-hidden="true">
                  <FurlyAvatar />
                </div>
                <div className="furly-chat__bubble furly-chat__bubble--typing">
                  <CatLoader label="Furly is typing" />
                </div>
              </article>
            )}
          </div>

          <div className="furly-chat__composer">
            <textarea
              rows={2}
              ref={composerRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Tell Furly about your living situation, routines, or dream pet..."
            />
            <button
              type="button"
              className="furly-chat__send"
              onClick={handleSendMessage}
              disabled={isTyping || !message.trim()}
            >
              {isTyping ? 'Matching...' : 'Send'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
