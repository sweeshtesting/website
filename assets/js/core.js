/* Shared helpers: passcode gate, per-passcode storage, header/footer. */
(function () {
  // SHA-256 hashes of the allowed passcodes (so the codes aren't readable in the source).
  const ALLOWED = [
    '91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203', // 000000 (testing)
    '628620393dac3f8553d7c9fd6132fcd329f56407af25564ba9d5bf4cc8e20857'  // 121105
  ];
  const KEY = 'cozy.code';

  async function sha256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
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
  function fitDesign() {
    const w = document.documentElement.clientWidth;
    if (w > 820) document.documentElement.style.setProperty('--u', Math.max(0.62, w / 1280) + 'px');
    else document.documentElement.style.removeProperty('--u');
  }
  fitDesign();
  window.addEventListener('resize', fitDesign);

  // Header + footer markup, shared by all pages.
  const page = document.body.dataset.page;
  const links = [
    ['letters', 'letters.html', 'Letters'],
    ['music', 'music.html', 'Music'],
    ['gacha', 'gacha.html', 'Gaccha'],
    ['garden', 'garden.html', 'Farm'],
    ['fanfics', 'fanfics.html', 'Fanfics']
  ];
  const header = document.querySelector('[data-header]');
  if (header) {
    header.innerHTML = `
      <a class="logo" href="home.html" aria-label="Home"><img src="assets/img/flower-c.webp" alt=""></a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav>${links.map(([id, href, label]) =>
        `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
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
