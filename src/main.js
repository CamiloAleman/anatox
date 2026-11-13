const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

const setMenuState = (isOpen) => {
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
  const menuLabel = menuToggle?.querySelector('.sr-only');
  if (menuLabel) menuLabel.textContent = isOpen ? 'Cerrar menú' : 'Abrir menú';
  mainNav?.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
};

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  setMenuState(isOpen);
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const atlasCards = [...document.querySelectorAll('.atlas-card')];

function applyFilter(filter) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  atlasCards.forEach((card) => {
    const isVisible = filter === 'todos' || card.dataset.category === filter;
    card.hidden = !isVisible;
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter));
});

document.querySelectorAll('[data-filter-link]').forEach((link) => {
  link.addEventListener('click', () => {
    applyFilter(link.dataset.filterLink);
  });
});

const imageDialog = document.querySelector('.image-dialog');
const imageDialogTitle = imageDialog?.querySelector('h2');
const imageDialogImage = imageDialog?.querySelector('img');

atlasCards.forEach((card) => {
  card.addEventListener('click', () => {
    imageDialogTitle.textContent = card.dataset.title;
    imageDialogImage.src = card.dataset.image;
    imageDialogImage.alt = `Vista ampliada: ${card.dataset.title}`;
    imageDialog.showModal();
  });
});

const videoDialog = document.querySelector('.video-dialog');
const videoDialogTitle = videoDialog?.querySelector('h2');
const videoFrame = videoDialog?.querySelector('[data-video-frame]');
const videoTriggers = document.querySelectorAll('[data-video-id]');

videoTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const { videoId, videoTitle, videoFormat } = trigger.dataset;
    videoDialogTitle.textContent = videoTitle;
    videoFrame.classList.toggle('is-portrait', videoFormat === 'portrait');
    videoFrame.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1"
        title="${videoTitle}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    `;
    videoDialog.showModal();
  });
});

function closeDialog(dialog) {
  if (dialog === videoDialog) {
    videoFrame.innerHTML = '';
  }
  dialog.close();
}

document.querySelectorAll('.media-dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => closeDialog(dialog));
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('[data-reveal]');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.main-nav a');

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55%' });

  sections.forEach((section) => sectionObserver.observe(section));
}
