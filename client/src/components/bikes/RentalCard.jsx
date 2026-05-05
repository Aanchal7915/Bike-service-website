import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Settings, MapPin, ArrowRight } from 'lucide-react';

export default function RentalCard({ car }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(`/rentals/${car._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px #EEE' : '0 4px 15px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        height: '100%',
      }}
    >
      <div style={{ position: 'relative', height: '180px', background: '#F5F5F5', overflow: 'hidden' }}>
        {car.images?.[0] ? (
          <img
            src={car.images[0]}
            alt={car.title}
            style={{
              width: '100%', height: '100%', objectFit: 'contain', padding: '1rem',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}>
            <Calendar size={40} />
          </div>
        )}

        {car.status === 'rented' && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: '#EF4444', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>BOOKED</div>
        )}
        {car.isFeatured && car.status === 'available' && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(245,158,11,0.95)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>FEATURED</div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(229,57,53,0.95)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>RENT</div>
      </div>

      <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFFFF', borderTop: '1px solid #EEE' }}>
        <div style={{ marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span style={{ color: '#E53935', fontSize: '0.6rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '2px', fontFamily: 'Rajdhani, sans-serif' }}>
              <Calendar size={10} /> {car.year}
            </span>
            <span style={{ color: '#888', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px', fontFamily: 'Rajdhani, sans-serif' }}>
              <Settings size={10} /> {car.transmission?.toUpperCase()}
            </span>
          </div>
        </div>

        <h3 className="product-card-title" style={{
          color: '#111', fontWeight: 900, fontSize: '0.85rem',
          lineHeight: 1.2, marginBottom: '0.3rem',
          fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.02em',
          textTransform: 'uppercase',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          {car.brand} {car.model}
        </h3>

        <p style={{ color: '#888', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3rem' }}>
          {car.fuelType?.toUpperCase()}
        </p>

        {car.location?.city && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '0.4rem', color: '#94A3B8', fontSize: '0.65rem', fontWeight: 600 }}>
            <MapPin size={10} /> {car.location.city}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span className="product-card-price" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.05rem', fontWeight: 950, color: '#E53935' }}>
              ₹{car.pricePerDay?.toLocaleString('en-IN')}<span style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 800 }}>/day</span>
            </span>
            {car.pricePerHour > 0 && (
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.7rem', fontWeight: 800, color: '#64748B' }}>
                or ₹{car.pricePerHour?.toLocaleString('en-IN')}<span style={{ fontSize: '0.55rem' }}>/hour</span>
              </span>
            )}
          </div>
          <div className="product-card-btn" style={{
            height: '28px', padding: '0 0.7rem',
            background: '#E53935', borderRadius: '6px', color: 'white',
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontSize: '0.65rem', fontWeight: 900, fontFamily: 'Rajdhani, sans-serif',
            letterSpacing: '0.04em', boxShadow: '0 4px 10px rgba(229,57,53,0.15)'
          }}>
            RENT <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
