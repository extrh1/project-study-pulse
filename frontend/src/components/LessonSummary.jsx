import React, { useState } from 'react';
import { Loader2, Copy, Download, RefreshCw, CheckCircle, HelpCircle, Book, Lightbulb } from 'lucide-react';
import api from '../api/api';

const LessonSummary = ({ lessonId, darkMode }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const theme = {
    bg: darkMode ? '#0a0a0f' : '#f8fafc',
    glass: darkMode ? 'rgba(26,26,46,0.95)' : 'rgba(248,250,252,0.95)',
    textPrimary: darkMode ? '#f8fafc' : '#0f172a',
    textSecondary: darkMode ? '#a1a1aa' : '#64748b',
    accent: darkMode ? '#a78bfa' : '#8b5cf6',
    accentHover: darkMode ? '#c084fc' : '#a78bfa',
    border: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
    card: darkMode ? '#1a1a2e' : '#ffffff',
    success: '#10b981',
  };

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/ai/summary/lesson/${lessonId}`);
      setSummary(res.data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!summary) return;
    navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSummary = () => {
    if (!summary) return;
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `lesson-summary-${lessonId}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
        <Loader2 size={48} style={{ color: theme.accent, animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ color: theme.textSecondary }}>Generating summary...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: '20px', background: darkMode ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)', border: `1px solid ${darkMode ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '8px', color: '#ef4444', textAlign: 'center' }}>
        <p>{error}</p>
        <button onClick={generateSummary} style={{ marginTop: '12px', padding: '8px 16px', background: theme.accent, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
          Try Again
        </button>
      </div>
    );
  }

  // Initial state — button to generate
  if (!summary) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Book size={40} style={{ color: theme.accent, marginBottom: '16px' }} />
        <p style={{ color: theme.textSecondary, marginBottom: '16px' }}>
          Generate an AI summary for this lesson
        </p>
        <button
          onClick={generateSummary}
          style={{ padding: '10px 24px', background: theme.accent, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
        >
          Generate Summary
        </button>
      </div>
    );
  }

  // Summary display
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: `1px solid ${theme.border}` }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: theme.textPrimary, margin: 0 }}>Lesson Summary</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', color: theme.accent, fontSize: '12px' }}>
            <Copy size={16} /> {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={downloadSummary} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', color: theme.accent, fontSize: '12px' }}>
            <Download size={16} /> Download
          </button>
          <button onClick={generateSummary} title="Regenerate" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '4px', cursor: 'pointer', color: theme.accent, fontSize: '12px' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Title */}
      {summary.title && (
        <h4 style={{ fontSize: '16px', fontWeight: 600, color: theme.accent, margin: 0 }}>{summary.title}</h4>
      )}

      {/* Overview */}
      {summary.overview && (
        <div>
          <p style={{ fontSize: '13px', fontWeight: 500, color: theme.textSecondary, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Overview</p>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: theme.textPrimary, margin: 0 }}>{summary.overview}</p>
        </div>
      )}

      {/* Key Points */}
      {summary.keyPoints?.length > 0 && (
        <div>
          <p style={{ fontSize: '13px', fontWeight: 500, color: theme.textSecondary, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Points</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {summary.keyPoints.map((point, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: theme.textPrimary }}>
                <CheckCircle size={16} style={{ color: theme.accent, minWidth: '20px', flexShrink: 0 }} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concepts */}
      {summary.concepts && Object.keys(summary.concepts).length > 0 && (
        <div>
          <p style={{ fontSize: '13px', fontWeight: 500, color: theme.textSecondary, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Important Concepts</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(summary.concepts).map(([concept, explanation], idx) => (
              <div key={idx} style={{ padding: '12px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '6px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: theme.accent, margin: '0 0 6px 0' }}>{concept}</p>
                <p style={{ fontSize: '13px', color: theme.textPrimary, margin: 0, lineHeight: '1.5' }}>{explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {summary.tips?.length > 0 && (
        <div>
          <p style={{ fontSize: '13px', fontWeight: 500, color: theme.textSecondary, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Study Tips</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {summary.tips.map((tip, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: theme.textPrimary }}>
                <Lightbulb size={16} style={{ color: theme.success, minWidth: '20px', flexShrink: 0 }} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Review Questions */}
      {summary.reviewQuestions?.length > 0 && (
        <div>
          <p style={{ fontSize: '13px', fontWeight: 500, color: theme.textSecondary, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Review Questions</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {summary.reviewQuestions.map((question, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: theme.textPrimary }}>
                <HelpCircle size={16} style={{ color: theme.accent, minWidth: '20px', flexShrink: 0 }} />
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LessonSummary;