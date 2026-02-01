// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    patientsToday: 0,
    invoicesToday: 0,
    revenueToday: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);

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

  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Patients created today
        const patientsQuery = query(
          collection(db, 'patients'),
          where('createdAt', '>=', todayStart),
          where('createdAt', '<=', todayEnd)
        );
        const patientsSnap = await getDocs(patientsQuery);

        // Invoices created today
        const invoicesQuery = query(
          collection(db, 'invoices'),
          where('createdAt', '>=', todayStart),
          where('createdAt', '<=', todayEnd),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const invoicesSnap = await getDocs(invoicesQuery);

        let revenue = 0;
        const invoiceList = [];
        invoicesSnap.forEach(doc => {
          const data = doc.data();
          revenue += data.total || 0;
          invoiceList.push({
            id: doc.id,
            patient: data.patientName || 'Unknown',
            service: data.items?.[0]?.description || 'Service',
            amount: data.total || 0,
            status: data.status || 'unpaid'
          });
        });

        setStats({
          patientsToday: patientsSnap.size,
          invoicesToday: invoicesSnap.size,
          revenueToday: revenue
        });
        setRecentInvoices(invoiceList);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    fetchData();
  }, []);

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
        fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#2d3748',
        position: 'relative'
      }}
    >
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
            {recentInvoices.length === 0 ? (
              <p>No recent invoices.</p>
            ) : (
              recentInvoices.map((invoice) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}