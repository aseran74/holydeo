import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import LandingPage from "./pages/Landing/LandingPage";

// Importar las páginas del proyecto
import Properties from "./pages/Properties/Properties";
import Bookings from "./pages/Bookings/Bookings";
import Experiences from "./pages/Experiences/Experiences";
import Agencies from "./pages/Agencies/Agencies";
import Agents from "./pages/Agents/Agents";
import Owners from "./pages/Owners/Owners";
import Guests from "./pages/Guests";
import MessagesPage from "./pages/Messages/MessagesPage";
import UserManagement from "./pages/UserManagement";
import ImageUploadTest from "./components/ImageUploadTest";
import CalendarManagement from "./pages/CalendarManagement/CalendarManagement";
import PropertyDetails from "./pages/Properties/PropertyDetails";
import ImageDebugger from "./components/ImageDebugger";
import PropertyImageTest from "./components/PropertyImageTest";
import ImageTest from "./components/ImageTest";
import GooglePlacesTest from "./components/GooglePlacesTest";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Landing Page - Sin Layout */}
          <Route index path="/" element={<LandingPage />} />

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<Home />} />
            
            {/* Propiedades y Gestión */}
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/agencies" element={<Agencies />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/user-management" element={<UserManagement />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Debug/Test Routes */}
            <Route path="/image-upload-test" element={<ImageUploadTest />} />
            <Route path="/image-debug/:propertyId" element={<ImageDebugger />} />
            <Route path="/property-image-test" element={<PropertyImageTest />} />
            <Route path="/image-test" element={<ImageTest />} />
            <Route path="/google-places-test" element={<GooglePlacesTest />} />
            
            {/* Calendar Management */}
            <Route path="/calendar-management/:propertyId" element={<CalendarManagement />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
