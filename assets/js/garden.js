(function () {
  const GROW_MS = 15000;
  const SEEDS = [
    { id: 'tomato', name: 'Tomato', img: 'assets/img/plants/tomato.webp' },
    { id: 'lily', name: 'Lily', img: 'assets/img/plants/lily.webp' },
    { id: 'orchid', name: 'Orchid', img: 'assets/img/plants/orchid.png' },
    { id: 'mushroom', name: 'Mushroom', img: 'assets/img/plants/mushroom.png' }
  ];
  // Every file in assets/img/stickers. Add new sticker files here.
  const STICKERS = ['20c94.webp','3bfe1.svg','48444.webp','4b76c.webp','4cad0.webp','6090a.webp','62311.webp','65404.png','70b88.png','713d4.png','8062f.png','8b938.webp','a7a1e.png','a7ba8.webp','b4da8.png','b76eb.png','ba1a0.webp','c2f39.png','c72ef.png','c9eb7.webp','e3770.png','f6345.png','f841b.webp','f8a2b.png','fox-a.webp','fox-b.webp','sheet1.png','sheet2.png','sheet3.png','sheet4.png','sheet5.png','sheet6.png','sheet7.png'].map(f => 'assets/img/stickers/' + f);

  const $ = s => document.querySelector(s);
  const state = Object.assign({ seed: 'tomato', beds: Array(9).fill(null), stickers: [] }, Cozy.load('garden', {}));
  if (!Array.isArray(state.beds) || state.beds.length !== 9) state.beds = Array(9).fill(null);
  const save = () => Cozy.save('garden', state);
  const seedOf = id => SEEDS.find(s => s.id === id) || SEEDS[0];

  /* ---------- Seed cabinet ---------- */
  const seedsEl = $('#seeds');
  function renderSeeds() {
    seedsEl.innerHTML = SEEDS.map(s => `<button class="seed" data-id="${s.id}" aria-pressed="${s.id === state.seed}">
      <img src="${s.img}" alt=""><span><span class="nm">${s.name}</span><br><span class="tm">15 seconds</span></span>
      <span class="st">${s.id === state.seed ? 'Selected' : 'Choose'}</span></button>`).join('');
  }
  seedsEl.addEventListener('click', e => {
    const b = e.target.closest('.seed'); if (!b) return;
    state.seed = b.dataset.id; save(); renderSeeds();
  });

  /* ---------- Garden beds ---------- */
  const plot = $('#plot');
  plot.innerHTML = state.beds.map((_, i) => `<button class="bed" data-i="${i}"><span class="lbl">Plant</span></button>`).join('');
  const beds = [...plot.children];

  function renderBed(i) {
    const b = beds[i], d = state.beds[i];
    const phase = !d ? 'empty' : Date.now() - d.t >= GROW_MS ? 'ready' : 'growing';
    if (b.dataset.phase === phase && b.dataset.seed === (d && d.seed)) return;
    b.dataset.phase = phase; b.dataset.seed = d ? d.seed : '';
    b.className = 'bed' + (phase === 'empty' ? '' : ' ' + phase);
    if (phase === 'empty') { b.innerHTML = '<span class="lbl">Plant</span>'; b.setAttribute('aria-label', 'Empty bed, plant a seed'); return; }
    const s = seedOf(d.seed);
    b.innerHTML = `<img src="${s.img}" alt=""><span class="lbl">${phase === 'ready' ? 'Harvest' : 'Growing...'}</span>${phase === 'growing' ? '<span class="bar"><i></i></span>' : ''}`;
    b.setAttribute('aria-label', phase === 'ready' ? `Harvest ${s.name}` : `${s.name} is growing`);
    // Resume the grow animation where it left off after a reload.
    const img = b.querySelector('img');
    if (phase === 'growing') img.style.animationDelay = `-${Date.now() - d.t}ms`;
  }
  function tick() {
    state.beds.forEach((d, i) => {
      renderBed(i);
      const bar = beds[i].querySelector('.bar i');
      if (bar && d) bar.style.width = Math.min(100, (Date.now() - d.t) / GROW_MS * 100) + '%';
    });
  }
  plot.addEventListener('click', e => {
    const b = e.target.closest('.bed'); if (!b) return;
    const i = +b.dataset.i, d = state.beds[i];
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    if (!d) { state.beds[i] = { seed: state.seed, t: Date.now() }; save(); tick(); return; }
    if (Date.now() - d.t >= GROW_MS) harvest(i);
  });

  /* ---------- Sticker board ---------- */
  const board = $('#board'), empty = $('#board-empty');
  const TOP = 0.15; // keep the heading clear
  // Sticker size in pixels for the board's current width.
  const sizeFor = W => Math.max(56, W * 0.09);

  function placeSticker() {
    const W = board.clientWidth, H = board.clientHeight, s = sizeFor(W), r = s * 0.5;
    const minX = r + 6, maxX = W - r - 6, minY = H * TOP + r, maxY = H - r - 6;
    const others = state.stickers.map(k => ({ x: k.x * W, y: k.y * H }));
    let spot = null;
    // Try random spots that don't touch any other sticker. If none is left, the board is full and overlap is allowed.
    for (let n = 0; n < 600 && !spot; n++) {
      const x = minX + Math.random() * (maxX - minX), y = minY + Math.random() * (maxY - minY);
      if (others.every(o => Math.hypot(o.x - x, o.y - y) >= s * 1.02)) spot = { x, y };
    }
    if (!spot) spot = { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * (maxY - minY) };
    return {
      src: STICKERS[Math.floor(Math.random() * STICKERS.length)],
      x: spot.x / W, y: spot.y / H,
      r: Math.round(Math.random() * 70 - 35) // never close to upside down
    };
  }
  function stickerEl(k, fresh) {
    const el = document.createElement('div');
    const s = sizeFor(board.clientWidth);
    el.className = 'stuck' + (fresh ? ' new' : '');
    el.style.cssText = `left:${k.x * 100}%;top:${k.y * 100}%;width:${s}px;height:${s}px;--r:${k.r}deg;--m:url('${k.src}')`;
    el.innerHTML = `<img src="${k.src}" alt="">${fresh ? '<span class="gleam"></span>' : ''}`;
    return el;
  }
  function renderBoard() {
    board.querySelectorAll('.stuck').forEach(e => e.remove());
    state.stickers.forEach(k => board.appendChild(stickerEl(k, false)));
    empty.hidden = state.stickers.length > 0;
  }
  function sparkles(k) {
    for (let n = 0; n < 8; n++) {
      const sp = document.createElement('span');
      const a = n / 8 * Math.PI * 2, d = 50 + Math.random() * 30;
      sp.className = 'sparkle'; sp.textContent = '✦';
      sp.style.cssText = `left:${k.x * 100}%;top:${k.y * 100}%;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;margin:-9px 0 0 -6px`;
      board.appendChild(sp);
      setTimeout(() => sp.remove(), 1700);
    }
  }

  function harvest(i) {
    const bed = beds[i], img = bed.querySelector('img');
    const k = placeSticker();
    state.beds[i] = null; state.stickers.push(k); save();
    // The plant hops up out of the bed...
    if (img) {
      const r = img.getBoundingClientRect(), fly = document.createElement('img');
      fly.src = img.src; fly.className = 'flying';
      fly.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;opacity:1`;
      document.body.appendChild(fly);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        fly.style.top = `${r.top - 120}px`; fly.style.opacity = '0'; fly.style.transform = 'scale(.4) rotate(20deg)';
      }));
      setTimeout(() => fly.remove(), 900);
    }
    tick();
    // ...then we glide down to the board and the sticker slaps on with a shine.
    board.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      empty.hidden = true;
      const el = stickerEl(k, true);
      board.appendChild(el);
      sparkles(k);
      setTimeout(() => { el.classList.remove('new'); const g = el.querySelector('.gleam'); if (g) g.remove(); }, 2000);
    }, 750);
  }

  renderSeeds();
  tick();
  renderBoard();
  setInterval(tick, 200);
  let rw; window.addEventListener('resize', () => { clearTimeout(rw); rw = setTimeout(renderBoard, 200); });
})();
