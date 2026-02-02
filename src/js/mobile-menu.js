/**
 * Mobile menu module for Your Energy application
 */

/**
 * Initialize mobile menu
 */
export function initMobileMenu() {
  const menu = document.querySelector('[data-menu]');
  const openBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');

  if (!menu || !openBtn || !closeBtn) return;

  // Open menu
  openBtn.addEventListener('click', () => {
    menu.classList.add('is-open');
    document.body.classList.add('no-scroll');
  });

  // Close menu
  closeBtn.addEventListener('click', () => {
    menu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    });
  });

  // Close on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }
  });

  // Initialize header hide on scroll
  initHeaderScroll();
}

/**
 * Initialize header hide/show on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Don't hide header at the very top
        if (currentScrollY < 100) {
          header.classList.remove('is-hidden');
        } else if (currentScrollY > lastScrollY) {
          // Scrolling down - hide header
          header.classList.add('is-hidden');
        } else {
          // Scrolling up - show header
          header.classList.remove('is-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });

      ticking = true;
    }
  });
}

/**
 * Initialize scroll to top button
 */
export function initScrollTop() {
  const scrollTopBtn = document.querySelector('[data-scroll-top]');
  if (!scrollTopBtn) return;

  // Show/hide based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('is-visible');
    } else {
      scrollTopBtn.classList.remove('is-visible');
    }
  });

  // Scroll to top on click
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
