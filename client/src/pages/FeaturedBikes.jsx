import { useState, useEffect } from 'react';
import { getFeaturedBikes } from '../api/bikeApi';
import BikeCard from '../components/bikes/BikeCard';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function FeaturedBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFeaturedBikes()
      .then(({ data }) => setBikes(data.bikes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #E53935, #E57373, transparent)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '3.5rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3.5rem' }}>
          <Link to="/bikes" style={{ background: '#F9F9F9', border: '1px solid #EEE', borderRadius: '12px', padding: '0.6rem 1.2rem', color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 800, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.borderColor = '#111'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F9F9F9'; e.currentTarget.style.borderColor = '#EEE'; }}>
            <ArrowLeft size={16} /> BROWSE ALL
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 6, height: 32, background: '#E53935', borderRadius: '3px' }} />
            <h1 style={{ color: '#111', fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 950, margin: 0, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              FEATURED <span style={{ color: '#E53935' }}>BIKES</span>
            </h1>
          </div>
        </div>
        
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : bikes.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
            {bikes.map(bike => <BikeCard key={bike._id} bike={bike} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '10rem 2rem', background: '#F9F9F9', borderRadius: '32px', border: '1.5px solid #EEE' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem', opacity: 0.2 }}>⭐</div>
            <h3 style={{ color: '#111', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase' }}>NO FEATURED BIKES FOUND</h3>
            <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 600, marginTop: '0.6rem', maxWidth: '400px', margin: '0.6rem auto' }}>Our curated collection of premium motorcycles is currently being updated. Check back shortly!</p>
            <Link to="/bikes" style={{ display: 'inline-block', marginTop: '2.5rem', color: '#E53935', fontWeight: 900, textDecoration: 'none', borderBottom: '2.5px solid #E53935', paddingBottom: '3px' }}>EXPLORE CATALOGUE →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
