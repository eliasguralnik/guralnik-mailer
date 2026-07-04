// src/preview/ui.ts
// Das komplette Preview-Frontend als selbst-enthaltene HTML-Seite.
// Bewusst Vanilla JS + Inline-CSS: null zusätzliche Dependencies für Package-Konsumenten.

export function renderPreviewPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Guralnik Mailer — Template Preview</title>
<style>
  :root {
    --bg: #f4f4f5;
    --surface: #ffffff;
    --border: #e4e4e7;
    --text: #18181b;
    --text-muted: #71717a;
    --accent: #4f46e5;
    --accent-soft: #eef2ff;
    --radius: 8px;
    --sidebar-w: 264px;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: var(--bg); color: var(--text); height: 100vh; overflow: hidden; font-size: 14px;
  }
  .layout { display: flex; height: 100vh; }

  /* ─── Sidebar ─── */
  .sidebar {
    width: var(--sidebar-w); min-width: var(--sidebar-w); background: var(--surface);
    border-right: 1px solid var(--border); overflow-y: auto; padding: 20px 12px;
  }
  .sidebar .logo { display: flex; align-items: center; gap: 8px; padding: 0 10px 16px; }
  .sidebar .logo .mark { font-size: 20px; }
  .sidebar .logo .name { font-weight: 650; font-size: 14px; letter-spacing: -0.01em; }
  .sidebar .logo .tag {
    font-size: 10px; font-weight: 600; color: var(--accent); background: var(--accent-soft);
    padding: 2px 6px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .group-label {
    font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--text-muted); padding: 14px 10px 6px;
  }
  .tpl-item {
    display: block; width: 100%; text-align: left; border: 0; background: none; cursor: pointer;
    padding: 7px 10px; border-radius: 6px; font-size: 13px; color: var(--text);
    font-family: inherit; line-height: 1.4;
  }
  .tpl-item:hover { background: #f4f4f5; }
  .tpl-item.active { background: var(--accent-soft); color: var(--accent); font-weight: 600; }

  /* ─── Main ─── */
  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .topbar {
    background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 10px 20px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .topbar .title { min-width: 0; margin-right: auto; }
  .topbar .title h1 { font-size: 14px; font-weight: 650; letter-spacing: -0.01em; }
  .topbar .title .subject {
    font-size: 12px; color: var(--text-muted); white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; max-width: 420px;
  }
  select, input[type="email"] {
    font-family: inherit; font-size: 13px; color: var(--text); background: var(--surface);
    border: 1px solid var(--border); border-radius: var(--radius); padding: 7px 10px; outline: none;
  }
  select:focus, input[type="email"]:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .field { display: flex; flex-direction: column; gap: 2px; }
  .field label {
    font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; color: var(--text-muted); padding-left: 2px;
  }
  .seg {
    display: inline-flex; background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 2px; align-self: flex-end;
  }
  .seg button {
    border: 0; background: none; font-family: inherit; font-size: 12.5px; font-weight: 500;
    padding: 5px 12px; border-radius: 6px; cursor: pointer; color: var(--text-muted);
  }
  .seg button.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 2px rgba(0,0,0,0.08); font-weight: 600; }

  .sendbox { display: flex; gap: 6px; align-self: flex-end; }
  .sendbox input { width: 210px; }
  .btn {
    font-family: inherit; font-size: 13px; font-weight: 600; border: 0; cursor: pointer;
    background: var(--accent); color: #fff; border-radius: var(--radius); padding: 8px 14px;
  }
  .btn:hover { filter: brightness(1.08); }
  .btn:disabled { opacity: 0.6; cursor: wait; }

  /* ─── Canvas ─── */
  .canvas { flex: 1; overflow: auto; padding: 24px; display: flex; justify-content: center; }
  .frame-wrap {
    width: 100%; max-width: 720px; transition: max-width 0.2s ease;
    background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
    overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); align-self: stretch; display: flex;
  }
  .frame-wrap.mobile { max-width: 375px; }
  iframe { width: 100%; border: 0; flex: 1; background: #fff; }

  /* ─── Source view ─── */
  .source-wrap {
    width: 100%; max-width: 960px; display: none; flex-direction: column; align-self: stretch;
    background: #0f172a; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .source-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 14px; border-bottom: 1px solid #1e293b;
  }
  .source-head span { font-size: 11px; color: #94a3b8; font-family: ui-monospace, monospace; }
  .source-head button {
    border: 1px solid #334155; background: #1e293b; color: #e2e8f0; font-size: 11.5px;
    font-family: inherit; border-radius: 6px; padding: 4px 10px; cursor: pointer;
  }
  .source-wrap pre {
    flex: 1; overflow: auto; padding: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap; word-break: break-all;
  }
  .mode-source .frame-wrap { display: none; }
  .mode-source .source-wrap { display: flex; }

  /* ─── Toast & Loading ─── */
  .toast {
    position: fixed; bottom: 20px; right: 20px; background: #18181b; color: #fff;
    padding: 11px 16px; border-radius: 10px; font-size: 13px; box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    opacity: 0; transform: translateY(8px); transition: all 0.25s ease; pointer-events: none; max-width: 380px;
  }
  .toast.show { opacity: 1; transform: translateY(0); }
  .toast.error { background: #dc2626; }
  .toast.success { background: #16a34a; }
  .loading-bar {
    position: absolute; top: 0; left: 0; height: 2px; width: 0%;
    background: var(--accent); transition: width 0.3s ease; z-index: 10;
  }
  .main { position: relative; }
</style>
</head>
<body>
<div class="layout">
  <nav class="sidebar" id="sidebar">
    <div class="logo">
      <span class="mark">✉️</span>
      <span class="name">Guralnik Mailer</span>
      <span class="tag">Preview</span>
    </div>
  </nav>

  <div class="main" id="main">
    <div class="loading-bar" id="loadingBar"></div>
    <div class="topbar">
      <div class="title">
        <h1 id="tplName">Loading…</h1>
        <div class="subject" id="tplSubject"></div>
      </div>

      <div class="field">
        <label for="themeSel">Theme</label>
        <select id="themeSel"></select>
      </div>

      <div class="field">
        <label for="langSel">Language</label>
        <select id="langSel"></select>
      </div>

      <div class="seg" id="deviceSeg" title="Viewport width">
        <button data-device="desktop" class="active">Desktop</button>
        <button data-device="mobile">Mobile</button>
      </div>

      <div class="seg" id="modeSeg" title="Rendered HTML vs. raw source">
        <button data-mode="html" class="active">HTML</button>
        <button data-mode="source">Source</button>
      </div>

      <div class="sendbox">
        <input type="email" id="sendTo" placeholder="you@example.com">
        <button class="btn" id="sendBtn">Send test</button>
      </div>
    </div>

    <div class="canvas">
      <div class="frame-wrap" id="frameWrap">
        <iframe id="previewFrame" title="Email preview"></iframe>
      </div>
      <div class="source-wrap">
        <div class="source-head">
          <span id="sourceMeta">text/html</span>
          <button id="copyBtn">Copy HTML</button>
        </div>
        <pre id="sourcePre"></pre>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
(function () {
  'use strict';

  var state = { template: null, theme: null, lang: null, html: '', meta: null };
  var $ = function (id) { return document.getElementById(id); };

  function toast(message, type) {
    var el = $('toast');
    el.textContent = message;
    el.className = 'toast show ' + (type || '');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.className = 'toast'; }, 3500);
  }

  function setLoading(active) {
    $('loadingBar').style.width = active ? '70%' : '100%';
    if (!active) setTimeout(function () { $('loadingBar').style.width = '0%'; }, 300);
  }

  function buildSidebar(categories) {
    var sidebar = $('sidebar');
    categories.forEach(function (cat) {
      var label = document.createElement('div');
      label.className = 'group-label';
      label.textContent = cat.label;
      sidebar.appendChild(label);
      cat.templates.forEach(function (tpl) {
        var btn = document.createElement('button');
        btn.className = 'tpl-item';
        btn.textContent = tpl;
        btn.dataset.template = tpl;
        btn.addEventListener('click', function () { selectTemplate(tpl); });
        sidebar.appendChild(btn);
      });
    });
  }

  function fillSelect(sel, options, selected) {
    options.forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value; o.textContent = opt.label;
      if (opt.value === selected) o.selected = true;
      sel.appendChild(o);
    });
  }

  function selectTemplate(tpl) {
    state.template = tpl;
    document.querySelectorAll('.tpl-item').forEach(function (el) {
      el.classList.toggle('active', el.dataset.template === tpl);
    });
    $('tplName').textContent = tpl;
    render();
  }

  var renderSeq = 0;
  function render() {
    if (!state.template) return;
    var seq = ++renderSeq;
    setLoading(true);
    var url = '/api/render?template=' + encodeURIComponent(state.template) +
              '&theme=' + encodeURIComponent(state.theme) +
              '&lang=' + encodeURIComponent(state.lang);
    fetch(url)
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        if (seq !== renderSeq) return; // veraltete Antwort verwerfen
        setLoading(false);
        if (!result.ok) { toast(result.data.error || 'Render failed', 'error'); return; }
        state.html = result.data.html;
        $('previewFrame').srcdoc = result.data.html;
        $('sourcePre').textContent = result.data.html;
        $('sourceMeta').textContent = 'text/html · ' + (result.data.html.length / 1024).toFixed(1) + ' KB';
        $('tplSubject').textContent = 'Subject: ' + result.data.subject;
      })
      .catch(function (err) { setLoading(false); toast('Render failed: ' + err.message, 'error'); });
  }

  function sendTest() {
    var to = $('sendTo').value.trim();
    if (!to || to.indexOf('@') === -1) { toast('Please enter a valid email address.', 'error'); $('sendTo').focus(); return; }
    localStorage.setItem('gm-preview-email', to);
    var btn = $('sendBtn');
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: state.template, theme: state.theme, lang: state.lang, to: to }),
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        btn.disabled = false; btn.textContent = 'Send test';
        if (result.ok) toast(result.data.message || 'Test email sent! 🚀', 'success');
        else toast(result.data.error || 'Send failed', 'error');
      })
      .catch(function (err) {
        btn.disabled = false; btn.textContent = 'Send test';
        toast('Send failed: ' + err.message, 'error');
      });
  }

  function initSegment(segId, callback) {
    var seg = $(segId);
    seg.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        seg.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        callback(btn.dataset.mode || btn.dataset.device);
      });
    });
  }

  // ─── Init ───
  fetch('/api/meta')
    .then(function (res) { return res.json(); })
    .then(function (meta) {
      state.meta = meta;
      state.theme = meta.defaultTheme;
      state.lang = meta.defaultLanguage;

      buildSidebar(meta.categories);
      fillSelect($('themeSel'), meta.themes.map(function (t) {
        return { value: t, label: t.charAt(0).toUpperCase() + t.slice(1) };
      }), state.theme);
      fillSelect($('langSel'), meta.languages.map(function (l) {
        return { value: l.code, label: l.label + ' (' + l.code + ')' };
      }), state.lang);

      document.title = meta.brandName + ' — Guralnik Mailer Preview';
      $('sendTo').value = localStorage.getItem('gm-preview-email') || '';
      if (!meta.configLoaded) {
        toast('No mailer.config.json found — previews use demo branding, sending is disabled.', '');
      }

      selectTemplate(meta.categories[0].templates[0]);
    })
    .catch(function (err) { toast('Failed to load metadata: ' + err.message, 'error'); });

  $('themeSel').addEventListener('change', function (e) { state.theme = e.target.value; render(); });
  $('langSel').addEventListener('change', function (e) { state.lang = e.target.value; render(); });
  $('sendBtn').addEventListener('click', sendTest);
  $('sendTo').addEventListener('keydown', function (e) { if (e.key === 'Enter') sendTest(); });

  initSegment('deviceSeg', function (device) {
    $('frameWrap').classList.toggle('mobile', device === 'mobile');
  });
  initSegment('modeSeg', function (mode) {
    $('main').classList.toggle('mode-source', mode === 'source');
  });

  $('copyBtn').addEventListener('click', function () {
    navigator.clipboard.writeText(state.html).then(
      function () { toast('HTML copied to clipboard.', 'success'); },
      function () { toast('Copy failed.', 'error'); }
    );
  });
})();
</script>
</body>
</html>`;
}
