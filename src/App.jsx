// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddPatient from './pages/AddPatients'; // ← Fixed filename case
import CreateInvoice from './pages/CreateInvoice';
import ViewPatient from './pages/ViewPatient';
import ViewInvoice from './pages/ViewInvoice';
import PatientsList from './pages/PatientsList';
import InvoicesList from './pages/InvoicesList';
import PrivateRoute from './components/PrivateRoute';
import EditPatient from './pages/EditPatient';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
        <Route path="/patients" element={<PrivateRoute><PatientsList /></PrivateRoute>} />
        <Route path="/patients/add" element={<PrivateRoute><AddPatient /></PrivateRoute>} />
        <Route path="/patients/:id" element={<PrivateRoute><ViewPatient /></PrivateRoute>} />
        <Route path="/patients/:id/edit" element={<PrivateRoute><EditPatient /></PrivateRoute>} />
        <Route path="/invoices" element={<PrivateRoute><InvoicesList /></PrivateRoute>} />
        <Route path="/invoices/create" element={<PrivateRoute><CreateInvoice /></PrivateRoute>} />
        <Route path="/invoices/:id" element={<PrivateRoute><ViewInvoice /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;