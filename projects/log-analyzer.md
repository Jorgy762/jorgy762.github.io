---
layout: default
title: Windows Log Analyzer
permalink: /projects/log-analyzer/
description: Browser-based parser for Windows Event XML, IIS W3C logs, and plain text logs. Filter, search, visualize, and export. No data leaves your browser.
---

<div class="container">
  <div class="page-header">
    <p class="page-header-eyebrow">Tool</p>
    <h1 class="page-header-title">Windows Log Analyzer</h1>
    <p class="page-header-desc">Drop in a log file. Filter by severity or Event ID, search across all fields, visualize level distribution, and export filtered results to CSV or JSON. Everything runs client-side -- no data leaves your browser.</p>
  </div>

  <div class="project-card-tags" style="margin-bottom:2rem;">
    <span class="tag">Blue Team</span>
    <span class="tag">Windows</span>
    <span class="tag">Log Analysis</span>
    <span class="tag">Client-Side</span>
    <span class="tag">JavaScript</span>
  </div>

  <div style="margin-bottom:2rem;font-size:0.82rem;color:var(--muted,#666);font-family:'Share Tech Mono',monospace;">
    <strong style="color:var(--gold,#c9a84c)">Supported formats:</strong>
    &nbsp;Windows Event XML (exported from Event Viewer) &bull;
    IIS W3C logs (<code>u_ex*.log</code>) &bull;
    Plain text logs
    &nbsp;&mdash;&nbsp;
    <a href="/blog/2026/05/19/windows-log-analyzer/" style="color:var(--gold,#c9a84c)">Read the write-up →</a>
  </div>

  <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:3px;padding:0.85rem 1rem;margin-bottom:2rem;font-size:0.78rem;font-family:'Share Tech Mono',monospace;color:#aaa;">
    <strong style="color:var(--gold,#c9a84c)">Note on .evtx files:</strong>
    Binary EVTX cannot be parsed in the browser. Export from Event Viewer first:
    <em>right-click any log &rarr; Save All Events As... &rarr; XML</em>.
    Or use PowerShell:<br><br>
    <code style="color:#e0e0e0">Get-WinEvent -Path "C:\path\to\file.evtx" | Select-Object TimeCreated, Id, LevelDisplayName, ProviderName, Message | Export-Csv -Path "$env:USERPROFILE\Desktop\events.csv" -NoTypeInformation</code>
  </div>

{% raw %}
<style>
#log-tool *{box-sizing:border-box}
#log-tool{
  font-family:'Share Tech Mono',monospace;
  background:#111;
  color:#e0e0e0;
  border:1px solid #c9a84c;
  border-radius:3px;
  padding:1.5rem;
  margin:2rem 0;
}
#drop-zone{
  border:2px dashed #c9a84c;
  border-radius:3px;
  padding:2.5rem 1rem;
  text-align:center;
  cursor:pointer;
  transition:background 0.2s;
  color:#c9a84c;
  user-select:none;
}
#drop-zone:hover,#drop-zone.dragover{background:rgba(201,168,76,0.07)}
#drop-zone .dz-icon{font-size:2rem;margin-bottom:0.4rem}
#drop-zone .dz-sub{font-size:0.73rem;color:#666;margin-top:0.4rem}
#status-bar{
  font-size:0.78rem;
  color:#888;
  min-height:1.3em;
  margin:0.6rem 0 0;
  padding-left:2px;
}
#status-bar.err{color:#ff4444}
#main-ui{display:none;margin-top:1rem}
.stat-row{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:0.5rem;
  margin-bottom:1rem;
}
.stat-card{
  background:#161616;
  border:1px solid #2a2a2a;
  border-radius:2px;
  padding:0.65rem 0.5rem;
  text-align:center;
}
.stat-card .sv{font-size:1.6rem;font-weight:bold;line-height:1}
.stat-card .sl{font-size:0.65rem;color:#666;text-transform:uppercase;letter-spacing:0.08em;margin-top:0.2rem}
.sv-total{color:#c9a84c}
.sv-error{color:#ff5555}
.sv-warn{color:#ffcc44}
.sv-info{color:#44aaff}
#chart-area{
  display:none;
  max-width:340px;
  margin:0 auto 1rem;
}
.ctrl-row{
  display:flex;
  flex-wrap:wrap;
  gap:0.4rem;
  align-items:center;
  margin-bottom:0.5rem;
}
.ctrl-row input,.ctrl-row select{
  font-family:'Share Tech Mono',monospace;
  font-size:0.8rem;
  background:#161616;
  border:1px solid #333;
  color:#e0e0e0;
  padding:0.35rem 0.6rem;
  border-radius:2px;
  transition:border-color 0.15s;
}
.ctrl-row input:focus,.ctrl-row select:focus{
  outline:none;
  border-color:#c9a84c;
}
#search-in{flex:1;min-width:160px}
#eventid-in{width:130px}
.lt-btn{
  font-family:'Share Tech Mono',monospace;
  font-size:0.78rem;
  background:transparent;
  border:1px solid #c9a84c;
  color:#c9a84c;
  padding:0.35rem 0.85rem;
  border-radius:2px;
  cursor:pointer;
  transition:background 0.15s;
  white-space:nowrap;
}
.lt-btn:hover{background:rgba(201,168,76,0.1)}
.lt-btn.danger{border-color:#cc4444;color:#cc4444}
.lt-btn.danger:hover{background:rgba(204,68,68,0.1)}
.filter-status{font-size:0.72rem;color:#555;margin-bottom:0.3rem;min-height:1.1em}
.tbl-wrap{overflow-x:auto}
#log-tbl{width:100%;border-collapse:collapse;font-size:0.75rem}
#log-tbl th{
  background:#161616;
  color:#c9a84c;
  text-align:left;
  padding:0.45rem 0.65rem;
  border-bottom:1px solid #c9a84c;
  white-space:nowrap;
  position:sticky;
  top:0;
}
#log-tbl td{
  padding:0.35rem 0.65rem;
  border-bottom:1px solid #1c1c1c;
  vertical-align:top;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  max-width:380px;
}
#log-tbl tr:hover td{background:#181818}
.lv-Critical{color:#ff4444}
.lv-Error{color:#ff7744}
.lv-Warning{color:#ffcc44}
.lv-Info{color:#44aaff}
.lv-Debug,.lv-Verbose{color:#777}
mark.hl{background:rgba(201,168,76,0.28);color:inherit;border-radius:1px;padding:0 1px}
.row-ctr{color:#444}
.tbl-footer{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-top:0.5rem;
  font-size:0.7rem;
  color:#555;
}
@media(max-width:600px){
  .stat-row{grid-template-columns:repeat(2,1fr)}
  #eventid-in{width:100px}
}
</style>

<div id="log-tool">
  <div id="drop-zone" onclick="document.getElementById('lt-file').click()">
    <div class="dz-icon">&#128193;</div>
    <div>Drop a log file here, or click to browse</div>
    <div class="dz-sub">Windows Event XML &bull; IIS W3C .log &bull; Plain text .log/.txt</div>
    <input type="file" id="lt-file" accept=".xml,.log,.txt" style="display:none">
  </div>
  <div id="status-bar"></div>

  <div id="main-ui">
    <div class="stat-row">
      <div class="stat-card"><div class="sv sv-total" id="sv-total">0</div><div class="sl">Total</div></div>
      <div class="stat-card"><div class="sv sv-error" id="sv-error">0</div><div class="sl">Errors</div></div>
      <div class="stat-card"><div class="sv sv-warn" id="sv-warn">0</div><div class="sl">Warnings</div></div>
      <div class="stat-card"><div class="sv sv-info" id="sv-info">0</div><div class="sl">Info</div></div>
    </div>

    <div id="chart-area"><canvas id="lt-chart"></canvas></div>

    <div class="ctrl-row">
      <input type="text" id="search-in" placeholder="Search all fields...">
      <select id="level-sel">
        <option value="">All Levels</option>
        <option value="Critical">Critical</option>
        <option value="Error">Error</option>
        <option value="Warning">Warning</option>
        <option value="Info">Info</option>
        <option value="Debug">Debug</option>
        <option value="Verbose">Verbose</option>
      </select>
      <input type="text" id="eventid-in" placeholder="Event ID / Status">
      <button class="lt-btn" onclick="ltExportCSV()">Export CSV</button>
      <button class="lt-btn" onclick="ltExportJSON()">Export JSON</button>
      <button class="lt-btn danger" onclick="ltReset()">Clear</button>
    </div>
    <div class="filter-status" id="filter-status"></div>

    <div class="tbl-wrap">
      <table id="log-tbl">
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
            <th>Level</th>
            <th id="th-eid">Event ID</th>
            <th id="th-src">Source</th>
            <th id="th-cmp">Computer</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody id="lt-tbody"></tbody>
      </table>
    </div>
    <div class="tbl-footer">
      <span>Showing <b id="showing-n">0</b> of <b id="total-n">0</b> records</span>
      <span id="log-type-lbl" style="color:#444"></span>
    </div>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script>
(function(){
  'use strict';

  const MAX_ROWS = 2500;
  let allRecords = [];
  let currentType = '';
  let ltChart = null;

  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('lt-file');

  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  });
  fileInput.addEventListener('change', () => { if (fileInput.files[0]) loadFile(fileInput.files[0]); });

  function loadFile(file) {
    if (file.name.toLowerCase().endsWith('.evtx')) {
      setStatus('Binary .evtx files cannot be parsed in the browser. Export as XML from Event Viewer first (see instructions above).', true);
      return;
    }
    setStatus('Reading ' + file.name + '...');
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target.result;
      currentType = detectType(file.name, content);
      setStatus('Detected: ' + currentType.toUpperCase() + ' -- parsing...');
      try {
        allRecords = parse(currentType, content);
        document.getElementById('log-type-lbl').textContent = currentType.toUpperCase() + ' format';
        setStatus('Loaded ' + allRecords.length.toLocaleString() + ' records from ' + file.name);
        updateStats(allRecords);
        drawChart(allRecords);
        applyFilters();
        document.getElementById('main-ui').style.display = 'block';
      } catch (err) {
        setStatus('Parse error: ' + err.message, true);
      }
    };
    reader.onerror = () => setStatus('Failed to read file.', true);
    reader.readAsText(file);
  }

  function setStatus(msg, isErr) {
    const el = document.getElementById('status-bar');
    el.textContent = msg;
    el.className = isErr ? 'err' : '';
  }

  function detectType(filename, content) {
    const head = content.slice(0, 600);
    if (filename.toLowerCase().endsWith('.xml') || head.includes('<Events') || head.includes('<Event xmlns='))
      return 'evtxml';
    if (head.includes('#Software: Microsoft Internet Information Services') || head.includes('#Fields:'))
      return 'iis';
    return 'text';
  }

  function parse(type, content) {
    if (type === 'evtxml') return parseEventXML(content);
    if (type === 'iis')    return parseIIS(content);
    return parseText(content);
  }

  function parseEventXML(content) {
    const xmlDoc = (new DOMParser()).parseFromString(content, 'text/xml');
    if (xmlDoc.querySelector('parsererror'))
      throw new Error('Invalid XML. Make sure this is a Windows Event Viewer XML export.');

    const levelMap = { '0':'Info','1':'Critical','2':'Error','3':'Warning','4':'Info','5':'Verbose' };
    const records = [];

    xmlDoc.querySelectorAll('Event').forEach(ev => {
      const sys = ev.querySelector('System');
      if (!sys) return;
      const rawLevel = (sys.querySelector('Level') || {}).textContent || '4';
      const level = levelMap[rawLevel] || 'Info';
      const timeEl = sys.querySelector('TimeCreated');
      const rawTime = timeEl ? timeEl.getAttribute('SystemTime') : '';
      let timeStr = rawTime || '';
      try { if (rawTime) timeStr = new Date(rawTime).toLocaleString(); } catch(e) {}

      const parts = [];
      ev.querySelectorAll('EventData > Data, UserData *').forEach(d => {
        const name = d.getAttribute('Name');
        const val  = (d.textContent || '').trim();
        if (val) parts.push(name ? name + ': ' + val : val);
      });
      const renderedEl = ev.querySelector('RenderingInfo > Message');
      const rendered = renderedEl ? renderedEl.textContent : '';

      const providerEl = sys.querySelector('Provider');
      records.push({
        time:    timeStr,
        eventId: (sys.querySelector('EventID') || {}).textContent || '',
        level,
        source:  providerEl ? providerEl.getAttribute('Name') : '',
        computer:(sys.querySelector('Computer') || {}).textContent || '',
        message: parts.join(' | ') || rendered.replace(/\s+/g, ' ').trim()
      });
    });
    return records;
  }

  function parseIIS(content) {
    const lines = content.split('\n');
    let fields = [];
    const records = [];

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;
      if (line.startsWith('#Fields:')) {
        fields = line.replace('#Fields:','').trim().split(/\s+/);
        return;
      }
      if (line.startsWith('#')) return;
      const vals = line.split(/\s+/);
      if (!fields.length || vals.length < 2) return;

      const rec = {};
      fields.forEach((f, i) => { rec[f] = vals[i] || '-'; });

      const status = parseInt(rec['sc-status'] || '0', 10);
      let level = 'Info';
      if (status >= 500)      level = 'Error';
      else if (status >= 400) level = 'Warning';

      const method = rec['cs-method'] || '';
      const uri    = rec['cs-uri-stem'] || '';
      const query  = rec['cs-uri-query'] && rec['cs-uri-query'] !== '-' ? '?' + rec['cs-uri-query'] : '';
      const ms     = rec['time-taken'] || '';
      const cip    = rec['c-ip'] || '';

      records.push({
        time:    ((rec['date'] || '') + ' ' + (rec['time'] || '')).trim(),
        eventId: rec['sc-status'] || '',
        level,
        source:  method,
        computer: cip,
        message: method + ' ' + uri + query + ' [' + status + '] ' + ms + 'ms from ' + cip
      });
    });
    return records;
  }

  function parseText(content) {
    const patterns = [
      ['Critical', /\b(critical|fatal)\b/i],
      ['Error',    /\b(error|err(?!\w)|fail(?:ed|ure)?)\b/i],
      ['Warning',  /\b(warn(?:ing)?)\b/i],
      ['Debug',    /\b(debug|trace|verbose)\b/i],
      ['Info',     /\b(info(?:rmation)?|notice)\b/i],
    ];
    const tsRx = /(\d{4}[-\/]\d{2}[-\/]\d{2}[\sT]\d{2}:\d{2}:\d{2})/;
    const records = [];

    content.split('\n').forEach((line, idx) => {
      const t = line.trim();
      if (!t) return;
      let level = 'Info';
      for (let i = 0; i < patterns.length; i++) {
        if (patterns[i][1].test(t)) { level = patterns[i][0]; break; }
      }
      const m = t.match(tsRx);
      records.push({
        time:     m ? m[1] : '',
        eventId:  String(idx + 1),
        level,
        source:   'Text',
        computer: '',
        message:  t
      });
    });
    return records;
  }

  function updateStats(recs) {
    const c = { Critical:0, Error:0, Warning:0, Info:0, Debug:0, Verbose:0 };
    recs.forEach(r => { c[r.level] = (c[r.level] || 0) + 1; });
    document.getElementById('sv-total').textContent = recs.length.toLocaleString();
    document.getElementById('sv-error').textContent = ((c.Critical || 0) + (c.Error || 0)).toLocaleString();
    document.getElementById('sv-warn').textContent  = (c.Warning || 0).toLocaleString();
    document.getElementById('sv-info').textContent  = ((c.Info || 0) + (c.Debug || 0) + (c.Verbose || 0)).toLocaleString();
  }

  function drawChart(recs) {
    const c = {};
    recs.forEach(r => { c[r.level] = (c[r.level] || 0) + 1; });
    const colorMap = {
      Critical:'#ff4444', Error:'#ff7744', Warning:'#ffcc44',
      Info:'#44aaff', Debug:'#666666', Verbose:'#555555'
    };
    const labels = Object.keys(c);
    const data   = labels.map(l => c[l]);
    const colors = labels.map(l => colorMap[l] || '#888');

    const area = document.getElementById('chart-area');
    area.style.display = labels.length ? 'block' : 'none';

    if (ltChart) ltChart.destroy();
    ltChart = new Chart(document.getElementById('lt-chart').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderColor: '#111', borderWidth: 2 }]
      },
      options: {
        plugins: {
          legend: {
            labels: { color: '#e0e0e0', font: { family: "'Share Tech Mono', monospace", size: 11 } }
          }
        },
        responsive: true
      }
    });
  }

  document.getElementById('search-in').addEventListener('input', applyFilters);
  document.getElementById('level-sel').addEventListener('change', applyFilters);
  document.getElementById('eventid-in').addEventListener('input', applyFilters);

  function getFiltered() {
    const search  = document.getElementById('search-in').value.trim().toLowerCase();
    const level   = document.getElementById('level-sel').value;
    const eventId = document.getElementById('eventid-in').value.trim().toLowerCase();

    return allRecords.filter(r => {
      if (level   && r.level !== level) return false;
      if (eventId && !r.eventId.toLowerCase().includes(eventId)) return false;
      if (search) {
        const hay = [r.time, r.eventId, r.level, r.source, r.computer, r.message]
          .join(' ').toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });
  }

  function applyFilters() {
    const filtered = getFiltered();
    const slice    = filtered.slice(0, MAX_ROWS);

    const thEid = document.getElementById('th-eid');
    const thSrc = document.getElementById('th-src');
    const thCmp = document.getElementById('th-cmp');
    if (currentType === 'iis') {
      thEid.textContent = 'Status'; thSrc.textContent = 'Method'; thCmp.textContent = 'Client IP';
    } else if (currentType === 'text') {
      thEid.textContent = 'Line #'; thSrc.textContent = 'Type'; thCmp.textContent = '';
    } else {
      thEid.textContent = 'Event ID'; thSrc.textContent = 'Source'; thCmp.textContent = 'Computer';
    }

    const term = document.getElementById('search-in').value.trim();
    const tbody = document.getElementById('lt-tbody');

    tbody.innerHTML = slice.map((r, i) =>
      '<tr>' +
        '<td class="row-ctr">' + (i + 1) + '</td>' +
        '<td style="color:#aaa">' + hl(r.time, term) + '</td>' +
        '<td class="lv-' + r.level + '">' + r.level + '</td>' +
        '<td>' + hl(r.eventId, term) + '</td>' +
        '<td style="max-width:160px">' + hl(r.source, term) + '</td>' +
        '<td>' + hl(r.computer, term) + '</td>' +
        '<td style="max-width:480px">' + hl(r.message, term) + '</td>' +
      '</tr>'
    ).join('');

    document.getElementById('showing-n').textContent = slice.length.toLocaleString();
    document.getElementById('total-n').textContent   = filtered.length.toLocaleString();

    const fs = document.getElementById('filter-status');
    fs.textContent = filtered.length > MAX_ROWS
      ? 'Showing first ' + MAX_ROWS.toLocaleString() + ' matches -- narrow your filters to see more.'
      : '';
  }

  function hl(text, term) {
    const safe = esc(text);
    if (!term) return safe;
    const safeTerm = esc(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safe.replace(new RegExp(safeTerm, 'gi'), m => '<mark class="hl">' + m + '</mark>');
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function ltExportCSV() {
    const rows = getFiltered();
    const header = ['Time','EventID','Level','Source','Computer','Message'];
    const lines  = rows.map(r =>
      [r.time, r.eventId, r.level, r.source, r.computer, r.message]
        .map(v => '"' + String(v || '').replace(/"/g, '""') + '"')
        .join(',')
    );
    dl('log-export.csv', [header.join(','), ...lines].join('\r\n'), 'text/csv');
  }

  function ltExportJSON() {
    dl('log-export.json', JSON.stringify(getFiltered(), null, 2), 'application/json');
  }

  function dl(filename, content, mime) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: mime }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function ltReset() {
    allRecords = []; currentType = '';
    if (ltChart) { ltChart.destroy(); ltChart = null; }
    document.getElementById('main-ui').style.display = 'none';
    document.getElementById('chart-area').style.display = 'none';
    document.getElementById('lt-file').value = '';
    document.getElementById('search-in').value = '';
    document.getElementById('level-sel').value = '';
    document.getElementById('eventid-in').value = '';
    document.getElementById('lt-tbody').innerHTML = '';
    setStatus('');
  }

  window.ltExportCSV  = ltExportCSV;
  window.ltExportJSON = ltExportJSON;
  window.ltReset      = ltReset;
})();
</script>
{% endraw %}

</div>
