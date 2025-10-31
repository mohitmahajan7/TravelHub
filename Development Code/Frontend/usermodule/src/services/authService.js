const AUTH_BASE_URL = '/api/auth';

class AuthService {
  async request(endpoint, options = {}) {
    const config = {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${AUTH_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Auth request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getCurrentUser() {
    return this.request('/me');
  }

  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  getToken() {
    // Check multiple token sources
    const tokenSources = [
      () => localStorage.getItem('jwtToken'),
      () => sessionStorage.getItem('jwtToken'),
      () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token') || urlParams.get('access_token');
      }
    ];

    for (const source of tokenSources) {
      const token = source();
      if (token && token !== 'session_authenticated') {
        return token;
      }
    }

    return null;
  }

  setToken(token, remember = false) {
    if (remember) {
      localStorage.setItem('jwtToken', token);
    } else {
      sessionStorage.setItem('jwtToken', token);
    }
  }

  clearToken() {
    localStorage.removeItem('jwtToken');
    sessionStorage.removeItem('jwtToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService();