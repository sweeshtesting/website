(function () {
  const FICS = window.FANFICS || [];
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const paras = t => String(t).split(/\n\s*\n/).map(p => `<p>${esc(p.trim())}</p>`).join('');

  /* AO3-style square: rating, category / warnings, status. */
  const RATING = { G: 'g', T: 't', M: 'm', E: 'e' };
  const CATEGORY = { 'M/M': ['mm', '♂'], 'F/F': ['ff', '♀'], 'F/M': ['fm', '⚥'], Gen: ['gen', '○'], Multi: ['multi', '⚥'], Other: ['other', '?'] };
  const WARNING = { none: ['none', ''], warnings: ['yes', '!'], chose: ['chose', '?'] };
  function badges(f) {
    const [cc, cs] = CATEGORY[f.category] || ['none', ''];
    const [wc, ws] = WARNING[f.warning] || WARNING.none;
    return `<div class="badges" aria-label="Rated ${esc(f.rating || '?')}, ${esc(f.category || 'no category')}, ${f.complete ? 'complete' : 'in progress'}">
        <span class="b-r-${RATING[f.rating] || 'none'}">${esc(f.rating || '')}</span>
        <span class="b-c-${cc}">${cs}</span>
        <span class="b-w-${wc}">${ws}</span>
        <span class="b-s-${f.complete ? 'done' : 'wip'}">${f.complete ? '✓' : '…'}</span>
      </div>`;
  }

  /* ---------- Works list ---------- */
  $('#works-count').textContent = `${FICS.length} found`;
  $('#works').innerHTML = FICS.map((f, i) => `
    <article class="work">
      ${badges(f)}
      <div>
        <h3><button data-i="${i}">${esc(f.title)}</button></h3>
        <div class="by">by <b>${esc(f.author)}</b></div>
        <div class="fandom">${esc(f.fandom)}</div>
        <div class="tags">${(f.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <p class="summary">${esc(f.summary)}</p>
      </div>
      <dl>
        <div><dt>Words</dt><dd>${esc(f.words)}</dd></div>
        <div><dt>Chapters</dt><dd>${esc(f.chapters)}</dd></div>
        <div><dt>Kudos</dt><dd>${esc(f.kudos)}</dd></div>
        <div><dt>Status</dt><dd>${f.complete ? 'Complete' : 'Ongoing'}</dd></div>
      </dl>
    </article>`).join('');

  /* ---------- Reader (a little book) ---------- */
  const reader = $('#reader'), book = $('#book'), count = $('#pg-count');
  let pages = [], at = 0;

  function open(i) {
    const f = FICS[i];
    const cover = `<h2>${esc(f.title)}</h2>
      <div class="meta">by ${esc(f.author)} · ${esc(f.fandom)} · Rated ${esc(f.rating)}</div>
      ${paras(f.about || f.summary)}
      ${f.url ? `<a class="btn read" href="${esc(f.url)}" target="_blank" rel="noopener">Read it ↗</a>` : ''}`;
    const body = (f.pages || []).map(p => paras(p));
    pages = [cover, ...body];
    book.innerHTML = pages.map((html, n) =>
      `<div class="page" style="z-index:${pages.length - n}">${html}<div class="pno">${n + 1}</div></div>`).join('');
    at = 0; update();
    reader.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    reader.classList.remove('open');
    document.body.style.overflow = '';
  }
  function update() {
    [...book.children].forEach((p, n) => p.classList.toggle('turned', n < at));
    count.textContent = `${at + 1} / ${pages.length}`;
    $('#pg-prev').disabled = at === 0;
    $('#pg-next').disabled = at >= pages.length - 1;
  }
  const go = d => { const n = at + d; if (n >= 0 && n < pages.length) { at = n; update(); } };

  $('#works').addEventListener('click', e => { const b = e.target.closest('h3 button'); if (b) open(+b.dataset.i); });
  $('#pg-prev').addEventListener('click', () => go(-1));
  $('#pg-next').addEventListener('click', () => go(1));
  reader.querySelector('.close').addEventListener('click', close);
  reader.addEventListener('click', e => { if (e.target === reader) close(); });
  document.addEventListener('keydown', e => {
    if (!reader.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
})();
