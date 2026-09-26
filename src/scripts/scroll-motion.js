// Progressive enhancement: content stays visible without JavaScript or observers.
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const selector = [
  '.section-head', '.project-card', '.playground', '.about-grid > div',
  '.experience', '.skill-grid > div', '.contact-section > *',
  '.contact-title', '.contact-grid > *', '.contact-detail > div',
  '.lab-intro', '.lab-card', '.standalone-app', '.education-cards > article',
  '.certificate', '.app-header', '.app-end'
].join(',');
const items = [...document.querySelectorAll(selector)];
if ('IntersectionObserver' in window && items.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.06 });
  items.forEach(item => {
    item.setAttribute('data-reveal', '');
    const rect = item.getBoundingClientRect();
    item.classList.toggle('is-visible', rect.bottom > 0 && rect.top < innerHeight);
    observer.observe(item);
  });
  const updatePreference = () => document.documentElement.classList.toggle('motion-ready', !preference.matches);
  updatePreference();
  preference.addEventListener('change', updatePreference);
  document.addEventListener('focusin', event => {
    if (event.target instanceof Element) event.target.closest('[data-reveal]')?.classList.add('is-visible');
  });
}
