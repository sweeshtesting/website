/* Shared helpers: passcode gate, per-passcode storage, header/footer. */
(function () {
  // SHA-256 hashes of the allowed passcodes (so the codes aren't readable in the source).
  const ALLOWED = [
    '91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203', // 000000 (testing)
    '628620393dac3f8553d7c9fd6132fcd329f56407af25564ba9d5bf4cc8e20857', // 121105
    '8c83f760edfb261c749cda6a5372bdd9223a8e2e52df026d0237deb63683ab56'  // 121104
  ];
  const KEY = 'cozy.code';

  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', bytes);
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return sha256Plain(bytes); // crypto.subtle only exists on https pages
  }

  // Plain-JS SHA-256, used when the page is opened over http.
  function sha256Plain(bytes) {
    const K = [], H = [];
    let n = 2, found = 0;
    const frac = x => ((x - Math.floor(x)) * 4294967296) >>> 0;
    while (found < 64) {
      let prime = true;
      for (let d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break; }
      if (prime) { if (found < 8) H[found] = frac(Math.sqrt(n)); K[found++] = frac(Math.cbrt(n)); }
      n++;
    }
    const len = bytes.length, total = ((len + 9 + 63) >> 6) << 6;
    const m = new Uint8Array(total);
    m.set(bytes); m[len] = 0x80;
    const bits = len * 8;
    m[total - 4] = bits >>> 24; m[total - 3] = bits >>> 16; m[total - 2] = bits >>> 8; m[total - 1] = bits;
    const w = new Uint32Array(64), rot = (x, r) => (x >>> r) | (x << (32 - r));
    for (let o = 0; o < total; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = (m[o + i * 4] << 24) | (m[o + i * 4 + 1] << 16) | (m[o + i * 4 + 2] << 8) | m[o + i * 4 + 3];
      for (let i = 16; i < 64; i++) {
        const s0 = rot(w[i - 15], 7) ^ rot(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rot(w[i - 2], 17) ^ rot(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (rot(e, 6) ^ rot(e, 11) ^ rot(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        const t2 = ((rot(a, 2) ^ rot(a, 13) ^ rot(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    return H.map(x => x.toString(16).padStart(8, '0')).join('');
  }

  function getCode() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  const Cozy = {
    async checkCode(code) {
      const h = await sha256(code);
      return ALLOWED.includes(h);
    },
    login(code) {
      try { localStorage.setItem(KEY, code); } catch (e) {}
    },
    logout() {
      try { localStorage.removeItem(KEY); } catch (e) {}
      location.href = 'index.html';
    },
    code: getCode,
    // Saved data is kept separately for each passcode.
    load(name, fallback) {
      try {
        const raw = localStorage.getItem(`cozy.${getCode()}.${name}`);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    },
    save(name, value) {
      try { localStorage.setItem(`cozy.${getCode()}.${name}`, JSON.stringify(value)); } catch (e) {}
    }
  };
  window.Cozy = Cozy;

  // Every page except the check-in page needs a valid passcode.
  const isCheckIn = document.body.dataset.page === 'checkin';
  if (!isCheckIn) {
    const code = getCode();
    if (!code) { location.replace('index.html'); return; }
    Cozy.checkCode(code).then(ok => { if (!ok) Cozy.logout(); });
    document.documentElement.classList.add('authed');
  }

  // Scale the 1280px-wide design to fill the window (the CSS switches to a phone layout at 820px and below).
  // Largest zoom of the 1280px design. Raise it to make wide screens look bigger, lower it for smaller.
  const MAX_SCALE = 1.1;
  function fitDesign() {
    const w = document.documentElement.clientWidth;
    const st = document.documentElement.style;
    if (w > 820) {
      const u = Math.min(MAX_SCALE, Math.max(0.62, w / 1280));
      st.setProperty('--u', u + 'px');
      st.setProperty('--off', Math.max(0, (w - 1280 * u) / 2) + 'px');
      st.setProperty('--vw', w / 1280 + 'px');
    } else ['--u', '--off', '--vw'].forEach(k => st.removeProperty(k));
  }
  fitDesign();
  window.addEventListener('resize', fitDesign);

  // Header + footer markup, shared by all pages.
  const page = document.body.dataset.page;
  const links = [
    ['letters', 'letters.html', 'Letters'],
    ['music', 'music.html', 'Music'],
    ['gacha', 'gacha.html', 'Gacha'],
    ['garden', 'garden.html', 'Farm'],
    ['fanfics', 'fanfics.html', 'Fanfics']
  ];
  const header = document.querySelector('[data-header]');
  if (header) {
    header.innerHTML = `
      <a class="logo" href="home.html" aria-label="Home"><img src="assets/img/flower-c.webp" alt=""></a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav>${links.map(([id, href, label]) =>
        `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('')}<button class="logout in-menu">Log out</button></nav>
      <button class="logout">Log out</button>`;
    // Logging out forgets the passcode on this device and goes back to the lock screen.
    header.querySelectorAll('.logout').forEach(b => b.addEventListener('click', () => Cozy.logout()));
    const toggle = header.querySelector('.nav-toggle');
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }
  const footer = document.querySelector('[data-footer]');
  if (footer) {
    const star = footer.dataset.footer === 'star';
    footer.innerHTML = `
      ${star ? '<div class="footer-star">✦</div>' : '<img class="footer-flower" src="assets/img/flower-c.webp" alt="">'}
      <p>${footer.dataset.text || 'THAT’S ALL FOR NOW!'}</p>
      ${footer.dataset.noTop !== undefined ? '' : `<button class="back-top${star ? ' underlined' : ''}">${footer.dataset.top || 'BACK TO TOP ↑'}</button>`}`;
    const btn = footer.querySelector('.back-top');
    if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Fade sections in as they scroll into view.
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 }) : null;
  document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));
})();
