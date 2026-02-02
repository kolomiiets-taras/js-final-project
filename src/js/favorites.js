/**
 * Favorites module for Your Energy application
 */

import { getFromStorage, saveToStorage } from './utils.js';

const STORAGE_KEY = 'favorites';

/**
 * Get all favorites from localStorage
 * @returns {Array}
 */
export function getFavorites() {
  return getFromStorage(STORAGE_KEY) || [];
}

/**
 * Check if exercise is in favorites
 * @param {string} exerciseId
 * @returns {boolean}
 */
export function isFavorite(exerciseId) {
  const favorites = getFavorites();
  return favorites.some(item => item._id === exerciseId);
}

/**
 * Add exercise to favorites
 * @param {Object} exercise - Exercise data
 */
export function addToFavorites(exercise) {
  const favorites = getFavorites();

  // Check if already exists
  if (favorites.some(item => item._id === exercise._id)) {
    return;
  }

  favorites.push(exercise);
  saveToStorage(STORAGE_KEY, favorites);
}

/**
 * Remove exercise from favorites
 * @param {string} exerciseId
 */
export function removeFromFavorites(exerciseId) {
  const favorites = getFavorites();
  const filtered = favorites.filter(item => item._id !== exerciseId);
  saveToStorage(STORAGE_KEY, filtered);
}

/**
 * Toggle exercise in favorites
 * @param {Object} exercise - Exercise data
 * @returns {boolean} - True if added, false if removed
 */
export function toggleFavorite(exercise) {
  if (isFavorite(exercise._id)) {
    removeFromFavorites(exercise._id);
    return false;
  } else {
    addToFavorites(exercise);
    return true;
  }
}

/**
 * Render favorites list
 * @param {HTMLElement} container
 * @param {HTMLElement} emptyEl
 * @param {Function} onStartClick - Callback for start button click
 * @param {Function} onDeleteClick - Callback for delete button click
 */
export function renderFavoritesList(container, emptyEl, onStartClick, onDeleteClick) {
  const favorites = getFavorites();

  if (favorites.length === 0) {
    container.innerHTML = '';
    if (emptyEl) {
      emptyEl.hidden = false;
    }
    return;
  }

  if (emptyEl) {
    emptyEl.hidden = true;
  }

  const html = favorites
    .map(
      exercise => `
      <li class="exercise-card" data-exercise-id="${exercise._id}">
        <div class="exercise-card-header">
          <span class="exercise-card-badge">workout</span>
          <div class="exercise-card-actions">
            <button class="exercise-delete-btn" type="button" data-delete="${exercise._id}" aria-label="Remove from favorites">
              <svg class="exercise-delete-icon">
                <use href="./img/sprite.svg#icon-trash"></use>
              </svg>
            </button>
            <button class="exercise-start-btn" type="button" data-start="${exercise._id}">
              Start
              <svg class="exercise-start-icon">
                <use href="./img/sprite.svg#icon-arrow"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="exercise-card-body">
          <div class="exercise-card-icon">
            <svg class="exercise-card-icon-svg">
              <use href="./img/sprite.svg#icon-run"></use>
            </svg>
          </div>
          <h3 class="exercise-card-title">${exercise.name}</h3>
        </div>
        <div class="exercise-card-meta">
          <span class="exercise-card-meta-item">Burned calories: <span>${exercise.burnedCalories} / 3 min</span></span>
          <span class="exercise-card-meta-item">Body part: <span>${exercise.bodyPart}</span></span>
          <span class="exercise-card-meta-item">Target: <span>${exercise.target}</span></span>
        </div>
      </li>
    `
    )
    .join('');

  container.innerHTML = html;

  // Add event listeners
  container.querySelectorAll('[data-start]').forEach(btn => {
    btn.addEventListener('click', () => {
      const exerciseId = btn.dataset.start;
      if (onStartClick) onStartClick(exerciseId);
    });
  });

  container.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      const exerciseId = btn.dataset.delete;
      removeFromFavorites(exerciseId);
      if (onDeleteClick) onDeleteClick(exerciseId);
      // Re-render the list
      renderFavoritesList(container, emptyEl, onStartClick, onDeleteClick);
    });
  });
}
