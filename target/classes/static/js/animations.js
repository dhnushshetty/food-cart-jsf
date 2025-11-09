/* ============================================
   Food Cart Platform - Animation Helpers
   Animation logic and micro-interactions
   ============================================ */

/* ============================================
   Ripple Effect
   ============================================ */

/**
 * Create ripple effect on button click
 * @param {Event} event - Click event
 */
function createRipple(event) {
  const button = event.currentTarget;
  
  // Remove existing ripples
  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }
  
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  button.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => ripple.remove(), 600);
}

/**
 * Add ripple effect to all buttons with .btn class
 */
function initRippleEffects() {
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', createRipple);
  });
}

/* ============================================
   Flying Item Animation (Add to Cart)
   ============================================ */

/**
 * Create flying item animation from source to cart icon
 * @param {HTMLElement} sourceElement - Element to animate from
 * @param {string} itemName - Name of item being added
 */
function animateFlyToCart(sourceElement, itemName) {
  const cartIcon = document.querySelector('.cart-badge') || document.querySelector('[href="/cart"]');
  
  if (!cartIcon) {
    console.warn('Cart icon not found for flying animation');
    return;
  }
  
  // Create flying element
  const flyingItem = document.createElement('div');
  flyingItem.className = 'flying-item';
  flyingItem.textContent = '🍽️';
  
  // Get positions
  const sourceRect = sourceElement.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();
  
  // Set initial position
  flyingItem.style.position = 'fixed';
  flyingItem.style.left = sourceRect.left + sourceRect.width / 2 + 'px';
  flyingItem.style.top = sourceRect.top + sourceRect.height / 2 + 'px';
  flyingItem.style.fontSize = '2rem';
  flyingItem.style.zIndex = '10000';
  flyingItem.style.pointerEvents = 'none';
  
  document.body.appendChild(flyingItem);
  
  // Calculate target position
  const deltaX = cartRect.left + cartRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const deltaY = cartRect.top + cartRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
  
  // Set CSS variables for animation
  flyingItem.style.setProperty('--fly-x', deltaX + 'px');
  flyingItem.style.setProperty('--fly-y', deltaY + 'px');
  
  // Trigger animation
  requestAnimationFrame(() => {
    flyingItem.style.animation = 'flyToCart 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
  });
  
  // Remove element after animation
  setTimeout(() => {
    flyingItem.remove();
  }, 800);
}

/* ============================================
   Cart Badge Animation
   ============================================ */

/**
 * Update cart badge count with animation
 * @param {number} count - New cart item count
 */
function updateCartBadge(count) {
  let badge = document.querySelector('.cart-badge-count');
  
  if (!badge) {
    // Create badge if it doesn't exist
    const cartLink = document.querySelector('[href="/cart"]');
    if (!cartLink) return;
    
    cartLink.classList.add('cart-badge');
    badge = document.createElement('span');
    badge.className = 'cart-badge-count';
    cartLink.appendChild(badge);
  }
  
  // Update count
  badge.textContent = count;
  
  // Add pop animation
  badge.classList.remove('animate-badge-pop');
  void badge.offsetWidth; // Trigger reflow
  badge.classList.add('animate-badge-pop');
  
  // Hide badge if count is 0
  if (count === 0) {
    badge.style.display = 'none';
  } else {
    badge.style.display = 'flex';
  }
}

/**
 * Get current cart count from API
 */
async function refreshCartBadge() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token || role !== 'ROLE_CUSTOMER') {
    return;
  }
  
  try {
    const response = await fetch('/api/cart', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    
    if (response.ok) {
      const cart = await response.json();
      const count = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
      updateCartBadge(count);
    }
  } catch (error) {
    console.error('Error fetching cart count:', error);
  }
}

/* ============================================
   Slide Out Animation (Remove Item)
   ============================================ */

/**
 * Animate element sliding out before removal
 * @param {HTMLElement} element - Element to animate
 * @param {function} callback - Callback after animation
 */
function slideOutAndRemove(element, callback) {
  element.style.overflow = 'hidden';
  element.style.transition = 'all 0.3s ease-out';
  element.style.transform = 'translateX(-100%)';
  element.style.opacity = '0';
  element.style.maxHeight = element.offsetHeight + 'px';
  
  setTimeout(() => {
    element.style.maxHeight = '0';
    element.style.marginBottom = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
  }, 100);
  
  setTimeout(() => {
    if (callback) callback();
    element.remove();
  }, 400);
}

/* ============================================
   Fade In Animation
   ============================================ */

/**
 * Fade in element
 * @param {HTMLElement} element - Element to fade in
 * @param {number} duration - Animation duration in ms
 */
function fadeIn(element, duration = 300) {
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease-in`;
  
  requestAnimationFrame(() => {
    element.style.opacity = '1';
  });
}

/**
 * Fade in multiple elements with stagger
 * @param {NodeList|Array} elements - Elements to fade in
 * @param {number} staggerDelay - Delay between each element in ms
 */
function fadeInStagger(elements, staggerDelay = 100) {
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    setTimeout(() => {
      fadeIn(element);
    }, index * staggerDelay);
  });
}

/* ============================================
   Scale Animation
   ============================================ */

/**
 * Scale element on hover
 * @param {HTMLElement} element - Element to scale
 * @param {number} scale - Scale factor (default: 1.05)
 */
function addScaleHover(element, scale = 1.05) {
  element.style.transition = 'transform 0.2s ease';
  
  element.addEventListener('mouseenter', () => {
    element.style.transform = `scale(${scale})`;
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'scale(1)';
  });
}

/* ============================================
   Pulse Animation
   ============================================ */

/**
 * Add pulse animation to element
 * @param {HTMLElement} element - Element to pulse
 * @param {number} duration - Duration in ms (default: 1000)
 */
function pulse(element, duration = 1000) {
  element.classList.add('animate-pulse');
  
  setTimeout(() => {
    element.classList.remove('animate-pulse');
  }, duration);
}

/* ============================================
   Shake Animation (for errors)
   ============================================ */

/**
 * Shake element (for error feedback)
 * @param {HTMLElement} element - Element to shake
 */
function shake(element) {
  element.classList.add('animate-shake');
  
  setTimeout(() => {
    element.classList.remove('animate-shake');
  }, 500);
}

/* ============================================
   Loading Spinner
   ============================================ */

/**
 * Show loading spinner in element
 * @param {HTMLElement} element - Container element
 * @param {string} size - Spinner size (sm, md, lg)
 */
function showSpinner(element, size = 'md') {
  const spinner = document.createElement('div');
  spinner.className = `spinner spinner-${size}`;
  element.innerHTML = '';
  element.appendChild(spinner);
}

/**
 * Hide loading spinner and show content
 * @param {HTMLElement} element - Container element
 * @param {string} content - HTML content to show
 */
function hideSpinner(element, content) {
  element.innerHTML = content;
}

/* ============================================
   Skeleton Loading
   ============================================ */

/**
 * Create skeleton loading cards
 * @param {number} count - Number of skeleton cards
 * @returns {string} - HTML string of skeleton cards
 */
function createSkeletonCards(count = 3) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="card">
        <div class="skeleton skeleton-card"></div>
        <div class="card-content">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
    `;
  }
  return html;
}

/**
 * Show skeleton loading state
 * @param {HTMLElement} element - Container element
 * @param {number} count - Number of skeletons
 */
function showSkeletonLoading(element, count = 3) {
  element.innerHTML = createSkeletonCards(count);
}

/* ============================================
   Smooth Scroll
   ============================================ */

/**
 * Smooth scroll to element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {number} offset - Offset from top in pixels
 */
function smoothScrollTo(target, offset = 0) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  if (!element) return;
  
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

/* ============================================
   Modal Animations
   ============================================ */

/**
 * Open modal with animation
 * @param {HTMLElement|string} modal - Modal element or selector
 */
function openModal(modal) {
  const modalElement = typeof modal === 'string' ? document.querySelector(modal) : modal;
  
  if (!modalElement) return;
  
  modalElement.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  const backdrop = modalElement.querySelector('.modal-backdrop');
  const content = modalElement.querySelector('.modal-content');
  
  if (backdrop) {
    backdrop.style.animation = 'fadeIn 0.2s ease';
  }
  
  if (content) {
    content.style.animation = 'slideInUp 0.3s ease-out';
  }
}

/**
 * Close modal with animation
 * @param {HTMLElement|string} modal - Modal element or selector
 */
function closeModal(modal) {
  const modalElement = typeof modal === 'string' ? document.querySelector(modal) : modal;
  
  if (!modalElement) return;
  
  const backdrop = modalElement.querySelector('.modal-backdrop');
  const content = modalElement.querySelector('.modal-content');
  
  if (backdrop) {
    backdrop.style.animation = 'fadeOut 0.2s ease';
  }
  
  if (content) {
    content.style.animation = 'slideOutDown 0.3s ease-in';
  }
  
  setTimeout(() => {
    modalElement.classList.remove('active');
    document.body.style.overflow = '';
  }, 300);
}

/**
 * Initialize modal close handlers
 */
function initModalHandlers() {
  // Close on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', () => {
      const modal = backdrop.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Close on close button click
  document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });
}

/* ============================================
   Image Lazy Loading
   ============================================ */

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('animate-fade-in');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

/* ============================================
   Scroll Animations
   ============================================ */

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animation = entry.target.dataset.animate;
        entry.target.classList.add(`animate-${animation}`);
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(el => scrollObserver.observe(el));
}

/* ============================================
   Counter Animation
   ============================================ */

/**
 * Animate number counter
 * @param {HTMLElement} element - Element containing number
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, target, duration = 1000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

/* ============================================
   Initialize All Animations
   ============================================ */

/**
 * Initialize all animation features
 */
function initAnimations() {
  // Initialize ripple effects
  initRippleEffects();
  
  // Initialize modal handlers
  initModalHandlers();
  
  // Initialize lazy loading
  if ('IntersectionObserver' in window) {
    initLazyLoading();
    initScrollAnimations();
  }
  
  // Refresh cart badge on page load
  refreshCartBadge();
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

/* ============================================
   Export for use in other files
   ============================================ */

window.animations = {
  createRipple,
  initRippleEffects,
  animateFlyToCart,
  updateCartBadge,
  refreshCartBadge,
  slideOutAndRemove,
  fadeIn,
  fadeInStagger,
  addScaleHover,
  pulse,
  shake,
  showSpinner,
  hideSpinner,
  createSkeletonCards,
  showSkeletonLoading,
  smoothScrollTo,
  openModal,
  closeModal,
  initModalHandlers,
  initLazyLoading,
  initScrollAnimations,
  animateCounter,
  initAnimations,
};
