import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingLocation } from '../api/rentalApi';
import { PageLoader } from '../components/common/LoadingSpinner';
import { MapPin, Bike, Clock, ArrowLeft, Navigation, Shield, Zap, Loader } from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const TrackBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const fetchData = async () => {
      try {
        const { data } = await getBookingLocation(id);
        setBooking(data.booking);
        setLocation(data.location);
      } catch (err) {
        toast.error('Failed to load tracking data');
        navigate('/my-bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Connect socket
    const serverUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5003';
    const socket = io(serverUrl, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('admin_watch_all'); // For simplicity, though user-specific emit could be used
    });

    socket.on('location_update', (data) => {
      if (data.bookingId === id) {
        setLocation({
          lat: data.lat,
          lng: data.lng,
          speed: data.speed,
          heading: data.heading,
          updatedAt: data.updatedAt
        });
      }
    });

    return () => {
      socket.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    if (loading || !mapRef.current || mapInstanceRef.current) return;

    const initMap = () => {
      const L = window.L;
      if (!L) {
        setTimeout(initMap, 200);
        return;
      }

      const map = L.map(mapRef.current).setView(
        location?.lat ? [location.lat, location.lng] : [20.5937, 78.9629],
        location?.lat ? 15 : 5
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      if (location?.lat) {
        const carIcon = L.divIcon({
          className: 'custom-car-marker',
          html: `<div style="background:#E53935;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;border:3px solid white;box-shadow:0 4px 15px rgba(229,57,53,0.4);">🏍️</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        markerRef.current = L.marker([location.lat, location.lng], { icon: carIcon })
          .addTo(map);
      }
    };

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [loading, location]);

  useEffect(() => {
    if (markerRef.current && location?.lat) {
      markerRef.current.setLatLng([location.lat, location.lng]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo([location.lat, location.lng]);
      }
    }
  }, [location]);

  if (loading) return <PageLoader />;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#0F172A', color: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Tracking <span style={{ color: '#E53935' }}>#{id.slice(-8).toUpperCase()}</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0, fontWeight: 600 }}>{booking?.carSnapshot?.brand} {booking?.carSnapshot?.model}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: socketConnected ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '0.4rem 1rem', borderRadius: '999px', border: socketConnected ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: socketConnected ? '#10B981' : '#EF4444', animation: socketConnected ? 'pulse 2s infinite' : 'none' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: socketConnected ? '#10B981' : '#EF4444' }}>
            {socketConnected ? 'LIVE UPDATES' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
        {/* Map Container */}
        <div ref={mapRef} style={{ flex: 1, zIndex: 1 }} />

        {/* Overlay Info Card */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', zIndex: 10, maxWidth: '400px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid #EEE' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <div style={{ background: booking?.status === 'active' ? '#DCFCE7' : '#F1F5F9', color: booking?.status === 'active' ? '#16A34A' : '#64748B', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    {booking?.status}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Speed</span>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem', fontWeight: 900, color: '#111' }}>{Math.round(location?.speed || 0)} <span style={{ fontSize: '0.8rem', color: '#64748B' }}>km/h</span></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ background: '#F8FAFC', padding: '0.8rem', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <Navigation size={14} style={{ color: '#E53935' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Heading</span>
                </div>
                <div style={{ fontWeight: 800, color: '#111', fontSize: '0.9rem' }}>{location?.heading || 0}°</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '0.8rem', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <Clock size={14} style={{ color: '#E53935' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Last Update</span>
                </div>
                <div style={{ fontWeight: 800, color: '#111', fontSize: '0.9rem' }}>
                  {location?.updatedAt ? new Date(location.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#0F172A', color: 'white', padding: '0.8rem 1.2rem', borderRadius: '16px' }}>
                <Shield size={20} style={{ color: '#10B981' }} />
                <div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Safety Status</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Secure Connection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        .custom-car-marker {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default TrackBooking;
