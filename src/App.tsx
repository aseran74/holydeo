import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import ProtectedSearchRoute from "./components/auth/ProtectedSearchRoute";
import AdminRoute from "./components/auth/AdminRoute";
import DashboardRoute from "./components/auth/DashboardRoute";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import OwnerDashboard from "./pages/Dashboard/OwnerDashboard";
import LandingPage from "./pages/Landing/LandingPage";

// Importar las páginas del proyecto
import Properties from "./pages/Properties/Properties";
import Bookings from "./pages/Bookings/Bookings";
import Experiences from "./pages/Experiences/Experiences";
import ExperienceForm from "./pages/Experiences/ExperienceForm";
import ExperienceDetails from "./pages/Experiences/ExperienceDetails";
import Agencies from "./pages/Agencies/Agencies";
import Agents from "./pages/Agents/Agents";
import Owners from "./pages/Owners/Owners";
import Guests from "./pages/Guests";
import MessagesPage from "./pages/Messages/MessagesPage";
import UserManagement from "./pages/UserManagement";
import ImageUploadTest from "./components/ImageUploadTest";
import ExperienceStorageTest from "./components/ExperienceStorageTest";
import ExperienceDebug from "./components/ExperienceDebug";
import CalendarManagement from "./pages/CalendarManagement/CalendarManagement";
import PropertyDetails from "./pages/Properties/PropertyDetails";
import ImageDebugger from "./components/ImageDebugger";
import PropertyImageTest from "./components/PropertyImageTest";
import ImageTest from "./components/ImageTest";
import GooglePlacesTest from "./components/GooglePlacesTest";
import SearchPage from "./pages/Search/SearchPage";
import MuiCalendarPage from "./pages/CalendarManagement/MuiCalendarPage";
import CalendarDemo from "./pages/CalendarManagement/CalendarDemo";
import TailGridsDemo from "./pages/CalendarManagement/TailGridsDemo";
import NumberStepperDemo from "./pages/CalendarManagement/NumberStepperDemo";
import PriceFilterDemo from "./pages/CalendarManagement/PriceFilterDemo";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Landing Page - Sin Layout */}
          <Route index path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginForm />} />

          {/* Página de Búsqueda - Sin Layout */}
          <Route path="/search" element={<SearchPage />} />

          {/* Detalles de Propiedad - Público */}
          <Route path="/property/:id" element={<PropertyDetails />} />

          {/* Detalles de Experiencia - Público */}
          <Route path="/experiences/:id" element={<ExperienceDetails />} />

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* Dashboard - Solo para usuarios autenticados */}
            <Route path="/dashboard" element={
              <DashboardRoute>
                <Home />
              </DashboardRoute>
            } />
            
            {/* Dashboard Administrativo - Solo para admins */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* Dashboard de Propietarios - Solo para propietarios */}
            <Route path="/owner-dashboard" element={
              <DashboardRoute>
                <OwnerDashboard />
              </DashboardRoute>
            } />
            
            {/* Propiedades y Gestión */}
            <Route path="/properties" element={
              <ProtectedSearchRoute>
                <Properties />
              </ProtectedSearchRoute>
            } />
            <Route path="/properties/:id" element={
              <ProtectedSearchRoute>
                <PropertyDetails />
              </ProtectedSearchRoute>
            } />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experiences/new" element={<ExperienceForm />} />
            <Route path="/experiences/edit/:id" element={<ExperienceForm />} />
            <Route path="/experiences/cards" element={<Experiences />} />
            <Route path="/agencies" element={<Agencies />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/user-management" element={<UserManagement />} />

            {/* Profile and Calendar */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />

            {/* Debug/Test Routes */}
            <Route path="/image-upload-test" element={<ImageUploadTest />} />
            <Route path="/experience-storage-test" element={<ExperienceStorageTest />} />
            <Route path="/experience-debug" element={<ExperienceDebug />} />
            <Route path="/image-debug/:propertyId" element={<ImageDebugger />} />
            <Route path="/property-image-test" element={<PropertyImageTest />} />
            <Route path="/image-test" element={<ImageTest />} />
            <Route path="/google-places-test" element={<GooglePlacesTest />} />
            
            {/* Calendar Management */}
            <Route path="/calendar-management/:propertyId" element={<CalendarManagement />} />
            <Route path="/mui-calendar" element={<MuiCalendarPage />} />
            <Route path="/calendar-demo" element={<CalendarDemo />} />
            <Route path="/tailgrids-demo" element={<TailGridsDemo />} />
            <Route path="/number-stepper-demo" element={<NumberStepperDemo />} />
            <Route path="/price-filter-demo" element={<PriceFilterDemo />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
