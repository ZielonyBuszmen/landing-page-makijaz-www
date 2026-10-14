// Menu
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  menu.classList.toggle('open');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  menu.classList.remove('open');
}));

// Sticky header
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('header--scrolled', window.scrollY > 80);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// FAQ – akordeon
document.querySelectorAll('.accordion__btn').forEach(btn =>
  btn.addEventListener('click', () => btn.parentElement.classList.toggle('open')));

// Zakres usług – zakładki
document.querySelectorAll('.tabs__nav button').forEach(btn => btn.addEventListener('click', () => {
  const id = btn.dataset.tab;
  document.querySelectorAll('.tabs [data-tab]').forEach(el => el.classList.toggle('active', el.dataset.tab === id));
}));

// Zdjęcia – powiększenie po kliknięciu: X, strzałki, klawiatura i przesuwanie (palcem lub myszką)
const lightboxLinks = document.querySelectorAll('[data-lightbox]');
if (lightboxLinks.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML =
    '<button type="button" class="lightbox__btn lightbox__close" aria-label="Zamknij">&times;</button>' +
    '<button type="button" class="lightbox__btn lightbox__prev" aria-label="Poprzednie zdjęcie">&#8249;</button>' +
    '<img class="lightbox__img" alt="" draggable="false">' +
    '<button type="button" class="lightbox__btn lightbox__next" aria-label="Następne zdjęcie">&#8250;</button>' +
    '<div class="lightbox__count"></div>';
  document.body.appendChild(lightbox);
  const img = lightbox.querySelector('.lightbox__img');
  const count = lightbox.querySelector('.lightbox__count');
  let group = [], index = 0;

  const show = i => {
    index = (i + group.length) % group.length;
    const link = group[index];
    img.src = link.href;
    img.alt = link.querySelector('img').alt;
    count.textContent = (index + 1) + ' / ' + group.length;
  };
  const close = () => lightbox.classList.remove('open');

  lightboxLinks.forEach(link => link.addEventListener('click', e => {
    e.preventDefault();
    // przeglądamy zdjęcia z tej samej galerii (np. brwi, usta, opinie)
    const container = link.parentElement;
    group = [...container.querySelectorAll('[data-lightbox]')];
    lightbox.classList.toggle('is-single', group.length < 2);
    show(group.indexOf(link));
    lightbox.classList.add('open');
  }));

  lightbox.querySelector('.lightbox__close').addEventListener('click', close);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', () => show(index - 1));
  lightbox.querySelector('.lightbox__next').addEventListener('click', () => show(index + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  // przesuwanie: w lewo = następne, w prawo = poprzednie
  let startX = null, dx = 0;
  img.addEventListener('pointerdown', e => {
    startX = e.clientX; dx = 0;
    img.classList.add('is-dragging');
    img.setPointerCapture(e.pointerId);
  });
  img.addEventListener('pointermove', e => {
    if (startX === null) return;
    dx = e.clientX - startX;
    img.style.transform = 'translateX(' + dx + 'px)';
  });
  const endDrag = () => {
    if (startX === null) return;
    img.classList.remove('is-dragging');
    img.style.transform = '';
    if (group.length > 1 && Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
    startX = null;
  };
  img.addEventListener('pointerup', endDrag);
  img.addEventListener('pointercancel', endDrag);
}

// Opinie – strzałki przewijania paska na stronie głównej
document.querySelectorAll('.opinie-strip').forEach(strip => {
  // długie opinie są przycięte w pasku – oznacz je, żeby pokazać dopisek „przeczytaj całość”
  strip.querySelectorAll('.opinie-strip__track a').forEach(card => {
    const img = card.querySelector('img');
    const mark = () => card.classList.toggle('is-long', img.offsetHeight > card.clientHeight + 2);
    img.complete ? mark() : img.addEventListener('load', mark);
    window.addEventListener('resize', mark);
  });
  const track = strip.querySelector('.opinie-strip__track');
  const step = () => track.clientWidth * 0.8;
  strip.querySelector('.opinie-strip__arrow--prev').addEventListener('click', () => track.scrollBy({ left: -step() }));
  strip.querySelector('.opinie-strip__arrow--next').addEventListener('click', () => track.scrollBy({ left: step() }));
});

// Cennik – podświetlanie aktywnej kategorii w bocznym menu
const priceLinks = document.querySelectorAll('.pricing__nav a');
if (priceLinks.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      priceLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('.price-block').forEach(block => observer.observe(block));
}

// Popup
const popup = document.getElementById('popup');
document.querySelectorAll('[data-open-popup]').forEach(btn => btn.addEventListener('click', e => {
  e.preventDefault();
  popup.classList.add('open');
}));
popup.addEventListener('click', e => {
  if (e.target === popup || e.target.hasAttribute('data-close-popup')) popup.classList.remove('open');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') popup.classList.remove('open'); });
