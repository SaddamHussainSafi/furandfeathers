import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api.js';
import FurlyAvatar from '../components/ui/FurlyAvatar';
import TypingIndicator from '../components/TypingIndicator';
import { slugifyPetName } from '../utils/petSlug';
import { normalizeMediaUrl } from '../utils/mediaUrl';
import '../styles/furly-chat.css';
import '../styles/furly-chat-hero.css';

const GUEST_SESSION_KEY = 'furly_guest_session';
const SESSION_REQUEST_TIMEOUT_MS = 12000;
const SESSION_FAILOVER_MS = 9000;

const INTENT_OPTIONS = [
  {
    intent: 'PET_MATCH',
    title: 'Smart Matchmaking',
    description: 'Let Furly learn about your home life and surface compatible pets with personality notes.'
  },
  {
    intent: 'GENERAL_QA',
    title: 'Ask Adoption Questions',
    description: 'Get clarity on application steps, meet-and-greets, or policies before you submit.'
  },
  {
    intent: 'CARE_GUIDE',
    title: 'Care & Lifestyle Coaching',
    description: 'Learn about nutrition, enrichment, and routines tailored to your future pet.'
  }
];

const INTENT_LABELS = INTENT_OPTIONS.reduce((acc, option) => {
  acc[option.intent] = option.title;
  return acc;
}, {});

const INTENT_OPENERS = {
  PET_MATCH: {
    message: 'What best describes your home environment?',
    quickReplies: ['Apartment', 'House with yard', 'Shared space']
  },
  GENERAL_QA: {
    message: 'Happy to help with any pet questions. What would you like to chat about?',
    quickReplies: ['Any daily care tips?', 'What foods should I avoid?', 'How do I keep them active?']
  },
  CARE_GUIDE: {
    message: 'Hi! I can help with nutrition, routines, or enrichment. What would you like to focus on?',
    quickReplies: ['Feeding guidance', 'Training tips', 'Activity ideas']
  }
};

export default function FurlyChat() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [furlyMessages, setFurlyMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [isLaunchingSession, setIsLaunchingSession] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [pendingIntent, setPendingIntent] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [guestSessionId, setGuestSessionId] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(GUEST_SESSION_KEY);
  });
  const messagesRef = useRef(null);
  const composerRef = useRef(null);
  const mountedRef = useRef(true);
  const sessionTimerRef = useRef(null);
  const conversationIdRef = useRef(null);
  const lastSessionRef = useRef(null);

  const buildMessage = useCallback((text, isUser, recommendations = [], quickReplies = []) => {
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text,
      isUser,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendations,
      quickReplies
    };
  }, []);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current);
      }
    };
  }, []);

  // Last-resort guard: if loading persists beyond 10s, reset and show an error.
  useEffect(() => {
    if (!isLaunchingSession) return undefined;

    console.log('FurlyChat: Starting session timeout guard (10s)');
    const guard = setTimeout(() => {
      if (!mountedRef.current) return;
      console.warn('FurlyChat: Session timeout guard triggered!');
      setIsLaunchingSession(false);
      setPendingIntent(null);
      setErrorMessage('Furly did not respond in time. Please try again.');
    }, 10000);

    return () => clearTimeout(guard);
  }, [isLaunchingSession]);

  // Ensure loading flags clear as soon as we have a conversation ID
  useEffect(() => {
    if (conversationId) {
      setIsLaunchingSession(false);
      setPendingIntent(null);
    }
    // If we have a conversation but somehow lost messages, restore the opener
    if (conversationId && furlyMessages.length === 0 && lastSessionRef.current) {
      const { openingText, quickReplies } = lastSessionRef.current;
      setFurlyMessages([buildMessage(openingText, false, [], quickReplies || [])]);
    }
  }, [conversationId, furlyMessages.length, buildMessage]);

  const startSession = async (intent) => {
    if (!intent || isLaunchingSession) {
      return;
    }

    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }

    setPendingIntent(intent);
    setIsLaunchingSession(true);
    setErrorMessage('');
    setSessionComplete(false);
    setSelectedIntent(null);
    setConversationId(null);
    setFurlyMessages([]);

    try {
      const payload = {
        intent,
        guestSessionId: guestSessionId || undefined
      };
      const { data } = await api.post('/furly/session', payload, {
        timeout: SESSION_REQUEST_TIMEOUT_MS
      });

      console.log('Furly session response', data);

      console.log('FurlyChat: Checking mountedRef:', mountedRef.current);
      if (!mountedRef.current) {
        console.warn('FurlyChat: Component is unmounted, aborting state update.');
        return;
      }

      if (data.guestSessionId) {
        console.log('FurlyChat: Updating guest session ID');
        setGuestSessionId(data.guestSessionId);
        if (typeof window !== 'undefined') {
          localStorage.setItem(GUEST_SESSION_KEY, data.guestSessionId);
        }
      }

      const cid = data?.conversationId;

      if (!cid) {
        console.error('Missing conversationId in response:', data);
        setErrorMessage('Connected but no conversation ID returned. Please try again.');
        setIsLaunchingSession(false);
        setPendingIntent(null);
        return;
      }

      const openingText = data.openingMessage || INTENT_OPENERS[intent]?.message || 'Hi! How can I help?';
      const quickReplies = Array.isArray(data.quickReplies) && data.quickReplies.length > 0
        ? data.quickReplies
        : INTENT_OPENERS[intent]?.quickReplies || [];

      setConversationId(cid);
      setSelectedIntent(data.intent);
      setFurlyMessages([buildMessage(openingText, false, [], quickReplies)]);
      lastSessionRef.current = { openingText, quickReplies, intent: data.intent };
      setMessage('');

      // Force state update to ensure UI reflects the change
      if (mountedRef.current) {
        setIsLaunchingSession(false);
        setPendingIntent(null);
      }
    } catch (error) {
      console.error('Error starting Furly session:', error?.message || error);
      if (mountedRef.current) {
        const status = error?.response?.status;
        const reason = error?.code === 'ERR_CANCELED' ? 'Request timed out' : error?.message;
        const msg = status ? `Could not start the chat (${status}). Please try again.` :
          `Could not start the chat. ${reason || 'Please try again.'}`;
        setErrorMessage(msg);
        setFurlyMessages([]);
        setSelectedIntent(null);
        setConversationId(null);
        setIsLaunchingSession(false);
        setPendingIntent(null);
      }
    } finally {
      if (mountedRef.current) {
        setIsLaunchingSession(false);
        setPendingIntent(null);
      }
    }
  };

  const sendMessageToFurly = useCallback(async (content) => {
    const trimmed = content.trim();
    if (!trimmed || isTyping || !conversationId || sessionComplete) {
      return;
    }

    const outgoing = buildMessage(trimmed, true);
    setFurlyMessages((prev) => [...prev, outgoing]);
    setMessage('');
    setIsTyping(true);
    setErrorMessage('');

    try {
      const payload = {
        conversationId,
        message: trimmed,
        guestSessionId: guestSessionId || undefined
      };
      const { data } = await api.post('/furly/message', payload);

      if (!mountedRef.current) {
        return;
      }

      setConversationId(data.conversationId);
      setFurlyMessages((prev) => [
        ...prev,
        buildMessage(data.message, false, data.recommendations, data.quickReplies)
      ]);
      setSessionComplete(Boolean(data.completed));
    } catch (error) {
      console.error('Error sending message to Furly:', error);
      if (mountedRef.current) {
        setFurlyMessages((prev) => [
          ...prev,
          buildMessage('Oops, something went wrong. Please try again in a moment.', false)
        ]);
      }
    } finally {
      if (mountedRef.current) {
        setIsTyping(false);
      }
    }
  }, [buildMessage, conversationId, guestSessionId, isTyping, sessionComplete]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [furlyMessages, isTyping]);

  const handleViewPet = (pet) => {
    if (!pet) return;
    const url = pet.link || `/pet/${slugifyPetName(pet.name)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendMessage = async () => {
    sendMessageToFurly(message);
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = useCallback(() => {
    setMessage('');
    setIsTyping(false);
    setFurlyMessages([]);
    setConversationId(null);
    setSelectedIntent(null);
    setSessionComplete(false);
    setErrorMessage('');
  }, []);

  const handleQuickReplySelect = (reply) => {
    if (!reply) {
      return;
    }
    composerRef.current?.focus();
    sendMessageToFurly(reply);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const latestAssistantMessageId = furlyMessages.reduce((lastId, entry) => {
    if (!entry.isUser) {
      return entry.id;
    }
    return lastId;
  }, null);
  const isSessionReady = Boolean(conversationId);
  const isWaitingForSession = isLaunchingSession && !conversationId;

  const shouldShowChatPanel = isLaunchingSession || isSessionReady || furlyMessages.length > 0;

  return (
    <div className="furly-chat-experience">
      {!shouldShowChatPanel ? (
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
          <p className="furly-chat-hero__hint">Pick a flow below to launch Furly&apos;s guided chat.</p>
          {errorMessage && <p className="furly-chat-hero__error">{errorMessage}</p>}
          <div className="furly-chat-hero__options">
            {INTENT_OPTIONS.map((option) => (
              <button
                key={option.intent}
                type="button"
                className={`furly-chat-hero__option ${pendingIntent === option.intent ? 'is-loading' : ''}`}
                onClick={() => startSession(option.intent)}
                disabled={isLaunchingSession}
              >
                <span className="furly-chat-hero__option-title">{option.title}</span>
                <p>{option.description}</p>
                <small>{option.intent.replace('_', ' ')}</small>
              </button>
            ))}
          </div>
          {isLaunchingSession && (
            <div className="furly-chat-hero__loader-container">
              <p className="furly-chat-hero__loader">Connecting to Furly...</p>
              <button
                type="button"
                className="furly-chat-hero__cancel-btn"
                onClick={() => {
                  console.log('FurlyChat: User cancelled connection');
                  setIsLaunchingSession(false);
                  setPendingIntent(null);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <section className="furly-chat__panel">
          <header className="furly-chat__window-header">
            <div className="furly-chat__window-title">
              <div className="furly-chat__window-avatar">
                <FurlyAvatar />
              </div>
              <div>
                <p className="furly-chat__window-eyebrow">Furly assistant</p>
                <h3>AI Adoption Concierge</h3>
              </div>
            </div>
            <div className="furly-chat__window-controls">
              <div className="furly-chat__viewer">
                <div className="furly-chat__viewer-initial">{viewerInitials}</div>
                <div>
                  <strong>{viewerLabel}</strong>
                  <small>{INTENT_LABELS[selectedIntent] || 'Custom flow'}</small>
                </div>
              </div>
              <button
                type="button"
                className="furly-chat__reset"
                onClick={handleResetChat}
                disabled={isTyping}
              >
                + New Chat
              </button>
            </div>
          </header>

          <div
            className="furly-chat__messages"
            ref={messagesRef}
            aria-live="polite"
            aria-busy={isTyping}
          >
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
                                src={normalizeMediaUrl(pet.imageUrl || '/placeholder.jpg')}
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
                  {!msg.isUser &&
                    msg.id === latestAssistantMessageId &&
                    Array.isArray(msg.quickReplies) &&
                    msg.quickReplies.length > 0 && (
                      <div className="furly-chat__quick-replies">
                        {msg.quickReplies.map((reply) => (
                          <button
                            key={reply}
                            type="button"
                            onClick={() => handleQuickReplySelect(reply)}
                            disabled={isTyping || sessionComplete}
                          >
                            {reply}
                          </button>
                        ))}
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
                  <TypingIndicator />
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
              disabled={sessionComplete || !isSessionReady}
            />
            <button
              type="button"
              className="furly-chat__send"
              onClick={handleSendMessage}
              disabled={sessionComplete || isTyping || !message.trim() || !isSessionReady}
            >
              {isTyping ? 'Matching...' : 'Send'}
            </button>
            {isWaitingForSession && (
              <p className="furly-chat__composer-note">
                Connecting you to Furly&hellip; this should only take a moment.
              </p>
            )}
            {errorMessage && (
              <p className="furly-chat__composer-note furly-chat__composer-note--error">
                {errorMessage}
              </p>
            )}
            {sessionComplete && (
              <p className="furly-chat__composer-note">
                Furly finished this flow. Start a new chat to explore another path.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
