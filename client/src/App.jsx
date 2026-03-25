import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Public pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import SubmitProperty from './pages/SubmitProperty';
import NotFound from './pages/NotFound';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageProperties from './pages/admin/ManageProperties';
import AddProperty from './pages/admin/AddProperty';
import ManageLeads from './pages/admin/ManageLeads';
import ManageUsers from './pages/admin/ManageUsers';
import ChangePassword from './pages/admin/ChangePassword';

// Public layout (Navbar + Footer wrapper)
const PublicLayout = () => {
  const [hideFooterInMobileApp, setHideFooterInMobileApp] = useState(false);

  useEffect(() => {
    const standaloneDisplayMode = window.matchMedia('(display-mode: standalone)');
    const mobileViewport = window.matchMedia('(max-width: 768px)');

    const updateFooterVisibility = () => {
      const isStandalone = standaloneDisplayMode.matches || window.navigator.standalone === true;
      setHideFooterInMobileApp(isStandalone && mobileViewport.matches);
    };

    updateFooterVisibility();

    standaloneDisplayMode.addEventListener('change', updateFooterVisibility);
    mobileViewport.addEventListener('change', updateFooterVisibility);
    window.addEventListener('resize', updateFooterVisibility);

    return () => {
      standaloneDisplayMode.removeEventListener('change', updateFooterVisibility);
      mobileViewport.removeEventListener('change', updateFooterVisibility);
      window.removeEventListener('resize', updateFooterVisibility);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!hideFooterInMobileApp && <Footer />}
      <WhatsAppButton />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* ─── Admin Login (no Navbar/Footer) ─── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ─── Protected Admin Panel ─── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="properties" element={<ManageProperties />} />
            <Route path="properties/add" element={<AddProperty />} />
            <Route path="properties/edit/:id" element={<AddProperty />} />
            <Route path="leads" element={<ManageLeads />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* ─── Public Routes (with Navbar + Footer via Outlet) ─── */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/submit-property" element={<SubmitProperty />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
