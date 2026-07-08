const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item) => {
  if (item.dataset.delay) item.style.setProperty('--delay', `${item.dataset.delay}ms`);
});

if (reducedMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const counters = document.querySelectorAll('[data-count]');
const formatCounter = (value, suffix) => `${value.toFixed(1)}${suffix}`;
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    if (reducedMotion) {
      element.textContent = formatCounter(target, suffix);
    } else {
      const start = performance.now();
      const duration = 1100;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = formatCounter(target * eased, suffix);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    observer.unobserve(element);
  });
}, { threshold: 0.45 });
counters.forEach((counter) => counterObserver.observe(counter));

const glow = document.querySelector('.cursor-glow');
if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const strength = card.classList.contains('terminal-card') ? 7 : 2;
      card.style.transform = `perspective(1100px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

const filterButtons = document.querySelectorAll('.filter-button');
const publications = document.querySelectorAll('.publication-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    publications.forEach((publication) => {
      const shouldShow = filter === 'all' || publication.dataset.category === filter;
      publication.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-header nav a')];
if (sections.length && navLinks.length) {
  const updateActiveLink = () => {
    const position = window.scrollY + window.innerHeight * 0.33;
    let current = '';
    sections.forEach((section) => {
      if (position >= section.offsetTop) current = section.id;
    });
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${current}`;
      link.style.color = active ? 'var(--green)' : '';
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });
}
