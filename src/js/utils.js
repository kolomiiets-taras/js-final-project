/**
 * Utility functions for Your Energy application
 */

/**
 * Email validation regex from spec
 */
export const EMAIL_REGEX = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

/**
 * Validate email address
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * Get data from localStorage
 * @param {string} key
 * @returns {any}
 */
export function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
}

/**
 * Save data to localStorage
 * @param {string} key
 * @param {any} data
 */
export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

/**
 * Remove data from localStorage
 * @param {string} key
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string}
 */
export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait) {
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
 * Capitalize first letter
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value (0-5)
 * @returns {string}
 */
export function generateStarsHTML(rating) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  let html = '';

  for (let i = 0; i < fullStars; i++) {
    html += `<svg class="exercise-modal-star"><use href="./img/sprite.svg#icon-star"></use></svg>`;
  }

  for (let i = 0; i < emptyStars; i++) {
    html += `<svg class="exercise-modal-star empty"><use href="./img/sprite.svg#icon-star-empty"></use></svg>`;
  }

  return html;
}

/**
 * Show notification (simple alert for now)
 * @param {string} message
 * @param {string} type - 'success' | 'error'
 */
export function showNotification(message, type = 'success') {
  // Simple alert implementation
  // Can be replaced with a custom toast notification
  alert(message);
}

/**
 * Get responsive limit for pagination based on screen width
 * @param {string} type - 'categories' | 'exercises'
 * @returns {number}
 */
export function getResponsiveLimit(type) {
  const width = window.innerWidth;

  if (type === 'categories') {
    if (width < 768) return 9;
    if (width < 1280) return 12;
    return 12;
  }

  if (type === 'exercises') {
    if (width < 768) return 8;
    if (width < 1280) return 10;
    return 10;
  }

  return 10;
}
