// Server-side API client for Next.js 15 Server Components
// Uses native fetch with Next.js caching strategies
// SECURITY: Hardened against CVE-2025-55182 (React2Shell RCE vulnerability)

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
 * Whitelist of allowed API endpoints to prevent RCE attacks
 * Only endpoints in this list can be called from Server Components
 */
const ALLOWED_ENDPOINTS = [
  // Articles
  /^\/articles(\?.*)?$/,
  /^\/articles\/featured(\?.*)?$/,
  /^\/articles\/popular(\?.*)?$/,
  // Allow Persian characters, English letters, numbers, dashes, and underscores in slug
  /^\/articles\/slug\/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\-_%]+(\?.*)?$/,
  // Services
  /^\/services(\?.*)?$/,
  /^\/services\/slug\/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\-_%]+(\?.*)?$/,
  // Portfolio
  /^\/portfolio(\?.*)?$/,
  /^\/portfolio\/slug\/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\-_%]+(\?.*)?$/,
  // Brands
  /^\/brands(\?.*)?$/,
  /^\/brands\/featured(\?.*)?$/,
  // Banners
  /^\/banners\/active\/[a-zA-Z0-9\-_]+(\?.*)?$/,
  // Categories
  /^\/categories(\?.*)?$/,
  // FAQ
  /^\/faq\/service\/[a-zA-Z0-9]{24}(\?.*)?$/, // MongoDB ObjectId format
  // Settings (public only)
  /^\/settings\/public$/,
  /^\/settings\/maintenance$/,
  // Sitemap data
  /^\/sitemap\/.*$/,
];

/**
 * Validate endpoint to prevent SSRF and RCE attacks
 * @param {string} endpoint - API endpoint to validate
 * @throws {Error} If endpoint is not allowed
 */
function validateEndpoint(endpoint) {
  // Remove leading slash for pattern matching
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Try to decode URL-encoded characters (for Persian slugs)
  // But keep the original for pattern matching to support both encoded and decoded
  let decodedEndpoint = cleanEndpoint;
  try {
    // Decode the path part (before query string)
    const [path, query] = cleanEndpoint.split('?');
    const decodedPath = decodeURIComponent(path);
    decodedEndpoint = query ? `${decodedPath}?${query}` : decodedPath;
  } catch (e) {
    // If decoding fails, use original endpoint
    decodedEndpoint = cleanEndpoint;
  }
  
  // Check if endpoint matches any allowed pattern (try both encoded and decoded)
  const isAllowed = ALLOWED_ENDPOINTS.some(pattern => 
    pattern.test(cleanEndpoint) || pattern.test(decodedEndpoint)
  );
  
  if (!isAllowed) {
    // Log security violation attempt
    console.error(`[SECURITY] Blocked unauthorized endpoint access: ${endpoint}`);
    throw new Error(`Unauthorized endpoint: ${endpoint}`);
  }
  
  // Additional security: Prevent protocol-relative and absolute URLs
  if (endpoint.includes('://') || endpoint.startsWith('//')) {
    console.error(`[SECURITY] Blocked SSRF attempt: ${endpoint}`);
    throw new Error('Invalid endpoint format');
  }
  
  // Prevent path traversal
  if (endpoint.includes('..') || endpoint.includes('~')) {
    console.error(`[SECURITY] Blocked path traversal attempt: ${endpoint}`);
    throw new Error('Invalid endpoint format');
  }
}

/**
 * Server-side fetch with Next.js 15 caching
 * @param {string} endpoint - API endpoint (e.g., '/articles')
 * @param {object} options - Fetch options
 * @param {number} options.revalidate - Revalidation time in seconds (default: 60)
 * @param {boolean} options.cache - Whether to cache (default: true, uses 'force-cache')
 * @returns {Promise<object>} API response
 */
export async function serverFetch(endpoint, options = {}) {
  // SECURITY: Validate endpoint before processing
  validateEndpoint(endpoint);
  
  const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Decode URL-encoded characters (for Persian slugs) before sending to API
  // The endpoint comes URL-encoded from Next.js routing, but API expects decoded
  let decodedEndpoint = safeEndpoint;
  try {
    // Decode the path part (before query string)
    const [path, query] = safeEndpoint.split('?');
    const decodedPath = decodeURIComponent(path);
    decodedEndpoint = query ? `${decodedPath}?${query}` : decodedPath;
  } catch (e) {
    // If decoding fails, use original endpoint
    decodedEndpoint = safeEndpoint;
  }
  
  const url = `${API_BASE_URL}${decodedEndpoint}`;
  
  // Default cache strategy: revalidate every 300 seconds (5 minutes) for better performance
  // Static/semi-static data can use longer cache times
  const revalidate = options.revalidate ?? 300;
  const cacheStrategy = options.cache !== false 
    ? { next: { revalidate } } 
    : { cache: 'no-store' };
  
  // SECURITY: Prevent user-controlled headers that could be exploited
  const safeHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Only allow specific safe headers from options
  if (options.headers) {
    const allowedHeaders = ['Authorization', 'X-Requested-With'];
    Object.keys(options.headers).forEach(key => {
      if (allowedHeaders.includes(key)) {
        safeHeaders[key] = options.headers[key];
      }
    });
  }
  
  const config = {
    ...options,
    method: options.method || 'GET',
    headers: safeHeaders,
    ...cacheStrategy,
    // SECURITY: Prevent redirects to external URLs (SSRF protection)
    redirect: 'error',
  };

  try {
    // SECURITY: Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
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

