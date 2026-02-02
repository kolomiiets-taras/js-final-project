/**
 * Subscription module for Your Energy application
 */

import { subscribe } from './api.js';
import { validateEmail } from './utils.js';

/**
 * Initialize subscription form
 */
export function initSubscription() {
  const form = document.querySelector('[data-subscribe-form]');
  if (!form) return;

  const emailInput = form.querySelector('input[name="email"]');
  const errorEl = form.querySelector('[data-subscribe-error]');
  const successEl = form.querySelector('[data-subscribe-success]');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Validate on input
  emailInput.addEventListener('input', () => {
    const isValid = validateEmail(emailInput.value) || emailInput.value.length === 0;
    emailInput.classList.toggle('is-invalid', !isValid);
    errorEl.textContent = isValid ? '' : 'Invalid email format';
    successEl.hidden = true;
  });

  // Handle form submit
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Validate email
    if (!validateEmail(email)) {
      emailInput.classList.add('is-invalid');
      errorEl.textContent = 'Please enter a valid email address';
      return;
    }

    // Clear previous states
    emailInput.classList.remove('is-invalid');
    errorEl.textContent = '';
    successEl.hidden = true;
    submitBtn.disabled = true;

    try {
      const response = await subscribe(email);

      // Show success message
      successEl.textContent = response.message || 'Successfully subscribed!';
      successEl.hidden = false;

      // Reset form
      form.reset();
    } catch (error) {
      console.error('Subscription error:', error);
      errorEl.textContent = error.message || 'Subscription failed. Please try again.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}
