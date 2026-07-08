const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item) => {
  if (item.dataset.delay) item.style.setProperty('--delay', `${item.dataset.delay}ms`);
});

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  revealItems.forEach((item) => observer.observe(item));
}

const progress = document.querySelector('.reading-progress span');
const navLinks = [...document.querySelectorAll('.site-header nav a')];
const sections = [...document.querySelectorAll('main section[id]')];

const updatePageState = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;

  const position = window.scrollY + window.innerHeight * 0.3;
  let current = 'top';
  sections.forEach((section) => {
    if (position >= section.offsetTop) current = section.id;
  });

  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${current}`;
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};

updatePageState();
window.addEventListener('scroll', updatePageState, { passive: true });
window.addEventListener('resize', updatePageState, { passive: true });

document.querySelectorAll('.interest-notes details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.interest-notes details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});
