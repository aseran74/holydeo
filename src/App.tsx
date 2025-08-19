import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from './pages/Dashboard/Home';
import Properties from './pages/Properties/Properties';
import PropertyDetails from './pages/Properties/PropertyDetails';
import Experiences from './pages/Experiences/Experiences';
import ExperienceDetails from './pages/Experiences/ExperienceDetails';
import PublicExperienceDetails from './pages/Experiences/PublicExperienceDetails';
import ExperienceForm from './pages/Experiences/ExperienceForm';
import Bookings from './pages/Bookings/Bookings';
import Agencies from './pages/Agencies/Agencies';
import Agents from './pages/Agents/Agents';
import Owners from './pages/Owners/Owners';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import OwnerDashboard from './pages/Dashboard/OwnerDashboard';
import GuestDashboard from './pages/Dashboard/GuestDashboard';
import GuestBookings from './pages/Bookings/GuestBookings';
import DebugBookingsStructure from './components/DebugBookingsStructure';
import UserManagement from './pages/Admin/UserManagement';
import SocialPage from './pages/Social/SocialPage';
import SocialManagement from './pages/Admin/SocialManagement';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/Landing/LandingPage';
import SearchPage from './pages/Search/SearchPage';
import NotFound from './pages/OtherPage/NotFound';
import ToastContainer from './components/ui/ToastContainer';
import ToastDemo from './components/ui/ToastDemo';
import './index.css';
import './styles/toast.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Search Page */}
          <Route path="/search" element={<SearchPage />} />
          
          {/* Login */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Toast Demo */}
          <Route path="/toast-demo" element={<ToastDemo />} />
          
          {/* Public Property Details Routes (accessible from landing page) */}
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          
          {/* Public Experience Details Routes (accessible from landing page) */}
          <Route path="/experiences/:id" element={<PublicExperienceDetails />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'owner', 'agent', 'guest']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Route>
          
          {/* Guest Dashboard Route */}
          <Route path="/guest-dashboard" element={
            <ProtectedRoute allowedRoles={['guest']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<GuestDashboard />} />
            </Route>
          </Route>
          
          <Route path="/owner-dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'owner']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<OwnerDashboard />} />
            </Route>
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="social" element={<SocialManagement />} />
            </Route>
          </Route>
          
          {/* Properties Routes */}
          <Route path="/properties" element={
            <ProtectedRoute allowedRoles={['admin', 'owner', 'agent', 'guest']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<Properties />} />
              <Route path=":id" element={<PropertyDetails />} />
            </Route>
          </Route>
          
          {/* Property Details Route (singular for compatibility) */}
          <Route path="/property" element={
            <ProtectedRoute allowedRoles={['admin', 'owner', 'agent', 'guest']} />
          }>
            <Route element={<AppLayout />}>
              <Route path=":id" element={<PropertyDetails />} />
            </Route>
          </Route>
          
          {/* Experiences Routes */}
          <Route path="/experiences" element={
            <ProtectedRoute allowedRoles={['admin', 'owner', 'agent', 'guest']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<Experiences />} />
              <Route path=":id" element={<ExperienceDetails />} />
              <Route path="new" element={<ExperienceForm />} />
              <Route path=":id/edit" element={<ExperienceForm />} />
            </Route>
          </Route>
          
          {/* Bookings Routes */}
          <Route path="/bookings" element={
            <ProtectedRoute allowedRoles={['admin', 'owner', 'agent', 'guest']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<Bookings />} />
            </Route>
          </Route>
          
          {/* Guest Bookings Route - Solo sus propias reservas */}
          <Route path="/guest-bookings" element={
            <ProtectedRoute allowedRoles={['guest']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<GuestBookings />} />
            </Route>
          </Route>
          
          {/* Debug Route - Temporal para verificar estructura */}
          <Route path="/debug-bookings" element={
            <ProtectedRoute allowedRoles={['guest']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<DebugBookingsStructure />} />
            </Route>
          </Route>
          
          {/* Agencies Routes */}
          <Route path="/agencies" element={
            <ProtectedRoute allowedRoles={['admin', 'owner']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<Agencies />} />
            </Route>
          </Route>
          
          {/* Agents Routes */}
          <Route path="/agents" element={
            <ProtectedRoute allowedRoles={['admin', 'owner']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<Agents />} />
            </Route>
          </Route>
          
          {/* Owners Routes */}
          <Route path="/owners" element={
            <ProtectedRoute allowedRoles={['admin']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<Owners />} />
            </Route>
          </Route>
          
          {/* Social Network Routes */}
          <Route path="/social" element={
            <ProtectedRoute allowedRoles={['admin', 'owner', 'agent', 'guest']} />
          }>
            <Route element={<AppLayout />}>
              <Route index element={<SocialPage />} />
            </Route>
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      
      {/* Contenedor de Toasts Global */}
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
