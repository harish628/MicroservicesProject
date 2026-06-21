// src/pages/HomePage.js
//
// The main storefront — hero, category filter pills, search bar, product grid.
// This is the page that talks to Product Service (via the Gateway) the most.

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import { productsApi } from '../api/products';

export default function HomePage() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // Fetch categories once on mount
  useEffect(() => {
    productsApi.getCategories()
      .then(setCategories)
      .catch(() => {}); // categories are non-critical — fail silently
  }, []);

  // Fetch products whenever category or search changes
  // useCallback so this function reference is stable for useEffect's dependency array
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { per_page: 24 };
      if (activeCategory) params.category_id = activeCategory;
      if (search)         params.search = search;

      const data = await productsApi.getAll(params);
      setProducts(data.products);
    } catch (err) {
      setError('Could not load products. Is the Product Service running?');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    // Debounce search — wait 400ms after typing stops before calling the API
    // Feynman: like waiting for someone to finish a sentence before responding,
    // instead of interrupting after every single word they type.
    const timer = setTimeout(fetchProducts, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchProducts, search]);

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-eyebrow">ShopFlow Marketplace</div>
        <h1>Everything you need, priced honestly.</h1>
        <p>Browse thousands of products across every category — no markup games, no fake discounts. Just real prices on real things.</p>
      </section>

      <div className="search-bar" style={{ marginTop: 28 }}>
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search for anything..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {categories.length > 0 && (
        <div className="category-row">
          <button
            className={`category-pill ${!activeCategory ? 'active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="section-header">
        <h2>{search ? `Results for "${search}"` : 'Browse Products'}</h2>
      </div>

      {loading && <p className="loading-text">Loading products...</p>}

      {error && (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p>No products found. Try a different search or category.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
