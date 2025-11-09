/* ============================================
   Food Cart Platform - Chart.js Integration
   Statistics visualization for owner dashboard
   ============================================ */

/**
 * Chart Manager for Owner Dashboard
 */
class ChartManager {
  constructor() {
    this.charts = {};
  }
  
  /**
   * Initialize all charts
   * @param {object} data - Statistics data
   */
  async init(data) {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded');
      return;
    }
    
    // Create revenue chart
    if (data.revenueData) {
      this.createRevenueChart(data.revenueData);
    }
    
    // Create order status chart
    if (data.orderStatusData) {
      this.createOrderStatusChart(data.orderStatusData);
    }
    
    // Create popular items chart
    if (data.popularItems) {
      this.createPopularItemsChart(data.popularItems);
    }
  }
  
  /**
   * Create revenue line chart
   * @param {object} data - Revenue data with labels and values
   */
  createRevenueChart(data) {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (this.charts.revenue) {
      this.charts.revenue.destroy();
    }
    
    this.charts.revenue = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Revenue (₹)',
          data: data.values || [0, 0, 0, 0, 0, 0, 0],
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-600').trim(),
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context) {
                return 'Revenue: ₹' + context.parsed.y.toFixed(2);
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + value;
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }
  
  /**
   * Create order status doughnut chart
   * @param {object} data - Order status data
   */
  createOrderStatusChart(data) {
    const canvas = document.getElementById('orderStatusChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (this.charts.orderStatus) {
      this.charts.orderStatus.destroy();
    }
    
    const colors = {
      PENDING: '#fbbf24',
      PREPARING: '#3b82f6',
      READY: '#10b981',
      DELIVERED: '#06b6d4',
      CANCELLED: '#ef4444'
    };
    
    this.charts.orderStatus = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels || ['Pending', 'Preparing', 'Ready', 'Delivered'],
        datasets: [{
          data: data.values || [0, 0, 0, 0],
          backgroundColor: data.labels ? data.labels.map(label => colors[label] || '#9ca3af') : Object.values(colors).slice(0, 4),
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return label + ': ' + value + ' (' + percentage + '%)';
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }
  
  /**
   * Create popular items bar chart
   * @param {object} data - Popular items data
   */
  createPopularItemsChart(data) {
    const canvas = document.getElementById('popularItemsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (this.charts.popularItems) {
      this.charts.popularItems.destroy();
    }
    
    this.charts.popularItems = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels || ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
        datasets: [{
          label: 'Orders',
          data: data.values || [0, 0, 0, 0, 0],
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-600').trim(),
          borderRadius: 6,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context) {
                return 'Orders: ' + context.parsed.y;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }
  
  /**
   * Update chart data
   * @param {string} chartName - Name of chart to update
   * @param {object} newData - New data for chart
   */
  updateChart(chartName, newData) {
    const chart = this.charts[chartName];
    if (!chart) return;
    
    chart.data.labels = newData.labels;
    chart.data.datasets[0].data = newData.values;
    chart.update('active');
  }
  
  /**
   * Destroy all charts
   */
  destroyAll() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
  }
}

/**
 * Animated counter for statistics
 * @param {HTMLElement} element - Element to animate
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 * @param {string} prefix - Prefix (e.g., '₹')
 * @param {string} suffix - Suffix (e.g., '%')
 */
function animateStatCounter(element, target, duration = 1000, prefix = '', suffix = '') {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    const displayValue = Math.floor(current);
    element.textContent = prefix + displayValue + suffix;
  }, 16);
}

/**
 * Create statistics cards with animated counters
 * @param {object} stats - Statistics data
 * @param {string} containerId - Container element ID
 */
function createAnimatedStatsCards(stats, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const cards = [
    { label: 'Total Revenue', value: stats.totalRevenue || 0, prefix: '₹', color: 'var(--success)' },
    { label: 'Total Orders', value: stats.totalOrders || 0, prefix: '', color: 'var(--info)' },
    { label: 'Pending Orders', value: stats.pendingOrdersCount || 0, prefix: '', color: 'var(--warning)' },
    { label: 'Menu Items', value: stats.menuItemsCount || 0, prefix: '', color: 'var(--primary-600)' }
  ];
  
  container.innerHTML = cards.map((card, index) => `
    <div class="card animate-scale-in" style="animation-delay: ${index * 100}ms;">
      <div class="card-content text-center">
        <div class="text-4xl font-bold mb-2" style="color: ${card.color};" data-counter="${card.value}" data-prefix="${card.prefix}">
          ${card.prefix}0
        </div>
        <p class="text-gray-600">${card.label}</p>
      </div>
    </div>
  `).join('');
  
  // Animate counters
  setTimeout(() => {
    container.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseInt(el.dataset.counter);
      const prefix = el.dataset.prefix;
      animateStatCounter(el, target, 1000, prefix);
    });
  }, 100);
}

// Export for use in other files
window.ChartManager = ChartManager;
window.animateStatCounter = animateStatCounter;
window.createAnimatedStatsCards = createAnimatedStatsCards;
