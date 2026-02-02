/**
 * Filters module for Your Energy application
 * Handles both categories (filters) and exercises views
 */

import { fetchFilters, fetchExercises } from './api.js';
import { renderPagination } from './pagination.js';
import { getResponsiveLimit, capitalize } from './utils.js';

// State
let currentFilter = 'Muscles';
let currentCategory = '';
let currentPage = 1;
let totalPages = 1;
let currentKeyword = '';
let isExercisesView = false;

// DOM elements
let filterButtons;
let categoriesList;
let categoriesView;
let exercisesView;
let exercisesList;
let exercisesEmpty;
let categoriesPagination;
let exercisesPagination;
let categoryNameEl;
let searchForm;
let searchInput;
let searchClearBtn;
let onExerciseStart;

/**
 * Initialize filters
 * @param {Function} exerciseStartCallback - Callback when exercise Start button is clicked
 */
export function initFilters(exerciseStartCallback) {
  onExerciseStart = exerciseStartCallback;

  filterButtons = document.querySelectorAll('[data-filter]');
  categoriesList = document.querySelector('[data-categories-list]');
  categoriesView = document.querySelector('[data-categories-view]');
  exercisesView = document.querySelector('[data-exercises-view]');
  exercisesList = document.querySelector('[data-exercises-list]');
  exercisesEmpty = document.querySelector('[data-exercises-empty]');
  categoriesPagination = document.querySelector('[data-categories-pagination]');
  exercisesPagination = document.querySelector('[data-exercises-pagination]');
  categoryNameEl = document.querySelector('[data-filters-category-name]');
  searchForm = document.querySelector('[data-search-form]');
  searchInput = searchForm?.querySelector('input[name="keyword"]');
  searchClearBtn = document.querySelector('[data-search-clear]');

  if (!filterButtons.length || !categoriesList) return;

  // Add click handlers to filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // If in exercises view, switch back to categories
      if (isExercisesView) {
        showCategoriesView();
      }

      if (filter !== currentFilter || isExercisesView) {
        setActiveFilter(btn);
        currentFilter = filter;
        currentPage = 1;
        currentKeyword = '';
        if (searchInput) searchInput.value = '';
        if (searchClearBtn) searchClearBtn.classList.remove('is-visible');
        loadCategories();
      }
    });
  });

  // Setup search form
  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const keyword = searchInput?.value.trim();
      currentKeyword = keyword;
      currentPage = 1;

      if (isExercisesView) {
        loadExercises();
      } else {
        loadCategories();
      }
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

      if (isExercisesView) {
        loadExercises();
      } else {
        loadCategories();
      }
    });
  }

  // Load initial categories (Muscles is default)
  loadCategories();

  // Handle window resize for responsive limit
  window.addEventListener('resize', handleResize);
}

/**
 * Set active filter button
 * @param {HTMLElement} activeBtn
 */
function setActiveFilter(activeBtn) {
  filterButtons.forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

/**
 * Show categories view
 */
function showCategoriesView() {
  isExercisesView = false;
  if (categoriesView) categoriesView.hidden = false;
  if (exercisesView) exercisesView.hidden = true;
  if (categoryNameEl) categoryNameEl.textContent = '';
  currentCategory = '';
  currentKeyword = '';
  currentPage = 1;
  if (searchInput) searchInput.value = '';
  if (searchClearBtn) searchClearBtn.classList.remove('is-visible');
}

/**
 * Show exercises view
 * @param {string} categoryName
 * @param {string} filterType
 */
function showExercisesView(categoryName, filterType) {
  isExercisesView = true;
  currentCategory = categoryName;
  currentFilter = filterType;
  currentPage = 1;
  currentKeyword = '';

  if (categoriesView) categoriesView.hidden = true;
  if (exercisesView) exercisesView.hidden = false;
  if (categoryNameEl) categoryNameEl.textContent = `/ ${capitalize(categoryName)}`;
  if (searchInput) searchInput.value = '';
  if (searchClearBtn) searchClearBtn.classList.remove('is-visible');

  // Update active filter button
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filterType);
  });

  loadExercises();
}

/**
 * Load categories from API
 */
async function loadCategories() {
  try {
    const limit = getResponsiveLimit('categories');
    const data = await fetchFilters({
      filter: currentFilter,
      page: currentPage,
      limit,
    });

    let results = data.results;

    // Client-side filtering by keyword
    if (currentKeyword) {
      const keyword = currentKeyword.toLowerCase();
      results = results.filter(cat =>
        cat.name.toLowerCase().includes(keyword)
      );
    }

    totalPages = currentKeyword ? 1 : data.totalPages;
    renderCategories(results);
    updateCategoriesPagination();
  } catch (error) {
    console.error('Error loading categories:', error);
    categoriesList.innerHTML = '<li>Failed to load categories. Please try again.</li>';
  }
}

/**
 * Render categories list
 * @param {Array} categories
 */
function renderCategories(categories) {
  const html = categories
    .map(
      category => `
      <li>
        <button class="category-card" type="button" data-category="${category.name}" data-filter-type="${category.filter}">
          <img
            class="category-card-image"
            src="${category.imgURL}"
            alt="${category.name}"
            loading="lazy"
          />
          <div class="category-card-content">
            <span class="category-card-name">${capitalize(category.name)}</span>
            <span class="category-card-filter">${category.filter}</span>
          </div>
        </button>
      </li>
    `
    )
    .join('');

  categoriesList.innerHTML = html;

  // Add click handlers
  categoriesList.querySelectorAll('[data-category]').forEach(card => {
    card.addEventListener('click', () => {
      const categoryName = card.dataset.category;
      const filterType = card.dataset.filterType;
      showExercisesView(categoryName, filterType);
    });
  });
}

/**
 * Update categories pagination
 */
function updateCategoriesPagination() {
  renderPagination({
    container: categoriesPagination,
    currentPage,
    totalPages,
    onPageChange: page => {
      currentPage = page;
      loadCategories();
    },
  });
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
    if (currentFilter === 'Muscles') {
      params.muscles = currentCategory;
    } else if (currentFilter === 'Body parts') {
      params.bodypart = currentCategory;
    } else if (currentFilter === 'Equipment') {
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

    updateExercisesPagination();
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
 * Update exercises pagination
 */
function updateExercisesPagination() {
  renderPagination({
    container: exercisesPagination,
    currentPage,
    totalPages,
    onPageChange: page => {
      currentPage = page;
      loadExercises();
    },
  });
}

/**
 * Handle window resize
 */
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (isExercisesView) {
      loadExercises();
    } else {
      loadCategories();
    }
  }, 250);
}

/**
 * Get current filter type
 * @returns {string}
 */
export function getCurrentFilter() {
  return currentFilter;
}
