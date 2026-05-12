import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PincodeModal from './components/common/PincodeModal';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BuyBikes from './pages/BuyBikes';
import BikeDetail from './pages/BikeDetail';
import SellBike from './pages/SellBike';
import Services from './pages/Services';
import SpareParts from './pages/SpareParts';
import Cart from './pages/Cart';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/Dashboard';
import TrackBooking from './pages/TrackBooking';
import Profile from './pages/Profile';
import PartDetail from './pages/PartDetail';
import Wishlist from './pages/Wishlist';
import FeaturedParts from './pages/FeaturedParts';
import BestsellerParts from './pages/BestsellerParts';
import FeaturedBikes from './pages/FeaturedBikes';
import BestsellerBikes from './pages/BestsellerBikes';
import About from './pages/About';
import Contact from './pages/Contact';
import Rentals from './pages/Rentals';
import RentalDetail from './pages/RentalDetail';

const Layout = ({ children, hideNav = false }) => (
  <>
    {!hideNav && <Navbar />}
    <main>{children}</main>
    {!hideNav && <Footer />}
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <PincodeModal />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#FFFFFF', color: '#111', border: '1px solid #EEE', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', borderRadius: '14px', fontWeight: 600 },
              success: { iconTheme: { primary: '#2E7D32', secondary: 'white' } },
              error: { iconTheme: { primary: '#E53935', secondary: 'white' } },
            }}
          />
          <Routes>
            {/* Auth pages - no nav */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin - no footer */}
            <Route path="/admin" element={<Layout hideNav={true}><AdminDashboard /></Layout>} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/bikes" element={<Layout><BuyBikes /></Layout>} />
            <Route path="/bikes/featured" element={<Layout><FeaturedBikes /></Layout>} />
            <Route path="/bikes/bestseller" element={<Layout><BestsellerBikes /></Layout>} />
            <Route path="/bikes/:id" element={<Layout><BikeDetail /></Layout>} />
            <Route path="/sell" element={<Layout><SellBike /></Layout>} />
            <Route path="/services" element={<Layout><Services /></Layout>} />
            <Route path="/parts" element={<Layout><SpareParts /></Layout>} />
            <Route path="/featured" element={<Layout><FeaturedParts /></Layout>} />
            <Route path="/bestseller" element={<Layout><BestsellerParts /></Layout>} />
            <Route path="/parts/:id" element={<Layout><PartDetail /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/rentals" element={<Layout><Rentals /></Layout>} />
            <Route path="/rentals/:id" element={<Layout><RentalDetail /></Layout>} />
            <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />
            <Route path="/my-orders" element={<Layout><MyBookings /></Layout>} />
            <Route path="/track/:id" element={<Layout><TrackBooking /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />

            {/* 404 */}
            <Route path="*" element={
              <Layout>
                <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', background: '#FFFFFF', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(5rem, 15vw, 10rem)', fontWeight: 950, color: '#111', lineHeight: 1, letterSpacing: '-0.05em' }}>404</div>
                  <div style={{ height: '6px', width: '60px', background: '#E53935', borderRadius: '3px' }} />
                  <h2 style={{ color: '#111', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 900, textTransform: 'uppercase' }}>PAGE NOT FOUND</h2>
                  <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '400px', fontWeight: 600 }}>The page you are looking for might have been removed or does not exist.</p>
                  <a href="/" style={{ marginTop: '1rem', background: '#111', color: 'white', padding: '1rem 2.5rem', borderRadius: '16px', textDecoration: 'none', fontWeight: 800, letterSpacing: '0.05em', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    BACK TO HOME
                  </a>
                </div>
              </Layout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
