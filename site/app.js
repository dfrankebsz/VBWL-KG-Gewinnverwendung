import { course, allTasks, shopItems } from './course-data.js';

const app = document.querySelector('#app');
const STORAGE_GUEST = 'kg-course-guest-v1';
const STORAGE_TOKEN = 'kg-course-token-v1';
const STORAGE_VIEW = 'kg-course-view-v1';

const DEFAULT_STATE = () => ({
  progress: { completed: {}, solutionViews: {}, attempts: {}, drafts: {} },
  cosmetics: { purchased: [], activeTheme: 'classic', accessory: '', pet: '' },
  xpSpent: 0
});

let state = DEFAULT_STATE();
let session = null; // {mode:'guest'|'account', user, token}
let currentView = localStorage.getItem(STORAGE_VIEW) || 'home';
let authMode = 'login';
let authRole = 'student';
let sidebarOpen = false;
let feedback = {};
let openHints = new Set();
let selectedMatch = {};
let draggedMatch = null;
let teacherUsers = null;
let teacherLoading = false;
let syncTimer = null;
let modalState = null;
let sessionStreak = 0;

function safeState(input) {
  const base = DEFAULT_STATE();
  if (!input || typeof input !== 'object') return base;
  return {
    progress: {
      completed: input.progress?.completed || {},
      solutionViews: input.progress?.solutionViews || {},
      attempts: input.progress?.attempts || {},
      drafts: input.progress?.drafts || {}
    },
    cosmetics: {
      purchased: Array.isArray(input.cosmetics?.purchased) ? input.cosmetics.purchased : [],
      activeTheme: input.cosmetics?.activeTheme || 'classic',
      accessory: input.cosmetics?.accessory || '',
      pet: input.cosmetics?.pet || ''
    },
    xpSpent: Number(input.xpSpent || 0)
  };
}

function mergeStates(a, b) {
  const x = safeState(a), y = safeState(b);
  const completed = { ...x.progress.completed };
  for (const [id, rec] of Object.entries(y.progress.completed || {})) {
    if (!completed[id] || Number(rec.awardedXP || 0) > Number(completed[id].awardedXP || 0)) completed[id] = rec;
  }
  return {
    progress: {
      completed,
      solutionViews: { ...x.progress.solutionViews, ...y.progress.solutionViews },
      attempts: Object.fromEntries([...new Set([...Object.keys(x.progress.attempts), ...Object.keys(y.progress.attempts)])].map(id => [id, Math.max(Number(x.progress.attempts[id] || 0), Number(y.progress.attempts[id] || 0))])),
      drafts: { ...x.progress.drafts, ...y.progress.drafts }
    },
    cosmetics: {
      purchased: [...new Set([...(x.cosmetics.purchased || []), ...(y.cosmetics.purchased || [])])],
      activeTheme: y.cosmetics.activeTheme !== 'classic' ? y.cosmetics.activeTheme : x.cosmetics.activeTheme,
      accessory: y.cosmetics.accessory || x.cosmetics.accessory,
      pet: y.cosmetics.pet || x.cosmetics.pet
    },
    xpSpent: Math.max(x.xpSpent, y.xpSpent)
  };
}

function esc(value='') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function fmt(n) {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2, maximumFractionDigits: 2 }).format(Number(n));
}

function parseCandidates(raw) {
  const s = String(raw ?? '').trim().replace(/€/g,'').replace(/\s/g,'');
  if (!s) return [];
  const out = [];
  const standard = Number(s.replace(',', '.'));
  if (Number.isFinite(standard)) out.push(standard);
  const german = Number(s.replace(/\./g,'').replace(',', '.'));
  if (Number.isFinite(german)) out.push(german);
  const plain = Number(s.replace(/[.,](?=\d{3}(\D|$))/g,''));
  if (Number.isFinite(plain)) out.push(plain);
  return [...new Set(out)];
}

function numericMatches(raw, expected, tolerance=.02) {
  return parseCandidates(raw).some(v => Math.abs(v - Number(expected)) <= tolerance);
}

function taskById(id){ return allTasks.find(t => t.id === id); }
function moduleById(id){ return course.modules.find(m => m.id === id); }
function completedCount(){ return Object.keys(state.progress.completed || {}).length; }
function earnedXP(){ return Object.values(state.progress.completed || {}).reduce((s,r)=>s + Number(r.awardedXP || 0),0); }
function xpBalance(){ return Math.max(0, earnedXP() - Number(state.xpSpent || 0)); }
function progressPct(){ return Math.round(completedCount() / allTasks.length * 100); }
function modulePct(m){ const done=m.tasks.filter(t=>state.progress.completed[t.id]).length; return Math.round(done/m.tasks.length*100); }
function isTeacher(){ return session?.mode === 'account' && session.user?.role === 'teacher'; }

function applyTheme(){
  document.body.dataset.theme = state.cosmetics.activeTheme || 'classic';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(document.body).getPropertyValue('--brand').trim() || '#17365d');
}

function saveGuest(){ localStorage.setItem(STORAGE_GUEST, JSON.stringify(state)); }
function scheduleSave(){
  if (session?.mode === 'guest') saveGuest();
  if (session?.mode !== 'account') return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(async()=>{
    try { await api('saveState', { state }); }
    catch(e){ toast('Fortschritt lokal gespeichert. Online-Synchronisierung derzeit nicht möglich.'); }
  },650);
}

async function api(action, payload={}){
  const headers = {'Content-Type':'application/json'};
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  const res = await fetch('/api', {method:'POST',headers,body:JSON.stringify({action,...payload})});
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.error || 'Serveranfrage fehlgeschlagen.');
  return data;
}

function navigate(view){
  currentView=view; localStorage.setItem(STORAGE_VIEW,view); sidebarOpen=false; feedback={}; openHints.clear(); window.scrollTo({top:0,behavior:'smooth'}); render();
  if (view==='teacher') loadTeacherUsers();
}

function avatarHTML(size='mini'){
  const acc = state.cosmetics.accessory || '';
  const pet = state.cosmetics.pet || '';
  if (size==='large') return `<div class="avatar-stage"><div class="avatar-face">🧑‍💼</div>${acc?`<div class="avatar-accessory">${esc(acc)}</div>`:''}${pet?`<div class="avatar-pet">${esc(pet)}</div>`:''}</div>`;
  return `<div class="avatar-mini"><span>🧑‍💼</span>${acc?`<span class="acc">${esc(acc)}</span>`:''}${pet?`<span class="pet">${esc(pet)}</span>`:''}</div>`;
}

function renderAuth(){
  app.innerHTML = `
  <div class="auth-screen">
    <section class="auth-visual">
      <div>
        <div class="brand-logo" style="background:#fff;color:#17365d;margin-bottom:26px">€</div>
        <h1>Gewinnverwendung<br>in der KG</h1>
        <p>Interaktiver Lernkurs mit Tabellenlabor, Rechentraining, Musterlösungen, XP, Avatar-Shop und vollständigen Prüfungsszenarien.</p>
      </div>
      <div class="auth-symbols" aria-hidden="true"><span>▦</span><span>🧮</span><span>🏆</span><span>🚲</span></div>
    </section>
    <section class="auth-panel">
      <div class="auth-card">
        <div class="auth-tabs">
          <button class="auth-tab ${authMode==='login'?'active':''}" data-action="auth-tab" data-mode="login">Anmelden</button>
          <button class="auth-tab ${authMode==='register'?'active':''}" data-action="auth-tab" data-mode="register">Registrieren</button>
        </div>
        ${authMode==='login'?`
          <form id="login-form" class="form-grid">
            <label>Klasse<input name="className" required autocomplete="organization" placeholder="z. B. BGW12a"></label>
            <label>Nickname<input name="nickname" required autocomplete="username" placeholder="Ihr Nickname"></label>
            <label>Passwort<input name="password" type="password" required autocomplete="current-password" placeholder="Ihr Passwort"></label>
            <button class="btn" type="submit">Anmelden</button>
          </form>
        `:`
          <form id="register-form" class="form-grid">
            <label>Rolle<select name="role" id="role-select"><option value="student" ${authRole==='student'?'selected':''}>Schüler/in</option><option value="teacher" ${authRole==='teacher'?'selected':''}>Lehrer/in</option></select></label>
            <label>Klasse<input name="className" required placeholder="z. B. BGW12a"></label>
            <label>Nickname<input name="nickname" required minlength="2" maxlength="24" placeholder="Selbst gewählter Nickname"></label>
            <label>Passwort<input name="password" type="password" required minlength="6" autocomplete="new-password" placeholder="Mindestens 6 Zeichen"></label>
            ${authRole==='teacher'?`<label>Lehrer-Code<input name="teacherCode" type="password" required placeholder="Code aus der Netlify-Variable"></label>`:''}
            <button class="btn" type="submit">Konto anlegen</button>
          </form>
        `}
        <div class="guest-card">
          <button class="btn secondary" data-action="guest">Ohne Anmeldung starten</button>
          <p class="micro">Ohne Anmeldung wird der Fortschritt nur auf diesem Gerät gespeichert. Mit Konto kann er auf mehreren Geräten fortgeführt werden.</p>
        </div>
        <div id="auth-feedback"></div>
      </div>
    </section>
  </div>`;
}

function renderShell(inner){
  const userName = session?.mode==='guest' ? 'Gast' : session?.user?.nickname || 'Lernende/r';
  const className = session?.mode==='guest' ? 'lokal' : session?.user?.className || '';
  app.innerHTML = `
  <div class="app-shell">
    <aside class="sidebar ${sidebarOpen?'open':''}">
      <div class="brand-block"><div class="brand-logo">€</div><div><h1>KG Gewinnverwendung</h1><p>Interaktiver Lernkurs</p></div></div>
      <button class="nav-btn ${currentView==='home'?'active':''}" data-action="nav" data-view="home"><span class="nav-icon">⌂</span><span>Übersicht</span></button>
      <div class="nav-section-title">Lernpfad</div>
      ${course.modules.map(m=>`<button class="nav-btn ${currentView===m.id?'active':''}" data-action="nav" data-view="${m.id}"><span class="nav-icon">${m.icon}</span><span>${esc(m.title.replace(/^\d+\.\s*/,''))}</span><small>${modulePct(m)}%</small></button>`).join('')}
      <div class="nav-section-title">Gamification</div>
      <button class="nav-btn ${currentView==='shop'?'active':''}" data-action="nav" data-view="shop"><span class="nav-icon">🛍️</span><span>XP-Shop</span><small>${xpBalance()} XP</small></button>
      <button class="nav-btn ${currentView==='profile'?'active':''}" data-action="nav" data-view="profile"><span class="nav-icon">👤</span><span>Avatar & Profil</span></button>
      ${isTeacher()?`<div class="nav-section-title">Lehrer</div><button class="nav-btn ${currentView==='teacher'?'active':''}" data-action="nav" data-view="teacher"><span class="nav-icon">📊</span><span>Klassenübersicht</span></button>`:''}
      <div class="sidebar-progress"><strong>${completedCount()} / ${allTasks.length} Aufgaben</strong><div class="progress-track" style="margin:8px 0 5px"><div class="progress-fill" style="width:${progressPct()}%"></div></div><small>${progressPct()}% Kursfortschritt</small></div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div class="topbar-left"><button class="btn secondary small mobile-menu" data-action="toggle-menu">☰</button><span class="hide-mobile"><strong>${esc(userName)}</strong> · ${esc(className)}</span></div>
        <div class="topbar-right"><span class="pill">⚡ <strong>${xpBalance()}</strong> XP verfügbar</span><span class="pill">🏆 ${earnedXP()} XP verdient</span><button class="nav-btn" style="width:auto;padding:0" data-action="nav" data-view="profile">${avatarHTML()}</button>${session?.mode==='account'?`<button class="btn secondary small" data-action="logout">Abmelden</button>`:`<button class="btn secondary small" data-action="show-auth">Anmelden</button>`}</div>
      </header>
      <div class="content">${inner}</div>
    </main>
  </div>
  <div class="toast-stack" id="toast-stack"></div>
  ${modalState?renderModal():''}`;
  applyTheme();
}

function renderHome(){
  const achievements = getAchievements();
  renderShell(`
    <section class="card hero-card">
      <div><span class="eyebrow">Ihr Lernpfad</span><h2>${esc(course.title)}</h2><p>${esc(course.subtitle)}</p><div class="action-row"><button class="btn" data-action="nav" data-view="${nextModuleId()}">Weiterlernen</button><button class="btn secondary" data-action="nav" data-view="m6">Direkt zum Tabellenlabor</button></div></div>
      <div class="hero-art"><div class="big-euro">€</div><div class="mini-table">AB → TV → Zins → Rest → EK</div></div>
    </section>
    <div class="stat-grid" style="margin:18px 0">
      <div class="stat"><strong>${progressPct()}%</strong><span>Kursfortschritt</span></div>
      <div class="stat"><strong>${completedCount()}</strong><span>Aufgaben gelöst</span></div>
      <div class="stat"><strong>${earnedXP()}</strong><span>XP verdient</span></div>
      <div class="stat"><strong>${sessionStreak}</strong><span>aktuelle Erfolgsserie</span></div>
    </div>
    <section class="card"><div class="page-head"><div><h2 style="font-size:28px">Lernmissionen</h2><p>Erklärungen, Beispiele und Übungen bauen aufeinander auf. Sie können dennoch jederzeit zu einem Kapitel springen.</p></div></div><div class="module-grid">${course.modules.map(m=>`
      <article class="module-card"><div class="icon">${m.icon}</div><div style="flex:1"><h3>${esc(m.title)}</h3><p>${esc(m.short)}</p><div class="meta"><span class="meta-chip">${m.tasks.length} Aufgaben</span><span class="meta-chip">${modulePct(m)}% erledigt</span></div><div class="progress-track" style="margin:10px 0"><div class="progress-fill" style="width:${modulePct(m)}%"></div></div><button class="btn secondary small" data-action="nav" data-view="${m.id}">Kapitel öffnen</button></div></article>`).join('')}</div></section>
    <section class="card" style="margin-top:18px"><h2 style="margin-top:0">Roter Faden: ${esc(course.redThread.company)}</h2><p>${esc(course.redThread.text)}</p><div class="module-grid">${course.redThread.people.map(p=>`<div class="definition"><h3>${esc(p.name)}</h3><p><strong>${esc(p.role)}</strong><br>eingezahltes Kapital: ${fmt(p.capital)} €${p.agreed?`<br>vereinbart: ${fmt(p.agreed)} €`:''}</p></div>`).join('')}</div></section>
    <section class="card" style="margin-top:18px"><h2 style="margin-top:0">Abzeichen</h2><div class="badge-grid">${achievements.map(a=>`<div class="achievement ${a.unlocked?'unlocked':''}"><span class="emoji">${a.icon}</span><strong>${esc(a.name)}</strong><div class="micro">${esc(a.text)}</div></div>`).join('')}</div></section>
  `);
}

function nextModuleId(){
  const m = course.modules.find(m=>modulePct(m)<100); return m?.id || 'm7';
}

function getAchievements(){
  const done=completedCount();
  const firstTable = ['t27','t29','t32','t33','t34','t35','t36'].some(id=>state.progress.completed[id]);
  return [
    {icon:'🚦',name:'Startklar',text:'Erste Aufgabe abgeschlossen',unlocked:done>=1},
    {icon:'🧮',name:'Rechenroutine',text:'10 Aufgaben abgeschlossen',unlocked:done>=10},
    {icon:'▦',name:'Tabellenpilot',text:'Erste Kompletttabelle gelöst',unlocked:firstTable},
    {icon:'🏆',name:'KG-Master',text:'Alle Aufgaben abgeschlossen',unlocked:done===allTasks.length}
  ];
}

function renderModule(module){
  renderShell(`
    <div class="page-head"><div><span class="eyebrow">Lernmission</span><h2>${module.icon} ${esc(module.title)}</h2><p>${esc(module.short)}</p></div><div class="pill">${modulePct(module)}% abgeschlossen</div></div>
    <section class="card lesson-content">${module.lesson}</section>
    <section class="task-section"><div class="task-section-head"><div><span class="eyebrow">Übungen</span><h2 style="margin:2px 0">Trainieren & anwenden</h2></div><span class="pill">${module.tasks.filter(t=>state.progress.completed[t.id]).length}/${module.tasks.length} erledigt</span></div>${module.tasks.map(renderTask).join('')}</section>
  `);
}

function renderTask(task){
  const done=!!state.progress.completed[task.id];
  const sol=!!state.progress.solutionViews[task.id];
  return `<article class="task-card ${done?'completed':''}" id="card-${task.id}">
    <div class="task-title-row"><div><div class="badges"><span class="task-badge afb">AFB ${task.afb}</span>${task.bonus?'<span class="task-badge bonus">Bonus</span>':''}${done?'<span class="task-badge">✓ abgeschlossen</span>':''}</div><h3>${esc(task.title)}</h3></div><span class="task-badge">${task.xp + (task.bonus?15:0)} XP</span></div>
    <p class="prompt">${esc(task.prompt)}</p>
    ${renderAnswerArea(task)}
    <div class="solution-actions">
      ${task.hints?.length?`<button class="btn ghost small" data-action="hint" data-task="${task.id}">${openHints.has(task.id)?'Hinweis ausblenden':'Hinweis'}</button>`:''}
      <button class="btn secondary small" data-action="solution" data-task="${task.id}">${sol?'Musterlösung anzeigen':'Musterlösung'}</button>
    </div>
    ${openHints.has(task.id) && task.hints?.length?`<div class="hint-box">💡 ${task.hints.map(esc).join('<br>')}</div>`:''}
    ${feedback[task.id]?renderFeedback(feedback[task.id]):''}
    ${sol?renderSolution(task):''}
  </article>`;
}

function renderAnswerArea(task){
  const draft=state.progress.drafts[task.id];
  if(task.type==='single') return `<div class="options">${task.options.map((o,i)=>`<label class="option"><input type="radio" name="${task.id}" data-draft-single="${task.id}" value="${i}" ${String(draft)===String(i)?'checked':''}><span>${esc(o)}</span></label>`).join('')}</div><div class="action-row"><button class="btn small" data-action="check" data-task="${task.id}">Prüfen</button></div>`;
  if(task.type==='multi'){
    const arr=Array.isArray(draft)?draft:[];
    return `<div class="options">${task.options.map((o,i)=>`<label class="option"><input type="checkbox" data-draft-multi="${task.id}" value="${i}" ${arr.includes(i)?'checked':''}><span>${esc(o)}</span></label>`).join('')}</div><div class="action-row"><button class="btn small" data-action="check" data-task="${task.id}">Prüfen</button></div>`;
  }
  if(task.type==='truefalse'){
    const obj=draft&&typeof draft==='object'&&!Array.isArray(draft)?draft:{};
    return `<div class="options">${task.statements.map(([st],i)=>`<div class="option" style="display:block"><div style="font-weight:700;margin-bottom:7px">${esc(st)}</div><label style="margin-right:14px"><input type="radio" name="${task.id}-${i}" data-draft-tf="${task.id}" data-key="${i}" value="true" ${obj[i]===true?'checked':''}> Richtig</label><label><input type="radio" name="${task.id}-${i}" data-draft-tf="${task.id}" data-key="${i}" value="false" ${obj[i]===false?'checked':''}> Falsch</label></div>`).join('')}</div><div class="action-row"><button class="btn small" data-action="check" data-task="${task.id}">Prüfen</button></div>`;
  }
  if(task.type==='numeric') return `<div class="answer-row"><input class="answer-input" inputmode="decimal" data-draft-text="${task.id}" value="${esc(draft||'')}" placeholder="Ergebnis eingeben"><span class="unit-label">${esc(task.unit||'')}</span><button class="btn small" data-action="check" data-task="${task.id}">Prüfen</button></div>`;
  if(task.type==='free') return `<textarea class="answer-input" data-draft-text="${task.id}" placeholder="${esc(task.placeholder||'Antwort eingeben')}">${esc(draft||'')}</textarea><div class="action-row"><button class="btn small" data-action="save-free" data-task="${task.id}">Antwort speichern</button></div>`;
  if(task.type==='multiNumeric'){
    const obj=draft&&typeof draft==='object'&&!Array.isArray(draft)?draft:{};
    return `<div class="multi-fields">${task.fields.map(([label],i)=>`<div class="field-line"><label>${esc(label)}</label><input class="answer-input" inputmode="decimal" data-draft-field="${task.id}" data-key="${i}" value="${esc(obj[i]||'')}" placeholder="Betrag in €"></div>`).join('')}</div><div class="action-row"><button class="btn small" data-action="check" data-task="${task.id}">Prüfen</button></div>`;
  }
  if(task.type==='order'){
    const list=Array.isArray(draft)&&draft.length?draft:[...task.items].reverse();
    return `<div class="order-list">${list.map((item,i)=>`<div class="order-item"><span class="task-badge">${i+1}</span><span class="grow">${esc(item)}</span><div class="order-controls"><button class="icon-btn" data-action="order-up" data-task="${task.id}" data-index="${i}">↑</button><button class="icon-btn" data-action="order-down" data-task="${task.id}" data-index="${i}">↓</button></div></div>`).join('')}</div><div class="action-row"><button class="btn small" data-action="check" data-task="${task.id}">Prüfen</button></div>`;
  }
  if(task.type==='match'){
    const obj=draft&&typeof draft==='object'&&!Array.isArray(draft)?draft:{};
    const used=Object.values(obj);
    return `<div class="match-grid"><div class="match-source"><strong>Begriffe</strong>${task.pairs.map(([term],i)=>`<div class="match-chip ${selectedMatch[task.id]===term?'selected':''}" draggable="true" data-match-source="${task.id}" data-term="${esc(term)}">${esc(term)}${used.includes(term)?' ✓':''}</div>`).join('')}</div><div class="match-targets"><strong>Bedeutungen</strong>${task.pairs.map(([,def],i)=>`<div class="match-target" data-match-target="${task.id}" data-index="${i}"><strong>${esc(def)}</strong><div class="match-drop">${obj[i]?esc(obj[i]):'Begriff hier zuordnen'}</div></div>`).join('')}</div></div><div class="action-row"><button class="btn small" data-action="check" data-task="${task.id}">Prüfen</button><button class="btn secondary small" data-action="match-clear" data-task="${task.id}">Zuordnung leeren</button></div>`;
  }
  if(task.type==='table'){
    const obj=draft&&typeof draft==='object'&&!Array.isArray(draft)?draft:{};
    const cellStatus=feedback[task.id]?.cellStatus||{};
    return `<div class="table-wrap"><table class="calc-table"><thead><tr><th>Gesellschafter</th>${task.columns.map(([,l])=>`<th>${esc(l)} (€)</th>`).join('')}</tr></thead><tbody>${task.rows.map((r,ri)=>`<tr class="${r.sum?'sum-row':''}"><td>${esc(r.label)}</td>${task.columns.map(([key])=>{const ck=`${ri}.${key}`,cls=cellStatus[ck]==='ok'?'ok':cellStatus[ck]==='no'?'no':'';return `<td><input class="${cls}" inputmode="decimal" data-table-cell="${task.id}" data-key="${ck}" value="${esc(obj[ck]||'')}" aria-label="${esc(r.label)} ${esc(key)}"></td>`}).join('')}</tr>`).join('')}</tbody></table></div><div class="action-row"><button class="btn small" data-action="check" data-task="${task.id}">Tabelle prüfen</button></div>`;
  }
  return '';
}

function renderFeedback(f){ return `<div class="feedback ${f.kind||'info'}">${f.kind==='good'?'✓ ':f.kind==='bad'?'↻ ':''}${esc(f.text)}${f.sub?`<span class="sub">${esc(f.sub)}</span>`:''}</div>`; }

function renderSolution(task){
  let content='';
  if(task.type==='table') content = renderSolutionTable(task);
  else if(task.type==='free') content = `<p>${esc(task.solution)}</p>`;
  else if(task.steps) content = `<ol>${task.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`;
  else if(task.explanation && task.type!=='truefalse') content = `<p>${esc(task.explanation)}</p>`;
  if(task.type==='single' && !task.steps) content += `<p><strong>Richtige Antwort:</strong> ${esc(task.options[task.answer])}</p>`;
  if(task.type==='multi' && !task.steps) content += `<p><strong>Richtig:</strong> ${task.answers.map(i=>esc(task.options[i])).join('; ')}</p>`;
  if(task.type==='truefalse') content += `<ul>${task.statements.map(([st,a])=>`<li>${a?'Richtig':'Falsch'}: ${esc(st)}</li>`).join('')}</ul><p>${esc(task.explanation||'')}</p>`;
  if(task.type==='multiNumeric') content += `<p><strong>Ergebnisse:</strong> ${task.fields.map(([l,v])=>`${esc(l)}: ${fmt(v)} €`).join(' | ')}</p>`;
  if(task.type==='match') content += `<ul>${task.pairs.map(([a,b])=>`<li><strong>${esc(a)}</strong> → ${esc(b)}</li>`).join('')}</ul>`;
  if(task.type==='order') content += `<ol>${task.answer.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
  return `<div class="solution-box"><h4>Musterlösung & Rechenhinweise</h4>${content}${task.type==='free' && !state.progress.completed[task.id]?`<div class="solution-actions"><button class="btn good small" data-action="self-correct" data-task="${task.id}">Meine Antwort passt</button><button class="btn secondary small" data-action="focus-answer" data-task="${task.id}">Ich überarbeite noch</button></div>`:''}<div class="micro" style="margin-top:9px">Die Musterlösung wurde geöffnet. Sie können die Aufgabe weiterhin abschließen; die XP-Ausbeute ist dann reduziert.</div></div>`;
}

function renderSolutionTable(task){
  return `<div class="table-wrap"><table class="calc-table"><thead><tr><th>Gesellschafter</th>${task.columns.map(([,l])=>`<th>${esc(l)} (€)</th>`).join('')}</tr></thead><tbody>${task.rows.map(r=>`<tr class="${r.sum?'sum-row':''}"><td>${esc(r.label)}</td>${task.columns.map(([k])=>`<td>${fmt(r.values[k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${task.steps?.length?`<ol>${task.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}`;
}

function renderShop(){
  renderShell(`<div class="page-head"><div><span class="eyebrow">Gamification</span><h2>🛍️ XP-Shop</h2><p>Verdiente XP können Sie für Hintergrundthemen, Accessoires und Begleiter ausgeben. Gekaufte Elemente bleiben freigeschaltet.</p></div><div class="pill">${xpBalance()} XP verfügbar</div></div>
  <section class="card"><div class="shop-grid">${shopItems.map(item=>{
    const owned=state.cosmetics.purchased.includes(item.id); const active=(item.kind==='theme'&&state.cosmetics.activeTheme===item.value)||(item.kind==='accessory'&&state.cosmetics.accessory===item.value)||(item.kind==='pet'&&state.cosmetics.pet===item.value);
    return `<article class="shop-item"><div class="shop-icon">${item.icon}</div><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><div class="shop-cost">${item.cost} XP</div><div class="action-row">${owned?`<button class="btn ${active?'good':'secondary'} small" data-action="equip" data-item="${item.id}">${active?'Aktiv':'Auswählen'}</button>`:`<button class="btn small" data-action="buy" data-item="${item.id}" ${xpBalance()<item.cost?'disabled':''}>Freischalten</button>`}</div></article>`}).join('')}</div></section>`);
}

function renderProfile(){
  const themes=[['classic','Standard'],...shopItems.filter(i=>i.kind==='theme'&&state.cosmetics.purchased.includes(i.id)).map(i=>[i.value,i.name])];
  const accessories=[['','Keins'],...shopItems.filter(i=>i.kind==='accessory'&&state.cosmetics.purchased.includes(i.id)).map(i=>[i.value,i.name])];
  const pets=[['','Keins'],...shopItems.filter(i=>i.kind==='pet'&&state.cosmetics.purchased.includes(i.id)).map(i=>[i.value,i.name])];
  renderShell(`<div class="page-head"><div><span class="eyebrow">Profil</span><h2>Avatar & Einstellungen</h2><p>${session?.mode==='guest'?'Ihr Gastfortschritt liegt nur auf diesem Gerät.':'Ihr Fortschritt wird Ihrem Nickname und Ihrer Klasse zugeordnet.'}</p></div></div>
  <section class="card avatar-card">${avatarHTML('large')}<div class="cosmetic-controls"><label><strong>Hintergrund</strong><select class="answer-input" data-cosmetic="theme">${themes.map(([v,n])=>`<option value="${esc(v)}" ${state.cosmetics.activeTheme===v?'selected':''}>${esc(n)}</option>`).join('')}</select></label><label><strong>Accessoire</strong><select class="answer-input" data-cosmetic="accessory">${accessories.map(([v,n])=>`<option value="${esc(v)}" ${state.cosmetics.accessory===v?'selected':''}>${esc(n)}</option>`).join('')}</select></label><label><strong>Begleiter</strong><select class="answer-input" data-cosmetic="pet">${pets.map(([v,n])=>`<option value="${esc(v)}" ${state.cosmetics.pet===v?'selected':''}>${esc(n)}</option>`).join('')}</select></label></div></section>
  <section class="card"><h3 style="margin-top:0">Kontostatus</h3><p><strong>${session?.mode==='guest'?'Gastmodus':esc(session.user.nickname)}</strong>${session?.mode==='account'?` · Klasse ${esc(session.user.className)} · ${session.user.role==='teacher'?'Lehrerzugang':'Schülerzugang'}`:''}</p><p>${completedCount()} von ${allTasks.length} Aufgaben erledigt · ${earnedXP()} XP verdient · ${xpBalance()} XP verfügbar.</p>${session?.mode==='guest'?`<button class="btn" data-action="show-auth">Jetzt anmelden oder Konto anlegen</button>`:''}</section>`);
}

function renderTeacher(){
  if(!isTeacher()){ navigate('home'); return; }
  const rows=teacherUsers||[];
  renderShell(`<div class="page-head"><div><span class="eyebrow">Lehrerzugang</span><h2>Klassenübersicht ${esc(session.user.className)}</h2><p>Fortschritt einsehen, Lernstände zurücksetzen, Nutzer entfernen und Passwörter neu setzen.</p></div><div class="action-row"><button class="btn secondary small" data-action="teacher-refresh">Aktualisieren</button><button class="btn danger small" data-action="teacher-reset-all">Gesamten Klassenfortschritt löschen</button></div></div>
  <section class="card">${teacherLoading?'<div class="empty">Daten werden geladen …</div>':rows.length?`<div class="table-wrap"><table class="teacher-table"><thead><tr><th>Nickname</th><th>Rolle</th><th>Fortschritt</th><th>XP</th><th>Letzte Aktivität</th><th>Aktionen</th></tr></thead><tbody>${rows.map(u=>`<tr><td><strong>${esc(u.nickname)}</strong></td><td>${u.role==='teacher'?'Lehrer/in':'Schüler/in'}</td><td><div class="user-progress-bar"><div class="progress-track"><div class="progress-fill" style="width:${u.progressPct}%"></div></div><small>${u.completed}/${allTasks.length} (${u.progressPct}%)</small></div></td><td>${u.earnedXP}</td><td>${esc(u.lastSeen||'–')}</td><td><div class="teacher-actions">${u.role!=='teacher'?`<button class="btn secondary small" data-action="teacher-reset-user" data-user="${esc(u.key)}">Fortschritt löschen</button><button class="btn secondary small" data-action="teacher-password" data-user="${esc(u.key)}" data-name="${esc(u.nickname)}">Passwort setzen</button><button class="btn danger small" data-action="teacher-delete" data-user="${esc(u.key)}" data-name="${esc(u.nickname)}">Nutzer entfernen</button>`:'–'}</div></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Noch keine Nutzer in dieser Klasse gefunden.</div>'}</section>`);
}

function renderModal(){
  if(modalState?.type==='solution') return `<div class="modal-backdrop"><div class="modal"><h3>Musterlösung wirklich anzeigen?</h3><p>Sind Sie sicher, oder möchten Sie die Aufgabe noch einmal selbst versuchen? Sie erhalten auch nach dem Öffnen der Lösung noch Lern-XP, allerdings weniger.</p><div class="modal-actions"><button class="btn secondary" data-action="modal-close">Noch einmal versuchen</button><button class="btn" data-action="modal-solution-confirm" data-task="${modalState.taskId}">Musterlösung anzeigen</button></div></div></div>`;
  if(modalState?.type==='confirm') return `<div class="modal-backdrop"><div class="modal"><h3>${esc(modalState.title)}</h3><p>${esc(modalState.text)}</p><div class="modal-actions"><button class="btn secondary" data-action="modal-close">Abbrechen</button><button class="btn danger" data-action="modal-confirm">Bestätigen</button></div></div></div>`;
  return '';
}

function render(){
  if(!session){ renderAuth(); return; }
  if(currentView==='home') return renderHome();
  if(currentView==='shop') return renderShop();
  if(currentView==='profile') return renderProfile();
  if(currentView==='teacher') return renderTeacher();
  const mod=moduleById(currentView); if(mod) return renderModule(mod);
  currentView='home'; renderHome();
}

function toast(msg){
  let stack=document.querySelector('#toast-stack');
  if(!stack){ stack=document.createElement('div'); stack.className='toast-stack'; stack.id='toast-stack'; document.body.appendChild(stack); }
  const el=document.createElement('div'); el.className='toast'; el.textContent=msg; stack.appendChild(el); setTimeout(()=>el.remove(),3400);
}

function setDraft(id,value){ state.progress.drafts[id]=value; saveGuest(); }

function markAttempt(id){ state.progress.attempts[id]=Number(state.progress.attempts[id]||0)+1; }

function completeTask(task, self=false){
  if(state.progress.completed[task.id]) return;
  const raw=task.xp+(task.bonus?15:0);
  const viewed=!!state.progress.solutionViews[task.id];
  const award=viewed?Math.ceil(raw*.6):raw;
  state.progress.completed[task.id]={awardedXP:award,completedAt:new Date().toISOString(),selfChecked:self,solutionViewed:viewed};
  sessionStreak += 1;
  feedback[task.id]={kind:'good',text:viewed?`Abgeschlossen. ${award} Lern-XP erhalten.`:`Richtig. ${award} XP erhalten.`,sub:'Die Lösung wurde Ihrem Fortschritt hinzugefügt.'};
  scheduleSave();
  toast(`+${award} XP · ${task.title}`);
}

function checkTask(task){
  markAttempt(task.id);
  const d=state.progress.drafts[task.id];
  let ok=false, sub='';
  if(task.type==='single') ok=Number(d)===task.answer;
  if(task.type==='multi'){
    const a=[...(Array.isArray(d)?d:[])].sort((x,y)=>x-y), b=[...task.answers].sort((x,y)=>x-y); ok=JSON.stringify(a)===JSON.stringify(b);
  }
  if(task.type==='truefalse'){
    const obj=d||{}; const hits=task.statements.filter(([,a],i)=>obj[i]===a).length; ok=hits===task.statements.length; sub=`${hits} von ${task.statements.length} Aussagen stimmen.`;
  }
  if(task.type==='numeric') ok=numericMatches(d,task.answer);
  if(task.type==='multiNumeric'){
    const obj=d||{}; const hits=task.fields.filter(([,v],i)=>numericMatches(obj[i],v)).length; ok=hits===task.fields.length; sub=`${hits} von ${task.fields.length} Teilwerten stimmen.`;
  }
  if(task.type==='order'){
    const list=Array.isArray(d)&&d.length?d:[...task.items].reverse(); ok=JSON.stringify(list)===JSON.stringify(task.answer);
  }
  if(task.type==='match'){
    const obj=d||{}; const hits=task.pairs.filter(([term],i)=>obj[i]===term).length; ok=hits===task.pairs.length; sub=`${hits} von ${task.pairs.length} Zuordnungen stimmen.`;
  }
  if(task.type==='table'){
    const obj=d||{}, status={}; let hits=0,total=0;
    task.rows.forEach((r,ri)=>task.columns.forEach(([key])=>{total++;const ck=`${ri}.${key}`;const yes=numericMatches(obj[ck],r.values[key]);status[ck]=yes?'ok':'no'; if(yes)hits++;}));
    ok=hits===total; sub=`${hits} von ${total} Tabellenfeldern stimmen.`; feedback[task.id]={kind:ok?'good':'bad',text:ok?'Die Tabelle ist vollständig richtig.':'Noch nicht vollständig korrekt.',sub,cellStatus:status};
  }
  if(ok){ completeTask(task); }
  else if(task.type!=='table'){
    sessionStreak=0; feedback[task.id]={kind:'bad',text:'Noch nicht richtig. Prüfen Sie Ihren Rechenweg und versuchen Sie es erneut.',sub};
  }
  scheduleSave(); render();
  setTimeout(()=>document.querySelector(`#card-${task.id}`)?.scrollIntoView({block:'nearest'}),20);
}

function buyItem(id){
  const item=shopItems.find(i=>i.id===id); if(!item)return;
  if(state.cosmetics.purchased.includes(id))return;
  if(xpBalance()<item.cost){toast('Dafür sind noch nicht genug XP verfügbar.');return;}
  state.xpSpent += item.cost; state.cosmetics.purchased.push(id); equipItem(id,false); scheduleSave(); toast(`${item.name} freigeschaltet.`); render();
}
function equipItem(id,rerender=true){
  const item=shopItems.find(i=>i.id===id); if(!item || !state.cosmetics.purchased.includes(id))return;
  if(item.kind==='theme')state.cosmetics.activeTheme=item.value;
  if(item.kind==='accessory')state.cosmetics.accessory=item.value;
  if(item.kind==='pet')state.cosmetics.pet=item.value;
  scheduleSave(); applyTheme(); if(rerender)render();
}

async function loadTeacherUsers(){
  if(!isTeacher())return; teacherLoading=true; render();
  try{ const r=await api('listClass'); teacherUsers=r.users||[]; }
  catch(e){ toast(e.message); teacherUsers=[]; }
  teacherLoading=false; render();
}

function askConfirm(title,text,onConfirm){ modalState={type:'confirm',title,text,onConfirm}; render(); }

app.addEventListener('click', async e=>{
  const btn=e.target.closest('[data-action]');
  if(!btn)return;
  const action=btn.dataset.action;
  if(action==='auth-tab'){authMode=btn.dataset.mode;render();}
  if(action==='guest'){
    state=safeState(JSON.parse(localStorage.getItem(STORAGE_GUEST)||'null')); session={mode:'guest',user:{nickname:'Gast',className:'lokal',role:'student'}}; currentView='home';render();
  }
  if(action==='show-auth'){ session=null; authMode='login'; render(); }
  if(action==='logout'){
    try{await api('logout');}catch{} localStorage.removeItem(STORAGE_TOKEN); session=null; teacherUsers=null; render();
  }
  if(action==='nav'){navigate(btn.dataset.view);}
  if(action==='toggle-menu'){sidebarOpen=!sidebarOpen;render();}
  if(action==='check'){const t=taskById(btn.dataset.task); if(t)checkTask(t);}
  if(action==='save-free'){
    const id=btn.dataset.task; feedback[id]={kind:'info',text:'Ihre Antwort ist gespeichert. Öffnen Sie anschließend die Musterlösung und vergleichen Sie selbst.'}; scheduleSave();render();
  }
  if(action==='hint'){const id=btn.dataset.task;openHints.has(id)?openHints.delete(id):openHints.add(id);render();}
  if(action==='solution'){
    const id=btn.dataset.task;
    if(state.progress.solutionViews[id]){document.querySelector(`#card-${id} .solution-box`)?.scrollIntoView({behavior:'smooth',block:'center'});return;}
    modalState={type:'solution',taskId:id}; render();
  }
  if(action==='modal-close'){modalState=null;render();}
  if(action==='modal-solution-confirm'){
    const id=btn.dataset.task; state.progress.solutionViews[id]=true; modalState=null; scheduleSave(); render(); setTimeout(()=>document.querySelector(`#card-${id} .solution-box`)?.scrollIntoView({behavior:'smooth',block:'center'}),40);
  }
  if(action==='self-correct'){const t=taskById(btn.dataset.task);if(t){const draft=String(state.progress.drafts[t.id]||'').trim();if(!draft){feedback[t.id]={kind:'bad',text:'Bitte tragen Sie zuerst eine eigene Antwort ein, bevor Sie sie selbst als passend abhaken.'};render();return;}completeTask(t,true);render();}}
  if(action==='focus-answer'){const id=btn.dataset.task; document.querySelector(`#card-${id} textarea`)?.focus();}
  if(action==='order-up'||action==='order-down'){
    const t=taskById(btn.dataset.task);if(!t)return;let list=Array.isArray(state.progress.drafts[t.id])&&state.progress.drafts[t.id].length?[...state.progress.drafts[t.id]]:[...t.items].reverse(); const i=Number(btn.dataset.index),j=action==='order-up'?i-1:i+1;if(j<0||j>=list.length)return;[list[i],list[j]]=[list[j],list[i]];setDraft(t.id,list);render();
  }
  if(action==='match-clear'){setDraft(btn.dataset.task,{});selectedMatch[btn.dataset.task]=null;render();}
  if(action==='buy')buyItem(btn.dataset.item);
  if(action==='equip')equipItem(btn.dataset.item);
  if(action==='teacher-refresh')loadTeacherUsers();
  if(action==='teacher-reset-all')askConfirm('Klassenfortschritt löschen','Der Lernfortschritt und die freigeschalteten Shop-Elemente aller Schüler/innen dieser Klasse werden zurückgesetzt. Konten bleiben bestehen.',async()=>{await api('resetClassProgress');toast('Klassenfortschritt wurde zurückgesetzt.');await loadTeacherUsers();});
  if(action==='teacher-reset-user'){
    const userKey=btn.dataset.user; askConfirm('Fortschritt löschen','Der Lernfortschritt dieses Nutzers wird vollständig zurückgesetzt. Das Konto bleibt bestehen.',async()=>{await api('resetUserProgress',{userKey});toast('Fortschritt gelöscht.');await loadTeacherUsers();});
  }
  if(action==='teacher-delete'){
    const userKey=btn.dataset.user,name=btn.dataset.name; askConfirm('Nutzer entfernen',`Das Konto „${name}“ wird dauerhaft entfernt.`,async()=>{await api('deleteUser',{userKey});toast('Nutzer entfernt.');await loadTeacherUsers();});
  }
  if(action==='teacher-password'){
    const newPassword=window.prompt(`Neues vorläufiges Passwort für ${btn.dataset.name} (mindestens 6 Zeichen):`); if(!newPassword)return; if(newPassword.length<6){toast('Das Passwort muss mindestens 6 Zeichen lang sein.');return;} try{await api('resetPassword',{userKey:btn.dataset.user,newPassword});toast('Passwort wurde neu gesetzt.');}catch(err){toast(err.message);}
  }
  if(action==='modal-confirm'){
    const fn=modalState?.onConfirm; modalState=null; if(fn){try{await fn();}catch(err){toast(err.message);render();}} else render();
  }
});

app.addEventListener('input',e=>{
  const el=e.target;
  if(el.dataset.draftText){setDraft(el.dataset.draftText,el.value);}
  if(el.dataset.draftSingle){setDraft(el.dataset.draftSingle,Number(el.value));}
  if(el.dataset.draftMulti){const id=el.dataset.draftMulti;const boxes=[...document.querySelectorAll(`[data-draft-multi="${id}"]`)];setDraft(id,boxes.filter(x=>x.checked).map(x=>Number(x.value)));}
  if(el.dataset.draftTf){const id=el.dataset.draftTf;const obj=state.progress.drafts[id]&&typeof state.progress.drafts[id]==='object'&&!Array.isArray(state.progress.drafts[id])?{...state.progress.drafts[id]}:{};obj[el.dataset.key]=el.value==='true';setDraft(id,obj);}
  if(el.dataset.draftField){const id=el.dataset.draftField;const obj=state.progress.drafts[id]&&typeof state.progress.drafts[id]==='object'&&!Array.isArray(state.progress.drafts[id])?{...state.progress.drafts[id]}:{};obj[el.dataset.key]=el.value;setDraft(id,obj);}
  if(el.dataset.tableCell){const id=el.dataset.tableCell;const obj=state.progress.drafts[id]&&typeof state.progress.drafts[id]==='object'&&!Array.isArray(state.progress.drafts[id])?{...state.progress.drafts[id]}:{};obj[el.dataset.key]=el.value;setDraft(id,obj);}
});

app.addEventListener('change',e=>{
  if(e.target.id==='role-select'){authRole=e.target.value;render();}
  if(e.target.dataset.cosmetic){
    const k=e.target.dataset.cosmetic,v=e.target.value;if(k==='theme')state.cosmetics.activeTheme=v;if(k==='accessory')state.cosmetics.accessory=v;if(k==='pet')state.cosmetics.pet=v;scheduleSave();render();
  }
});

app.addEventListener('click',e=>{
  const src=e.target.closest('[data-match-source]'); if(src){selectedMatch[src.dataset.matchSource]=src.dataset.term;render();return;}
  const target=e.target.closest('[data-match-target]'); if(target){const id=target.dataset.matchTarget,term=selectedMatch[id];if(!term)return;const obj=state.progress.drafts[id]&&typeof state.progress.drafts[id]==='object'&&!Array.isArray(state.progress.drafts[id])?{...state.progress.drafts[id]}:{};Object.keys(obj).forEach(k=>{if(obj[k]===term)delete obj[k]});obj[target.dataset.index]=term;setDraft(id,obj);selectedMatch[id]=null;render();}
});
app.addEventListener('dragstart',e=>{const src=e.target.closest('[data-match-source]');if(src)draggedMatch={taskId:src.dataset.matchSource,term:src.dataset.term};});
app.addEventListener('dragover',e=>{if(e.target.closest('[data-match-target]'))e.preventDefault();});
app.addEventListener('drop',e=>{const target=e.target.closest('[data-match-target]');if(!target||!draggedMatch||draggedMatch.taskId!==target.dataset.matchTarget)return;e.preventDefault();const id=target.dataset.matchTarget;const obj=state.progress.drafts[id]&&typeof state.progress.drafts[id]==='object'&&!Array.isArray(state.progress.drafts[id])?{...state.progress.drafts[id]}:{};Object.keys(obj).forEach(k=>{if(obj[k]===draggedMatch.term)delete obj[k]});obj[target.dataset.index]=draggedMatch.term;setDraft(id,obj);draggedMatch=null;render();});

app.addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.target; const fd=new FormData(form);
  const box=document.querySelector('#auth-feedback');
  try{
    if(form.id==='login-form'){
      const result=await api('login',{className:fd.get('className'),nickname:fd.get('nickname'),password:fd.get('password')});
      session={mode:'account',token:result.token,user:result.user};localStorage.setItem(STORAGE_TOKEN,result.token);
      const guest=safeState(JSON.parse(localStorage.getItem(STORAGE_GUEST)||'null'));state=mergeStates(result.state,guest);await api('saveState',{state});localStorage.removeItem(STORAGE_GUEST);currentView=result.user.role==='teacher'?'teacher':'home';render();if(isTeacher())loadTeacherUsers();toast('Anmeldung erfolgreich. Fortschritt wurde synchronisiert.');
    }
    if(form.id==='register-form'){
      const result=await api('register',{role:fd.get('role'),className:fd.get('className'),nickname:fd.get('nickname'),password:fd.get('password'),teacherCode:fd.get('teacherCode')||''});
      session={mode:'account',token:result.token,user:result.user};localStorage.setItem(STORAGE_TOKEN,result.token);
      const guest=safeState(JSON.parse(localStorage.getItem(STORAGE_GUEST)||'null'));state=mergeStates(result.state,guest);await api('saveState',{state});localStorage.removeItem(STORAGE_GUEST);currentView=result.user.role==='teacher'?'teacher':'home';render();if(isTeacher())loadTeacherUsers();toast('Konto wurde angelegt.');
    }
  }catch(err){if(box)box.innerHTML=`<div class="feedback bad">${esc(err.message)}</div>`;}
});

async function boot(){
  if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}
  const token=localStorage.getItem(STORAGE_TOKEN);
  if(token){
    session={mode:'account',token,user:null};
    try{
      const result=await api('session');session.user=result.user;state=safeState(result.state);render();if(currentView==='teacher'&&isTeacher())loadTeacherUsers();return;
    }catch{localStorage.removeItem(STORAGE_TOKEN);session=null;}
  }
  renderAuth();
}
boot();
