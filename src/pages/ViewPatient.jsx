// src/pages/ViewPatient.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ViewPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const docRef = doc(db, 'patients', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPatient({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("Patient not found");
          navigate('/dashboard');
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load patient");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Delete this patient? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'patients', id));
        navigate('/dashboard');
      } catch (err) {
        alert("Failed to delete patient");
      }
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

  if (!patient) return null;

  // Format DOB safely
  const dobFormatted = patient.dob 
    ? new Date(patient.dob).toLocaleDateString('en-KE')
    : null;

  return (
    <div
      style={{
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
      }}
    >
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        zIndex: 0
      }}></div>

      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            color: '#228B22', 
            fontWeight: '600' 
          }}>
            Patient Details
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
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
            ← Dashboard
          </button>
        </div>

        {/* Patient Card */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '24px 24px 16px',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <h2 style={{ 
              fontSize: '22px', 
              margin: 0,
              color: '#228B22'
            }}>
              {patient.name}
            </h2>
          </div>

          {/* Sections */}
          <div style={{ padding: '24px' }}>
            
            {/* Contact Info */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: '#4a5568',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📞 Contact Information
              </h3>
              <div style={{ paddingLeft: '4px' }}>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Phone:</strong> {patient.phone}
                </div>
                {patient.email && (
                  <div style={{ marginBottom: '6px' }}>
                    <strong>Email:</strong> {patient.email}
                  </div>
                )}
                {patient.address && (
                  <div>
                    <strong>Address:</strong> {patient.address}
                  </div>
                )}
              </div>
            </div>

            {/* Personal Info */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: '#4a5568',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                👤 Personal Details
              </h3>
              <div style={{ paddingLeft: '4px' }}>
                {dobFormatted && (
                  <div style={{ marginBottom: '6px' }}>
                    <strong>Date of Birth:</strong> {dobFormatted}
                  </div>
                )}
                {patient.gender && (
                  <div style={{ marginBottom: '6px' }}>
                    <strong>Gender:</strong> {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                  </div>
                )}
                <div>
                  <strong>Patient ID:</strong> <span style={{ color: '#228B22' }}>{patient.patientId}</span>
                </div>
              </div>
            </div>

            {/* Medical Notes */}
            {patient.notes && (
              <div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '12px',
                  color: '#4a5568',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🩺 Medical Notes
                </h3>
                <div style={{ 
                  paddingLeft: '4px',
                  fontStyle: 'italic',
                  color: '#4a5568'
                }}>
                  “{patient.notes}”
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginTop: '24px'
        }}>
          <button
            onClick={() => navigate(`/patients/${id}/edit`)}
            style={{
              flex: 1, 
              padding: '12px', 
              backgroundColor: '#e8f5e9', 
              color: '#228B22',
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '500',
              fontSize: '15px'
            }}
          >
            Edit Patient
          </button>
          <button
            onClick={handleDelete}
            style={{
              flex: 1, 
              padding: '12px', 
              backgroundColor: '#fee', 
              color: '#c53030',
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '500',
              fontSize: '15px'
            }}
          >
            Delete Patient
          </button>
        </div>
      </div>
    </div>
  );
}