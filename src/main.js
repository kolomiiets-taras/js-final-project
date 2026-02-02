/**
 * Main JavaScript file for Your Energy application
 */

import { initMobileMenu, initScrollTop } from './js/mobile-menu.js';
import { initQuote } from './js/quote.js';
import { initSubscription } from './js/subscription.js';
import { initModals, openExerciseModal } from './js/modal.js';
import { initFilters } from './js/filters.js';
import { renderFavoritesList } from './js/favorites.js';

// Determine current page
const isHomePage = document.querySelector('[data-filters-section]') !== null;
const isFavoritesPage = document.querySelector('[data-favorites-list]') !== null;

/**
 * Initialize application
 */
function init() {
  // Common initializations for all pages
  initMobileMenu();
  initScrollTop();
  initQuote();
  initSubscription();
  initModals();

  // Page-specific initializations
  if (isHomePage) {
    initHomePage();
  }

  if (isFavoritesPage) {
    initFavoritesPage();
  }
}

/**
 * Initialize Home page
 */
function initHomePage() {
  // Initialize filters with exercise start callback
  initFilters(handleExerciseStart);
}

/**
 * Handle exercise start button click
 * @param {string} exerciseId
 */
function handleExerciseStart(exerciseId) {
  openExerciseModal(exerciseId);
}

/**
 * Initialize Favorites page
 */
function initFavoritesPage() {
  const favoritesList = document.querySelector('[data-favorites-list]');
  const favoritesEmpty = document.querySelector('[data-favorites-empty]');

  if (!favoritesList) return;

  // Render favorites list
  renderFavoritesList(
    favoritesList,
    favoritesEmpty,
    handleExerciseStart, // onStartClick
    () => {} // onDeleteClick - list is re-rendered automatically
  );
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
