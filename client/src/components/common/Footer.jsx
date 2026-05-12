import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid #1A1A1A', color: '#888' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/src/assets/logo.png" alt="MotoExpress Logo" style={{ height: '32px', width: 'auto' }} />
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: 'white', fontSize: '1.25rem' }}>MotoExpress</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>India's fastest bike buy, sell & service platform. Get your bike serviced in 1 hour or sell it the same day.</p>
            <div className="flex items-center gap-3 mt-4">
              {[FaFacebook, FaInstagram, FaYoutube, FaTwitter].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: '8px', background: '#1A1A1A', border: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E53935'; e.currentTarget.style.color = '#E53935'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#888'; }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Services</h4>
            {['Regular Service', 'Engine Repair', 'Puncture Fix', 'Battery Service', 'Brake Service', 'Bike Washing'].map(s => (
              <Link key={s} to="/services" style={{ display: 'block', color: '#888', textDecoration: 'none', fontSize: '0.87rem', marginBottom: '0.5rem', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.target.style.color = '#E53935')}
                onMouseLeave={(e) => (e.target.style.color = '#888')}>
                {s}
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Quick Links</h4>
            {[['Buy Bikes', '/bikes'], ['Sell My Bike', '/sell'], ['Spare Parts', '/parts'], ['Track Order', '/my-orders'], ['My Bookings', '/my-bookings'], ['Profile', '/profile']].map(([label, href]) => (
              <Link key={href} to={href} style={{ display: 'block', color: '#888', textDecoration: 'none', fontSize: '0.87rem', marginBottom: '0.5rem', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.target.style.color = '#E53935')}
                onMouseLeave={(e) => (e.target.style.color = '#888')}>
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Contact Us</h4>
            {[
              { Icon: Phone, text: '+91 98765 43210' },
              { Icon: Mail, text: 'support@motoexpress.in' },
              { Icon: MapPin, text: 'Mumbai, Maharashtra, India' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2" style={{ marginBottom: '0.75rem', fontSize: '0.87rem' }}>
                <Icon size={14} style={{ color: '#E53935', flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#1A1A1A', borderRadius: '8px', border: '1px solid #2A2A2A' }}>
              <p style={{ fontSize: '0.82rem', color: '#aaa', marginBottom: '0.5rem' }}>Emergency Bike Rescue</p>
              <a href="tel:+919876543210" style={{ color: '#E53935', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif' }}>
                📞 +91 98765 43210
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1A1A1A', marginTop: '2.5rem', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '0.83rem' }}>© {new Date().getFullYear()} MotoExpress. All rights reserved.</p>
          <div className="flex items-center gap-4" style={{ fontSize: '0.83rem' }}>
            <Link to="/privacy" style={{ color: '#888', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#888', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
