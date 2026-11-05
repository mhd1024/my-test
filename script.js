(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- theme ---------- */
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
  $('#themeToggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- silk background (flowing light ribbons) ---------- */
  const cv = $('#silk'), cx = cv.getContext('2d');
  let W, H, DPR;
  const ribbons = [
    { y: .10, amp: .10, f: 1.3, sp: .00012, w: 140, hue: 228, a: .32, ph: 0 },
    { y: .32, amp: .14, f: 0.9, sp: .00009, w: 220, hue: 250, a: .20, ph: 2 },
    { y: .62, amp: .12, f: 1.1, sp: .00011, w: 160, hue: 235, a: .26, ph: 4 },
    { y: .88, amp: .10, f: 1.5, sp: .00008, w: 200, hue: 262, a: .22, ph: 1 },
  ];
  function size() {
    DPR = Math.min(devicePixelRatio || 1, 1.5);
    W = cv.width = innerWidth * DPR * .6;
    H = cv.height = innerHeight * DPR * .6;
  }
  function drawSilk(t) {
    const light = root.dataset.theme === 'light';
    cx.clearRect(0, 0, W, H);
    cx.globalCompositeOperation = light ? 'multiply' : 'lighter';
    for (const r of ribbons) {
      for (let k = 0; k < 7; k++) {
        cx.beginPath();
        const off = k * r.w * .06 * (W / 900);
        for (let x = -20; x <= W + 20; x += 18) {
          const u = x / W;
          const y = H * r.y + off +
            Math.sin(u * Math.PI * r.f * 2 + t * r.sp * 6 + r.ph + k * .12) * H * r.amp +
            Math.sin(u * Math.PI * 3.1 - t * r.sp * 4 + r.ph) * H * r.amp * .35;
          x < 0 ? cx.moveTo(x, y) : cx.lineTo(x, y);
        }
        const g = cx.createLinearGradient(0, 0, W, 0);
        const a = r.a * (1 - k / 8) * (light ? .5 : 1);
        g.addColorStop(0, `hsla(${r.hue},90%,70%,0)`);
        g.addColorStop(.35, `hsla(${r.hue},95%,72%,${a})`);
        g.addColorStop(.7, `hsla(${r.hue + 18},90%,78%,${a * .7})`);
        g.addColorStop(1, `hsla(${r.hue},90%,70%,0)`);
        cx.strokeStyle = g;
        cx.lineWidth = (k === 0 ? 1.4 : .8) * DPR;
        cx.shadowColor = `hsla(${r.hue},100%,70%,.9)`;
        cx.shadowBlur = k === 0 ? 18 : 0;
        cx.stroke();
      }
    }
    cx.shadowBlur = 0;
  }
  size(); addEventListener('resize', size);
  let last = 0;
  function loop(t) {
    if (t - last > 33) { drawSilk(t); last = t; }
    if (!document.hidden) requestAnimationFrame(loop); else setTimeout(() => requestAnimationFrame(loop), 500);
  }
  reduce ? drawSilk(0) : requestAnimationFrame(loop);

  /* ---------- dynamic specular highlight on glass ---------- */
  addEventListener('pointermove', e => {
    for (const el of $$('.glass')) {
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top - 300 || e.clientY > r.bottom + 300) continue;
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }
  }, { passive: true });

  /* ---------- liquid nav pill + tab blob + scroll spy ---------- */
  const navLinks = $$('.nav a'), pill = $('.nav-pill');
  const tabLinks = $$('.tabbar a'), blob = $('.tab-blob');
  function setActive(id) {
    navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + id));
    tabLinks.forEach((a, i) => {
      const on = a.hash === '#' + id;
      if (on && !a.classList.contains('active')) {
        blob.style.transform = `translateX(${i * 100}%)`;
        blob.classList.remove('squish'); void blob.offsetWidth; blob.classList.add('squish');
      }
      a.classList.toggle('active', on);
    });
    movePill();
  }
  function movePill() {
    const a = $('.nav a.active'); if (!a || !a.offsetWidth) return;
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  addEventListener('resize', movePill);
  document.fonts?.ready.then(movePill); movePill();

  const sections = ['beranda', 'proyek', 'tentang', 'kontak'].map(id => document.getElementById(id));
  function spy() {
    $('.topbar').classList.toggle('scrolled', scrollY > 20);
    const mid = innerHeight * .45;
    let cur = 'beranda';
    // order on page: beranda, tentang, proyek, kontak
    for (const s of [...sections].sort((a, b) => a.offsetTop - b.offsetTop)) {
      if (s.getBoundingClientRect().top < mid) cur = s.id;
    }
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) cur = 'kontak';
    setActive(cur);
  }
  addEventListener('scroll', spy, { passive: true }); spy();

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(el); });

  /* ---------- segmented control filter ---------- */
  const seg = $('.segmented'), thumb = $('.seg-thumb');
  function moveThumb() {
    const b = $('[aria-selected="true"]', seg);
    thumb.style.width = b.offsetWidth + 'px';
    thumb.style.transform = `translateX(${b.offsetLeft}px)`;
  }
  $$('button', seg).forEach(b => b.addEventListener('click', () => {
    $$('button', seg).forEach(x => x.setAttribute('aria-selected', x === b));
    moveThumb();
    const f = b.dataset.filter;
    $$('.card').forEach(c => c.classList.toggle('dim', f !== 'all' && !c.dataset.tags.includes(f)));
  }));
  moveThumb(); addEventListener('resize', moveThumb); document.fonts?.ready.then(moveThumb);

  /* ---------- waveform art ---------- */
  const wc = $('canvas.wave'), wx = wc.getContext('2d');
  function wave(t) {
    const w = wc.width = wc.offsetWidth * 2, h = wc.height = wc.offsetHeight * 2;
    wx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 18; k++) {
      wx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const u = x / w;
        const env = Math.exp(-Math.pow((u - .55) * 3.2, 2));
        const y = h * .62 - env * h * .45 * (Math.sin(u * 22 + t * .0012 + k * .18) * .5 + .5) * (1 - k * .03) - k * 1.5;
        x ? wx.lineTo(x, y) : wx.moveTo(x, y);
      }
      wx.strokeStyle = `hsla(${225 + k * 3},95%,${60 + k}%,${.5 - k * .022})`;
      wx.lineWidth = 1.6; wx.stroke();
    }
    if (!reduce) requestAnimationFrame(wave);
  }
  requestAnimationFrame(wave);

  /* ---------- sheet ---------- */
  const sheet = $('#sheet'), back = $('#sheetBackdrop');
  let lastFocus;
  function openSheet() {
    lastFocus = document.activeElement;
    sheet.hidden = back.hidden = false;
    requestAnimationFrame(() => { sheet.classList.add('open'); back.classList.add('open'); });
    setTimeout(() => $('input', sheet).focus(), 350);
  }
  function closeSheet() {
    sheet.classList.remove('open'); back.classList.remove('open');
    setTimeout(() => { sheet.hidden = back.hidden = true; lastFocus?.focus(); }, 450);
  }
  $$('[data-open-sheet]').forEach(b => b.addEventListener('click', openSheet));
  $$('[data-close-sheet]').forEach(b => b.addEventListener('click', closeSheet));
  back.addEventListener('click', closeSheet);
  addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

  const dur = $('#dur'), out = $('#durOut');
  const upd = () => { out.textContent = dur.value + ' minggu'; dur.style.setProperty('--p', ((dur.value - 1) / 11 * 100) + '%'); };
  dur.addEventListener('input', upd); upd();

  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(e.target);
    const body = `${d.get('msg')}\n\nKolaborasi: ${d.get('collab') ? 'Ya' : 'Tidak'}\nPerkiraan durasi: ${d.get('dur')} minggu\n\n— ${d.get('name')}`;
    location.href = `mailto:mochamad.ramdhan@example.com?subject=${encodeURIComponent('Halo dari ' + d.get('name'))}&body=${encodeURIComponent(body)}`;
    closeSheet();
  });
})();
