import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBike, enquireBike } from '../api/bikeApi';
import { toggleWishlist } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Heart, Phone, MessageCircle, MapPin, Calendar, Gauge, Zap, CheckCircle, ArrowLeft, Eye, Share2 } from 'lucide-react';

const isVideo = (url = '') => /\.(mp4|mov|webm|ogg|m4v)(\?.*)?$/i.test(url) || url.includes('/video/upload/');

export default function BikeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState(user?.phone || '');
  const [enquirySending, setEnquirySending] = useState(false);

  const [selectedPincode, setSelectedPincode] = useState(
    () => localStorage.getItem('selectedPincode') || ''
  );

  useEffect(() => {
    const handlePincodeUpdate = () => {
      setSelectedPincode(localStorage.getItem('selectedPincode') || '');
    };
    window.addEventListener('pincode-updated', handlePincodeUpdate);
    return () => window.removeEventListener('pincode-updated', handlePincodeUpdate);
  }, []);

  useEffect(() => {
    getBike(id).then(({ data }) => {
      setBike(data.bike);
      setWishlisted(user?.wishlist?.includes(data.bike._id));
    }).catch(() => navigate('/bikes'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login'); navigate('/login'); return; }
    try {
      await toggleWishlist(id);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { toast.error('Failed'); }
  };

  const handleEnquire = async () => {
    if (!user) { toast.error('Please login'); navigate('/login'); return; }
    if (!enquiryPhone) { toast.error('Please enter your phone number'); return; }
    setEnquirySending(true);
    try {
      await enquireBike(id, { message: enquiryMsg, phone: enquiryPhone });
      toast.success('Enquiry sent! Seller will contact you.');
      setEnquiryMsg('');
      // Refresh bike data to show status
      const { data } = await getBike(id);
      setBike(data.bike);
    } catch { toast.error('Failed to send enquiry'); }
    finally { setEnquirySending(false); }
  };

  if (loading) return <PageLoader />;
  if (!bike) return null;

  // Combine images and videos into a single media array
  const imageList = bike.images?.length ? bike.images : [];
  const videoList = bike.videos?.length ? bike.videos : [];
  const media = [...imageList, ...videoList];
  if (media.length === 0) media.push('https://via.placeholder.com/800x500/1A1A1A/E53935?text=Bike+Image');

  // Pincode pricing logic
  const pincodeData = bike.pincodePricing?.find(p => p.pincode === selectedPincode.trim()) || null;
  const effectivePrice = pincodeData ? Number(pincodeData.price) : (bike.discountedPrice || bike.price);
  const effectiveOriginalPrice = pincodeData?.originalPrice ? Number(pincodeData.originalPrice) : bike.price;
  const effectiveLocation = pincodeData?.location || bike.location?.city;

  const discount = effectiveOriginalPrice && effectiveOriginalPrice > effectivePrice
    ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#F9F9F9', borderBottom: '1px solid #EEE', padding: '0.8rem 0' }}>
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-2" style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>
          <button onClick={() => navigate('/bikes')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#111'}
            onMouseLeave={e => e.currentTarget.style.color = '#666'}>
            <ArrowLeft size={16} /> Back to Inventory
          </button>
          <span>/</span>
          <span style={{ color: '#E53935', fontWeight: 800 }}>{bike.brand} {bike.model}</span>
        </div>
      </div>
 
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="animate-fadeInUp" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>
 
          {/* Left: Media & Details */}
          <div>
            {/* Main Image/Video */}
            <div style={{ position: 'relative', background: '#F5F5F5', borderRadius: '20px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid #EEE', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
              {/* Wishlist Floating Button */}
              <button onClick={handleWishlist}
                style={{ position: 'absolute', top: '15px', right: '15px', width: '42px', height: '42px', borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <Heart size={20} fill={wishlisted ? '#E53935' : 'none'} color={wishlisted ? '#E53935' : '#111'} strokeWidth={2.5} />
              </button>

              {isVideo(media[selectedImage]) ? (
                <video
                  key={media[selectedImage]}
                  src={media[selectedImage]}
                  controls autoPlay muted playsInline
                  style={{ width: '100%', height: 420, objectFit: 'contain', background: '#000' }}
                />
              ) : (
                <img src={media[selectedImage]} alt={bike.title} style={{ width: '100%', height: 420, objectFit: 'cover' }} />
              )}
            </div>
 
            {/* Thumbnails */}
            {media.length > 1 && (
              <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.8rem', marginBottom: '2rem' }} className="hide-scrollbar">
                {media.map((src, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    style={{ flexShrink: 0, width: 90, height: 65, borderRadius: '12px', overflow: 'hidden', border: '2.5px solid', borderColor: selectedImage === i ? '#E53935' : '#EEE', cursor: 'pointer', padding: 0, position: 'relative', transition: 'all 0.2s', background: '#FFF' }}>
                    {isVideo(src) ? (
                      <>
                        <video src={src} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1.2rem' }}>▶</div>
                      </>
                    ) : (
                      <img src={src} alt={`Thumb ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
 
            {/* Specifications */}
            {bike.specifications && Object.keys(bike.specifications).some(k => bike.specifications[k]) && (
              <div style={{ marginTop: '0.8rem', background: '#FFF', border: '1px solid #EEE', borderRadius: '20px', padding: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <h3 style={{ color: '#111', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem', fontWeight: 900, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 6, height: 20, background: '#E53935', borderRadius: '4px' }} />
                  Full Specifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {Object.entries(bike.specifications || {}).map(([key, value]) => value && (
                    <div key={key} style={{ padding: '0.6rem 0.8rem', background: '#F9F9F9', borderRadius: '10px', border: '1px solid #EEE' }}>
                      <div style={{ color: '#888', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.2rem' }}>{key}</div>
                      <div style={{ color: '#111', fontWeight: 700, fontSize: '0.85rem' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
 
            {/* Description */}
            {bike.description && (
              <div style={{ marginTop: '1.2rem', background: '#FFF', border: '1px solid #EEE', borderRadius: '20px', padding: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <h3 style={{ color: '#111', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 6, height: 20, background: '#E53935', borderRadius: '4px' }} />
                  Vehicle Overview
                </h3>
                <p style={{ color: '#555', lineHeight: 1.6, fontSize: '0.95rem', fontWeight: 500 }}>{bike.description}</p>
              </div>
            )}
          </div>
 
          {/* Right: Info & Actions */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ background: '#FFF', border: '1px solid #EEE', borderRadius: '20px', padding: '1.2rem', marginBottom: '1.2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              {/* Status badges */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                <span className={`badge ${bike.type === 'new' ? 'badge-green' : 'badge-blue'}`} style={{ fontWeight: 800, fontSize: '0.6rem' }}>{bike.type === 'new' ? 'NEW' : 'CERTIFIED'}</span>
              </div>
 
              <h1 style={{ color: '#111', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.4rem', lineHeight: 1.1 }}>
                {bike.brand} {bike.model}
              </h1>
 
              <div style={{ marginBottom: '1.2rem', borderBottom: '1px solid #EEE', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 950, color: '#E53935', lineHeight: 1 }}>
                    ₹{effectivePrice?.toLocaleString('en-IN')}
                  </div>
                  {discount > 0 && (
                    <div style={{
                      background: 'rgba(229,57,53,0.1)', color: '#E53935',
                      fontSize: '0.8rem', fontWeight: 900,
                      padding: '2px 8px', borderRadius: '6px',
                      fontFamily: 'Rajdhani, sans-serif'
                    }}>
                      {discount}% OFF
                    </div>
                  )}
                </div>
                {discount > 0 && (
                  <div style={{ color: '#AAA', fontSize: '0.9rem', textDecoration: 'line-through', marginTop: '0.2rem', fontWeight: 700 }}>
                    MRP: ₹{effectiveOriginalPrice?.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
 
              {/* Key Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {[
                  { icon: Calendar, label: 'Year', value: bike.year },
                  { icon: Gauge, label: 'Mileage', value: `${bike.kmDriven?.toLocaleString()} km` },
                  { icon: Zap, label: 'Engine', value: `${bike.engineCC || '-'} cc` },
                  { icon: MapPin, label: 'Location', value: effectiveLocation || 'N/A' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ padding: '0.6rem 0.8rem', background: '#F9F9F9', borderRadius: '12px', border: '1px solid #EEE' }}>
                    <div style={{ color: '#888', fontSize: '0.65rem', marginBottom: '0.2rem', fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
                    <div style={{ color: '#111', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Icon size={14} style={{ color: '#E53935' }} /> {value}
                    </div>
                  </div>
                ))}
              </div>
 
              <div style={{ color: '#AAA', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem', paddingLeft: '0.2rem' }}>
                <Eye size={14} /> {bike.views} views
              </div>
 
              {/* Enquiry */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ marginBottom: '0.6rem' }}>
                  <label style={{ color: '#888', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem', display: 'block', paddingLeft: '0.2rem' }}>PHONE NUMBER *</label>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={enquiryPhone}
                    onChange={e => setEnquiryPhone(e.target.value)}
                    className="input-light"
                    style={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, padding: '0.6rem', height: '42px' }}
                  />
                </div>
                <label style={{ color: '#888', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem', display: 'block', paddingLeft: '0.2rem' }}>MESSAGE</label>
                <textarea
                  placeholder="Ask about availability, price, etc..."
                  value={enquiryMsg}
                  onChange={e => setEnquiryMsg(e.target.value)}
                  rows={2}
                  className="input-light"
                  style={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, padding: '0.6rem' }}
                />
              </div>

              {/* Status if already enquired */}
              {bike.userEnquiry && (
                <div style={{ marginBottom: '1.2rem', padding: '0.8rem', background: 'rgba(229,57,53,0.05)', border: '1px solid rgba(229,57,53,0.1)', borderRadius: '12px' }}>
                  <div style={{ color: '#E53935', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.2rem' }}>ENQUIRY STATUS</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#111', fontWeight: 800, fontSize: '0.9rem' }}>
                    <CheckCircle size={14} style={{ color: '#2E7D32' }} /> 
                    {bike.userEnquiry.status?.toUpperCase() || 'REQUESTED'}
                  </div>
                </div>
              )}
 
              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <button onClick={handleEnquire} disabled={enquirySending} className="btn-primary" style={{ height: '52px', borderRadius: '12px', fontSize: '1rem', fontWeight: 900, background: '#111' }}>
                  <MessageCircle size={20} /> {enquirySending ? 'SENDING...' : 'ENQUIRE NOW'}
                </button>
                {bike.seller?.phone && (
                  <a href={`tel:${bike.seller.phone}`} className="btn-outline" style={{ height: '52px', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, background: '#FFF', color: '#111', border: '2px solid #111', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={18} /> CALL SELLER
                  </a>
                )}
              </div>
            </div>
 
            {/* Seller Info Card */}
            {bike.seller && (
              <div className="animate-fadeIn" style={{ background: '#F9F9F9', border: '1px solid #EEE', borderRadius: '20px', padding: '1.5rem', animationDelay: '0.3s' }}>
                <p style={{ color: '#888', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2rem' }}>LISTED BY</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 50, height: 50, borderRadius: '16px', background: '#E53935', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1.3rem', boxShadow: '0 5px 15px rgba(229,57,53,0.3)' }}>
                    {bike.seller.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: '#111', fontWeight: 800, fontSize: '1.1rem' }}>{bike.seller.name}</div>
                    <div style={{ color: '#2E7D32', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, marginTop: '0.2rem' }}>
                      <CheckCircle size={14} /> CERTIFIED PARTNER
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
