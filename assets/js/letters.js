(function () {
  const LETTERS = [
    { n: 1, title: 'DayDream', landscape: false },
    { n: 2, title: 'A world full of colour', landscape: false },
    { n: 3, title: 'Everlasting flower', landscape: true },
    { n: 4, title: 'Distance', landscape: false }
  ];
  const grid = document.getElementById('letters');
  grid.innerHTML = LETTERS.map((l, i) => `
    <button class="letter-card reveal" data-i="${i}">
      <span class="thumb"><img class="${l.landscape ? 'landscape' : ''}" src="assets/letters/letter${l.n}-front.webp" alt="Letter ${l.n}: ${l.title}" loading="lazy"></span>
      <h3>#${l.n} - ${l.title}</h3>
    </button>`).join('');
  grid.querySelectorAll('.reveal').forEach(el => requestAnimationFrame(() => el.classList.add('in')));

  const viewer = document.getElementById('viewer');
  const flip = document.getElementById('flip');
  const [front, back] = flip.querySelectorAll('img');
  let current = null;

  // Normal view: wide enough to read comfortably (taller letters scroll).
  // Zoomed out: the whole letter fits on screen. The Zoom button switches between them.
  let zoomedOut = false;
  const zoom = document.getElementById('zoom');
  function size() {
    if (!current) return;
    const ratio = current.landscape ? 1754 / 1241 : 1241 / 1754;
    flip.style.aspectRatio = String(ratio);
    flip.style.width = zoomedOut ? `min(94vw, calc((100vh - 80px) * ${ratio}))`
      : current.landscape ? 'min(94vw, 1200px)' : 'min(94vw, 760px)';
    zoom.textContent = zoomedOut ? '+ Zoom in' : '− Zoom out';
    zoom.setAttribute('aria-pressed', zoomedOut);
    flip.style.height = 'auto';
  }
  function open(i) {
    current = LETTERS[i];
    front.src = `assets/letters/letter${current.n}-front.webp`;
    back.src = `assets/letters/letter${current.n}-back.webp`;
    front.alt = `Letter ${current.n}, front`; back.alt = `Letter ${current.n}, back`;
    flip.classList.remove('flipped');
    size();
    viewer.classList.add('open');
    viewer.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    flip.focus({ preventScroll: true });
  }
  function close() {
    viewer.classList.remove('open');
    document.body.style.overflow = '';
  }
  grid.addEventListener('click', e => {
    const card = e.target.closest('.letter-card');
    if (card) open(+card.dataset.i);
  });
  flip.addEventListener('click', () => flip.classList.toggle('flipped'));
  flip.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip.classList.toggle('flipped'); } });
  viewer.querySelector('.close').addEventListener('click', close);
  viewer.addEventListener('click', e => { if (e.target === viewer) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', size);
  zoom.addEventListener('click', () => { zoomedOut = !zoomedOut; size(); viewer.scrollTop = 0; });
})();
