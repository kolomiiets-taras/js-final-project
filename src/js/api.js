/**
 * API module for Your Energy application
 * Base URL: https://your-energy.b.goit.study/api
 */

const BASE_URL = 'https://your-energy.b.goit.study/api';

/**
 * Fetch quote of the day
 * @returns {Promise<{author: string, quote: string}>}
 */
export async function fetchQuote() {
  const response = await fetch(`${BASE_URL}/quote`);
  if (!response.ok) {
    throw new Error('Failed to fetch quote');
  }
  return response.json();
}

/**
 * Fetch filters (categories)
 * @param {Object} params
 * @param {string} params.filter - Filter type: 'Muscles' | 'Body parts' | 'Equipment'
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=12] - Items per page
 * @returns {Promise<{page: number, perPage: number, totalPages: number, results: Array}>}
 */
export async function fetchFilters({ filter, page = 1, limit = 12 }) {
  const params = new URLSearchParams({
    filter,
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${BASE_URL}/filters?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch filters');
  }
  return response.json();
}

/**
 * Fetch exercises list
 * @param {Object} params
 * @param {string} [params.bodypart] - Body part filter
 * @param {string} [params.muscles] - Muscles filter
 * @param {string} [params.equipment] - Equipment filter
 * @param {string} [params.keyword] - Search keyword
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page
 * @returns {Promise<{page: number, perPage: number, totalPages: number, results: Array}>}
 */
export async function fetchExercises({
  bodypart,
  muscles,
  equipment,
  keyword,
  page = 1,
  limit = 10,
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (bodypart) params.append('bodypart', bodypart);
  if (muscles) params.append('muscles', muscles);
  if (equipment) params.append('equipment', equipment);
  if (keyword) params.append('keyword', keyword);

  const response = await fetch(`${BASE_URL}/exercises?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch exercises');
  }
  return response.json();
}

/**
 * Fetch single exercise details
 * @param {string} exerciseId - Exercise ID
 * @returns {Promise<Object>}
 */
export async function fetchExerciseById(exerciseId) {
  const response = await fetch(`${BASE_URL}/exercises/${exerciseId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch exercise details');
  }
  return response.json();
}

/**
 * Submit exercise rating
 * @param {string} exerciseId - Exercise ID
 * @param {Object} data
 * @param {number} data.rate - Rating (1-5)
 * @param {string} data.email - Email address
 * @param {string} data.review - Review text
 * @returns {Promise<Object>}
 */
export async function submitRating(exerciseId, { rate, email, review }) {
  const response = await fetch(`${BASE_URL}/exercises/${exerciseId}/rating`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rate, email, review }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit rating');
  }
  return response.json();
}

/**
 * Subscribe to newsletter
 * @param {string} email - Email address
 * @returns {Promise<Object>}
 */
export async function subscribe(email) {
  const response = await fetch(`${BASE_URL}/subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to subscribe');
  }
  return response.json();
}
