import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Careers from './pages/Careers'
import AdminDashboard from './pages/AdminDashboard'
import ApplyNow from './pages/ApplyNow'
import AdminLogin from './pages/AdminLogin'
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
    <Router>
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

          {/* Secured Admin Routes */}
          <Route path="/vault/internal/gate/secure/auth/login" element={<AdminLogin />} />
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
