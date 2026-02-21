import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Careers from './pages/Careers'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import AdminDashboard from './pages/AdminDashboard'
import ApplyNow from './pages/ApplyNow'
import AdminLogin from './pages/AdminLogin'
import FinanceLogin from './pages/FinanceLogin'
import FinanceDashboard from './pages/FinanceDashboard'
import EmployeeLogin from './pages/EmployeeLogin'
import EmployeeDashboard from './pages/EmployeeDashboard'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate } from 'react-router-dom'

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null; // Or a spinner
  if (!user) return <Navigate to="/vault/internal/gate/secure/auth/login" replace />;

  return children;
}

// Employee Protected Route Wrapper (requires auth + employee session)
const EmployeeProtectedRoute = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;
  if (!user || !sessionStorage.getItem('employeeAuthorized')) {
    return <Navigate to="/portal/employee/login" replace />;
  }

  return children;
}

// Finance Protected Route Wrapper (requires auth + passcode session)
const FinanceProtectedRoute = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;
  if (!user || !sessionStorage.getItem('financeAuthorized')) {
    return <Navigate to="/vault/internal/gate/secure/finance/login" replace />;
  }

  return children;
}

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/apply/:jobId" element={<ApplyNow />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Secured Admin Routes */}
          <Route path="/vault/internal/gate/secure/auth/login" element={<AdminLogin />} />
          {/* Secured Finance Routes */}
          <Route path="/vault/internal/gate/secure/finance/login" element={<FinanceLogin />} />
          <Route
            path="/vault/internal/gate/secure/finance/payroll"
            element={
              <FinanceProtectedRoute>
                <FinanceDashboard />
              </FinanceProtectedRoute>
            }
          />

          {/* Secured Employee Routes */}
          <Route path="/portal/employee/login" element={<EmployeeLogin />} />
          <Route
            path="/portal/employee/dashboard"
            element={
              <EmployeeProtectedRoute>
                <EmployeeDashboard />
              </EmployeeProtectedRoute>
            }
          />

          <Route
            path="/vault/internal/gate/secure/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
