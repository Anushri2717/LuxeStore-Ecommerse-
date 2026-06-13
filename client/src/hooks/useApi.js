import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE = 'http://localhost:5000/api';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE}/products`, { params })
      .then(r => setProducts(r.data.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { products, loading, error };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${BASE}/products/${id}`)
      .then(r => setProduct(r.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading };
};

export const useBanners = () => {
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    axios.get(`${BASE}/banners`).then(r => setBanners(r.data.data));
  }, []);
  return banners;
};

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    axios.get(`${BASE}/testimonials`).then(r => setTestimonials(r.data.data));
  }, []);
  return testimonials;
};