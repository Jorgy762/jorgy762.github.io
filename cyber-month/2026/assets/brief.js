/* Cyber Month 2026 brief series: shared behaviour
   (cost clock, progress bar, stop-the-clock, series navigation, completion tracking) */
(function(){
  const RATE = 704e6 / (365*24*3600); // CAFC 2025 reported fraud losses, dollars per second
  const fmt = v => '$' + Math.round(v).toLocaleString('en-CA');
  const start = Date.now(); let stoppedAt = null;
  window.CM = { RATE, fmt };

  const clock = document.getElementById('clock');
  if (clock) setInterval(() => { if (!stoppedAt) clock.textContent = fmt((Date.now()-start)/1000*RATE); }, 250);

  const prog = document.getElementById('progress');
  if (prog) addEventListener('scroll', () => { const h = document.documentElement.scrollHeight - innerHeight; prog.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%'; }, {passive:true});

  // Completion is stored only in the reader's own browser. Nothing is sent anywhere.
  const id = document.body.dataset.brief;
  const key = n => 'cm' + (window.CM_SERIES ? CM_SERIES.year : '') + '-done-' + n;
  const markDone = () => { if (!id) return; try { localStorage.setItem(key(id), '1'); } catch (e) {} };
  window.CM.isDone = n => { try { return localStorage.getItem(key(n)) === '1'; } catch (e) { return false; } };

  const stop = document.getElementById('stop');
  if (stop) stop.addEventListener('click', () => {
    if (!stoppedAt) stoppedAt = Date.now();
    const secs = (stoppedAt - start)/1000, m = Math.floor(secs/60), s = Math.round(secs%60);
    const amt = fmt(secs*RATE);
    document.getElementById('stopAmt').textContent = amt; if (clock) clock.textContent = amt;
    document.getElementById('stopTime').textContent = (m ? m + ' min ' : '') + s + ' sec';
    document.getElementById('stopOut').hidden = false; stop.textContent = 'Clock stopped';
    markDone();
  });

  const src = document.getElementById('sources');
  if (src && 'IntersectionObserver' in window) {
    const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { markDone(); o.disconnect(); } }), {threshold:.3});
    o.observe(src);
  }

  // Series navigation at the bottom of a brief
  const nav = document.getElementById('seriesNav');
  if (nav && window.CM_SERIES && id) {
    const list = CM_SERIES.briefs, i = list.findIndex(b => b.n === id);
    const cell = (b, label, cls) => {
      if (!b) return `<span class="${cls} off"><small>${label}</small><b>None</b></span>`;
      if (b.status !== 'live') return `<span class="${cls} off"><small>${label}: Brief ${b.n}</small><b>Coming soon</b></span>`;
      return `<a class="${cls}" href="../${b.n}/"><small>${label}: Brief ${b.n}</small><b>${b.title}</b></a>`;
    };
    nav.innerHTML = cell(list[i-1], 'Previous', 'prev') +
      `<a class="hub" href="../"><small>Cyber Month ${CM_SERIES.year}</small><b>All briefs</b></a>` +
      cell(list[i+1], 'Next', 'next');
    const pos = document.querySelector('[data-series-pos]');
    if (pos) pos.textContent = `[ CYBER MONTH ${CM_SERIES.year} // BRIEF ${id} OF ${String(list.length).padStart(2,'0')} ]`;
  }

  // Hub grid
  const grid = document.getElementById('seriesGrid');
  if (grid && window.CM_SERIES) {
    grid.innerHTML = CM_SERIES.briefs.map(b => {
      if (b.status !== 'live') return `<div class="panel bcard planned"><div class="num">${b.n}</div><h3>Coming soon</h3><p>The next brief in the series.</p><div class="meta"><span class="status soon">PLANNED</span></div></div>`;
      const done = CM.isDone(b.n);
      return `<a class="panel bcard" href="${b.n}/"><div class="num">${b.n}</div><h3>${b.title}</h3><p>${b.blurb}</p><div class="meta"><span class="status ${done ? 'done' : 'live'}">${done ? 'COMPLETED' : 'LIVE'}</span><span>${b.minutes} min</span></div></a>`;
    }).join('');
  }
})();
