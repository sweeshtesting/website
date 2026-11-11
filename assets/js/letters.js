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

  // Zoom levels, relative to "fit": 100% shows the whole letter on screen.
  // Letters open at 175%, which is comfortable to read on a laptop or desktop.
  const LEVELS = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];
  const START = 3;
  let level = START;
  const zIn = document.getElementById('zoom-in'), zOut = document.getElementById('zoom-out'), zFit = document.getElementById('zoom-fit');
  function size() {
    if (!current) return;
    const ratio = current.landscape ? 1754 / 1241 : 1241 / 1754;
    const fit = Math.min(window.innerWidth * .94, window.innerWidth - 32, (window.innerHeight - 80) * ratio);
    // On phones the fitted letter is already as wide as the screen, so start there.
    const z = window.innerWidth <= 820 && level === START && !zoomed ? 1 : LEVELS[level];
    flip.style.aspectRatio = String(ratio);
    flip.style.width = Math.round(fit * z) + 'px';
    flip.style.height = 'auto';
    zFit.textContent = Math.round(z * 100) + '%';
    zOut.disabled = z <= LEVELS[0]; zIn.disabled = level >= LEVELS.length - 1;
  }
  let zoomed = false;
  function setLevel(n) {
    // Keep the same spot of the letter in the middle of the screen while zooming.
    const cx = (viewer.scrollLeft + viewer.clientWidth / 2) / viewer.scrollWidth;
    const cy = (viewer.scrollTop + viewer.clientHeight / 2) / viewer.scrollHeight;
    const z = window.innerWidth <= 820 && level === START && !zoomed ? 0 : level;
    zoomed = true;
    level = Math.max(0, Math.min(LEVELS.length - 1, n === 'in' ? z + 1 : n === 'out' ? z - 1 : n));
    size();
    viewer.scrollLeft = cx * viewer.scrollWidth - viewer.clientWidth / 2;
    viewer.scrollTop = cy * viewer.scrollHeight - viewer.clientHeight / 2;
  }
  function open(i) {
    current = LETTERS[i];
    front.src = `assets/letters/letter${current.n}-front.webp`;
    back.src = `assets/letters/letter${current.n}-back.webp`;
    front.alt = `Letter ${current.n}, front`; back.alt = `Letter ${current.n}, back`;
    flip.classList.remove('flipped');
    level = START; zoomed = false;
    size();
    viewer.classList.add('open');
    viewer.scrollTop = 0; viewer.scrollLeft = 0;
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
  document.addEventListener('keydown', e => {
    if (!viewer.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === '+' || e.key === '=') setLevel('in');
    if (e.key === '-' || e.key === '_') setLevel('out');
  });
  window.addEventListener('resize', size);
  zIn.addEventListener('click', () => setLevel('in'));
  zOut.addEventListener('click', () => setLevel('out'));
  zFit.addEventListener('click', () => setLevel(0));
})();
