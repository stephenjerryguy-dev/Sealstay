import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import HowItWorks from "./pages/HowItWorks";
import ForStudents from "./pages/ForStudents";
import ForLandlords from "./pages/ForLandlords";
import Innovations from "./pages/Innovations";
import StudentPortal from "./pages/StudentPortal";
import LandlordPortal from "./pages/LandlordPortal";
import AdminDashboard from "./pages/AdminDashboard";
import LeaseDNAScanner from "./pages/LeaseDNAScanner";
import LeaseRelief from "./pages/LeaseRelief";
import SealScore from "./pages/SealScore";
import ListProperty from "./pages/ListProperty";
import ClaimListing from "./pages/ClaimListing";
import LandlordShield from "./pages/LandlordShield";
import AdminLogin from "./pages/AdminLogin";
import LegalCompliance from "./pages/LegalCompliance";
import SimpleStub from "./pages/SimpleStub";
import { AuthProvider } from "./context/AuthContext";
import SignInModal from "./components/SignInModal";
import Footer from "./components/Footer";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppFrame />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppFrame() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <SignInModal />
      <div className="flex flex-col min-h-screen">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/for-students" element={<ForStudents />} />
        <Route path="/for-landlords" element={<ForLandlords />} />
        <Route path="/innovations" element={<Innovations />} />

        <Route path="/lease-relief" element={<LeaseRelief />} />
        <Route path="/lease-dna-scanner" element={<LeaseDNAScanner />} />
        <Route path="/seal-score" element={<SealScore />} />
        <Route path="/student-portal" element={<StudentPortal />} />
        <Route path="/landlord-portal" element={<LandlordPortal />} />
        <Route path="/landlord-shield" element={<LandlordShield />} />
        <Route path="/list-property" element={<ListProperty />} />
        <Route path="/claim-listing" element={<ClaimListing />} />
        <Route
          path="/legal-compliance"
          element={<LegalCompliance />}
        />
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route
          path="*"
          element={
            <SimpleStub
              title="Page not found"
              subtitle="That route doesn't exist yet — or it never will."
            />
          }
        />
        </Routes>
        {!isAdmin && <Footer />}
      </div>
    </>
  );
}
