// src/pages/CreateInvoice.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: '' }]);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [mpesaCode, setMpesaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const q = query(collection(db, 'patients'));
        const snapshot = await getDocs(q);
        const list = [];
        snapshot.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setPatients(list);
        if (list.length > 0) setSelectedPatient(list[0].id);
      } catch (err) {
        console.error(err);
        setError("Failed to load patients.");
      }
    };
    fetchPatients();
  }, []);

  // Calculate total
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.unitPrice) || 0;
    const qty = parseInt(item.quantity) || 0;
    return sum + (price * qty);
  }, 0);

  const total = subtotal;
  const paid = parseFloat(amountPaid) || 0;
  const balance = Math.max(0, total - paid);
  const status = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';

  // Item handlers
  const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: '' }]);
  const removeItem = (index) => items.length > 1 && setItems(items.filter((_, i) => i !== index));
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return setError("Please select a patient.");
    if (items.some(i => !i.description || !i.unitPrice)) return setError("Fill all service details.");
    if (!amountPaid || paid <= 0) return setError("Enter amount paid.");
    if (paymentMethod === 'mpesa' && !mpesaCode.trim()) return setError("M-Pesa code is required.");

    setLoading(true);
    setError('');

    try {
      const now = new Date();
      const invoiceId = `INV-${now.getFullYear()}-${String(now.getTime()).slice(-4)}`;

      const invoiceData = {
        invoiceId,
        patientId: selectedPatient,
        patientName: patients.find(p => p.id === selectedPatient)?.name || 'Unknown',
        items: items.map(i => ({
          description: i.description.trim(),
          quantity: parseInt(i.quantity),
          unitPrice: parseFloat(i.unitPrice)
        })),
        notes: notes.trim(),
        subtotal,
        total,
        paymentMethod,
        amountPaid: paid,
        mpesaCode: paymentMethod === 'mpesa' ? mpesaCode.trim() : null,
        balance,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'invoices'), invoiceData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to save invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        // Match dashboard background
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
      {/* Soft white overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        zIndex: 0
      }}></div>

      <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <h1 style={{ fontSize: '24px', color: '#228B22', fontWeight: '600' }}>Create Invoice</h1>
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

        {success && (
          <div style={{
            padding: '12px',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            ✅ Invoice saved!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Patient */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>Patient *</label>
            {patients.length === 0 ? (
              <div style={{ color: '#e53e3e' }}>
                No patients.{' '}
                <button 
                  onClick={() => navigate('/patients/add')} 
                  style={{ 
                    color: '#228B22', 
                    background: 'none', 
                    border: 'none',
                    textDecoration: 'underline'
                  }}
                >
                  Add one
                </button>
              </div>
            ) : (
              <select 
                value={selectedPatient} 
                onChange={e => setSelectedPatient(e.target.value)} 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: 'none', 
                  borderBottom: '1px solid #cbd5e0', 
                  outline: 'none',
                  backgroundColor: 'transparent'
                }}
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.phone && `(${p.phone})`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Services */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', color: '#4a5568' }}>Services *</label>
              <button 
                type="button" 
                onClick={addItem} 
                style={{ 
                  color: '#228B22', 
                  background: 'none', 
                  border: 'none',
                  fontWeight: '500'
                }}
              >
                + Add Service
              </button>
            </div>
            {items.map((item, i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1fr 1fr auto', 
                  gap: '12px', 
                  alignItems: 'center',
                  padding: '8px 0'
                }}
              >
                <input 
                  placeholder="e.g., Teeth Cleaning" 
                  value={item.description} 
                  onChange={e => updateItem(i, 'description', e.target.value)} 
                  style={{ 
                    padding: '10px', 
                    border: 'none', 
                    borderBottom: '1px solid #cbd5e0',
                    backgroundColor: 'transparent'
                  }} 
                />
                <input 
                  type="number" 
                  min="1" 
                  value={item.quantity} 
                  onChange={e => updateItem(i, 'quantity', e.target.value)} 
                  style={{ 
                    padding: '10px', 
                    border: 'none', 
                    borderBottom: '1px solid #cbd5e0', 
                    textAlign: 'center',
                    backgroundColor: 'transparent'
                  }} 
                />
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={item.unitPrice} 
                  onChange={e => updateItem(i, 'unitPrice', e.target.value)} 
                  style={{ 
                    padding: '10px', 
                    border: 'none', 
                    borderBottom: '1px solid #cbd5e0', 
                    textAlign: 'right',
                    backgroundColor: 'transparent'
                  }} 
                />
                {items.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeItem(i)} 
                    style={{ 
                      color: '#e53e3e', 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '18px',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>Notes</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              rows="2" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: 'none', 
                borderBottom: '1px solid #cbd5e0', 
                resize: 'vertical',
                backgroundColor: 'transparent'
              }} 
            />
          </div>

          {/* Payment Section */}
          <div style={{ 
            backgroundColor: 'rgba(232, 245, 233, 0.7)', 
            padding: '20px', 
            borderRadius: '12px',
            backdropFilter: 'blur(4px)'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px', 
              color: '#228B22' 
            }}>
              Payment Details
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px', 
              marginBottom: '16px' 
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={e => setPaymentMethod(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: 'none', 
                    borderBottom: '1px solid #cbd5e0',
                    backgroundColor: 'transparent'
                  }}
                >
                  <option value="cash">Cash</option>
                  <option value="mpesa">M-Pesa</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>Amount Paid (Ksh) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)}
                  placeholder="0.00"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: 'none', 
                    borderBottom: '1px solid #cbd5e0', 
                    textAlign: 'right',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
            </div>

            {paymentMethod === 'mpesa' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '6px' }}>M-Pesa Code *</label>
                <input
                  type="text"
                  value={mpesaCode}
                  onChange={e => setMpesaCode(e.target.value)}
                  placeholder="e.g., LGR98HJK23"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: 'none', 
                    borderBottom: '1px solid #cbd5e0',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
              <span>Total: <strong>Ksh {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              <span>Paid: <strong>Ksh {paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              {balance > 0 && (
                <span>Balance: <strong style={{ color: '#e53e3e' }}>Ksh {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading} 
            style={{
              padding: '14px',
              backgroundColor: '#228B22',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? 'Saving Invoice...' : 'Save Invoice'}
          </button>
        </form>
      </div>
    </div>
  );
}