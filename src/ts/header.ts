/**
 * Header Module — Mobile menu toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('headerNav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('open');
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    nav.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
});
