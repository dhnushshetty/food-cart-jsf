/* ============================================
   Food Cart Platform - Cart Overlay & Badge
   Cart badge functionality and overlay management
   ============================================ */

/**
 * Cart Badge Manager
 */
class CartBadgeManager {
  constructor() {
    this.badge = null;
    this.cartLink = null;
    this.init();
  }
  
  /**
   * Initialize cart badge
   */
  init() {
    this.cartLink = document.querySelector('[href="/cart"]');
    if (!this.cartLink) return;
    
    // Add cart-badge class to link
    this.cartLink.classList.add('cart-badge');
    
    // Create badge element if it doesn't exist
    if (!this.cartLink.querySelector('.cart-badge-count')) {
      this.badge = document.createElement('span');
      this.badge.className = 'cart-badge-count';
      this.badge.style.display = 'none';
      this.cartLink.appendChild(this.badge);
    } else {
      this.badge = this.cartLink.querySelector('.cart-badge-count');
    }
    
    // Load initial count
    this.refresh();
  }
  
  /**
   * Update badge count
   * @param {number} count - New cart item count
   */
  update(count) {
    if (!this.badge) return;
    
    this.badge.textContent = count;
    
    if (count > 0) {
      this.badge.style.display = 'flex';
      // Add pop animation
      this.badge.classList.remove('animate-badge-pop');
      void this.badge.offsetWidth; // Trigger reflow
      this.badge.classList.add('animate-badge-pop');
    } else {
      this.badge.style.display = 'none';
    }
  }
  
  /**
   * Refresh badge count from API
   */
  async refresh() {
    const auth = getAuthState();
    
    if (!auth.isAuthenticated || !auth.isCustomer) {
      return;
    }
    
    try {
      const response = await fetch('/api/cart', {
        headers: { 'Authorization': 'Bearer ' + auth.token }
      });
      
      if (response.ok) {
        const cart = await response.json();
        const count = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        this.update(count);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  }
  
  /**
   * Increment badge count
   * @param {number} amount - Amount to increment by
   */
  increment(amount = 1) {
    if (!this.badge) return;
    
    const currentCount = parseInt(this.badge.textContent) || 0;
    this.update(currentCount + amount);
  }
  
  /**
   * Decrement badge count
   * @param {number} amount - Amount to decrement by
   */
  decrement(amount = 1) {
    if (!this.badge) return;
    
    const currentCount = parseInt(this.badge.textContent) || 0;
    this.update(Math.max(0, currentCount - amount));
  }
}

/**
 * Add to Cart Animation Handler
 */
class AddToCartAnimator {
  /**
   * Animate adding item to cart
   * @param {HTMLElement} sourceElement - Element to animate from (button)
   * @param {string} itemName - Name of item being added
   * @param {number} quantity - Quantity being added
   */
  static animate(sourceElement, itemName, quantity = 1) {
    // Add tada animation to source button
    sourceElement.classList.add('animate-tada');
    setTimeout(() => {
      sourceElement.classList.remove('animate-tada');
    }, 1000);
    
    // Create flying item
    const flyingItem = this.createFlyingItem();
    
    // Get positions
    const sourceRect = sourceElement.getBoundingClientRect();
    const cartIcon = document.querySelector('.cart-badge') || document.querySelector('[href="/cart"]');
    
    if (!cartIcon) {
      console.warn('Cart icon not found for animation');
      return;
    }
    
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Set initial position
    flyingItem.style.left = sourceRect.left + sourceRect.width / 2 + 'px';
    flyingItem.style.top = sourceRect.top + sourceRect.height / 2 + 'px';
    
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
    
    // Animate cart icon when item arrives
    setTimeout(() => {
      cartIcon.classList.add('animate-jello');
      setTimeout(() => {
        cartIcon.classList.remove('animate-jello');
      }, 800);
    }, 700);
    
    // Remove element after animation
    setTimeout(() => {
      flyingItem.remove();
    }, 800);
  }
  
  /**
   * Create flying item element
   * @returns {HTMLElement} - Flying item element
   */
  static createFlyingItem() {
    const flyingItem = document.createElement('div');
    flyingItem.className = 'flying-item';
    flyingItem.textContent = '🍽️';
    flyingItem.style.position = 'fixed';
    flyingItem.style.fontSize = '2rem';
    flyingItem.style.zIndex = '10000';
    flyingItem.style.pointerEvents = 'none';
    return flyingItem;
  }
}

/**
 * Cart Overlay Manager (for future implementation)
 */
class CartOverlay {
  constructor() {
    this.overlay = null;
    this.isOpen = false;
  }
  
  /**
   * Create overlay element
   */
  create() {
    if (this.overlay) return;
    
    this.overlay = document.createElement('div');
    this.overlay.className = 'cart-overlay';
    this.overlay.innerHTML = `
      <div class="cart-overlay-backdrop"></div>
      <div class="cart-overlay-content">
        <div class="cart-overlay-header">
          <h2>Your Cart</h2>
          <button class="cart-overlay-close">&times;</button>
        </div>
        <div class="cart-overlay-body">
          <!-- Cart items will be loaded here -->
        </div>
        <div class="cart-overlay-footer">
          <div class="cart-overlay-total">
            <span>Total:</span>
            <span class="cart-overlay-total-amount">₹0.00</span>
          </div>
          <button class="btn btn-primary" onclick="window.location.href='/cart'">
            View Full Cart
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    
    // Add event listeners
    this.overlay.querySelector('.cart-overlay-close').addEventListener('click', () => this.close());
    this.overlay.querySelector('.cart-overlay-backdrop').addEventListener('click', () => this.close());
  }
  
  /**
   * Open cart overlay
   */
  open() {
    if (!this.overlay) this.create();
    
    this.overlay.classList.add('active');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Load cart data
    this.loadCart();
  }
  
  /**
   * Close cart overlay
   */
  close() {
    if (!this.overlay) return;
    
    this.overlay.classList.remove('active');
    this.isOpen = false;
    document.body.style.overflow = '';
  }
  
  /**
   * Toggle cart overlay
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  /**
   * Load cart data
   */
  async loadCart() {
    const auth = getAuthState();
    if (!auth.isAuthenticated) return;
    
    const body = this.overlay.querySelector('.cart-overlay-body');
    showSpinner(body);
    
    try {
      const response = await fetch('/api/cart', {
        headers: { 'Authorization': 'Bearer ' + auth.token }
      });
      
      if (response.ok) {
        const cart = await response.json();
        this.renderCart(cart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      body.innerHTML = '<p class="text-center text-gray-600">Error loading cart</p>';
    }
  }
  
  /**
   * Render cart items
   * @param {object} cart - Cart data
   */
  renderCart(cart) {
    const body = this.overlay.querySelector('.cart-overlay-body');
    const totalAmount = this.overlay.querySelector('.cart-overlay-total-amount');
    
    if (!cart.items || cart.items.length === 0) {
      body.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <p class="empty-state-description">Your cart is empty</p>
        </div>
      `;
      totalAmount.textContent = '₹0.00';
      return;
    }
    
    body.innerHTML = cart.items.map(item => `
      <div class="cart-overlay-item">
        <div class="cart-overlay-item-info">
          <h4>${escapeHtml(item.menuItemName)}</h4>
          <p>₹${item.price} × ${item.quantity}</p>
        </div>
        <div class="cart-overlay-item-total">
          ₹${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    `).join('');
    
    totalAmount.textContent = '₹' + cart.totalAmount;
  }
}

// Create global instances
const cartBadge = new CartBadgeManager();
const cartOverlay = new CartOverlay();

// Export for use in other files
window.cartBadge = cartBadge;
window.cartOverlay = cartOverlay;
window.AddToCartAnimator = AddToCartAnimator;

// Refresh cart badge on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => cartBadge.refresh());
} else {
  cartBadge.refresh();
}
