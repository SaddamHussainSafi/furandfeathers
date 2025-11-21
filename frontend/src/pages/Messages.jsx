import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import api from '../api';
import SectionHero from '../components/SectionHero';
import '../styles/messages.css';

export default function Messages() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return (
      <div className="page">
        <SectionHero
          title="Please sign in to view messages"
          subtitle="You need to be logged in to access your conversations."
          badge={<span>Private area</span>}
        />
      </div>
    );
  }
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [contactQuery, setContactQuery] = useState('');

  // Check if we should start a conversation with someone
  useEffect(() => {
    if (location.state?.startConversationWith) {
      const targetUser = location.state.startConversationWith;
      startNewConversation(targetUser);
      // Clear the state to avoid re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch all users on component mount or when user changes
  useEffect(() => {
    const loadUsers = async () => {
      try {
        await fetchAllUsers();
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [user]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.email);
    }
  }, [selectedChat]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      // Fetch all users available for messaging
      const response = await api.get('/messages/users');
      // Filter out current user (should already be filtered by backend)
      const filteredUsers = response.data.filter(u => u.email !== user.email);
      setAllUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback: try a different endpoint or show an error
      alert('Unable to load users for new conversations. Please try again later.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const startNewConversation = (selectedUser) => {
    setSelectedChat(selectedUser);
    setShowNewConversation(false);
    // Clear any existing messages since this is a new conversation
    setMessages([]);
  };

  const fetchMessages = async (email) => {
    try {
      const response = await api.get(`/messages/conversation/${email}`);
      setMessages(response.data);
      // Mark messages as read
      await api.post(`/messages/mark-read/${email}`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedChat) {
      setSending(true);
      try {
        await api.post('/messages', {
          receiverEmail: selectedChat.email,
          content: message.trim()
        });
        setMessage('');
        // Refresh messages
        fetchMessages(selectedChat.email);
      } catch (error) {
        console.error('Failed to send message:', error);
        alert('Failed to send message. Please try again.');
      } finally {
        setSending(false);
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const renderAvatar = (person, size = 'md') => {
    const initials = (person?.name || person?.email || 'FF')
      .split(' ')
      .map((part) => part?.[0] || '')
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
    const avatarSrc =
      person?.profilePicture ||
      person?.picture ||
      person?.avatarUrl ||
      person?.avatar ||
      person?.photoUrl ||
      null;

    return (
      <div className={`chat-avatar ${size === 'lg' ? 'chat-avatar--lg' : ''} ${size === 'sm' ? 'chat-avatar--sm' : ''}`}>
        {avatarSrc ? (
          <img src={avatarSrc} alt={person?.name || person?.email} referrerPolicy="no-referrer" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="page">
        <SectionHero title="Messages" subtitle="Loading conversations..." />
      </div>
    );
  }

  const filteredUsers = allUsers.filter((u) => {
    const haystack = `${u.name || ''} ${u.email || ''}`.toLowerCase();
    return haystack.includes(contactQuery.trim().toLowerCase());
  });

  const todayCount = messages.filter((msg) => {
    if (!msg?.timestamp) return false;
    const date = new Date(msg.timestamp);
    const now = new Date();
    return date.toDateString() === now.toDateString();
  }).length;

  const incomingCount = messages.filter((msg) => msg?.sender?.email && msg.sender.email !== user.email).length;
  const outgoingCount = Math.max(messages.length - incomingCount, 0);

  return (
    <div className="chat-page bento-theme">
      <div className="bento-bg">
        <span className="bento-blob bento-blob--one" />
        <span className="bento-blob bento-blob--two" />
        <span className="bento-blob bento-blob--three" />
      </div>

      <div className="chat-content">
        <SectionHero
          badge={<span>Private messages</span>}
          title="Messages"
          subtitle="Connect with adopters and shelters. Your conversations help move pets into loving homes."
        />

        <div className="bento-stats">
          <div className="bento-tile bento-tile--wide">
            <div>
              <p className="bento-label">Active contacts</p>
              <h3>{allUsers.length}</h3>
              <p className="bento-sub">Click a card on the right to open a thread.</p>
            </div>
            <div className="bento-pill">Glass inbox</div>
          </div>
          <div className="bento-tile">
            <p className="bento-label">Today</p>
            <h3>{todayCount}</h3>
            <p className="bento-sub">Messages exchanged</p>
          </div>
          <div className="bento-tile">
            <p className="bento-label">Replies sent</p>
            <h3>{outgoingCount}</h3>
            <p className="bento-sub">Outgoing messages</p>
          </div>
          <div className="bento-tile">
            <p className="bento-label">Inbox</p>
            <h3>{incomingCount}</h3>
            <p className="bento-sub">New/received</p>
          </div>
        </div>

        <div className="chat-layout chat-bento">
          {/* Contacts */}
          <div className="surface-card chat-sidebar glass-card">
            <div className="chat-sidebar__header">
              <div>
                <h3 style={{ margin: 0 }}>Contacts</h3>
                <p className="bento-sub">Navigate between shelter and adopter chats.</p>
              </div>
            </div>
            <div className="chat-toolbar">
              <input
                type="search"
                placeholder="Search contacts"
                value={contactQuery}
                onChange={(e) => setContactQuery(e.target.value)}
              />
              <div className="chat-toolbar__pills">
                <span className="pill pill--soft">Glass</span>
                <span className="pill pill--soft">Secure</span>
                <span className="pill pill--soft">Real-time</span>
              </div>
            </div>
            {loadingUsers ? (
              <div className="chat-empty" style={{ padding: '1rem' }}>Loading contacts...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="chat-empty" style={{ padding: '1rem' }}>No contacts available.</div>
            ) : (
              <div className="chat-list">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className={`chat-list__item ${selectedChat?.id === u.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedChat(u)}
                  >
                    <div className="chat-list__entry">
                      {renderAvatar(u)}
                      <div>
                        <div className="chat-list__name">{u.name || u.email}</div>
                        <div className="chat-list__meta">{u.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversation */}
          <div className="chat-window-glow glass-card">
            <div className="surface-card chat-window">
              {selectedChat ? (
                <>
                  <div className="chat-window__header">
                    <div className="chat-window__person">
                      {renderAvatar(selectedChat, 'lg')}
                      <div>
                        <h4 style={{ margin: 0 }}>{selectedChat.name || selectedChat.email}</h4>
                        <span>{selectedChat.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="chat-window__body">
                    {messages.length === 0 ? (
                      <div className="chat-empty" style={{ minHeight: '220px' }}>
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const outgoing = msg.sender.email === user.email;
                        return (
                          <div
                            key={msg.id}
                            className={`chat-message ${outgoing ? 'chat-message--outgoing' : 'chat-message--incoming'}`}
                          >
                            {!outgoing && renderAvatar(msg.sender, 'sm')}
                            <div className="chat-message__content">
                              {outgoing && (
                                <div
                                  className="chat-bubble__time"
                                  style={{ textAlign: 'right', marginTop: '0.35rem' }}
                                >
                                  {formatTime(msg.timestamp)}
                                </div>
                              )}
                              <div className={`chat-bubble ${outgoing ? 'chat-bubble--outgoing' : 'chat-bubble--incoming'}`}>
                                <div>{msg.content}</div>
                              </div>
                              {!outgoing && (
                                <div
                                  className="chat-bubble__time"
                                  style={{ textAlign: 'left', marginTop: '0.35rem' }}
                                >
                                  {formatTime(msg.timestamp)}
                                </div>
                              )}
                            </div>
                            {outgoing && renderAvatar(user, 'sm')}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="chat-window__input">
                    <input
                      type="text"
                      className="chat-input"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyDown={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                      disabled={sending}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sending || !message.trim()}
                      className="site-button site-button--primary"
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="chat-empty" style={{ minHeight: '320px' }}>
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
