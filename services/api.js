// services/api.js

// services/api.js
const API_BASE = '/api';

async function request(endpoint, method = 'GET', data = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  let json;
  const text = await res.text(); // get raw text first
  try {
    json = JSON.parse(text);
  } catch (e) {
    // If response is not JSON, throw a clear error
    throw new Error(`Server returned non-JSON response (status ${res.status}). Please check your API route.`);
  }

  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

// ... rest of the file

// Get token from localStorage
function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export const auth = {
  register: (data) => request('/auth/register', 'POST', data),
  login: (data) => request('/auth/login', 'POST', data),
  me: () => request('/auth/me', 'GET', null, getToken()),
};

export const products = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products?${query}`, 'GET', null, getToken());
  },
  get: (id) => request(`/products/${id}`, 'GET', null, getToken()),
  create: (data) => request('/products', 'POST', data, getToken()),
  update: (id, data) => request(`/products/${id}`, 'PUT', data, getToken()),
  delete: (id) => request(`/products/${id}`, 'DELETE', null, getToken()),
};

// services/api.js – add this to the importedProducts object
export const importedProducts = {
  create: (data) => request('/imported-products', 'POST', data, getToken()),
  list: () => request('/imported-products', 'GET', null, getToken()),
  get: (id) => request(`/imported-products/${id}`, 'GET', null, getToken()),  // ✅ NEW
  update: (id, data) => request(`/imported-products/${id}`, 'PUT', data, getToken()),
};

export const installments = {
  create: (data) => request('/installments', 'POST', data, getToken()),
  list: () => request('/installments', 'GET', null, getToken()),
  get: (id) => request(`/installments/${id}`, 'GET', null, getToken()),
  update: (id, data) => request(`/installments/${id}`, 'PUT', data, getToken()),
};

export const orders = {
  create: (data) => request('/orders', 'POST', data, getToken()),
  list: () => request('/orders', 'GET', null, getToken()),
};

export const wishlist = {
  list: () => request('/wishlist', 'GET', null, getToken()),
  add: (productId) => request('/wishlist', 'POST', { productId }, getToken()),
  remove: (productId) => request(`/wishlist/${productId}`, 'DELETE', null, getToken()),
};

export const admin = {
  getStats: () => request('/admin/stats', 'GET', null, getToken()),
  // etc.
};

// ... add other endpoints as needed