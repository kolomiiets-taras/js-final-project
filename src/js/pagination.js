/**
 * Pagination module for Your Energy application
 */

/**
 * Render pagination
 * @param {Object} options
 * @param {HTMLElement} options.container - Pagination container element
 * @param {number} options.currentPage - Current page number
 * @param {number} options.totalPages - Total pages count
 * @param {Function} options.onPageChange - Callback when page changes
 */
export function renderPagination({ container, currentPage, totalPages, onPageChange }) {
  if (!container) return;

  // Hide pagination if only one page
  if (totalPages <= 1) {
    container.classList.add('is-hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('is-hidden');

  let html = '';

  // First page and prev buttons
  html += `
    <button class="pagination-btn" type="button" data-page="1" ${currentPage === 1 ? 'disabled' : ''} aria-label="First page">
      <svg class="pagination-icon"><use href="./img/sprite.svg#icon-chevrons-left"></use></svg>
    </button>
    <button class="pagination-btn" type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">
      <svg class="pagination-icon"><use href="./img/sprite.svg#icon-chevron-left"></use></svg>
    </button>
  `;

  // Page numbers
  const pages = getPageNumbers(currentPage, totalPages);

  pages.forEach((page, index) => {
    if (page === '...') {
      html += `<span class="pagination-dots">...</span>`;
    } else {
      html += `
        <button class="pagination-btn ${page === currentPage ? 'active' : ''}" type="button" data-page="${page}">
          ${page}
        </button>
      `;
    }
  });

  // Next and last page buttons
  html += `
    <button class="pagination-btn" type="button" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">
      <svg class="pagination-icon"><use href="./img/sprite.svg#icon-chevron-right"></use></svg>
    </button>
    <button class="pagination-btn" type="button" data-page="${totalPages}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Last page">
      <svg class="pagination-icon"><use href="./img/sprite.svg#icon-chevrons-right"></use></svg>
    </button>
  `;

  container.innerHTML = html;

  // Add click handlers
  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page, 10);
      if (page !== currentPage && page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    });
  });
}

/**
 * Generate array of page numbers to display
 * @param {number} current - Current page
 * @param {number} total - Total pages
 * @returns {Array<number|string>}
 */
function getPageNumbers(current, total) {
  const pages = [];
  const maxVisible = 5;

  if (total <= maxVisible) {
    // Show all pages
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (current > 3) {
      pages.push('...');
    }

    // Show pages around current
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (current < total - 2) {
      pages.push('...');
    }

    // Always show last page
    if (!pages.includes(total)) {
      pages.push(total);
    }
  }

  return pages;
}

/**
 * Clear pagination
 * @param {HTMLElement} container
 */
export function clearPagination(container) {
  if (container) {
    container.innerHTML = '';
    container.classList.add('is-hidden');
  }
}
