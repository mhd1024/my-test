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

  /* ---------- real liquid-glass refraction (Chromium) ----------
     For every .glass element we build a displacement map shaped like
     its rounded rectangle: neutral in the middle, bending light inward
     along a convex bezel at the edge — like looking through thick glass.
     The three colour channels are displaced by slightly different amounts
     for a subtle chromatic dispersion. Other browsers keep the CSS blur. */
  // Chromium (Chrome, Edge, Opera, Samsung, Android) — not iOS browsers, which are all WebKit
  const isChromium = /Chrome\//.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS|Firefox/.test(navigator.userAgent);
  if (isChromium) {
    root.classList.add('lg');
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', 0); svg.setAttribute('height', 0);
    svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
    document.body.prepend(svg);
    const cache = new Map(); let uid = 0;

    function makeMap(w, h, r, bezel) {
      const S = 1;                                     // map resolution (css px)
      const cw = Math.max(2, Math.round(w * S)), ch = Math.max(2, Math.round(h * S));
      const c = document.createElement('canvas'); c.width = cw; c.height = ch;
      const g = c.getContext('2d'), img = g.createImageData(cw, ch), d = img.data;
      const hx = w / 2, hy = h / 2, ix = hx - r, iy = hy - r;
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        const px = (x + .5) / S - hx, py = (y + .5) / S - hy;
        const qx = Math.abs(px) - ix, qy = Math.abs(py) - iy;
        let dist, nx, ny;                               // dist: depth inside edge; n: outward normal
        if (qx > 0 && qy > 0) {
          const l = Math.hypot(qx, qy) || 1; dist = r - l; nx = qx / l; ny = qy / l;
        } else if (qx > qy) { dist = r - qx; nx = 1; ny = 0; }
        else { dist = r - qy; nx = 0; ny = 1; }
        nx *= Math.sign(px) || 1; ny *= Math.sign(py) || 1;
        let m = 0;
        if (dist < bezel) { const t = Math.max(0, dist) / bezel; m = Math.pow(1 - t, 2.4); }   // convex bezel
        const i = (y * cw + x) * 4;
        d[i] = 128 - nx * m * 127; d[i + 1] = 128 - ny * m * 127; d[i + 2] = 128; d[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      return c.toDataURL();
    }

    function filterFor(el) {
      const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
      if (!w || !h) return null;
      const cs = getComputedStyle(el);
      const r = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, w / 2, h / 2);
      const frost = parseFloat(cs.getPropertyValue('--frost')) || 3;
      const small = Math.min(w, h) < 70;
      const bezel = Math.min(small ? Math.min(w, h) * .42 : 30, r + 6, Math.min(w, h) / 2);
      const scale = small ? 26 : 46;
      const key = [w, h, r, frost].join('x');
      if (cache.has(key)) return cache.get(key);
      const id = 'lgf' + (uid++);
      const f = document.createElementNS(NS, 'filter');
      f.id = id;
      for (const [k, v] of Object.entries({ x: 0, y: 0, width: w, height: h, filterUnits: 'userSpaceOnUse', primitiveUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB' })) f.setAttribute(k, v);
      f.innerHTML = `
        <feImage href="${makeMap(w, h, r, bezel)}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="${frost}" edgeMode="duplicate" result="b"/>
        <feDisplacementMap in="b" in2="map" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="dR"/>
        <feDisplacementMap in="b" in2="map" scale="${scale * .93}" xChannelSelector="R" yChannelSelector="G" result="dG"/>
        <feDisplacementMap in="b" in2="map" scale="${scale * .86}" xChannelSelector="R" yChannelSelector="G" result="dB"/>
        <feColorMatrix in="dR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cR"/>
        <feColorMatrix in="dG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="cG"/>
        <feColorMatrix in="dB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cB"/>
        <feComposite in="cR" in2="cG" operator="arithmetic" k2="1" k3="1" result="rg"/>
        <feComposite in="rg" in2="cB" operator="arithmetic" k2="1" k3="1"/>`;
      svg.appendChild(f);
      cache.set(key, id);
      return id;
    }

    function applyGlass() {
      for (const el of $$('.glass')) {
        if (el.closest('[hidden]') || el.classList.contains('chip')) continue;
        const id = filterFor(el); if (!id) continue;
        const v = `url(#${id}) saturate(1.7) brightness(1.08)`;
        el.style.backdropFilter = v; el.style.webkitBackdropFilter = v;
      }
    }
    window.__applyGlass = applyGlass;
    (document.fonts?.ready || Promise.resolve()).then(applyGlass);
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(applyGlass, 200); });
  }

  /* ---------- dynamic specular highlight on glass ---------- */
  addEventListener('pointermove', e => {
    for (const el of $$('.glass')) {
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top - 300 || e.clientY > r.bottom + 300) continue;
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }
  }, { passive: true });

  /* ---------- liquid selector (iOS 26 style) ----------
     Shared behaviour for every horizontal choice group (tab bar, top nav,
     segmented filter):
       press   → the indicator swells into a lens over the finger and the
                 items beneath it are magnified;
       drag    → the lens follows the finger, stretching with speed, and
                 the item under it lights up;
       release → it springs onto the nearest item and activates it.
     A plain tap still behaves like a normal click. */
  function liquidSelect(root, indicator, items, isActive) {
    indicator.classList.add('liq-ind');
    root.classList.add('liq');
    items().forEach(it => { it.draggable = false; });
    let x = 0, w = 0;
    const place = (nx, nw) => {
      x = nx; w = nw;
      indicator.style.left = '0px';
      indicator.style.width = nw + 'px';
      indicator.style.transform = `translateX(${nx}px)`;
    };
    const active = () => items().find(isActive) || items()[0];
    const sync = () => { const a = active(); if (a && a.offsetWidth) place(a.offsetLeft, a.offsetWidth); };

    const local = cx => {                        // pointer x in the root's own (unscaled) px
      const r = root.getBoundingClientRect();
      return (cx - r.left) * (root.offsetWidth / r.width);
    };
    const nearest = cx => items().reduce((best, it) => {
      const d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - cx);
      return d < best.d ? { it, d } : best;
    }, { it: null, d: Infinity }).it;
    const magnify = center => items().forEach(it => {
      const k = Math.max(0, 1 - Math.abs(it.offsetLeft + it.offsetWidth / 2 - center) / it.offsetWidth);
      it.style.scale = (1 + .16 * k).toFixed(3);
      it.classList.toggle('hot', k > .5);
    });
    const unmagnify = () => items().forEach(it => { it.style.scale = ''; it.classList.remove('hot'); });

    let down = null, dragging = false, suppress = false, lastX = 0, lastT = 0, hover = null;
    function follow(cx) {
      const its = items(), first = its[0], last = its[its.length - 1];
      const n = nearest(cx);
      const nw = n.offsetWidth;
      const nx = Math.min(Math.max(cx - nw / 2, first.offsetLeft), last.offsetLeft + last.offsetWidth - nw);
      // stretch with velocity, like liquid being pulled
      const now = performance.now(), v = Math.abs(cx - lastX) / Math.max(1, now - lastT);
      lastX = cx; lastT = now;
      const s = Math.min(v * .35, .28);
      indicator.style.scale = `${(1.18 + s).toFixed(3)} ${(1.18 - s * .6).toFixed(3)}`;
      place(nx, nw);
      magnify(nx + nw / 2);
      if (n !== hover) { hover = n; if (dragging) navigator.vibrate?.(6); }
    }

    root.addEventListener('pointerdown', e => {
      if (e.button !== 0 || !items().some(it => it.contains(e.target))) return;
      down = { id: e.pointerId, x: e.clientX, y: e.clientY };
      dragging = false; hover = null;
      indicator.classList.remove('squish');
      root.classList.add('pressing');
      lastX = local(e.clientX); lastT = performance.now();
      follow(lastX);
    });
    root.addEventListener('pointermove', e => {
      if (!down || e.pointerId !== down.id) return;
      if (!dragging) {
        if (Math.abs(e.clientX - down.x) < 6) return;
        if (Math.abs(e.clientY - down.y) > Math.abs(e.clientX - down.x)) return release(false);  // vertical → let the page scroll
        dragging = true;
        root.classList.add('dragging');
        try { root.setPointerCapture(e.pointerId); } catch (_) {}
      }
      follow(local(e.clientX));
    });
    function release(commit, cx) {
      root.classList.remove('pressing', 'dragging');
      indicator.style.scale = '';
      unmagnify();
      const target = commit && dragging ? nearest(cx) : null;
      down = null;
      if (target) {
        suppress = true;                         // swallow the click the browser fires after a drag
        setTimeout(() => { suppress = false; target.click(); sync(); }, 0);
      } else setTimeout(sync, 0);              // a tap: the normal click handler moves it
      dragging = false;
    }
    root.addEventListener('pointerup', e => { if (down && e.pointerId === down.id) release(true, local(e.clientX)); });
    root.addEventListener('pointercancel', () => down && release(false));
    // only the root's own capture matters (an icon losing its implicit touch capture also bubbles here)
    root.addEventListener('lostpointercapture', e => e.target === root && down && dragging && release(false));
    root.addEventListener('click', e => { if (suppress) { e.preventDefault(); e.stopPropagation(); } }, true);

    addEventListener('resize', sync);
    document.fonts?.ready.then(sync);
    return { sync };
  }

  /* ---------- liquid nav pill + tab blob + scroll spy ---------- */
  const navLinks = $$('.nav a'), pill = $('.nav-pill');
  const tabLinks = $$('.tabbar a'), blob = $('.tab-blob');
  const navSel = liquidSelect($('.nav'), pill, () => navLinks, a => a.classList.contains('active'));
  const tabSel = liquidSelect($('.tabbar'), blob, () => tabLinks, a => a.classList.contains('active'));
  function setActive(id) {
    navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + id));
    tabLinks.forEach((a, i) => {
      const on = a.hash === '#' + id;
      if (on && !a.classList.contains('active')) {
        blob.classList.remove('squish'); void blob.offsetWidth; blob.classList.add('squish');
      }
      a.classList.toggle('active', on);
    });
    navSel.sync(); tabSel.sync();
  }
  const movePill = () => navSel.sync();
  addEventListener('resize', movePill);
  document.fonts?.ready.then(movePill); movePill();

  const sections = ['beranda', 'proyek', 'tentang', 'kontak'].map(id => document.getElementById(id));
  /* Tapping a menu item: the highlight moves at once, the page scrolls smoothly,
     and nothing else reacts until that scroll is over — so the bar never
     shrinks or flickers half-way through (or snaps at the end). */
  let lockUntil = 0;
  const locked = () => performance.now() < lockUntil;
  [...navLinks, ...tabLinks].forEach(a => a.addEventListener('click', () => {
    lockUntil = performance.now() + 1400;
    setMini(false);
    setActive(a.hash.slice(1));
  }));
  // a real finger or wheel takes control back immediately
  ['wheel', 'touchstart'].forEach(t => addEventListener(t, () => { lockUntil = 0; }, { passive: true }));
  addEventListener('scrollend', () => { if (lockUntil) { lockUntil = 0; resetDir(); spy(); } });

  function spy() {
    const mid = innerHeight * .45;
    let cur = 'beranda';
    for (const s of [...sections].sort((a, b) => a.offsetTop - b.offsetTop)) {
      if (s.getBoundingClientRect().top < mid) cur = s.id;
    }
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) cur = 'kontak';
    setActive(cur);
  }

  /* ---------- tab bar minimises while scrolling down, expands on scroll up ----------
     With hysteresis: it needs a deliberate 48 px downward scroll to shrink and
     24 px upward to grow, so small jitters never toggle it. */
  const tb = $('.tabbar'), topbar = $('.topbar');
  let lastY = scrollY, dir = 0, dirStart = scrollY;
  const setMini = on => tb.classList.toggle('mini', on);
  const resetDir = () => { lastY = dirStart = scrollY; dir = 0; };
  function tabMini() {
    const y = scrollY, dy = y - lastY; lastY = y;
    if (!dy) return;
    const d = dy > 0 ? 1 : -1;
    if (d !== dir) { dir = d; dirStart = y - dy; }
    if (y < 120) setMini(false);
    else if (dir > 0 && y - dirStart > 48) setMini(true);
    else if (dir < 0 && dirStart - y > 24) setMini(false);
  }
  function onScroll() {
    topbar.classList.toggle('scrolled', scrollY > 20);
    if (locked()) { lastY = dirStart = scrollY; return; }   // keep reference fresh, no reaction
    if (lockUntil) { lockUntil = 0; resetDir(); }           // lock expired without scrollend (older Safari)
    tabMini(); spy();
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(el); });

  /* ---------- segmented control filter ---------- */
  const seg = $('.segmented'), thumb = $('.seg-thumb');
  const segSel = liquidSelect(seg, thumb, () => $$('button', seg), b => b.getAttribute('aria-selected') === 'true');
  const moveThumb = () => segSel.sync();
  $$('button', seg).forEach(b => b.addEventListener('click', () => {
    $$('button', seg).forEach(x => x.setAttribute('aria-selected', x === b));
    moveThumb();
    const f = b.dataset.filter;
    $$('.card').forEach(c => c.classList.toggle('dim', f !== 'all' && !c.dataset.tags.includes(f)));
  }));
  const syncTabIndex = () => $$('button', seg).forEach(b => b.tabIndex = b.getAttribute('aria-selected') === 'true' ? 0 : -1);
  seg.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const bs = $$('button', seg), i = bs.findIndex(b => b.getAttribute('aria-selected') === 'true');
    const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length];
    n.click(); n.focus(); e.preventDefault();
  });
  seg.addEventListener('click', syncTabIndex); syncTabIndex();
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

  /* ---------- about: expand in place ---------- */
  const moreBtn = $('[aria-controls="aboutMore"]'), more = $('#aboutMore');
  moreBtn.addEventListener('click', () => {
    const open = moreBtn.getAttribute('aria-expanded') !== 'true';
    moreBtn.setAttribute('aria-expanded', open);
    more.hidden = !open;
    $('span', moreBtn).textContent = open ? 'Lebih sedikit' : 'Selengkapnya';
    window.__applyGlass?.();
  });

  /* ---------- sheets (dialogs) with focus trap ---------- */
  const back = $('#sheetBackdrop');
  let current = null, lastFocus = null;
  const focusables = el => $$('a[href],button:not([disabled]),input:not([type=hidden]),textarea,[tabindex]:not([tabindex="-1"])', el)
    .filter(x => !x.closest('[hidden]'));
  function openSheet(id, trigger) {
    if (current) { current.classList.remove('open'); current.hidden = true; }
    else lastFocus = trigger || document.activeElement;
    current = document.getElementById(id);
    current.hidden = back.hidden = false;
    window.__applyGlass?.();
    requestAnimationFrame(() => { current.classList.add('open'); back.classList.add('open'); });
    setTimeout(() => (focusables(current).find(x => x.matches('input,textarea')) || focusables(current)[0])?.focus(), 350);
  }
  function closeSheet() {
    if (!current) return;
    const s = current; current = null;
    s.classList.remove('open'); back.classList.remove('open');
    setTimeout(() => { s.hidden = back.hidden = true; lastFocus?.focus(); }, 450);
  }
  $$('[data-open-sheet]').forEach(b => b.addEventListener('click', () => { prepContact(''); openSheet(b.dataset.openSheet, b); }));
  $$('[data-close-sheet]').forEach(b => b.addEventListener('click', closeSheet));
  back.addEventListener('click', closeSheet);
  addEventListener('keydown', e => {
    if (!current) return;
    if (e.key === 'Escape') { closeSheet(); return; }
    if (e.key === 'Tab') {
      const f = focusables(current), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  });

  /* ---------- project detail ----------
     CONTOH: isi di bawah disusun dari deskripsi kartu. Ganti dengan data asli
     (tahun, peran, masalah/solusi, stack, tautan kode/demo). */
  const PROJECTS = {
    voicecraft: {
      title: 'VoiceCraft AI', meta: 'AI · Audio · Pascaproduksi film',
      problem: 'Rekaman dialog di lokasi syuting sering tercampur bising, gema, atau terpotong, sehingga harus direkam ulang di studio.',
      solution: 'Model AI yang memulihkan audio dialog langsung dari rekaman asli, sehingga editor bisa menyelamatkan take terbaik tanpa rekam ulang.',
      stack: ['Python', 'PyTorch', 'Audio Processing', 'Gradio'], code: ''
    },
    simpulcloud: {
      title: 'Simpul Creative Cloud', meta: 'AI · Suite kreatif offline',
      problem: 'Alat kreatif berbasis AI umumnya bergantung pada internet dan langganan cloud, sehingga sulit dipakai di lokasi dengan jaringan terbatas.',
      solution: 'Kumpulan alat kreatif yang menjalankan model AI secara lokal di perangkat dan tetap berfungsi tanpa koneksi internet.',
      stack: ['Python', 'Machine Learning', 'React', 'UI/UX Design'], code: ''
    },
    simpuleyes: {
      title: 'SimpulEyes 4', meta: 'Film · Sinkronisasi audio',
      problem: 'Menyelaraskan audio dari perekam terpisah dengan banyak kamera secara manual memakan waktu berjam-jam.',
      solution: 'Alat sinkronisasi modern yang mencocokkan gelombang audio antar sumber secara otomatis, terinspirasi dari PluralEyes.',
      stack: ['Python', 'Audio Processing', 'Video Editing'], code: ''
    }
  };
  let currentProject = null;
  function openProject(key, trigger) {
    const p = PROJECTS[key]; if (!p) return;
    currentProject = p;
    $('#pTitle').textContent = p.title;
    $('#pMeta').textContent = p.meta;
    $('#pProblem').textContent = p.problem;
    $('#pSolution').textContent = p.solution;
    const list = $('#pStack'); list.innerHTML = '';
    p.stack.forEach(s => { const li = document.createElement('li'); li.className = 'chip glass'; li.textContent = s; list.append(li); });
    const code = $('#pCode');
    code.disabled = !p.code; code.title = p.code ? '' : 'Tautan belum tersedia';
    code.onclick = () => p.code && window.open(p.code, '_blank', 'noopener');
    openSheet('projectSheet', trigger);
  }
  $$('.card').forEach(card => {
    const btn = $('[data-project]', card);
    card.addEventListener('click', () => { if (!card.classList.contains('dim')) openProject(btn.dataset.project, btn); });
  });
  $('#pDiscuss').addEventListener('click', () => { prepContact(currentProject?.title || ''); openSheet('sheet'); });

  /* ---------- contact form: validation, error + loading states ---------- */
  const form = $('#contactForm');
  function prepContact(project) {
    form.subject.value = project;
    const ctx = $('#formContext');
    ctx.hidden = !project;
    ctx.textContent = project ? `Tentang proyek serupa: ${project}` : '';
    $$('.field', form).forEach(f => f.classList.remove('invalid'));
    $$('.field-error', form).forEach(p => p.hidden = true);
    $$('input,textarea', form).forEach(x => x.removeAttribute('aria-invalid'));
  }
  function validate(el) {
    const bad = !el.value.trim();
    el.closest('.field').classList.toggle('invalid', bad);
    if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    $('#err-' + el.name).hidden = !bad;
    return !bad;
  }
  const fields = [form.elements.name, form.elements.msg];
  fields.forEach(el => el.addEventListener('input', () => el.closest('.field').classList.contains('invalid') && validate(el)));

  const dur = $('#dur'), out = $('#durOut');
  const upd = () => { out.textContent = dur.value + ' minggu'; dur.style.setProperty('--p', ((dur.value - 1) / 11 * 100) + '%'); };
  dur.addEventListener('input', upd); upd();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = fields.map(validate);
    if (ok.includes(false)) { fields[ok.indexOf(false)].focus(); return; }
    const d = new FormData(form), btn = $('[type=submit]', form), label = $('.btn-label', btn);
    btn.setAttribute('aria-busy', 'true'); label.textContent = 'Membuka email…';
    const subject = d.get('subject') ? `Diskusi proyek serupa ${d.get('subject')}` : `Halo dari ${d.get('name')}`;
    const body = `${d.get('msg')}\n\nKolaborasi: ${d.get('collab') ? 'Ya' : 'Tidak'}\nPerkiraan durasi: ${d.get('dur')} minggu\n\n— ${d.get('name')}`;
    location.href = `mailto:mochamad.ramdhan@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => { btn.removeAttribute('aria-busy'); label.textContent = 'Kirim via Email'; closeSheet(); }, 1200);
  });
})();
