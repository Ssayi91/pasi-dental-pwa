// src/pages/Login.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Montserrat,-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#333333'
        }}>
          Pasi<span style={{ fontWeight: 600, color: '#228B22' }}>Dental</span>
        </h1>
        <p style={{ marginTop: '8px', fontSize: '16px', color: '#6b7280' }}>
          Clinic Management System
        </p>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '700',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #e5e7eb',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
              placeholder="you@pasidentalcare.co.ke"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #e5e7eb',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#228B22',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Enter Clinic'}
          </button>
        </form>
      </div>
    </div>
  );
}