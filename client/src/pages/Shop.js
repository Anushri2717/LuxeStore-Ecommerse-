import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useApi';
import './Shop.css';

const SORTS = [
  { value: '', label: 'Featured' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
];
const CATS = ['all','watches','fashion','electronics','home','accessories'];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [view, setView] = useState('grid');

  const params = {};
  if (category !== 'all') params.category = category;
  if (sort) params.sort = sort;
  if (search) params.search = search;

  const { products, loading } = useProducts(params);

  useEffect(() => {
    const p = {};
    if (category !== 'all') p.category = category;
    if (sort) p.sort = sort;
    if (search) p.search = search;
    setSearchParams(p);
  }, [category, sort, search]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); };
  const clearFilters = () => { setCategory('all'); setSort(''); setSearch(''); setSearchInput(''); };
  const hasFilters = category !== 'all' || sort || search;

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="container">
          <div className="shop-header-inner">
            <div>
              <p className="section-eyebrow">Our Collection</p>
              <h1 className="section-title">Shop All Products</h1>
            </div>
            <form onSubmit={handleSearch} className="shop-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="shop-search-input"
              />
              {searchInput && (
                <button type="button" onClick={() => { setSearchInput(''); setSearch(''); }}
                  className="search-clear">✕</button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="container shop-body">
        <div className="shop-toolbar">
          <div className="cat-filters">
            {CATS.map(c => (
              <button
                key={c}
                className={`cat-filter-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <div className="toolbar-right">
            <span className="product-count">
              {loading ? '...' : `${products.length} products`}
            </span>
            <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <div className="view-toggle">
              <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
              <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
            </div>
            {hasFilters && (
              <button className="btn btn-ghost clear-filters" onClick={clearFilters}>
                Clear ✕
              </button>
            )}
          </div>
        </div>

        {hasFilters && (
          <div className="active-filters">
            {category !== 'all' && (
              <span className="filter-tag">
                {category} <button onClick={() => setCategory('all')}>✕</button>
              </span>
            )}
            {search && (
              <span className="filter-tag">
                "{search}" <button onClick={() => { setSearch(''); setSearchInput(''); }}>✕</button>
              </span>
            )}
            {sort && (
              <span className="filter-tag">
                {SORTS.find(s => s.value === sort)?.label}
                <button onClick={() => setSort('')}>✕</button>
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="products-grid">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height:'380px', borderRadius:'20px' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">◈</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-primary" onClick={clearFilters} style={{ marginTop:'16px' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={`products-grid ${view === 'list' ? 'list-view' : ''}`}>
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;