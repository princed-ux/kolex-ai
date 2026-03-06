'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const KOLEX_LOGO = "data:image/png;base64,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";

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'signup') {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Registration failed');
        setLoading(false);
        return;
      }
    }

    const result = await signIn('credentials', { email, password, redirect: false });

    if (result?.error) {
      setError(mode === 'signin' ? 'Invalid email or password' : 'Account created but sign in failed. Try signing in.');
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="root">
      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="grid-overlay" />

      <div className="container">
        <div className="brand">
          <img src={KOLEX_LOGO} className={loading ? 'logo spin' : 'logo'} alt="Kolex" />
          <h1 className="brand-name">Kolex</h1>
          <p className="brand-sub">Your intelligent AI assistant</p>
        </div>

        <div className="card">
          <div className="tabs">
            <button className={`tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => { setMode('signin'); setError(''); }}>
              Sign In
            </button>
            <button className={`tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(''); }}>
              Register
            </button>
          </div>

          <div className="oauth-group">
            <button className="oauth-btn" onClick={() => signIn('google', { callbackUrl: '/' })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button className="oauth-btn" onClick={() => signIn('github', { callbackUrl: '/' })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="divider"><span>or continue with email</span></div>

          <form onSubmit={handleCredentials} className="form">
            {mode === 'signup' && (
              <div className="field">
                <label>Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(p => !p)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    // Eye icon
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span /><span /><span />
                </span>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="switch-note">
            {mode === 'signin' ? (
              <>Don&apos;t have an account?{' '}
                <button className="switch-link" onClick={() => { setMode('signup'); setError(''); }}>Register</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button className="switch-link" onClick={() => { setMode('signin'); setError(''); }}>Sign In</button>
              </>
            )}
          </p>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .root {
          min-height: 100vh;
          background: #e8f8fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        /* Subtle dot grid overlay */
        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, #00bcd430 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
        }

        /* Animated orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.35;
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #00bcd4, #00838f);
          top: -160px; right: -120px;
          animation: drift1 12s ease-in-out infinite;
        }
        .orb-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, #4dd0e1, #0097a7);
          bottom: -120px; left: -100px;
          animation: drift2 15s ease-in-out infinite;
        }
        .orb-3 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, #80deea, #26c6da);
          top: 40%; left: 20%;
          animation: drift3 18s ease-in-out infinite;
        }
        .orb-4 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, #b2ebf2, #00bcd4);
          bottom: 20%; right: 15%;
          animation: drift4 14s ease-in-out infinite;
        }

        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.05); }
          66% { transform: translate(20px, -20px) scale(0.97); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -30px) scale(1.08); }
          66% { transform: translate(-20px, 40px) scale(0.95); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -50px) scale(1.1); }
        }
        @keyframes drift4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.12); }
        }

        .container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
        }

        .brand {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .logo {
          width: 64px; height: 64px;
          object-fit: contain;
          drop-shadow: 0 4px 12px rgba(0,188,212,0.3);
        }
        .spin { animation: spin 1.2s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .brand-name {
          font-size: 28px; font-weight: 700;
          color: #1a2a2a; margin: 0;
          letter-spacing: -0.5px;
        }
        .brand-sub {
          font-size: 14px; color: #889;
          margin: 0; font-weight: 400;
        }

        .card {
          width: 100%;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 8px 32px rgba(0,188,212,0.12), 0 1px 4px rgba(0,0,0,0.06);
          border: 1px solid rgba(255,255,255,0.7);
        }

        .tabs {
          display: flex;
          background: #f0fafa;
          border-radius: 10px;
          padding: 3px;
          margin-bottom: 24px;
        }
        .tab {
          flex: 1; padding: 8px;
          background: none; border: none;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          color: #889; cursor: pointer;
          transition: all 0.2s;
        }
        .tab.active {
          background: #fff; color: #00bcd4;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .oauth-group {
          display: flex; flex-direction: column;
          gap: 8px; margin-bottom: 20px;
        }
        .oauth-btn {
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
          padding: 11px 16px;
          background: rgba(255,255,255,0.9);
          border: 1.5px solid #e0eeee;
          border-radius: 12px; color: #334;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          width: 100%;
        }
        .oauth-btn:hover {
          border-color: #00bcd4;
          background: #f0fafa;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,188,212,0.1);
        }

        .divider {
          display: flex; align-items: center;
          gap: 10px; margin: 16px 0;
          color: #bbc; font-size: 12px;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1;
          height: 1px; background: #e8f0f0;
        }

        .form {
          display: flex; flex-direction: column;
          gap: 14px;
        }
        .field {
          display: flex; flex-direction: column;
          gap: 5px;
        }
        .field label {
          font-size: 12px; font-weight: 500;
          color: #556;
        }
        .field input {
          padding: 11px 14px;
          background: #f7fbfb;
          border: 1.5px solid #e0eeee;
          border-radius: 10px; color: #223;
          font-family: 'Inter', sans-serif;
          font-size: 14px; outline: none;
          transition: all 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .field input:focus {
          border-color: #00bcd4;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,188,212,0.1);
        }
        .field input::placeholder { color: #bbc; }

        /* Password input with eye button */
        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-wrap input {
          padding-right: 42px;
        }
        .eye-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: #99a;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: color 0.2s;
          line-height: 0;
        }
        .eye-btn:hover { color: #00bcd4; }

        .error {
          background: #fff5f5;
          border: 1px solid #ffcccc;
          border-radius: 8px;
          padding: 10px 14px;
          color: #cc3344; font-size: 13px;
        }

        .submit-btn {
          margin-top: 4px; padding: 13px;
          background: #00bcd4; border: none;
          border-radius: 12px; color: white;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center;
          justify-content: center; min-height: 46px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #00acc1;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,188,212,0.35);
        }
        .submit-btn:disabled {
          opacity: 0.7; cursor: not-allowed;
          transform: none;
        }

        .btn-loading {
          display: flex; gap: 4px;
          align-items: center;
        }
        .btn-loading span {
          width: 6px; height: 6px;
          background: white; border-radius: 50%;
          animation: bounce 0.8s infinite;
        }
        .btn-loading span:nth-child(2) { animation-delay: 0.15s; }
        .btn-loading span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        .switch-note {
          margin-top: 16px;
          font-size: 12px; color: #aab;
          text-align: center; line-height: 1.5;
        }
        .switch-link {
          background: none; border: none;
          color: #00bcd4; font-size: 12px;
          font-weight: 600; cursor: pointer;
          padding: 0; font-family: 'Inter', sans-serif;
          text-decoration: underline;
        }
        .switch-link:hover { color: #00acc1; }
      `}</style>
    </div>
  );
}