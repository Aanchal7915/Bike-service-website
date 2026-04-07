import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBikes } from '../api/bikeApi';
import BikeCard from '../components/bikes/BikeCard';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const BRANDS = ['Honda', 'Bajaj', 'TVS', 'Hero', 'Royal Enfield', 'Yamaha', 'Suzuki', 'KTM', 'Kawasaki'];
const CONDITIONS = ['excellent', 'good', 'fair', 'poor'];
const FUEL_TYPES = ['petrol', 'electric', 'hybrid'];

export default function BuyBikes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    brand: searchParams.get('brand') || '',
    condition: '',
    fuelType: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    sort: 'newest',
  });

  const fetchBikes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await getBikes(params);
      setBikes(data.bikes);
      setTotal(data.total);
      setPages(data.pages);
    } catch { } finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchBikes(); }, [fetchBikes]);

  const handleFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', type: '', brand: '', condition: '', fuelType: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '', sort: 'newest' });
    setPage(1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <style>{`
        @media (max-width: 640px) {
          .bikes-search-bar { flex-direction: column !important; }
          .bikes-search-bar > div:first-child { min-width: 100% !important; }
          .bikes-type-pills { width: 100%; justify-content: center; }
          .bikes-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.6rem !important; }
          .bikes-filter-panel { grid-template-columns: 1fr 1fr !important; }
          .bikes-sort-row { width: 100% !important; }
          .bikes-sort-row select { width: 100% !important; }
          .bikes-sort-row button { flex: 1 !important; }
        }
        @media (max-width: 400px) {
          .bikes-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bikes-filter-panel { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* Header */}
      <div style={{ background: '#F9F9F9', borderBottom: '1px solid #EEE', padding: '2rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111', marginBottom: '0.3rem' }}>
            Buy <span style={{ color: '#E53935' }}>Bikes</span>
          </h1>
          <p style={{ color: '#666' }}>{total} bikes available</p>
 
          {/* Search & Sort Bar */}
          <div className="bikes-search-bar" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input type="text" className="input-light" style={{ paddingLeft: '2.5rem' }}
                placeholder="Search brand, model, city..."
                value={filters.search}
                onChange={(e) => handleFilter('search', e.target.value)} />
            </div>
 
            {/* Type Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {['', 'new', 'used'].map((t) => (
                <button key={t} onClick={() => handleFilter('type', t)}
                  style={{
                    padding: '0.5rem 1.2rem', borderRadius: '999px', border: '1px solid',
                    borderColor: filters.type === t ? '#E53935' : '#EEE',
                    background: filters.type === t ? 'rgba(229,57,53,0.05)' : '#FFF',
                    color: filters.type === t ? '#E53935' : '#666',
                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                    transition: 'all 0.2s'
                  }}>
                  {t === '' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
 
            <div className="bikes-sort-row" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select className="input-light" style={{ width: 'auto' }} value={filters.sort} onChange={(e) => handleFilter('sort', e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>

              <button onClick={() => setFiltersOpen(!filtersOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.2rem', background: '#FFF', border: '1px solid #EEE', borderRadius: '8px', color: '#666', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                <SlidersHorizontal size={16} /> Filters
              </button>
            </div>
          </div>
 
          {/* Expanded Filters */}
          {filtersOpen && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#FFF', borderRadius: '12px', border: '1px solid #EEE', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div className="bikes-filter-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {/* Brand */}
                <div>
                  <label style={{ color: '#888', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Brand</label>
                  <select className="input-light" value={filters.brand} onChange={(e) => handleFilter('brand', e.target.value)}>
                    <option value="">All Brands</option>
                    {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                {/* Condition */}
                <div>
                  <label style={{ color: '#888', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Condition</label>
                  <select className="input-light" value={filters.condition} onChange={(e) => handleFilter('condition', e.target.value)}>
                    <option value="">All</option>
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                {/* Fuel */}
                <div>
                  <label style={{ color: '#888', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Fuel Type</label>
                  <select className="input-light" value={filters.fuelType} onChange={(e) => handleFilter('fuelType', e.target.value)}>
                    <option value="">All</option>
                    {FUEL_TYPES.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                  </select>
                </div>
                {/* Price */}
                <div>
                  <label style={{ color: '#888', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Price Range (₹)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="number" className="input-light" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilter('minPrice', e.target.value)} />
                    <input type="number" className="input-light" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilter('maxPrice', e.target.value)} />
                  </div>
                </div>
                {/* Year */}
                <div>
                  <label style={{ color: '#888', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Year Range</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="number" className="input-light" placeholder="From" value={filters.minYear} onChange={(e) => handleFilter('minYear', e.target.value)} />
                    <input type="number" className="input-light" placeholder="To" value={filters.maxYear} onChange={(e) => handleFilter('maxYear', e.target.value)} />
                  </div>
                </div>
              </div>
              <button onClick={clearFilters} style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: '1px solid #EEE', borderRadius: '6px', color: '#888', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                <X size={14} /> Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
 
      {/* Bike Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : bikes.length > 0 ? (
          <>
            <div className="animate-fadeInUp bikes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {bikes.map((bike) => <BikeCard key={bike._id} bike={bike} hideBadges={true} />)}
            </div>
 
            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '4rem' }}>
                {[...Array(pages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    style={{
                      width: 40, height: 40, borderRadius: '10px', border: '1px solid',
                      borderColor: page === i + 1 ? '#E53935' : '#EEE',
                      background: page === i + 1 ? '#E53935' : '#FFF',
                      color: page === i + 1 ? 'white' : '#666',
                      cursor: 'pointer', fontWeight: 700,
                      transition: 'all 0.2s'
                    }}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#555' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 500 }}>No bikes match your filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
