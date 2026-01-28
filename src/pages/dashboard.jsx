// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats] = useState({
    patientsToday: 4,
    invoicesToday: 3,
    revenueToday: 24500
  });
  const [recentInvoices] = useState([
    { id: '1', patient: 'Jane M.', service: 'Teeth Cleaning', amount: 5000, status: 'paid' },
    { id: '2', patient: 'Robert K.', service: 'Filling', amount: 8500, status: 'unpaid' },
    { id: '3', patient: 'Amina S.', service: 'X-Ray', amount: 3000, status: 'paid' }
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Patients', path: '/patients' },
    { name: 'Invoices', path: '/invoices' }
  ];

  return (
    <div
      style={{
        // Background image (place your clinic image in public/pasi-bg.jpg)
        backgroundImage: 'url(/pasi-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#f0f9f4', // fallback
        minHeight: '100vh',
        padding: '24px',
        fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#2d3748',
        position: 'relative'
      }}
    >
      {/* Soft white overlay for readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        zIndex: 0
      }}></div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
       {/* Header */}
<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'flex-start',
  marginBottom: '16px'
}}>
  <div>
    <h2 style={{ fontSize: '20px', color: '#4a5568', margin: '0 0 4px 0', fontWeight: '500' }}>
      {getGreeting()}, Admin 👋
    </h2>
    <h1 style={{ fontSize: '24px', color: '#228B22', fontWeight: '600', margin: 0 }}>
      Pasi Dental – Nairobi
    </h1>
  </div>
  <button
    onClick={handleLogout}
    style={{
      padding: '6px 12px',
      backgroundColor: 'transparent',
      color: '#228B22',
      border: '1px solid #228B22',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#e8f5e9'}
    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
  >
    Logout
  </button>
</div>
        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          marginBottom: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '8px'
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#228B22' : '#718096',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  paddingBottom: '6px',
                  borderBottom: isActive ? '2px solid #228B22' : 'none',
                  outline: 'none'
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Date */}
        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>
          📅 {today}
        </p>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(4px)'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#718096' }}>Patients</div>
            <div style={{ fontSize: '20px', fontWeight: '600', marginTop: '4px' }}>
              {stats.patientsToday}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#718096' }}>Invoices</div>
            <div style={{ fontSize: '20px', fontWeight: '600', marginTop: '4px' }}>
              {stats.invoicesToday}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#718096' }}>Revenue</div>
            <div style={{ fontSize: '20px', fontWeight: '600', marginTop: '4px' }}>
              Ksh {stats.revenueToday.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={() => navigate('/patients/add')}
            style={{
              padding: '16px',
              backgroundColor: '#228B22',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              textAlign: 'left',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1E6B1E'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#228B22'}
          >
            ➕ Add New Patient
          </button>

          <button
            onClick={() => navigate('/invoices/create')}
            style={{
              padding: '16px',
              backgroundColor: '#228B22',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              textAlign: 'left',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1E6B1E'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#228B22'}
          >
            💳 Create Invoice
          </button>
        </div>

        {/* Recent Activity */}
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '12px',
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} style={{ paddingBottom: '12px', borderBottom: '1px solid #edf2f7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500' }}>{invoice.patient}</span>
                  <span style={{ 
                    color: invoice.status === 'paid' ? '#2F855A' : '#E53E3E',
                    fontSize: '14px'
                  }}>
                    {invoice.status === 'paid' ? '✅ Paid' : '⏳ Unpaid'}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '4px',
                  fontSize: '14px',
                  color: '#718096'
                }}>
                  <span>{invoice.service}</span>
                  <span>Ksh {invoice.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}