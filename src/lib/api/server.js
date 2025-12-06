// Server-side API client for Next.js 15 Server Components
// Uses native fetch with Next.js caching strategies

const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api/v1';
  }
  
  if (process.env.NEXT_PUBLIC_API_URL) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl.endsWith('/api/v1')) {
      return baseUrl.endsWith('/') ? `${baseUrl}api/v1` : `${baseUrl}/api/v1`;
    }
    return baseUrl;
  }
  
  return 'https://api.hikaweb.ir/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Server-side fetch with Next.js 15 caching
 * @param {string} endpoint - API endpoint (e.g., '/articles')
 * @param {object} options - Fetch options
 * @param {number} options.revalidate - Revalidation time in seconds (default: 60)
 * @param {boolean} options.cache - Whether to cache (default: true, uses 'force-cache')
 * @returns {Promise<object>} API response
 */
export async function serverFetch(endpoint, options = {}) {
  const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${safeEndpoint}`;
  
  // Default cache strategy: revalidate every 60 seconds
  const revalidate = options.revalidate ?? 60;
  const cacheStrategy = options.cache !== false 
    ? { next: { revalidate } } 
    : { cache: 'no-store' };
  
  const config = {
    ...options,
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...cacheStrategy,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = errorData.code || errorData.error;
      throw error;
    }

    return await response.json();
  } catch (error) {
    // Only log non-route errors to avoid console spam
    if (error.code !== 'routeNotFound' && error.code !== 'auth.tokenRequired') {
      console.error('Server API request error:', error);
    }
    throw error;
  }
}

/**
 * GET request with caching
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} API response
 */
export async function serverGet(endpoint, options = {}) {
  return serverFetch(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request (no caching)
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @param {object} options - Fetch options
 * @returns {Promise<object>} API response
 */
export async function serverPost(endpoint, data, options = {}) {
  return serverFetch(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
}

/**
 * PUT request (no caching)
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @param {object} options - Fetch options
 * @returns {Promise<object>} API response
 */
export async function serverPut(endpoint, data, options = {}) {
  return serverFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
}

/**
 * DELETE request (no caching)
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} API response
 */
export async function serverDelete(endpoint, options = {}) {
  return serverFetch(endpoint, {
    ...options,
    method: 'DELETE',
    cache: 'no-store',
  });
}

