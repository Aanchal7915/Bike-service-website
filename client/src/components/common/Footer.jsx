import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import logo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid #1A1A1A', color: '#888' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="MotoExpress Logo" style={{ height: '32px', width: 'auto' }} />
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
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <MapPin size={12} style={{ color: '#E53935' }} />
                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>GURGAON</span>
                </div>
                <p style={{ fontSize: '0.7rem', lineHeight: 1.4 }}>Tower B, 3rd Floor, Unitech Cyber Park, Sector 39, 122002</p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <MapPin size={12} style={{ color: '#E53935' }} />
                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>MUMBAI</span>
                </div>
                <p style={{ fontSize: '0.7rem', lineHeight: 1.4 }}>Third Floor, Vasudev Chamber, Teli Galli Cross Rd, Andheri East, 400069</p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <MapPin size={12} style={{ color: '#E53935' }} />
                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>ROHTAK</span>
                </div>
                <p style={{ fontSize: '0.7rem', lineHeight: 1.4 }}>108, First Floor, Agro Mall, Rohtak</p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <MapPin size={12} style={{ color: '#E53935' }} />
                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>AUSTRALIA</span>
                </div>
                <p style={{ fontSize: '0.7rem', lineHeight: 1.4 }}>Australia</p>
              </div>
            </div>

            <div className="flex items-center gap-2" style={{ marginBottom: '0.6rem', fontSize: '0.87rem' }}>
              <Phone size={14} style={{ color: '#E53935', flexShrink: 0 }} />
              <span>+91 9253625099</span>
            </div>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem', fontSize: '0.87rem' }}>
              <Mail size={14} style={{ color: '#E53935', flexShrink: 0 }} />
              <span>kp@avanienterprises.in</span>
            </div>
            
            <div style={{ padding: '0.75rem', background: '#1A1A1A', borderRadius: '8px', border: '1px solid #2A2A2A' }}>
              <p style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '0.2rem' }}>Quick Support</p>
              <a href="tel:+919253625099" style={{ color: '#E53935', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif' }}>
                📞 +91 9253625099
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
