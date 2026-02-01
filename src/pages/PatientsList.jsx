// src/pages/PatientsList.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function PatientsList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const q = query(collection(db, 'patients'), orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        const list = [];
        snapshot.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setPatients(list);
      } catch (err) {
        console.error(err);
        alert("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    if (!search) return patients;
    const term = search.toLowerCase();
    return patients.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.phone?.includes(term)
    );
  }, [patients, search]);

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

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{ fontSize: '24px', color: '#228B22', fontWeight: '600' }}>Patients</h1>
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

        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #cbd5e0',
              outline: 'none',
              backgroundColor: 'transparent'
            }}
          />
        </div>

        {/* Patient List */}
        {loading ? (
          <div>Loading...</div>
        ) : filteredPatients.length === 0 ? (
          <div>No patients found.</div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px' 
          }}>
            {filteredPatients.map(patient => (
              <div
                key={patient.id}
                onClick={() => navigate(`/patients/${patient.id}`)}
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8faf9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '6px'
                }}>
                  {/* Initial Avatar */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: '#e8f5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ 
                      fontSize: '16px', 
                      color: '#228B22',
                      fontWeight: '600'
                    }}>
                      {patient.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '15px', 
                    color: '#333' 
                  }}>
                    {patient.name}
                  </div>
                </div>

                <div style={{ 
                  fontSize: '13px', 
                  color: '#718096',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{patient.phone}</span>
                  <span>{patient.patientId}</span>
                </div>

                {patient.clinic && (
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#228B22',
                    marginTop: '4px',
                    fontWeight: '500'
                  }}>
                    {patient.clinic === 'westlands' ? 'Westlands' :
                     patient.clinic === 'karen' ? 'Karen' : 'Langata'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Button */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/patients/add')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#228B22',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            ➕ Add New Patient
          </button>
        </div>
      </div>
    </div>
  );
}