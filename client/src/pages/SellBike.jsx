import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { createSellRequest, getPriceEstimate } from '../api/storeApi';
import toast from 'react-hot-toast';
import { Upload, Camera, Loader, IndianRupee, CheckCircle, Clock, Truck, ArrowRight } from 'lucide-react';

const BRANDS = ['Honda', 'Bajaj', 'TVS', 'Hero', 'Royal Enfield', 'Yamaha', 'Suzuki', 'KTM', 'Kawasaki', 'Other'];

export default function SellBike() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  if (!user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', background: '#0A0A0A' }}>
        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>Login to Sell Your Bike</h2>
        <button onClick={() => navigate('/login')} className="btn-primary">Login Now</button>
      </div>
    );
  }

  const handleEstimate = async () => {
    const formData = watch();
    if (!formData.brand || !formData.model || !formData.year || !formData.kmDriven || !formData.condition) {
      toast.error('Fill all required fields first');
      return;
    }
    try {
      const { data } = await getPriceEstimate({
        brand: formData.brand, model: formData.model, year: formData.year,
        kmDriven: formData.kmDriven, condition: formData.condition, engineCC: formData.engineCC,
      });
      setEstimatedPrice(data.estimatedPrice);
    } catch { toast.error('Estimation failed'); }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.slice(0, 10));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      // Build pickup address object
      const pickupAddress = { street: data.pickupStreet, city: data.pickupCity, state: data.pickupState, pincode: data.pickupPincode };
      Object.entries(data).forEach(([k, v]) => {
        if (k.startsWith('pickup') && k !== 'pickupAddress') return; // skip individual pickup fields
        if (v !== null && v !== undefined && typeof v !== 'object') formData.append(k, v);
      });
      formData.append('pickupAddress', JSON.stringify(pickupAddress));
      images.forEach((img) => formData.append('images', img));
      await createSellRequest(formData);
      setStep(3);
      toast.success('Sell request submitted! 🏍️');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <div style={{ background: '#F9F9F9', borderBottom: '1px solid #EEE', padding: '3.5rem 0' }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="animate-fadeInUp" style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '3.5rem', fontWeight: 900, color: '#111', lineHeight: 1.1, marginBottom: '0.8rem' }}>
              SELL YOUR <span style={{ color: '#E53935' }}>BIKE INSTANTLY</span>
            </h1>
            <p style={{ color: '#666', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '0.02em', maxWidth: '500px', margin: '0 auto' }}>Get the industry-best price appraisal and sell your motorcycle in under 60 minutes.</p>
          </div>
        </div>
      </div>
 
      <div className="max-w-3xl mx-auto px-4 py-6">
        {step === 1 && (
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {/* USPs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { title: 'Instant Valuation', desc: 'AI-derived precision pricing' },
                { title: 'Free Home Pickup', desc: 'We come to your doorstep' },
                { title: 'Direct Bank Pay', desc: 'Get paid within 30 minutes' },
              ].map(({ title, desc }) => (
                <div key={title} style={{ textAlign: 'center', padding: '1rem 0.8rem', background: '#FFF', borderRadius: '18px', border: '1px solid #EEE', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#111'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#EEE'; }}>
                  <div style={{ color: '#111', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'Rajdhani, sans-serif', marginBottom: '0.1rem' }}>{title.toUpperCase()}</div>
                  <div style={{ color: '#888', fontSize: '0.75rem', fontWeight: 600 }}>{desc}</div>
                </div>
              ))}
            </div>
 
            <form onSubmit={handleSubmit(onSubmit)} style={{ background: '#FFF', border: '1.5px solid #EEE', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 4, height: 22, background: '#E53935', borderRadius: '3px' }} />
                <h3 style={{ color: '#111', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>VEHICLE SPECIFICATIONS</h3>
              </div>
 
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ color: '#666', fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brand *</label>
                  <select className="input-light" style={{ borderRadius: '10px', fontWeight: 600, height: '42px', fontSize: '0.8rem', padding: '0 0.8rem' }} {...register('brand', { required: 'Required' })}>
                    <option value="">Select Brand</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#666', fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Model *</label>
                  <input className="input-light" style={{ borderRadius: '10px', fontWeight: 600, height: '42px', fontSize: '0.8rem', padding: '0 0.8rem' }} placeholder="Model" {...register('model', { required: 'Required' })} />
                </div>
                <div>
                  <label style={{ color: '#666', fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reg. Year *</label>
                  <input type="number" className="input-light" style={{ borderRadius: '10px', fontWeight: 600, height: '42px', fontSize: '0.8rem', padding: '0 0.8rem' }} placeholder="Year" {...register('year', { required: 'Required' })} />
                </div>
                <div>
                  <label style={{ color: '#666', fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KM Driven *</label>
                  <input type="number" className="input-light" style={{ borderRadius: '10px', fontWeight: 600, height: '42px', fontSize: '0.8rem', padding: '0 0.8rem' }} placeholder="KM" {...register('kmDriven', { required: 'Required' })} />
                </div>
                <div>
                  <label style={{ color: '#666', fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Condition *</label>
                  <select className="input-light" style={{ borderRadius: '10px', fontWeight: 600, height: '42px', fontSize: '0.8rem', padding: '0 0.8rem' }} {...register('condition', { required: 'Required' })}>
                    <option value="">Condition</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#666', fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Engine CC</label>
                  <input type="number" className="input-light" style={{ borderRadius: '10px', fontWeight: 600, height: '42px', fontSize: '0.8rem', padding: '0 0.8rem' }} placeholder="CC" {...register('engineCC')} />
                </div>
              </div>

              <div style={{ marginTop: '0.8rem' }}>
                <label style={{ color: '#666', fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                <textarea className="input-light" style={{ borderRadius: '12px', fontWeight: 600, padding: '0.5rem 0.75rem', minHeight: '50px', fontSize: '0.75rem' }} rows={2} placeholder="History..." {...register('description')} />
              </div>

              {/* Instant Estimate */}
              <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#F9F9F9', borderRadius: '14px', border: '1.5px solid #EEE' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
                  <div>
                    <div style={{ color: '#888', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.1rem' }}>VALUATION</div>
                    {estimatedPrice ? (
                      <div className="animate-fadeIn" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 900, color: '#2E7D32', lineHeight: 1 }}>
                        ₹{estimatedPrice.toLocaleString('en-IN')}
                      </div>
                    ) : (
                      <div style={{ color: '#AAA', fontSize: '0.8rem', fontWeight: 600 }}>Calculating...</div>
                    )}
                  </div>
                  <button type="button" onClick={handleEstimate}
                    style={{ height: '38px', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0 0.8rem', background: '#111', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 800, border: 'none', transition: 'all 0.2s', fontSize: '0.75rem' }}>
                    <IndianRupee size={12} /> APPRAISE
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              <div style={{ marginTop: '1rem' }}>
                <label style={{ color: '#666', fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Photos (max 10)
                </label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '1rem 0.8rem', border: '2px dashed #EEE', borderRadius: '14px', cursor: 'pointer',
                  background: '#F9F9F9', transition: 'all 0.3s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = '#FFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#EEE'; e.currentTarget.style.background = '#F9F9F9'; }}>
                  <div style={{ width: 34, height: 34, borderRadius: '10px', background: 'rgba(229,57,53,0.1)', color: '#E53935', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.3rem' }}>
                    <Camera size={18} />
                  </div>
                  <span style={{ color: '#111', fontSize: '0.85rem', fontWeight: 800 }}>Browse Photos</span>
                  <input type="file" multiple accept="image/*,video/*" style={{ display: 'none' }} onChange={handleImageChange} />
                </label>
              </div>

              {/* Pickup Address */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#FFF', borderRadius: '16px', border: '1.5px solid #EEE' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  <Truck size={14} style={{ color: '#E53935' }} />
                  <span style={{ color: '#111', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'Rajdhani, sans-serif' }}>PICKUP DETAILS</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.5fr 0.8fr', gap: '0.5rem' }}>
                  <input className="input-light" style={{ borderRadius: '8px', fontWeight: 600, height: '36px', fontSize: '0.75rem' }} placeholder="Address" {...register('pickupStreet')} />
                  <input className="input-light" style={{ borderRadius: '8px', fontWeight: 600, height: '36px', fontSize: '0.75rem' }} placeholder="City" {...register('pickupCity')} />
                  <input className="input-light" style={{ borderRadius: '8px', fontWeight: 600, height: '36px', fontSize: '0.75rem' }} placeholder="Pin" {...register('pickupPincode')} />
                </div>
              </div>

              <div style={{ marginTop: '0.8rem', padding: '0.5rem 0.6rem', background: '#FFF1F0', borderRadius: '10px', border: '1px solid rgba(229,57,53,0.1)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input type="checkbox" {...register('isOneHourSell')} style={{ accentColor: '#E53935', width: 16, height: 16, cursor: 'pointer' }} />
                  <div>
                    <div style={{ color: '#111', fontWeight: 800, fontSize: '0.75rem' }}>ACTIVATE EXPRESS SALE</div>
                  </div>
                </label>
              </div>

              <button type="submit" className="btn-primary" style={{ height: '48px', width: '100%', justifyContent: 'center', padding: '0.5rem', marginTop: '1rem', fontSize: '0.95rem', fontWeight: 900, borderRadius: '12px', letterSpacing: '0.1em', background: '#E53935', border: 'none' }} disabled={submitting}>
                {submitting ? <Loader size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> : <><Upload size={16} /> SUBMIT REQUEST</>}
              </button>
            </form>
          </div>
        )}
 
        {step === 3 && (
          <div className="animate-scaleIn" style={{ textAlign: 'center', padding: '6rem 3rem', background: '#FFF', borderRadius: '32px', border: '1.5px solid #EEE', boxShadow: '0 30px 100px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(46,125,50,0.1)', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <CheckCircle size={60} />
            </div>
            <h2 style={{ color: '#111', fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.8rem', lineHeight: 1 }}>SUCCESSFULLY LISTED!</h2>
            <p style={{ color: '#666', fontSize: '1.15rem', fontWeight: 500, maxWidth: '450px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>Our appraisal experts are reviewing your submission. You will receive an offer within <span style={{ color: '#E53935', fontWeight: 800 }}>30 minutes</span>.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/my-bookings')} className="btn-primary" style={{ height: '56px', padding: '0 2.5rem', borderRadius: '16px', fontWeight: 800, background: '#111' }}>MY SELL REQUESTS</button>
              <button onClick={() => navigate('/')} className="btn-outline" style={{ height: '56px', padding: '0 2.5rem', borderRadius: '16px', fontWeight: 800, border: '2px solid #111', color: '#111' }}>BACK TO HOME</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
