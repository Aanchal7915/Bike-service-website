import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star } from 'lucide-react';
import { getPart } from '../api/storeApi';
import { getBike } from '../api/bikeApi';
import toast from 'react-hot-toast';

function WishlistItemLoader({ partId, pincode, toggleWishlist, addToCart }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        // Try parts first
        const pRes = await getPart(partId);
        if (pRes.data.part) {
          setItem({ ...pRes.data.part, itemType: 'part' });
          return;
        }
      } catch (e) {
        // Part fetch failed, try bikes
        try {
          const bRes = await getBike(partId);
          if (bRes.data.bike) {
            setItem({ ...bRes.data.bike, itemType: 'bike' });
            return;
          }
        } catch (err) {
          setItem(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [partId]);
 
  if (loading) return (
    <div style={{ background: '#FFF', border: '1px solid #EEE', borderRadius: '24px', height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #F5F5F5', borderTopColor: '#E53935', borderRadius: '50%', animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
 
  if (!item) return (
    <div style={{ background: '#FFF', border: '1px solid #EEE', borderRadius: '24px', height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
      <p style={{ color: '#888', fontSize: '0.9rem', fontWeight: 600 }}>This item is no longer available</p>
      <button onClick={() => toggleWishlist(partId)} style={{ background: '#F9F9F9', border: '1.5px solid #EEE', borderRadius: '12px', color: '#666', cursor: 'pointer', fontSize: '0.8rem', padding: '0.6rem 1.2rem', fontWeight: 800 }}>
        Remove from List
      </button>
    </div>
  );

  const isBike = item.itemType === 'bike';
  const detailUrl = isBike ? `/bikes/${item._id}` : `/parts/${item._id}`;
  const title = isBike ? (item.title || `${item.brand} ${item.model}`) : item.name;
  const brand = item.brand;
  const images = item.images || [];

  // Pincode logic only for parts
  let price = item.price;
  let originalPrice = item.price;
  let discount = 0;
  let effectiveStock = isBike ? 1 : item.stock;

  if (!isBike) {
    const hasPincodePricing = Array.isArray(item.pincodePricing) && item.pincodePricing.length > 0;
    const pincodeEntry = pincode.length === 6 && hasPincodePricing
      ? item.pincodePricing.find(p => p.pincode === pincode) : null;
    price = pincodeEntry ? Number(pincodeEntry.price) : (item.discountedPrice || item.price);
    originalPrice = pincodeEntry?.originalPrice ? Number(pincodeEntry.originalPrice) : item.price;
    effectiveStock = pincodeEntry ? Number(pincodeEntry.inventory) : item.stock;
    discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  }

  return (
    <div style={{ background: '#FFF', border: '1px solid #EEE', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.05)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#EEE'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)'; }}>

      {/* Image */}
      <Link to={detailUrl} style={{ display: 'block', position: 'relative', height: 220, overflow: 'hidden', background: '#F5F5F5', flexShrink: 0, borderBottom: '1px solid #F5F5F5' }}>
        <img
          src={images[0] || 'https://via.placeholder.com/400x300/F5F5F5/E53935?text=Product'}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1.5rem', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 15, left: 15, background: '#E53935', color: 'white', fontSize: '0.75rem', fontWeight: 900, padding: '4px 10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(229,57,53,0.3)', letterSpacing: '0.05em' }}>
            {discount}% OFF
          </span>
        )}
      </Link>

      {/* Info */}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#E53935', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em' }}>
            {isBike ? (item.type || 'BIKE') : (item.category?.replace('_', ' ') || 'PART')}
          </span>
          {!isBike && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Star size={12} fill="#FB8C00" color="#FB8C00" />
              <span style={{ color: '#111', fontSize: '0.75rem', fontWeight: 800 }}>{item.ratings || '5.0'}</span>
            </div>
          )}
        </div>
        <Link to={detailUrl} style={{ textDecoration: 'none' }}>
          <h3 style={{ color: '#111', fontWeight: 900, fontSize: '1.15rem', margin: '0 0 0.4rem', fontFamily: 'Rajdhani, sans-serif', lineHeight: 1.2, textTransform: 'uppercase' }}>{title}</h3>
        </Link>
        <p style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 1rem' }}>
          {isBike ? `${item.year} • ${item.kmDriven?.toLocaleString()} KM • ${item.location?.city || 'India'}` : brand}
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.6rem', fontWeight: 900, color: '#111' }}>₹{price?.toLocaleString('en-IN')}</span>
          {discount > 0 && <span style={{ color: '#AAA', fontSize: '0.9rem', textDecoration: 'line-through', fontWeight: 600 }}>₹{originalPrice?.toLocaleString('en-IN')}</span>}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto' }}>
          {!isBike ? (
            <button
              onClick={() => addToCart({ ...item, effectivePrice: price })}
              disabled={effectiveStock === 0}
              style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.5rem', background: effectiveStock === 0 ? '#EEE' : '#111', color: effectiveStock === 0 ? '#AAA' : 'white', border: 'none', borderRadius: '14px', fontWeight: 900, cursor: effectiveStock === 0 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em', transition: 'all 0.2s' }}>
              <ShoppingCart size={16} /> {effectiveStock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
          ) : (
            <Link to={detailUrl} style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.5rem', background: '#111', color: 'white', textDecoration: 'none', border: 'none', borderRadius: '14px', fontWeight: 900, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em', transition: 'all 0.2s' }}>
              VIEW DETAILS
            </Link>
          )}
          <button
            onClick={() => toggleWishlist(item._id)}
            style={{ width: 48, height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF1F0', border: '1.5px solid rgba(229,57,53,0.1)', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
            title="Remove from wishlist"
            onMouseEnter={e => { e.currentTarget.style.background = '#E53935'; e.currentTarget.firstChild.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FFF1F0'; e.currentTarget.firstChild.style.color = '#E53935'; }}>
            <Trash2 size={18} style={{ color: '#E53935', transition: 'color 0.2s' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default function Wishlist() {
  const { user, wishlist = [], toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [pincode, setPincode] = useState(() => localStorage.getItem('selectedPincode') || '');
 
  useEffect(() => {
    const handler = () => setPincode(localStorage.getItem('selectedPincode') || '');
    window.addEventListener('pincode-updated', handler);
    return () => window.removeEventListener('pincode-updated', handler);
  }, []);
 
  if (!user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', gap: '2rem', padding: '2rem' }}>
        <div style={{ background: '#F9F9F9', width: 140, height: 140, borderRadius: '40px', border: '2px solid #EEE', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', transform: 'rotate(-5deg)' }}>
          <Heart size={60} style={{ color: '#DDD' }} />
        </div>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ color: '#111', fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 900, margin: 0, lineHeight: 1.1 }}>READY TO SAVE <span style={{ color: '#E53935' }}>YOUR FAVORITES?</span></h2>
          <p style={{ color: '#666', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.5 }}>Login to your MotoXpress account to view and manage your personalized wishlist.</p>
        </div>
        <Link to="/login" style={{ background: '#111', color: 'white', padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 900, textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.15em', fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
          ACCOUNT LOGIN
        </Link>
      </div>
    );
  }
 
  if (wishlist.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', gap: '2rem', padding: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ background: '#F9F9F9', width: 140, height: 140, borderRadius: '40px', border: '2px solid #EEE', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <Heart size={60} style={{ color: '#DDD' }} />
          </div>
          <div style={{ position: 'absolute', top: -10, right: -10, width: 44, height: 44, background: '#E53935', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'white', fontWeight: 900, boxShadow: '0 5px 15px rgba(229,57,53,0.3)', border: '4px solid white' }}>0</div>
        </div>
        <div style={{ textAlign: 'center', maxWidth: '450px' }}>
          <h2 style={{ color: '#111', fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '0.05em', lineHeight: 1.1 }}>YOUR WISHLIST <span style={{ color: '#E53935' }}>IS EMPTY</span></h2>
          <p style={{ color: '#666', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>Start exploring our massive inventory of genuine spare parts and save what you love!</p>
        </div>
        <Link to="/parts" style={{ background: '#E53935', color: 'white', padding: '1.2rem 3rem', borderRadius: '16px', fontWeight: 900, textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.15em', fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(229,57,53,0.2)', transition: 'all 0.3s' }}>
          EXPLORE STORE
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #E53935, #FF7043, transparent)' }} />
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
          <button onClick={() => navigate('/')}
            style={{ background: '#111', border: 'none', borderRadius: '12px', padding: '0.8rem 1.5rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', fontWeight: 800, transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}>
            <ArrowLeft size={16} /> BACK TO STORE
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: 4, height: 32, background: '#E53935', borderRadius: '4px' }} />
            <h1 style={{ color: '#111', fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '0.04em' }}>
              YOUR <span style={{ color: '#E53935' }}>WISHLIST</span>
            </h1>
          </div>
        </div>
 
        {pincode.length === 6 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#F9F9F9', borderRadius: '10px', border: '1px solid #EEE', width: 'fit-content', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.1rem' }}>📍</span>
            <span style={{ color: '#666', fontSize: '0.85rem', fontWeight: 700 }}>
              Checking availability for <span style={{ color: '#E53935' }}>{pincode}</span>
            </span>
          </div>
        )}
 
        <div className="animate-fadeInUp" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.8rem' }}>
          {wishlist.map((id) => (
            <WishlistItemLoader key={id} partId={id} pincode={pincode} toggleWishlist={toggleWishlist} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}
