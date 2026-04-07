import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Account created! Welcome');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #E53935, #C62828)', borderRadius: '10px', padding: '10px 14px' }}>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, color: 'white', fontSize: '1.4rem' }}>MOTO</span>
            </div>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, color: '#111', fontSize: '1.6rem' }}>XPRESS</span>
          </Link>
          <h1 style={{ color: '#111', fontSize: '1.8rem', fontWeight: 900, marginTop: '2rem', fontFamily: 'Rajdhani, sans-serif' }}>Create Account</h1>
          <p style={{ color: '#666', marginTop: '0.5rem', fontWeight: 500 }}>Join India's fastest bike platform</p>
        </div>
 
        <div style={{ background: '#FFF', border: '1px solid #EEE', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {[
              { name: 'name', label: 'Full Name', icon: User, placeholder: 'John Doe', type: 'text', rules: { required: 'Name is required' } },
              { name: 'email', label: 'Email Address', icon: Mail, placeholder: 'you@example.com', type: 'email', rules: { pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } } },
              { name: 'phone', label: 'Mobile Number', icon: Phone, placeholder: '+91 98765 43210', type: 'tel', rules: {} },
            ].map(({ name, label, icon: Icon, placeholder, type, rules }) => (
              <div key={name} style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#333', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#AAA' }} />
                  <input type={type} className="input-light" style={{ paddingLeft: '2.8rem', height: '52px' }} placeholder={placeholder} {...register(name, rules)} />
                </div>
                {errors[name] && <p style={{ color: '#E53935', fontSize: '0.82rem', marginTop: '0.4rem', fontWeight: 600 }}>{errors[name].message}</p>}
              </div>
            ))}
 
            <div style={{ marginBottom: '1.8rem' }}>
              <label style={{ color: '#333', fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#AAA' }} />
                <input type={showPass ? 'text' : 'password'} className="input-light" style={{ paddingLeft: '2.8rem', paddingRight: '2.8rem', height: '52px' }}
                  placeholder="Min. 6 characters"
                  {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#AAA', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#E53935', fontSize: '0.82rem', marginTop: '0.4rem', fontWeight: 600 }}>{errors.password.message}</p>}
            </div>
 
            <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: '1.8rem', lineHeight: 1.6 }}>
              By creating an account, you agree to our{' '}
              <Link to="/terms" style={{ color: '#E53935', textDecoration: 'none', fontWeight: 700 }}>Terms</Link> and{' '}
              <Link to="/privacy" style={{ color: '#E53935', textDecoration: 'none', fontWeight: 700 }}>Privacy</Link>.
            </p>
 
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.1rem', fontSize: '1.05rem', fontWeight: 700, borderRadius: '12px' }} disabled={loading}>
              {loading ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <><ArrowRight size={20} /> CREATE ACCOUNT</>}
            </button>
          </form>
        </div>
 
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem', fontSize: '0.95rem', fontWeight: 500 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#E53935', textDecoration: 'none', fontWeight: 700 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
