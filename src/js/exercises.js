/**
 * Exercises module for Your Energy application
 */

import { fetchExercises } from './api.js';
import { renderPagination, clearPagination } from './pagination.js';
import { getResponsiveLimit, capitalize } from './utils.js';

let currentCategory = '';
let currentFilterType = '';
let currentKeyword = '';
let currentPage = 1;
let totalPages = 1;

// DOM elements
let exercisesSection;
let exercisesList;
let exercisesEmpty;
let paginationContainer;
let categoryNameEl;
let searchForm;
let searchInput;
let searchClearBtn;
let exercisesFilterButtons;
let onExerciseStart;
let onFilterSwitch;

/**
 * Initialize exercises section
 * @param {Function} exerciseStartCallback - Callback when Start button is clicked
 * @param {Function} filterSwitchCallback - Callback when filter button is clicked
 */
export function initExercises(exerciseStartCallback, filterSwitchCallback) {
  onExerciseStart = exerciseStartCallback;
  onFilterSwitch = filterSwitchCallback;

  exercisesSection = document.querySelector('[data-exercises-section]');
  exercisesList = document.querySelector('[data-exercises-list]');
  exercisesEmpty = document.querySelector('[data-exercises-empty]');
  paginationContainer = document.querySelector('[data-exercises-pagination]');
  categoryNameEl = document.querySelector('[data-exercises-category-name]');
  searchForm = document.querySelector('[data-search-form]');
  searchInput = searchForm?.querySelector('input[name="keyword"]');
  searchClearBtn = document.querySelector('[data-search-clear]');
  exercisesFilterButtons = document.querySelectorAll('[data-exercises-filter]');

  if (!exercisesSection || !exercisesList) return;

  // Setup search form
  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const keyword = searchInput?.value.trim();
      currentKeyword = keyword;
      currentPage = 1;
      loadExercises();
    });
  }

  // Setup clear button
  if (searchClearBtn && searchInput) {
    searchInput.addEventListener('input', () => {
      searchClearBtn.classList.toggle('is-visible', searchInput.value.length > 0);
    });

    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchClearBtn.classList.remove('is-visible');
      currentKeyword = '';
      currentPage = 1;
      loadExercises();
    });
  }

  // Setup filter buttons in exercises section
  exercisesFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.exercisesFilter;
      if (onFilterSwitch) {
        onFilterSwitch(filter);
      }
    });
  });
}

/**
 * Show exercises for selected category
 * @param {string} categoryName
 * @param {string} filterType - 'Muscles' | 'Body parts' | 'Equipment'
 */
export function showExercises(categoryName, filterType) {
  currentCategory = categoryName;
  currentFilterType = filterType;
  currentKeyword = '';
  currentPage = 1;

  // Reset search input
  if (searchInput) {
    searchInput.value = '';
    searchClearBtn?.classList.remove('is-visible');
  }

  // Update category name
  if (categoryNameEl) {
    categoryNameEl.textContent = `/ ${capitalize(categoryName)}`;
  }

  // Show exercises section
  if (exercisesSection) {
    exercisesSection.classList.add('is-visible');
  }

  loadExercises();
}

/**
 * Hide exercises section
 */
export function hideExercises() {
  if (exercisesSection) {
    exercisesSection.classList.remove('is-visible');
  }
  currentCategory = '';
  currentFilterType = '';
}

/**
 * Load exercises from API
 */
async function loadExercises() {
  try {
    const limit = getResponsiveLimit('exercises');
    const params = {
      page: currentPage,
      limit,
    };

    // Add filter param based on type
    if (currentFilterType === 'Muscles') {
      params.muscles = currentCategory;
    } else if (currentFilterType === 'Body parts') {
      params.bodypart = currentCategory;
    } else if (currentFilterType === 'Equipment') {
      params.equipment = currentCategory;
    }

    // Add keyword if searching
    if (currentKeyword) {
      params.keyword = currentKeyword;
    }

    const data = await fetchExercises(params);

    totalPages = data.totalPages;

    if (data.results.length === 0) {
      showEmptyState();
    } else {
      hideEmptyState();
      renderExercises(data.results);
    }

    updatePagination();
  } catch (error) {
    console.error('Error loading exercises:', error);
    exercisesList.innerHTML = '<li>Failed to load exercises. Please try again.</li>';
  }
}

/**
 * Render exercises list
 * @param {Array} exercises
 */
function renderExercises(exercises) {
  const html = exercises
    .map(
      exercise => `
      <li class="exercise-card">
        <div class="exercise-card-header">
          <span class="exercise-card-badge">workout</span>
          <div class="exercise-card-actions">
            <span class="exercise-card-rating">
              ${exercise.rating?.toFixed(1) || '0.0'}
              <svg class="rating-star">
                <use href="./img/sprite.svg#icon-star"></use>
              </svg>
            </span>
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
          <h3 class="exercise-card-title">${capitalize(exercise.name)}</h3>
        </div>
        <div class="exercise-card-meta">
          <span class="exercise-card-meta-item">Burned calories: <span>${exercise.burnedCalories} / 3 min</span></span>
          <span class="exercise-card-meta-item">Body part: <span>${capitalize(exercise.bodyPart)}</span></span>
          <span class="exercise-card-meta-item">Target: <span>${capitalize(exercise.target)}</span></span>
        </div>
      </li>
    `
    )
    .join('');

  exercisesList.innerHTML = html;

  // Add click handlers
  exercisesList.querySelectorAll('[data-start]').forEach(btn => {
    btn.addEventListener('click', () => {
      const exerciseId = btn.dataset.start;
      if (onExerciseStart) onExerciseStart(exerciseId);
    });
  });
}

/**
 * Show empty state
 */
function showEmptyState() {
  exercisesList.innerHTML = '';
  if (exercisesEmpty) {
    exercisesEmpty.hidden = false;
    const keywordEl = exercisesEmpty.querySelector('[data-search-keyword]');
    if (keywordEl) {
      keywordEl.textContent = currentKeyword ? `"${currentKeyword}"` : '';
    }
  }
}

/**
 * Hide empty state
 */
function hideEmptyState() {
  if (exercisesEmpty) {
    exercisesEmpty.hidden = true;
  }
}

/**
 * Update pagination
 */
function updatePagination() {
  renderPagination({
    container: paginationContainer,
    currentPage,
    totalPages,
    onPageChange: page => {
      currentPage = page;
      loadExercises();
    },
  });
}
