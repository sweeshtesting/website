(function () {
  const D = window.GACHA_DATA;

  /* ---------- Genshin-style odds ----------
     5★: 0.6% base. From pull 74 the chance rises by 6% per pull; pull 90 is guaranteed.
     4★: 5.1% base. Pull 9 since the last 4★ is 56.1%; pull 10 is guaranteed.
     50/50: a 5★ is either a voice note or a loss (tomato or rickroll). After a loss, the next 5★ is always a voice note.
     The very first 5★ is always the rickroll, as a joke. */
  function chance5(n) { return n >= 90 ? 1 : n < 74 ? 0.006 : Math.min(1, 0.006 + 0.06 * (n - 73)); }
  function chance4(n) { return n >= 10 ? 1 : n === 9 ? 0.561 : 0.051; }

  const state = Object.assign({ pity5: 0, pity4: 0, guaranteed: false, total: 0, owned: {}, tomatoes: 0 }, Cozy.load('gacha', {}));
  const save = () => Cozy.save('gacha', state);

  const pool = {
    3: D.THREE_STAR.map((text, i) => ({ id: `3-${i}`, rarity: 3, n: i + 1, text })),
    4: D.FOUR_STAR.map((text, i) => ({ id: `4-${i}`, rarity: 4, n: i + 1, text })),
    5: D.VOICE_NOTES.map((v, i) => ({ id: `5-${i}`, rarity: 5, n: i + 1, voice: v }))
  };
  // 50/50 losses. Older saves counted tomatoes separately; move that count into `owned`.
  const FAILS = D.FAILS.map(f => ({ id: f.id, rarity: 5, fail: f }));
  if (state.tomatoes && !state.owned.tomato) state.owned.tomato = state.tomatoes;
  delete state.tomatoes;
  // The very first 5★ is always the rickroll (counts as a lost 50/50). Saves that already have a 5★ skip this.
  if (!state.got5) state.got5 = [...pool[5], ...FAILS].some(it => state.owned[it.id]);

  function pick(list) {
    // Prefer rewards you don't have yet, so the collection fills up.
    const fresh = list.filter(it => !state.owned[it.id]);
    const from = fresh.length ? fresh : list;
    return from[Math.floor(Math.random() * from.length)];
  }

  function pullOnce() {
    state.total++;
    const n5 = state.pity5 + 1, n4 = state.pity4 + 1;
    const r = Math.random();
    let item;
    if (r < chance5(n5)) {
      state.pity5 = 0; state.pity4 = n4;
      if (!state.got5) { state.got5 = true; state.guaranteed = true; item = FAILS.find(f => f.id === 'rickroll') || pick(FAILS); }
      else if (state.guaranteed || Math.random() < 0.5) { state.guaranteed = false; item = pick(pool[5]); }
      else { state.guaranteed = true; item = pick(FAILS); }
    } else if (Math.random() < chance4(n4)) {
      state.pity5 = n5; state.pity4 = 0; item = pick(pool[4]);
    } else {
      state.pity5 = n5; state.pity4 = n4; item = pick(pool[3]);
    }
    state.owned[item.id] = (state.owned[item.id] || 0) + 1;
    return item;
  }

  /* ---------- Views ---------- */
  const views = { banner: $('#v-banner'), rewards: $('#v-rewards'), inventory: $('#v-inventory') };
  function $(s) { return document.querySelector(s); }
  function show(name) {
    Object.entries(views).forEach(([k, el]) => el.classList.toggle('active', k === name));
    if (name === 'inventory') renderInventory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const star = '✦';
  const cardHTML = (it, locked) =>
    `<div class="card r${it.rarity}${locked ? ' locked' : ''}"><span class="star">${star}</span></div>`;

  /* ---------- Pulling ---------- */
  let lastPull = [];
  function warp(count) {
    lastPull = Array.from({ length: count }, pullOnce);
    save();
    const best = Math.max(...lastPull.map(i => i.rarity));
    flash(best);
    const grid = $('#reward-grid');
    grid.classList.toggle('single', count === 1);
    grid.innerHTML = lastPull.map((it, i) =>
      `<div class="reward-cell"><button class="card r${it.rarity} deal" data-i="${i}" style="animation-delay:${i * 90}ms" aria-label="Open reward ${i + 1}"><span class="star">${star}</span></button></div>`).join('');
    setTimeout(() => show('rewards'), best === 5 ? 650 : 250);
  }
  function flash(rarity) {
    const f = document.createElement('div');
    f.style.cssText = `position:fixed;inset:0;z-index:120;pointer-events:none;background:${rarity === 5 ? 'radial-gradient(circle,#ffe7a3,#e0b23a 60%,transparent)' : rarity === 4 ? 'radial-gradient(circle,rgba(242,200,92,.55),transparent 70%)' : 'radial-gradient(circle,rgba(255,255,255,.4),transparent 70%)'};animation:fadeout ${rarity === 5 ? 1.1 : .6}s ease forwards`;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1200);
  }
  const st = document.createElement('style');
  st.textContent = '@keyframes fadeout{from{opacity:1}to{opacity:0}}';
  document.head.appendChild(st);

  $('#warp1').addEventListener('click', () => warp(1));
  $('#warp10').addEventListener('click', () => warp(10));
  $('#to-inventory').addEventListener('click', () => show('inventory'));
  $('#to-banner').addEventListener('click', () => show('banner'));
  $('#back-gacha').addEventListener('click', () => show('banner'));
  $('#reward-grid').addEventListener('click', e => {
    const c = e.target.closest('.card'); if (!c) return;
    c.classList.add('seen');
    openNotes(lastPull, +c.dataset.i);
  });

  /* ---------- Inventory ---------- */
  let tier = 3, page = 0;
  const PER_PAGE = 12;
  function invItems() {
    const list = pool[tier].slice();
    if (tier === 5) list.push(...FAILS);
    return list;
  }
  function renderInventory() {
    document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.t === tier));
    const list = invItems();
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    page = Math.min(page, pages - 1);
    const slice = list.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
    $('#inv-grid').innerHTML = slice.map(it => {
      const have = state.owned[it.id];
      const name = !have ? 'Not unlocked' : it.fail ? `${it.fail.name} x${have}` : `${it.rarity === 5 ? 'Voice note' : 'Note'} #${it.n} x${have}`;
      return `<div class="inv-cell"><button class="card r${it.rarity}${have ? '' : ' locked'}" data-id="${it.id}" ${have ? '' : 'disabled'} aria-label="${name}"><span class="star">${star}</span></button><span class="cell-label">${name}</span></div>`;
    }).join('');
    $('#inv-page').textContent = `${page + 1} / ${pages}`;
    $('#inv-prev').disabled = page === 0;
    $('#inv-next').disabled = page >= pages - 1;
    const got = pool[tier].filter(it => state.owned[it.id]).length;
    $('#inv-stats').innerHTML = `${got} of ${pool[tier].length} collected · ${state.total} pulls · 5★ pity ${state.pity5}/90${state.guaranteed ? ' · next 5★ guaranteed' : ''}`;
  }
  document.querySelector('.tabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    tier = +b.dataset.t; page = 0; renderInventory();
  });
  $('#inv-prev').addEventListener('click', () => { page--; renderInventory(); });
  $('#inv-next').addEventListener('click', () => { page++; renderInventory(); });
  $('#inv-grid').addEventListener('click', e => {
    const c = e.target.closest('.card:not(.locked)'); if (!c) return;
    const owned = invItems().filter(it => state.owned[it.id]);
    openNotes(owned, owned.findIndex(it => it.id === c.dataset.id));
  });

  /* ---------- Note popup ---------- */
  const modal = $('#note-modal'), paper = $('#note-paper'), counter = $('#note-counter');
  const vAudio = new Audio();
  let notes = [], at = 0;
  function openNotes(list, i) {
    notes = list; at = i;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderNote();
  }
  function closeNotes() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    vAudio.pause();
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function renderNote() {
    vAudio.pause();
    const it = notes[at];
    paper.className = `note-paper r${it.rarity}`;
    void paper.offsetWidth; paper.classList.add('pop');
    const stars = star.repeat(it.rarity);
    if (it.fail) {
      const f = it.fail;
      paper.innerHTML = `<div class="stars">${stars}</div><img class="tomato" src="${esc(f.img)}" alt="${esc(f.alt || f.name)}"><div class="quote">${esc(f.text)}</div>`;
      // Some losses come with a song that loops until the note is closed.
      if (f.audio) { vAudio.src = f.audio; vAudio.loop = true; vAudio.onplay = vAudio.onpause = vAudio.onended = vAudio.onseeked = vAudio.onloadedmetadata = null; vAudio.play().catch(() => {}); }
    } else if (it.voice) {
      const v = it.voice;
      paper.innerHTML = `<div class="stars">${stars}</div>
        <p class="transcript">${(v.transcript || '').split(/(\s+)/).map((w, i) => i % 2 ? w : w && `<span class="w">${esc(w)}</span>`).join('')}</p>
        <div class="vn">
          <div class="seek"><div class="track"></div><div class="fill"></div><span class="t0">0:00</span><span class="t1">0:00</span></div>
          <button class="play-btn" aria-label="Play voice note" ${v.src ? '' : 'disabled style="opacity:.4"'}></button>
        </div>`;
      setupVoice(v);
    } else {
      // Long notes use the easier-to-read body font; fitText() then sizes it to the card.
      const long = it.text.length > 120;
      paper.innerHTML = `<div class="stars">${stars}</div><div class="quote${long ? ' long' : ''}">“${esc(it.text)}”</div>`;
    }
    const count = state.owned[it.id] || 0;
    if (count) paper.insertAdjacentHTML('beforeend', `<span class="qty">x${count}</span>`);
    fitText();
    counter.textContent = `${at + 1}/${notes.length}`;
    $('#note-prev').disabled = at === 0;
    $('#note-next').disabled = at === notes.length - 1;
  }
  // Biggest font size (in whole px) at which the note still fits on screen without scrolling.
  function fitText() {
    const q = paper.querySelector('.quote'); if (!q) return;
    const big = q.classList.contains('long') ? 26 : 48, small = q.classList.contains('long') ? 16 : 20;
    let size = window.innerWidth < 600 ? Math.round(big * .75) : big;
    q.style.fontSize = size + 'px';
    while (size > small && paper.scrollHeight > paper.clientHeight + 1) { size--; q.style.fontSize = size + 'px'; }
  }
  window.addEventListener('resize', () => { if (modal.classList.contains('open')) fitText(); });
  const fmt = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';
  function setupVoice(v) {
    const btn = paper.querySelector('.play-btn'), seek = paper.querySelector('.seek'), fill = seek.querySelector('.fill');
    const box = paper.querySelector('.transcript'), words = [...box.querySelectorAll('.w')];
    if (!v.src) return;
    vAudio.src = v.src; vAudio.loop = false;
    // Start time of each word. Falls back to spreading the words evenly if there are no timings.
    const times = v.times && v.times.length === words.length ? v.times : null;
    let lit = 0, lineTop = -1, raf = 0;
    const litAt = t => {
      if (!times) return Math.round(words.length * (t / vAudio.duration || 0));
      let n = 0; while (n < times.length && times[n] <= t + .08) n++; return n;
    };
    const paint = () => {
      const t = vAudio.currentTime;
      fill.style.width = (t / vAudio.duration || 0) * 100 + '%';
      seek.querySelector('.t0').textContent = fmt(t);
      seek.querySelector('.t1').textContent = fmt(vAudio.duration);
      const n = litAt(t);
      if (n !== lit) {
        const [lo, hi] = n > lit ? [lit, n] : [n, lit];
        for (let k = lo; k < hi; k++) words[k].classList.toggle('on', n > lit);
        if (words[lit - 1]) words[lit - 1].classList.remove('now');
        lit = n;
        const cur = words[Math.max(0, lit - 1)];
        if (lit) cur.classList.add('now');
        // Like synced lyrics: when speech moves to a new line, glide that line to the middle of the box.
        if (cur && cur.offsetTop !== lineTop) {
          lineTop = cur.offsetTop;
          box.scrollTo({ top: Math.max(0, lineTop - box.clientHeight * .4), behavior: 'smooth' });
        }
      }
      btn.classList.toggle('on', !vAudio.paused);
      // The box can't be scrolled by hand while the voice note is playing.
      box.classList.toggle('locked', !vAudio.paused && !vAudio.ended);
    };
    const loop = () => { paint(); if (!vAudio.paused) raf = requestAnimationFrame(loop); };
    vAudio.onplay = () => { cancelAnimationFrame(raf); loop(); };
    vAudio.onpause = vAudio.onended = vAudio.onseeked = vAudio.onloadedmetadata = paint;
    vAudio.ontimeupdate = null;
    btn.addEventListener('click', () => vAudio.paused ? vAudio.play() : vAudio.pause());
    seek.addEventListener('click', e => {
      const r = seek.getBoundingClientRect();
      if (vAudio.duration) vAudio.currentTime = (e.clientX - r.left) / r.width * vAudio.duration;
    });
  }
  $('#note-prev').addEventListener('click', () => { if (at > 0) { at--; renderNote(); } });
  $('#note-next').addEventListener('click', () => { if (at < notes.length - 1) { at++; renderNote(); } });
  $('#note-close').addEventListener('click', closeNotes);
  modal.addEventListener('click', e => { if (e.target === modal) closeNotes(); });
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeNotes();
    if (e.key === 'ArrowLeft') $('#note-prev').click();
    if (e.key === 'ArrowRight') $('#note-next').click();
  });

  show('banner');
})();
