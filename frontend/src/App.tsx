// ==============================================
// FEC 2026 | Componente raiz e definição de rotas
// ==============================================
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { ScanlineOverlay } from './components/HUD';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Gallery from './pages/Gallery';
import UploadPage from './pages/Upload';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [booting, setBooting] = useState(true);

  if (booting) {
    return <LoadingScreen onDone={() => setBooting(false)} />;
  }

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-void">
        <ScanlineOverlay />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/enviar" element={<UploadPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
