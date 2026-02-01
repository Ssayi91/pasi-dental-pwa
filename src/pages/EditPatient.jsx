// src/pages/EditPatient.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const docRef = doc(db, 'patients', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setAddress(data.address || '');
          setDob(data.dob || '');
          setGender(data.gender || '');
          setNotes(data.notes || '');
        } else {
          alert("Patient not found");
          navigate('/patients');
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load patient");
        navigate('/patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Full name is required.");
    if (!phone.trim()) return setError("Phone number is required.");

    setSaving(true);
    setError('');

    try {
      const docRef = doc(db, 'patients', id);
      await updateDoc(docRef, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        dob: dob || null,
        gender: gender || null,
        notes: notes.trim(),
        updatedAt: new Date()
      });
      navigate(`/patients/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update patient. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{
      backgroundImage: 'url(/pasi-bg.png)',
      backgroundSize: 'cover',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ color: '#228B22', fontSize: '18px' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{
      backgroundImage: 'url(/pasi-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundColor: '#f0f9f4',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: "'Montserrat', sans-serif",
      color: '#2d3748',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        zIndex: 0
      }}></div>

      <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{ fontSize: '24px', color: '#228B22', fontWeight: '600' }}>
            Edit Patient
          </h1>
          <button
            onClick={() => navigate(`/patients/${id}`)}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              color: '#228B22',
              border: '1px solid #228B22',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>
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
                borderBottom: '1px solid #cbd5e0',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
              placeholder="e.g., Jane Wanjiru"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>
              Phone Number *
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
                borderBottom: '1px solid #cbd5e0',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
              placeholder="0712 345 678"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>
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
                borderBottom: '1px solid #cbd5e0',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
              placeholder="jane@example.com"
            />
          </div>

          {/* Address */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>
              Address (Optional)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #cbd5e0',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
              placeholder="Westlands, Nairobi"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #cbd5e0',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          {/* Gender */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>
              Gender (Optional)
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #cbd5e0',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: 'none',
                borderBottom: '1px solid #cbd5e0',
                outline: 'none',
                resize: 'vertical',
                backgroundColor: 'transparent'
              }}
              placeholder="Allergies, medical history, etc."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '14px',
              backgroundColor: '#228B22',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.8 : 1
            }}
          >
            {saving ? 'Saving...' : 'Update Patient'}
          </button>
        </form>
      </div>
    </div>
  );
}