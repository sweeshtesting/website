(function () {
  const SONGS = [
    { mood: 'Yearning For You', title: 'Queen & Poet', artist: 'John Michael Howell', color: '#ef826e', src: 'assets/audio/queen-and-poet.mp3' },
    { mood: 'Beating the Bush For You', title: 'Confession Rehearsal', artist: 'HoneyWorks', color: '#edbd52', src: 'assets/audio/confession-rehearsal.mp3' },
    { mood: 'Falling For You', title: 'Like This', artist: 'Jake Scott', color: '#87aaa0', src: 'assets/audio/like-this.mp3' },
    { mood: 'Always Thinking About You', title: 'Elements', artist: 'John Michael Howell & ZVC', color: '#829dbd', src: 'assets/audio/elements.mp3' }
  ];
  const fmt = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';
  const grid = document.getElementById('tapes');
  grid.innerHTML = SONGS.map((s, i) => `
    <button class="tape reveal" data-i="${i}" style="--c:${s.color}" aria-label="Play ${s.title} by ${s.artist}">
      <span class="pin"></span><span class="string"></span>
      <span class="body">
        <span class="sticker" style="display:block">
          <span class="mood" style="display:block">${s.mood}</span>
          <span class="name" style="display:block">${s.title}</span>
          <span class="artist" style="display:block">${s.artist}</span>
        </span>
        <span class="reels"><span class="reel"></span><span class="reel"></span></span>
      </span>
      <span class="shelf"></span>
      <span class="meta"><span class="dur">–:––</span> · <span class="st">Select tape</span></span>
    </button>`).join('');
  const tapes = [...grid.querySelectorAll('.tape')];
  tapes.forEach(el => requestAnimationFrame(() => el.classList.add('in')));

  // Load each song's length for the label under the tape.
  SONGS.forEach((s, i) => {
    const a = new Audio(); a.preload = 'metadata'; a.src = s.src;
    a.addEventListener('loadedmetadata', () => { tapes[i].querySelector('.dur').textContent = fmt(a.duration); });
  });

  const audio = document.getElementById('audio');
  const player = document.getElementById('player');
  const playBtn = document.getElementById('p-play');
  const seek = document.getElementById('p-seek');
  const fill = seek.querySelector('.fill');
  let idx = 0;

  function load(i, autoplay) {
    idx = (i + SONGS.length) % SONGS.length;
    const s = SONGS[idx];
    audio.src = s.src;
    document.getElementById('p-title').textContent = s.title;
    document.getElementById('p-artist').textContent = s.artist;
    player.style.setProperty('--c', s.color);
    tapes.forEach((t, j) => t.querySelector('.st').textContent = j === idx ? 'Now playing' : 'Select tape');
    if (autoplay) audio.play().catch(() => {});
    sync();
  }
  function sync() {
    const on = !audio.paused;
    playBtn.classList.toggle('on', on);
    playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play');
    player.classList.toggle('playing', on);
    tapes.forEach((t, j) => t.classList.toggle('playing', on && j === idx));
  }
  grid.addEventListener('click', e => {
    const t = e.target.closest('.tape'); if (!t) return;
    const i = +t.dataset.i;
    if (i === idx && audio.src) { audio.paused ? audio.play() : audio.pause(); }
    else load(i, true);
  });
  playBtn.addEventListener('click', () => { audio.paused ? audio.play().catch(() => {}) : audio.pause(); });
  document.getElementById('p-prev').addEventListener('click', () => load(idx - 1, true));
  document.getElementById('p-next').addEventListener('click', () => load(idx + 1, true));
  audio.addEventListener('play', sync);
  audio.addEventListener('pause', sync);
  audio.addEventListener('ended', () => load(idx + 1, true));
  audio.addEventListener('timeupdate', () => {
    fill.style.width = (audio.currentTime / audio.duration * 100 || 0) + '%';
    seek.querySelector('.t0').textContent = fmt(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', () => { seek.querySelector('.t1').textContent = fmt(audio.duration); });
  function seekTo(clientX) {
    const r = seek.getBoundingClientRect();
    if (audio.duration) audio.currentTime = Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * audio.duration;
  }
  let dragging = false;
  seek.addEventListener('pointerdown', e => { dragging = true; seek.setPointerCapture(e.pointerId); seekTo(e.clientX); });
  seek.addEventListener('pointermove', e => { if (dragging) seekTo(e.clientX); });
  seek.addEventListener('pointerup', () => { dragging = false; });
  seek.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') audio.currentTime += 5;
    if (e.key === 'ArrowLeft') audio.currentTime -= 5;
  });
  load(0, false);
})();
