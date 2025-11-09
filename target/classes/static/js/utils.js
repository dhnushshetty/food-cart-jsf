/* ============================================
   Food Cart Platform - Utility Functions
   Shared helper functions for API calls, validation, etc.
   ============================================ */

/* ============================================
   API Utilities
   ============================================ */

/**
 * Fetch wrapper with error handling and authentication
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - Response data or null on error
 */
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    // Handle unauthorized
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      return null;
    }
    
    // Handle other errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
    
    // Return JSON response
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/* ============================================
   Authentication Utilities
   ============================================ */

/**
 * Get current authentication state
 * @returns {object} - Auth state with token, username, role
 */
function getAuthState() {
  return {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role'),
    isAuthenticated: !!localStorage.getItem('token'),
    isCustomer: localStorage.getItem('role') === 'ROLE_CUSTOMER',
    isOwner: localStorage.getItem('role') === 'ROLE_OWNER',
  };
}

/**
 * Logout user and redirect to home
 */
function logout() {
  localStorage.clear();
  window.location.href = '/';
}

/**
 * Require authentication - redirect to login if not authenticated
 */
function requireAuth() {
  const auth = getAuthState();
  if (!auth.isAuthenticated) {
    window.location.href = '/login';
    return false;
  }
  return true;
}

/**
 * Require specific role - redirect if user doesn't have role
 * @param {string} requiredRole - Required role (ROLE_CUSTOMER or ROLE_OWNER)
 */
function requireRole(requiredRole) {
  const auth = getAuthState();
  if (!auth.isAuthenticated || auth.role !== requiredRole) {
    window.location.href = '/';
    return false;
  }
  return true;
}

/* ============================================
   Form Validation
   ============================================ */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
function validatePassword(password) {
  if (!password) {
    return {
      isValid: false,
      message: 'Please enter your password!',
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid',
  };
}

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {object} - Validation result with isValid and message
 */
function validateUsername(username) {
  if (!username || username.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters long',
    };
  }
  
  if (username.length > 50) {
    return {
      isValid: false,
      message: 'Username must be less than 50 characters',
    };
  }
  
  return {
    isValid: true,
    message: 'Username is valid',
  };
}

/**
 * Validate form field and show error message
 * @param {HTMLElement} input - Input element to validate
 * @param {function} validator - Validation function
 * @returns {boolean} - True if valid
 */
function validateField(input, validator) {
  const value = input.value.trim();
  const result = validator(value);
  
  const errorElement = input.parentElement.querySelector('.form-error');
  
  if (!result.isValid) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    if (errorElement) {
      errorElement.textContent = result.message;
      errorElement.style.display = 'block';
    }
    return false;
  } else {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
    return true;
  }
}

/* ============================================
   DOM Utilities
   ============================================ */

/**
 * Safely get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} - Element or null
 */
function getElement(id) {
  return document.getElementById(id);
}

/**
 * Create element with classes and attributes
 * @param {string} tag - HTML tag name
 * @param {object} options - Options (classes, attributes, text, html)
 * @returns {HTMLElement} - Created element
 */
function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  
  if (options.classes) {
    element.className = Array.isArray(options.classes) 
      ? options.classes.join(' ') 
      : options.classes;
  }
  
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  if (options.text) {
    element.textContent = options.text;
  }
  
  if (options.html) {
    element.innerHTML = options.html;
  }
  
  return element;
}

/**
 * Add event listener with cleanup
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event name
 * @param {function} handler - Event handler
 * @returns {function} - Cleanup function
 */
function addListener(element, event, handler) {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

/* ============================================
   String Utilities
   ============================================ */

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Truncate string to max length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated string
 */
function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: ₹)
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount, currency = '₹') {
  return `${currency}${parseFloat(amount).toFixed(2)}`;
}

/* ============================================
   Date/Time Utilities
   ============================================ */

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date and time to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date/time string
 */
function formatDateTime(date) {
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative time string
 */
function getRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
}

/* ============================================
   Number Utilities
   ============================================ */

/**
 * Clamp number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ============================================
   Debounce & Throttle
   ============================================ */

/**
 * Debounce function - delay execution until after wait time
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - limit execution to once per wait time
 * @param {function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} - Throttled function
 */
function throttle(func, wait) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

/* ============================================
   Local Storage Utilities
   ============================================ */

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Stored value or default
 */
function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Set item in localStorage with JSON stringification
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/* ============================================
   Image Utilities
   ============================================ */

/**
 * Create image element with fallback
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text
 * @param {string} fallback - Fallback emoji or text
 * @returns {HTMLElement} - Image element or placeholder
 */
function createImageWithFallback(src, alt, fallback = '🍽️') {
  if (!src) {
    return createElement('div', {
      classes: 'menu-item-image-placeholder',
      text: fallback,
    });
  }
  
  const img = createElement('img', {
    classes: 'menu-item-image',
    attributes: { src, alt },
  });
  
  const placeholder = createElement('div', {
    classes: 'menu-item-image-placeholder',
    text: fallback,
    attributes: { style: 'display:none;' },
  });
  
  img.onerror = () => {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  };
  
  const container = createElement('div', { classes: 'image-container' });
  container.appendChild(img);
  container.appendChild(placeholder);
  
  return container;
}

/* ============================================
   Loading State Utilities
   ============================================ */

/**
 * Show loading spinner in element
 * @param {HTMLElement} element - Target element
 * @param {string} size - Spinner size (sm, md, lg)
 */
function showLoading(element, size = 'md') {
  const spinner = createElement('div', {
    classes: `spinner spinner-${size}`,
  });
  element.innerHTML = '';
  element.appendChild(spinner);
}

/**
 * Create skeleton loading element
 * @param {string} type - Skeleton type (text, title, avatar, card)
 * @returns {HTMLElement} - Skeleton element
 */
function createSkeleton(type = 'text') {
  return createElement('div', {
    classes: `skeleton skeleton-${type}`,
  });
}

/* ============================================
   Export for use in other files
   ============================================ */

// Make functions available globally
window.utils = {
  fetchWithAuth,
  getAuthState,
  logout,
  requireAuth,
  requireRole,
  isValidEmail,
  validatePassword,
  validateUsername,
  validateField,
  getElement,
  createElement,
  addListener,
  escapeHtml,
  truncate,
  formatCurrency,
  formatDate,
  formatDateTime,
  getRelativeTime,
  clamp,
  randomInt,
  debounce,
  throttle,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  createImageWithFallback,
  showLoading,
  createSkeleton,
};
