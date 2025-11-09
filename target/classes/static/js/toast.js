/* ============================================
   Food Cart Platform - Toast Notification System
   Enhanced toast notifications with animations
   ============================================ */

/**
 * Toast notification class
 */
class ToastNotification {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.init();
  }
  
  /**
   * Initialize toast container
   */
  init() {
    // Create container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector('.toast-container');
    }
  }
  
  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {number} duration - Duration in ms (default: 3000)
   */
  show(message, type = 'info', duration = 3000) {
    const toast = this.createToast(message, type);
    this.container.appendChild(toast);
    this.toasts.push(toast);
    
    // Trigger animation with bounce effect
    requestAnimationFrame(() => {
      toast.classList.add('animate-slide-in-bounce');
    });
    
    // Add wiggle animation for success
    if (type === 'success') {
      setTimeout(() => {
        toast.classList.add('animate-wiggle');
      }, 300);
    }
    
    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }
    
    return toast;
  }
  
  /**
   * Create toast element
   * @param {string} message - Toast message
   * @param {string} type - Toast type
   * @returns {HTMLElement} - Toast element
   */
  createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon based on type
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    
    const icon = icons[type] || icons.info;
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${this.escapeHtml(message)}</div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;
    
    // Add close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.dismiss(toast);
    });
    
    return toast;
  }
  
  /**
   * Dismiss toast
   * @param {HTMLElement} toast - Toast element to dismiss
   */
  dismiss(toast) {
    if (!toast || !toast.parentElement) return;
    
    toast.classList.add('removing');
    toast.style.animation = 'slideOutRight 0.3s ease-in';
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
      
      // Remove from array
      const index = this.toasts.indexOf(toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 300);
  }
  
  /**
   * Dismiss all toasts
   */
  dismissAll() {
    this.toasts.forEach(toast => this.dismiss(toast));
  }
  
  /**
   * Show success toast
   * @param {string} message - Success message
   * @param {number} duration - Duration in ms
   */
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }
  
  /**
   * Show error toast
   * @param {string} message - Error message
   * @param {number} duration - Duration in ms
   */
  error(message, duration = 4000) {
    return this.show(message, 'error', duration);
  }
  
  /**
   * Show warning toast
   * @param {string} message - Warning message
   * @param {number} duration - Duration in ms
   */
  warning(message, duration = 3500) {
    return this.show(message, 'warning', duration);
  }
  
  /**
   * Show info toast
   * @param {string} message - Info message
   * @param {number} duration - Duration in ms
   */
  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} str - String to escape
   * @returns {string} - Escaped string
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

// Create global toast instance
const toast = new ToastNotification();

/**
 * Legacy showToast function for backward compatibility
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, warning, info)
 */
function showToast(message, type = 'info') {
  toast.show(message, type);
}

/* ============================================
   Export for use in other files
   ============================================ */

window.toast = toast;
window.showToast = showToast;
