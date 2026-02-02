/**
 * Quote of the day module for Your Energy application
 */

import { fetchQuote } from './api.js';
import { getFromStorage, saveToStorage, getTodayDate } from './utils.js';

const STORAGE_KEY = 'quote-data';

/**
 * Initialize quote of the day
 */
export async function initQuote() {
  const quoteTextEl = document.querySelector('[data-quote-text]');
  const quoteAuthorEl = document.querySelector('[data-quote-author]');

  if (!quoteTextEl || !quoteAuthorEl) return;

  try {
    const quoteData = await getQuoteOfTheDay();
    renderQuote(quoteData, quoteTextEl, quoteAuthorEl);
  } catch (error) {
    console.error('Error loading quote:', error);
  }
}

/**
 * Get quote of the day from storage or API
 * @returns {Promise<{quote: string, author: string}>}
 */
async function getQuoteOfTheDay() {
  const today = getTodayDate();
  const storedData = getFromStorage(STORAGE_KEY);

  // Check if we have a valid stored quote for today
  if (storedData && storedData.date === today) {
    return {
      quote: storedData.quote,
      author: storedData.author,
    };
  }

  // Fetch new quote from API
  const newQuote = await fetchQuote();

  // Save to localStorage with today's date
  saveToStorage(STORAGE_KEY, {
    quote: newQuote.quote,
    author: newQuote.author,
    date: today,
  });

  return newQuote;
}

/**
 * Render quote to DOM
 * @param {Object} quoteData
 * @param {HTMLElement} textEl
 * @param {HTMLElement} authorEl
 */
function renderQuote(quoteData, textEl, authorEl) {
  textEl.textContent = quoteData.quote;
  authorEl.textContent = quoteData.author;
}
