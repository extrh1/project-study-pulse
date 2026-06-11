import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Trash2, MessageSquare } from 'lucide-react';
import api from '../api/api';

const StudyAssistant = ({ lessonId, darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const theme = {
    bg: darkMode ? '#0a0a0f' : '#f8fafc',
    glass: darkMode ? 'rgba(26,26,46,0.95)' : 'rgba(248,250,252,0.95)',
    textPrimary: darkMode ? '#f8fafc' : '#0f172a',
    textSecondary: darkMode ? '#a1a1aa' : '#64748b',
    accent: darkMode ? '#a78bfa' : '#8b5cf6',
    border: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
    card: darkMode ? '#1a1a2e' : '#ffffff',
    userMsg: darkMode ? 'rgba(167, 139, 250, 0.2)' : 'rgba(139, 92, 246, 0.1)',
    assistantMsg: darkMode ? 'rgba(52, 211, 153, 0.1)' : 'rgba(16, 185, 129, 0.05)',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history
  useEffect(() => {
    loadHistory();
  }, [lessonId]);

  const loadHistory = async () => {
    try {
      const query = lessonId ? `?lesson_id=${lessonId}` : '';
      const res = await api.get(`/ai/assistant/history${query}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/ai/assistant/chat', {
        message: userMessage,
        lesson_id: lessonId || null,
      });

      // Add both user and assistant messages
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'user',
          content: userMessage,
          created_at: new Date().toISOString(),
        },
        {
          id: res.data.response.id,
          role: 'assistant',
          content: res.data.response.content,
          created_at: res.data.response.created_at,
        }
      ]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
      // Re-add the user message on error
      setInput(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (window.confirm('Clear all messages? This cannot be undone.')) {
      try {
        const query = lessonId ? `?lesson_id=${lessonId}` : '';
        await api.delete(`/ai/assistant/clear${query}`);
        setMessages([]);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to clear chat');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: '600px',
      background: theme.glass,
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: theme.textPrimary,
          margin: 0,
        }}>
          Study Assistant
        </h3>
        <button
          onClick={clearChat}
          disabled={messages.length === 0}
          title="Clear chat history"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            background: 'transparent',
            border: `1px solid ${theme.border}`,
            borderRadius: '4px',
            cursor: messages.length === 0 ? 'not-allowed' : 'pointer',
            color: theme.accent,
            fontSize: '12px',
            opacity: messages.length === 0 ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: theme.textSecondary,
            textAlign: 'center',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <MessageSquare size={32} style={{ color: theme.accent }} />
            <p style={{ margin: 0, fontSize: '14px' }}>
              Hi! I'm your study assistant. Ask me anything about this lesson!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '4px',
              }}
            >
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: msg.role === 'user' ? theme.userMsg : theme.assistantMsg,
                border: `1px solid ${msg.role === 'user' ? 'rgba(167, 139, 250, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                wordWrap: 'break-word',
              }}>
                <p style={{
                  fontSize: '14px',
                  color: theme.textPrimary,
                  margin: 0,
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginTop: '8px',
          }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: theme.assistantMsg,
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}>
              <Loader2 size={16} style={{
                color: theme.accent,
                animation: 'spin 1s linear infinite',
              }} />
              <span style={{
                fontSize: '13px',
                color: theme.textSecondary,
              }}>
                Thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '10px 16px',
          background: darkMode ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)',
          borderTop: `1px solid rgba(239,68,68,0.3)`,
          color: '#ef4444',
          fontSize: '12px',
        }}>
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} style={{
        padding: '12px',
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        gap: '8px',
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 12px',
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: '6px',
            color: theme.textPrimary,
            fontSize: '13px',
            outline: 'none',
            transition: 'all 0.2s',
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'text',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = theme.accent;
            e.target.style.boxShadow = `0 0 0 2px rgba(167, 139, 250, 0.1)`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme.border;
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 16px',
            background: theme.accent,
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 500,
            opacity: loading || !input.trim() ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          <Send size={14} />
          Send
        </button>
      </form>
    </div>
  );
};

export default StudyAssistant;
