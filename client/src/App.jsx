import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import Browse from './pages/Browse';
import PropertyDetail from './pages/PropertyDetail';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import About from './pages/About';
import Subscription from './pages/Subscription';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import UserManagement from './pages/UserManagement';
import Support from './pages/Support';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import ChatSupport from './components/ChatSupport';

import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/property/:id" element={<PropertyDetail />} />

              {/* Private Routes */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Owner Routes */}
              <Route path="/owner/dashboard" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
              <Route path="/owner/subscription" element={<ProtectedRoute roles={['owner']}><Subscription /></ProtectedRoute>} />
              <Route path="/owner/add-property" element={<ProtectedRoute roles={['owner']}><AddProperty /></ProtectedRoute>} />
              <Route path="/owner/edit-property/:id" element={<ProtectedRoute roles={['owner']}><EditProperty /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
            </Routes>
          </div>
          <Footer />
        </div>
        <ChatSupport />
      </AuthProvider>
    </Router>
  );
};

export default App;
