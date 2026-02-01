// src/pages/InvoicesList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function InvoicesList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all'); // 'all', 'cash', 'mpesa'
  const [filterDate, setFilterDate] = useState('today'); // 'today', 'yesterday', 'this-week', 'custom'
  const [customDate, setCustomDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const list = [];
        snapshot.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setInvoices(list);
        setFilteredInvoices(list);
      } catch (err) {
        console.error(err);
        alert("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...invoices];

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(inv => inv.status === filterStatus);
    }

    // Filter by payment method
    if (filterPayment !== 'all') {
      result = result.filter(inv => inv.paymentMethod === filterPayment);
    }

    // Filter by date
    const now = new Date();
    let startDate, endDate;

    switch (filterDate) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'this-week':
        // Start of week (Monday)
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(now.getFullYear(), now.getMonth(), diff);
        endDate = new Date(now.getFullYear(), now.getMonth(), diff + 7);
        break;
      case 'custom':
        if (customDate) {
          const custom = new Date(customDate);
          startDate = new Date(custom.getFullYear(), custom.getMonth(), custom.getDate());
          endDate = new Date(custom.getFullYear(), custom.getMonth(), custom.getDate() + 1);
        } else {
          startDate = null;
          endDate = null;
        }
        break;
      default:
        startDate = null;
        endDate = null;
    }

    if (startDate && endDate) {
      result = result.filter(inv => {
        const invoiceDate = inv.createdAt?.toDate?.() || new Date(0);
        return invoiceDate >= startDate && invoiceDate < endDate;
      });
    }

    // Search
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(inv =>
        inv.patientName.toLowerCase().includes(term) ||
        inv.invoiceId.toLowerCase().includes(term)
      );
    }

    setFilteredInvoices(result);
  }, [search, filterStatus, filterPayment, filterDate, customDate, invoices]);

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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{ fontSize: '24px', color: '#228B22', fontWeight: '600' }}>Invoices</h1>
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

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search by patient or invoice ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #cbd5e0',
              outline: 'none'
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #cbd5e0',
              outline: 'none'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
          </select>
        </div>

        {/* Advanced Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: '8px',
              fontSize: '14px',
              border: 'none',
              borderBottom: '1px solid #cbd5e0',
              outline: 'none'
            }}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this-week">This Week</option>
            <option value="custom">Custom Date</option>
          </select>

          {filterDate === 'custom' && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              style={{
                padding: '8px',
                fontSize: '14px',
                border: 'none',
                borderBottom: '1px solid #cbd5e0',
                outline: 'none'
              }}
            />
          )}

          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            style={{
              padding: '8px',
              fontSize: '14px',
              border: 'none',
              borderBottom: '1px solid #cbd5e0',
              outline: 'none'
            }}
          >
            <option value="all">All Payments</option>
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
          </select>
        </div>

        {/* Invoice List */}
        {loading ? (
          <div>Loading...</div>
        ) : filteredInvoices.length === 0 ? (
          <div>No invoices found for selected filters.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredInvoices.map(invoice => (
              <div
                key={invoice.id}
                onClick={() => navigate(`/invoices/${invoice.id}`)}
                style={{
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8faf9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#333' }}>{invoice.patientName}</div>
                    <div style={{ fontSize: '14px', color: '#718096' }}>{invoice.invoiceId}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>Ksh {invoice.total?.toLocaleString()}</div>
                    <div style={{ 
                      fontSize: '12px',
                      color: invoice.status === 'paid' ? '#2F855A' : 
                             invoice.status === 'partial' ? '#D69E2E' : '#E53E3E'
                    }}>
                      {invoice.paymentMethod === 'mpesa' ? '📱 M-Pesa' : '💵 Cash'} • 
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}