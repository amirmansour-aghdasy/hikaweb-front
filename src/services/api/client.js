// Get API URL from environment or use default
const getApiBaseUrl = () => {
  // In development, always use localhost (ignore NEXT_PUBLIC_API_URL)
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api/v1';
  }
  
  // In production, use NEXT_PUBLIC_API_URL if set, otherwise default
  if (process.env.NEXT_PUBLIC_API_URL) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    // If it doesn't end with /api/v1, add it
    if (!baseUrl.endsWith('/api/v1')) {
      return baseUrl.endsWith('/') ? `${baseUrl}api/v1` : `${baseUrl}/api/v1`;
    }
    return baseUrl;
  }
  
  // Default production URL
  return 'https://api.hikaweb.ir/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Global handler for 401 errors - will be set by authStore
let handleUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  handleUnauthorized = handler;
};

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.requestCache = new Map(); // Cache for in-flight requests
  }

  async request(endpoint, options = {}) {
    // Validate endpoint to prevent SSRF attacks
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Invalid endpoint');
    }

    // Prevent protocol-relative and absolute URLs
    if (endpoint.startsWith('//') || endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      throw new Error('Invalid endpoint format');
    }

    // Ensure endpoint starts with /
    const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${safeEndpoint}`;
    
    // Create a cache key for this request
    const cacheKey = `${options.method || 'GET'}:${url}`;
    
    // If there's already an in-flight request for this endpoint, return the same promise
    if (this.requestCache.has(cacheKey)) {
      return this.requestCache.get(cacheKey);
    }
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Add timeout
      signal: AbortSignal.timeout(options.timeout || 10000), // 10 seconds default
    };

    // Check if this is a protected endpoint that requires authentication
    const isProtectedEndpoint = endpoint.includes('/profile') || endpoint.includes('/tickets') || 
                               endpoint.includes('/consultations') || endpoint.includes('/bookmarks') ||
                               endpoint.includes('/notifications');
    
    // Add auth token if available (for client-side requests)
    let hasToken = false;
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const accessToken = cookies
        .find(c => c.trim().startsWith('accessToken='))
        ?.split('=')[1];
      
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        hasToken = true;
      }
    }

    // For protected endpoints, don't make request if no token exists
    // This prevents unnecessary 401 errors in console
    if (isProtectedEndpoint && !hasToken && typeof window !== 'undefined') {
      return Promise.resolve({ success: false, data: null, message: 'Authentication required' });
    }

    // Create the request promise
    const requestPromise = (async () => {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          // Handle 401 errors (authentication required or token expired)
          if (response.status === 401) {
            // Check if we have a token (means user was authenticated but token expired)
            // If no token exists, this is expected and we should return gracefully
            const hasToken = typeof window !== 'undefined' && 
                           document.cookie.split(';').some(c => c.trim().startsWith('accessToken='));
            
            if (hasToken && handleUnauthorized) {
              // Token exists but expired - logout user
              console.warn('Token expired, logging out user');
              handleUnauthorized();
            }
            
            // For public endpoints, return gracefully
            // For protected endpoints, throw error so caller can handle it
            const isAuthEndpoint = endpoint.includes('/auth/') && !endpoint.includes('/auth/send-otp') && !endpoint.includes('/auth/verify-otp');
            
            if (isAuthEndpoint || (isProtectedEndpoint && hasToken)) {
              // Throw error for auth/protected endpoints when token exists (means expired/invalid)
              // This allows authStore to handle token refresh or logout
              const error = new Error(errorData.message || 'Authentication required');
              error.status = 401;
              error.data = errorData;
              throw error;
            }
            
            // For protected endpoints without token, return gracefully (user not logged in)
            // For public endpoints, also return gracefully
            // Don't log warnings for expected 401 errors (no token)
            return { success: false, data: null, message: errorData.message || 'Authentication required' };
          }
          // Handle 429 rate limit errors
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const message = errorData.message || 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید.';
            const error = new Error(message);
            error.status = 429;
            error.retryAfter = retryAfter ? parseInt(retryAfter) : 60; // Default 60 seconds
            throw error;
          }
          // Handle 403 forbidden errors
          if (response.status === 403) {
            const message = errorData.message || 'دسترسی غیرمجاز';
            const error = new Error(message);
            error.status = 403;
            throw error;
          }
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        // Handle timeout and network errors gracefully
        if (error.name === 'TimeoutError' || error.name === 'AbortError') {
          throw new Error('Request timeout. Please check your connection.');
        }
        if (error.message === 'Failed to fetch') {
          throw new Error('Unable to connect to server. Please check if the backend is running.');
        }
        // Don't expose internal error details in production
        if (process.env.NODE_ENV === 'production') {
          console.error('API request error');
          throw new Error('An error occurred. Please try again.');
        }
        console.error('API request error:', error);
        throw error;
      } finally {
        // Remove from cache after request completes
        this.requestCache.delete(cacheKey);
      }
    })();

    // Cache the promise
    this.requestCache.set(cacheKey, requestPromise);
    
    return requestPromise;
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;

