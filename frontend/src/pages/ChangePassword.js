import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api';

/* ── Inject fonts + keyframes + pseudo styles (once) ── */
(() => {
  if (document.getElementById('change-password-styles')) return;
  const style = document.createElement('style');
  style.id = 'change-password-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
    @keyframes cardFade { from { opacity:0; transform:translateY(20px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
    @keyframes alertIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
    .cp-input:focus {
      border-color: #00c87a !important;
      box-shadow: 0 0 0 3px rgba(0,255,163,0.18) !important;
      background: #0a1520 !important;
      outline: none;
    }
    .cp-btn:hover {
      background: linear-gradient(135deg, #00ffa3, #00c87a) !important;
      box-shadow: 0 6px 28px rgba(0,255,163,0.4) !important;
    }
    .cp-btn:active { transform: scale(0.97) !important; }
    .cp-back:hover { color: #00ffa3 !important; }
  `;
  document.head.appendChild(style);
})();

const ChangePassword = ({ user, setUser }) => {
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await changePassword({ newPassword });
      const updatedUser = { ...user, isFirstLogin: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert('Password updated successfully.');
      navigate('/');
    } catch (err) {
      console.error('Change password error:', err);
      if (err.response?.data?.msg) {
        alert('Update failed: ' + err.response.data.msg);
      } else {
        alert('Update failed. Please check if the backend server is running.');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#080b10',
      backgroundImage: `
        linear-gradient(rgba(0,255,163,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,163,0.025) 1px, transparent 1px),
        radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,255,163,0.045) 0%, transparent 65%)
      `,
      backgroundSize: '40px 40px, 40px 40px, 100% 100%',
      fontFamily: "'DM Sans', sans-serif",
      padding: '1.5rem',
    }}>

      {/* Card */}
      <div style={{
        background: '#0d1520',
        border: '1px solid #1a2b3c',
        borderRadius: '18px',
        padding: '2.5rem 2.25rem',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        overflow: 'hidden',
        animation: 'cardFade 0.5s cubic-bezier(0.22,1,0.36,1) both',
        boxShadow: '0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,255,163,0.04)',
      }}>

        {/* Top accent bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #00ffa3, #3b82f6 60%, transparent 90%)',
        }} />

        {/* Corner decoration */}
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '18px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.62rem',
          color: '#1e3448',
          letterSpacing: '0.08em',
          userSelect: 'none',
        }}>SYS::AUTH</div>

        {/* Lock icon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '52px',
          height: '52px',
          background: 'rgba(0,255,163,0.07)',
          border: '1px solid rgba(0,255,163,0.18)',
          borderRadius: '12px',
          margin: '0 auto 1.5rem',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ffa3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#dce9f5',
          textAlign: 'center',
          marginBottom: '0.6rem',
          letterSpacing: '0.03em',
        }}>
          <span style={{ color: '#00ffa3', marginRight: '0.35rem' }}>//</span>
          Set New Password
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: '0.82rem',
          color: '#6b8fa8',
          textAlign: 'center',
          marginBottom: '2rem',
          lineHeight: 1.6,
          padding: '0 0.5rem',
        }}>
          {user?.isFirstLogin
            ? 'For security, please update the default password assigned by the admin.'
            : 'Enter your new password below.'}
        </p>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #1a2b3c 30%, #1a2b3c 70%, transparent)',
          marginBottom: '1.75rem',
        }} />

        {/* Form */}
        <form onSubmit={handleUpdate}>

          {/* Label */}
          <label style={{
            display: 'block',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.67rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#6b8fa8',
            marginBottom: '0.45rem',
          }}>New Password</label>

          {/* Input */}
          <input
            className="cp-input"
            type="password"
            placeholder="Enter new secure password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.72rem 0.95rem',
              background: '#070d14',
              border: '1px solid #1a2b3c',
              borderRadius: '7px',
              color: '#dce9f5',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.84rem',
              caretColor: '#00ffa3',
              transition: 'border-color 0.18s, box-shadow 0.18s, background 0.18s',
              boxSizing: 'border-box',
              marginBottom: '1.25rem',
              display: 'block',
            }}
          />

          {/* Submit button */}
          <button
            className="cp-btn"
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              width: '100%',
              padding: '0.8rem 1.2rem',
              background: 'linear-gradient(135deg, #00c87a, #009e60)',
              color: '#001a0e',
              border: 'none',
              borderRadius: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'background 0.18s, box-shadow 0.18s, transform 0.1s',
              boxShadow: '0 2px 16px rgba(0,200,122,0.22)',
              textTransform: 'uppercase',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Update Password
          </button>
        </form>

        {/* Back link */}
        <button
          className="cp-back"
          onClick={() => navigate(-1)}
          style={{
            display: 'block',
            width: '100%',
            marginTop: '1.1rem',
            background: 'none',
            border: 'none',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.72rem',
            color: '#2e4a60',
            cursor: 'pointer',
            letterSpacing: '0.06em',
            textAlign: 'center',
            transition: 'color 0.18s',
            padding: '0.3rem',
          }}
        >
          ← go back
        </button>

      </div>
    </div>
  );
};

export default ChangePassword;
