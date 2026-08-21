/**
 * App Module — Landing page interactivity
 */

// Header scroll effect
function initHeaderScroll(): void {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = (): void => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initial state
}

// Smooth scroll for anchor links
function initSmoothScroll(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href') || '');
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// Intersection Observer for scroll animations
function initScrollAnimations(): void {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe feature cards
  document.querySelectorAll('.feature-card').forEach((card) => {
    card.classList.add('animate-on-scroll');
    observer.observe(card);
  });
}

// Initialize all
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initSmoothScroll();
  initScrollAnimations();
});

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s var(--easing-default), transform 0.6s var(--easing-default);
  }
  
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
