/**
 * Modal module for Your Energy application
 */

import { fetchExerciseById, submitRating } from './api.js';
import { isFavorite, toggleFavorite } from './favorites.js';
import { generateStarsHTML, validateEmail, capitalize, showNotification } from './utils.js';

// DOM elements
let exerciseModal;
let ratingModal;
let currentExercise = null;

// Event listeners storage for cleanup
let escapeHandler = null;
let backdropHandler = null;

/**
 * Initialize modals
 */
export function initModals() {
  exerciseModal = document.querySelector('[data-exercise-modal]');
  ratingModal = document.querySelector('[data-rating-modal]');

  if (!exerciseModal || !ratingModal) return;

  // Setup close buttons
  exerciseModal.querySelector('[data-modal-close]')?.addEventListener('click', closeExerciseModal);
  ratingModal.querySelector('[data-modal-close]')?.addEventListener('click', closeRatingModal);

  // Setup Give rating button
  exerciseModal.querySelector('[data-modal-give-rating]')?.addEventListener('click', () => {
    // Close exercise modal but keep currentExercise for rating
    closeModal(exerciseModal);
    openRatingModal();
  });

  // Setup favorites button
  exerciseModal.querySelector('[data-modal-favorites]')?.addEventListener('click', handleFavoritesClick);

  // Setup rating form
  setupRatingForm();
}

/**
 * Open exercise modal
 * @param {string} exerciseId
 */
export async function openExerciseModal(exerciseId) {
  try {
    const exercise = await fetchExerciseById(exerciseId);
    currentExercise = exercise;

    renderExerciseModal(exercise);
    openModal(exerciseModal);
    updateFavoritesButton();
  } catch (error) {
    console.error('Error loading exercise:', error);
    showNotification('Failed to load exercise details', 'error');
  }
}

/**
 * Render exercise modal content
 * @param {Object} exercise
 */
function renderExerciseModal(exercise) {
  // Video or GIF
  const videoContainer = exerciseModal.querySelector('[data-modal-video]');
  const gifEl = exerciseModal.querySelector('[data-modal-gif]');

  if (exercise.gifUrl) {
    gifEl.src = exercise.gifUrl;
    gifEl.alt = exercise.name;
    videoContainer.innerHTML = '';
    videoContainer.appendChild(gifEl);
  }

  // Title
  exerciseModal.querySelector('[data-modal-title]').textContent = capitalize(exercise.name);

  // Rating
  const ratingValue = exercise.rating?.toFixed(1) || '0.0';
  exerciseModal.querySelector('[data-modal-rating-value]').textContent = ratingValue;
  exerciseModal.querySelector('[data-modal-stars]').innerHTML = generateStarsHTML(
    exercise.rating || 0
  );

  // Meta info
  exerciseModal.querySelector('[data-modal-target]').textContent = capitalize(exercise.target);
  exerciseModal.querySelector('[data-modal-bodypart]').textContent = capitalize(exercise.bodyPart);
  exerciseModal.querySelector('[data-modal-popularity]').textContent = exercise.popularity || '0';
  exerciseModal.querySelector('[data-modal-calories]').textContent = exercise.burnedCalories;

  // Description
  exerciseModal.querySelector('[data-modal-description]').textContent = exercise.description || '';
}

/**
 * Update favorites button state
 */
function updateFavoritesButton() {
  if (!currentExercise) return;

  const btn = exerciseModal.querySelector('[data-modal-favorites]');
  const icon = btn.querySelector('use');
  const isInFavorites = isFavorite(currentExercise._id);

  if (isInFavorites) {
    btn.innerHTML = `Remove from favorites <svg class="btn-favorites-icon"><use href="./img/sprite.svg#icon-heart-filled"></use></svg>`;
  } else {
    btn.innerHTML = `Add to favorites <svg class="btn-favorites-icon"><use href="./img/sprite.svg#icon-heart"></use></svg>`;
  }
}

/**
 * Handle favorites button click
 */
function handleFavoritesClick() {
  if (!currentExercise) return;

  toggleFavorite(currentExercise);
  updateFavoritesButton();
}

/**
 * Close exercise modal
 */
function closeExerciseModal() {
  closeModal(exerciseModal);
  currentExercise = null;
}

/**
 * Open rating modal
 */
function openRatingModal() {
  // Reset form
  const form = ratingModal.querySelector('[data-rating-form]');
  form.reset();
  form.querySelector('[data-rating-value]').value = '0';
  form.querySelector('[type="submit"]').disabled = true;

  // Reset stars
  resetRatingStars();

  openModal(ratingModal);
}

/**
 * Close rating modal
 */
function closeRatingModal() {
  closeModal(ratingModal);
}

/**
 * Setup rating form
 */
function setupRatingForm() {
  const starsContainer = ratingModal.querySelector('[data-rating-stars]');
  const form = ratingModal.querySelector('[data-rating-form]');
  const rateInput = form.querySelector('[data-rating-value]');
  const emailInput = form.querySelector('[name="email"]');
  const submitBtn = form.querySelector('[type="submit"]');
  const emailError = ratingModal.querySelector('[data-rating-email-error]');

  // Star rating click
  starsContainer.querySelectorAll('[data-star]').forEach(star => {
    star.addEventListener('click', () => {
      const value = star.dataset.star;
      rateInput.value = value;
      updateRatingStars(value);
      validateForm();
    });
  });

  // Email validation
  emailInput.addEventListener('input', () => {
    const isValid = validateEmail(emailInput.value);
    emailInput.classList.toggle('is-invalid', !isValid && emailInput.value.length > 0);
    emailError.hidden = isValid || emailInput.value.length === 0;
    validateForm();
  });

  // Form submit
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const rate = parseInt(rateInput.value, 10);
    const email = emailInput.value.trim();
    const review = form.querySelector('[name="review"]').value.trim();

    if (!currentExercise || rate === 0 || !validateEmail(email)) {
      return;
    }

    submitBtn.disabled = true;

    try {
      await submitRating(currentExercise._id, { rate, email, review });
      showNotification('Thank you for your rating!', 'success');
      closeRatingModal();
      // Re-open exercise modal with updated data
      if (currentExercise) {
        openExerciseModal(currentExercise._id);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      showNotification(error.message || 'Failed to submit rating', 'error');
      submitBtn.disabled = false;
    }
  });

  function validateForm() {
    const rate = parseInt(rateInput.value, 10);
    const email = emailInput.value.trim();
    const isValid = rate > 0 && validateEmail(email);
    submitBtn.disabled = !isValid;
  }
}

/**
 * Update rating stars display
 * @param {number} value
 */
function updateRatingStars(value) {
  const starsContainer = ratingModal.querySelector('[data-rating-stars]');
  starsContainer.querySelectorAll('[data-star]').forEach(star => {
    const starValue = parseInt(star.dataset.star, 10);
    const use = star.querySelector('use');
    if (starValue <= value) {
      use.setAttribute('href', './img/sprite.svg#icon-star');
    } else {
      use.setAttribute('href', './img/sprite.svg#icon-star-empty');
    }
  });
}

/**
 * Reset rating stars
 */
function resetRatingStars() {
  const starsContainer = ratingModal.querySelector('[data-rating-stars]');
  starsContainer.querySelectorAll('[data-star] use').forEach(use => {
    use.setAttribute('href', './img/sprite.svg#icon-star-empty');
  });
}

/**
 * Open modal with backdrop
 * @param {HTMLElement} modal
 */
function openModal(modal) {
  modal.classList.add('is-open');
  document.body.classList.add('no-scroll');

  // Add escape handler
  escapeHandler = e => {
    if (e.key === 'Escape') {
      closeModal(modal);
    }
  };
  document.addEventListener('keydown', escapeHandler);

  // Add backdrop click handler
  backdropHandler = e => {
    if (e.target === modal) {
      closeModal(modal);
    }
  };
  modal.addEventListener('click', backdropHandler);
}

/**
 * Close modal
 * @param {HTMLElement} modal
 */
function closeModal(modal) {
  modal.classList.remove('is-open');
  document.body.classList.remove('no-scroll');

  // Remove event listeners
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }

  if (backdropHandler) {
    modal.removeEventListener('click', backdropHandler);
    backdropHandler = null;
  }
}
