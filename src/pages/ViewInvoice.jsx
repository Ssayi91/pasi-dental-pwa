// src/pages/ViewInvoice.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ViewInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const docRef = doc(db, 'invoices', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInvoice({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("Invoice not found");
          navigate('/invoices');
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load invoice");
        navigate('/invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
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
      <div style={{ color: '#228B22', fontSize: '18px' }}>Loading invoice...</div>
    </div>
  );

  if (!invoice) return null;

  const invoiceDate = invoice.createdAt?.toDate 
    ? invoice.createdAt.toDate().toLocaleDateString('en-KE')
    : 'N/A';

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
      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        zIndex: 0
      }}></div>

      {/* Print-friendly receipt */}
      <div id="invoice-print" style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '14px',
        lineHeight: 1.6,
        position: 'relative',
        zIndex: 1
      }}>
        {/* Printable background watermark */}
        <img 
          src="/pasi-invoice-bg.png" 
          alt="" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
            opacity: 0.03, // Very subtle
            pointerEvents: 'none'
          }}
        />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#228B22', fontSize: '24px', margin: '0' }}>Pasi Dental Care</h1>
          <p style={{ color: '#666', marginTop: '4px' }}>Nairobi, Kenya</p>
          <p style={{ color: '#666' }}>Invoice #{invoice.invoiceId}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <p><strong>Billed To:</strong></p>
            <p>{invoice.patientName}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p><strong>Date:</strong> {invoiceDate}</p>
            <p><strong>Status:</strong> 
              <span style={{ 
                color: invoice.status === 'paid' ? '#2F855A' : 
                       invoice.status === 'partial' ? '#D69E2E' : '#E53E3E',
                marginLeft: '6px'
              }}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'left', paddingBottom: '8px' }}>Description</th>
              <th style={{ textAlign: 'center', paddingBottom: '8px' }}>Qty</th>
              <th style={{ textAlign: 'right', paddingBottom: '8px' }}>Unit Price</th>
              <th style={{ textAlign: 'right', paddingBottom: '8px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ paddingTop: '12px', paddingBottom: '12px' }}>{item.description}</td>
                <td style={{ textAlign: 'center', paddingTop: '12px', paddingBottom: '12px' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', paddingTop: '12px', paddingBottom: '12px' }}>Ksh {Number(item.unitPrice).toLocaleString()}</td>
                <td style={{ textAlign: 'right', paddingTop: '12px', paddingBottom: '12px' }}>Ksh {(item.quantity * item.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Subtotal:</span>
              <span>Ksh {Number(invoice.subtotal || invoice.total).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span><strong>Total:</strong></span>
              <span><strong>Ksh {Number(invoice.total).toLocaleString()}</strong></span>
            </div>
            {invoice.amountPaid > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Paid:</span>
                  <span>Ksh {Number(invoice.amountPaid).toLocaleString()}</span>
                </div>
                {invoice.balance > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Balance:</span>
                    <span style={{ color: '#e53e3e' }}>Ksh {Number(invoice.balance).toLocaleString()}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {invoice.paymentMethod && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
            <p><strong>Payment Method:</strong> {invoice.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash'}</p>
            {invoice.mpesaCode && <p><strong>M-Pesa Code:</strong> {invoice.mpesaCode}</p>}
          </div>
        )}

        {invoice.notes && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
            <p><strong>Notes:</strong> {invoice.notes}</p>
          </div>
        )}
      </div>

      {/* Action buttons — hidden on print */}
      <div className="no-print" style={{ 
        maxWidth: '800px', 
        margin: '24px auto 0', 
        display: 'flex', 
        gap: '12px',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <button
          onClick={handlePrint}
          style={{
            padding: '12px 24px',
            backgroundColor: '#228B22',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Print Invoice
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#e8f5e9',
            color: '#228B22',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}