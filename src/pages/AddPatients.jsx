// src/pages/AddPatient.jsx
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function AddPatient() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setError('Name and phone are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Auto-generate patient ID (you can enhance this later)
      const patientId = `PASI-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

      await addDoc(collection(db, 'patients'), {
        patientId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        notes: notes.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setSuccess(true);
      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setNotes('');
    } catch (err) {
      console.error(err);
      setError('Failed to save patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginBottom: '24px',
            color: '#228B22',
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ← Back to Dashboard
        </button>

        <h1 style={{ fontSize: '24px', color: '#333', fontWeight: '600', marginBottom: '24px' }}>
          Add New Patient
        </h1>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            ✅ Patient saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #e5e7eb',
                outline: 'none'
              }}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '6px' }}>
              Phone *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #e5e7eb',
                outline: 'none'
              }}
              placeholder="0712 345 678"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '6px' }}>
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #e5e7eb',
                outline: 'none'
              }}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '6px' }}>
              Address (Optional)
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #e5e7eb',
                outline: 'none',
                minHeight: '80px',
                resize: 'vertical'
              }}
              placeholder="Nairobi, Kenya"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '6px' }}>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #e5e7eb',
                outline: 'none',
                minHeight: '80px',
                resize: 'vertical'
              }}
              placeholder="Allergies, medical history, etc."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
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
            {loading ? 'Saving...' : 'Save Patient'}
          </button>
        </form>
      </div>
    </div>
  );
}