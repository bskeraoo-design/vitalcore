/* ════════════════════════════════════════
   VITALCORE — App.js
   SPA with Auth, Real-time Simulation,
   Daily Mission, LocalStorage persistence
════════════════════════════════════════ */

const LS = {
  user:         'vc_user',
  data:         'vc_data',
  mission:      'vc_mission',
  missionDate:  'vc_mission_date',
};

/* ── State ── */
let state = {
  synced: false,
  liveMode: false,
  liveInterval: null,
  hrv: 0, hr: 0, spo2: 0, recovery: 0,
  strain: 0, sleep: 0, stress: 0,
};
let user = null;

/* ════════════════════════════════════════
   AUTH
════════════════════════════════════════ */
function loginWithGoogle() {
  const section   = document.getElementById('oauth-section');
  const loading   = document.getElementById('login-loading');
  const loadingTxt = document.getElementById('loading-text');
  section.classList.add('hidden');
  loading.classList.remove('hidden');
  loadingTxt.textContent = 'Connecting to Google...';
  setTimeout(() => { loadingTxt.textContent = 'Verifying identity...'; }, 900);
  setTimeout(() => { loadingTxt.textContent = 'Applying End-to-End Encryption...'; }, 1700);
  setTimeout(() => {
    const mockUser = { name: 'Bskerao', email: 'bskeraoo@gmail.com', avatar: 'B', method: 'google' };
    completeLogin(mockUser);
  }, 2600);
}

function loginWithEmail() {
  const emailInput = document.getElementById('email-input');
  const passWrap   = document.getElementById('pass-wrap');
  const passInput  = document.getElementById('pass-input');
  const btn        = document.getElementById('email-btn');
  const email      = emailInput.value.trim();
  if (!email || !email.includes('@')) {
    emailInput.style.borderColor = 'var(--red)';
    setTimeout(() => { emailInput.style.borderColor = ''; }, 1500);
    return;
  }
  if (passWrap.style.display === 'none') {
    passWrap.style.display = 'flex';
    btn.textContent = 'Sign In';
    emailInput.disabled = true;
    return;
  }
  const pass = passInput.value;
  if (!pass) {
    passInput.style.borderColor = 'var(--red)';
    setTimeout(() => { passInput.style.borderColor = ''; }, 1500);
    return;
  }
  const section   = document.getElementById('oauth-section');
  const loading   = document.getElementById('login-loading');
  const loadingTxt = document.getElementById('loading-text');
  section.classList.add('hidden');
  loading.classList.remove('hidden');
  loadingTxt.textContent = 'Verifying credentials...';
  setTimeout(() => { loadingTxt.textContent = 'Applying End-to-End Encryption...'; }, 1000);
  setTimeout(() => {
    const name = email.split('@')[0];
    const initials = name.charAt(0).toUpperCase();
    completeLogin({ name, email, avatar: initials, method: 'email' });
  }, 2000);
}

function completeLogin(u) {
  user = u;
  localStorage.setItem(LS.user, JSON.stringify(u));
  document.getElementById('login-screen').classList.add('hidden');
  const app = document.getElementById('app');
  app.classList.remove('hidden');
  app.style.animation = 'fadeUp .4s ease';
  setUserUI(u);
  initApp();
}

function setUserUI(u) {
  ['sidebar-avatar','profile-avatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = u.avatar || '?';
  });
  const sn = document.getElementById('sidebar-name');
  const pn = document.getElementById('profile-name');
  const pe = document.getElementById('profile-email');
  if (sn) sn.textContent = u.name || 'User';
  if (pn) pn.textContent = u.name || 'User';
  if (pe) pe.textContent = u.email || '--';
}

function logout() {
  if (!confirm('Sign out of VitalCore?')) return;
  localStorage.removeItem(LS.user);
  localStorage.removeItem(LS.data);
  stopLive();
  state = { synced:false, liveMode:false, liveInterval:null, hrv:0, hr:0, spo2:0, recovery:0, strain:0, sleep:0, stress:0 };
  document.getElementById('app').classList.add('hidden');
  const ls = document.getElementById('login-screen');
  ls.classList.remove('hidden');
  // Reset login form
  document.getElementById('oauth-section').classList.remove('hidden');
  document.getElementById('login-loading').classList.add('hidden');
  document.getElementById('email-input').value = '';
  document.getElementById('email-input').disabled = false;
  document.getElementById('pass-wrap').style.display = 'none';
  document.getElementById('email-btn').textContent = 'Continue with Email';
  resetDisplayToZero();
}

/* ════════════════════════════════════════
   APP INIT
════════════════════════════════════════ */
function initApp() {
  setTodayDate();
  initNav();
  initMission();
  initSimToggle();
  buildHRVChart('7D');
  initTabGroups();
  restoreData();
  setTimeout(() => { document.getElementById('timer-fill').style.transform = 'scaleX(0.83)'; }, 400);
}

function setTodayDate() {
  const d = new Date();
  const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  const el = document.getElementById('today-date');
  if (el) el.textContent = d.toLocaleDateString('en-US', opts);
}

/* ════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════ */
function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const id = item.dataset.screen;
      showScreen(id);
    });
  });
  document.querySelectorAll('.ring-card[data-screen]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.screen;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.screen === id));
      showScreen(id);
    });
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const s = document.getElementById('screen-' + id);
  if (s) {
    s.classList.add('active');
    onScreenEnter(id);
  }
}

function onScreenEnter(id) {
  if (id === 'recovery') buildHRVChart(document.querySelector('.tab.active')?.dataset?.range || '7D');
  if (state.synced) animateBigRing(id);
  animateZoneBars();
}

/* ════════════════════════════════════════
   DATA & DISPLAY
════════════════════════════════════════ */
function resetDisplayToZero() {
  setRing('ring-strain',    0, 314.16);
  setRing('ring-recovery',  0, 314.16);
  setRing('ring-sleep',     0, 314.16);
  setRing('big-ring-recovery', 0, 534);
  setRing('big-ring-strain',   0, 534);
  setRing('big-ring-sleep',    0, 534);
  setText('val-strain','--'); setText('val-recovery','--'); setText('val-sleep','--');
  setText('big-val-recovery','--'); setText('big-val-strain','--'); setText('big-val-sleep','--');
  setText('meta-hrv','-- ms'); setText('meta-rhr','-- bpm');
  setText('meta-sleep-dur','-- h'); setText('meta-deep-rem','--%');
  setText('metric-hrv','-- ms'); setText('metric-hr','-- bpm');
  setText('metric-spo2','--%'); setText('metric-bp','--/--');
  setText('val-stress-peak','--'); setText('val-stress-low','--'); setText('val-stress-avg','--');
  setText('pct-stress','0%'); setText('pct-energy','0%');
  setBarWidth('bar-stress', 0); setBarWidth('bar-energy', 0);
  updateStatusBadge('waiting');
  updateCoaching(null);
  document.getElementById('coaching-tags').innerHTML = '';
}

function applyData(d) {
  state.synced = true;
  state.hrv      = d.hrv;
  state.hr       = d.hr;
  state.spo2     = d.spo2;
  state.recovery = d.recovery;
  state.strain   = d.strain;
  state.sleep    = d.sleep;
  state.stress   = d.stress || Math.round(40 + (100 - d.recovery) * 0.4);

  /* ─ Rings (today) ─ */
  const strainOffset   = 314.16 - (d.strain   / 100) * 314.16;
  const recoveryOffset = 314.16 - (d.recovery / 100) * 314.16;
  const sleepScore     = calcSleepScore(d.sleep);
  const sleepOffset    = 314.16 - (sleepScore  / 100) * 314.16;
  setRing('ring-strain',   strainOffset,   314.16);
  setRing('ring-recovery', recoveryOffset, 314.16);
  setRing('ring-sleep',    sleepOffset,    314.16);
  setText('val-strain',   d.strain + '%');
  setText('val-recovery', d.recovery + '%');
  setText('val-sleep',    sleepScore + '%');

  /* ─ Big rings (detail screens) ─ */
  setRing('big-ring-recovery', 534 - (d.recovery/100)*534, 534);
  setRing('big-ring-strain',   534 - (d.strain/100)*534,   534);
  setRing('big-ring-sleep',    534 - (sleepScore/100)*534, 534);
  setText('big-val-recovery', d.recovery + '%');
  setText('big-val-strain',   d.strain   + '%');
  setText('big-val-sleep',    sleepScore + '%');

  /* ─ Ring meta ─ */
  const strainLabel = d.strain < 30 ? 'Low' : d.strain < 60 ? 'Moderate' : d.strain < 80 ? 'High' : 'Peak';
  setText('strain-label',    strainLabel);
  setText('meta-hrv',        d.hrv + ' ms');
  setText('meta-rhr',        d.hr  + ' bpm');
  setText('meta-sleep-dur',  d.sleep.toFixed(1) + ' h');
  setText('meta-deep-rem',   calcDeepRem(d.sleep) + '%');

  /* ─ Health monitor ─ */
  setText('metric-hrv',  d.hrv  + ' ms');
  setText('metric-hr',   d.hr   + ' bpm');
  setText('metric-spo2', d.spo2 + '%');
  setText('metric-bp',   calcBP(d.hr));
  applyTrend('trend-hrv',  d.hrv, 100, ' ms');
  applyTrend('trend-hr',   d.hr,  55,  ' bpm', true);
  applyTrend('trend-spo2', d.spo2, 96, '%');
  applyTrend('trend-bp',   120, 120, '', false, true);

  /* ─ Detail pills ─ */
  setText('pill-hrv',       d.hrv  + ' ms');
  setText('pill-rhr',       d.hr   + ' bpm');
  setText('pill-spo2',      d.spo2 + '%');
  setText('pill-kj',        Math.round(d.strain * 18) + ' kJ');
  setText('pill-maxhr',     Math.round(d.hr * 1.8) + ' bpm');
  setText('pill-sleep-dur', d.sleep.toFixed(1) + ' h');
  setText('pill-deep',      Math.round(d.sleep > 0 ? 12 : 0) + '%');
  setText('pill-rem',       Math.round(d.sleep > 0 ? 18 : 0) + '%');

  /* ─ Stress bars ─ */
  const stressAvg  = state.stress;
  const stressPeak = Math.min(100, stressAvg + 30);
  const stressLow  = Math.max(0,  stressAvg - 26);
  const energy     = Math.round(d.recovery * 0.9 + d.spo2 * 0.1 - 5);
  setText('val-stress-peak', stressPeak);
  setText('val-stress-low',  stressLow);
  setText('val-stress-avg',  stressAvg);
  setText('pct-stress', stressAvg + '%');
  setText('pct-energy', energy + '%');
  setBarWidth('bar-stress', stressAvg);
  setBarWidth('bar-energy', Math.min(100, energy));

  /* ─ Status & coaching ─ */
  const status = d.recovery >= 67 ? 'green' : d.recovery >= 34 ? 'amber' : 'red';
  updateStatusBadge(status, d);
  updateCoaching(d);

  /* ─ Persist ─ */
  localStorage.setItem(LS.data, JSON.stringify(d));
}

function restoreData() {
  const saved = localStorage.getItem(LS.data);
  if (saved) {
    try { applyData(JSON.parse(saved)); } catch(e) { resetDisplayToZero(); }
  } else {
    resetDisplayToZero();
  }
}

/* ════════════════════════════════════════
   SIMULATOR
════════════════════════════════════════ */
function initSimToggle() {
  const btn = document.getElementById('sim-toggle-btn');
  if (btn) btn.addEventListener('click', toggleSimulator);
}

function toggleSimulator() {
  const panel = document.getElementById('simulator-panel');
  panel.classList.toggle('hidden');
}

function liveUpdate(key, value) {
  const numVal = parseFloat(value);
  document.getElementById('disp-' + key).textContent = numVal;
  if (state.synced && state.liveMode) {
    const d = currentSliderValues();
    applyData(d);
  }
}

function currentSliderValues() {
  return {
    hr:       parseFloat(document.getElementById('sl-hr').value),
    spo2:     parseFloat(document.getElementById('sl-spo2').value),
    hrv:      parseFloat(document.getElementById('sl-hrv').value),
    recovery: parseFloat(document.getElementById('sl-recovery').value),
    strain:   parseFloat(document.getElementById('sl-strain').value),
    sleep:    parseFloat(document.getElementById('sl-sleep').value),
  };
}

function simulateSync() {
  const btn    = document.getElementById('sim-sync-btn');
  const dot    = document.getElementById('sim-status').querySelector('.sim-dot');
  const status = document.getElementById('sim-status').querySelector('span');
  btn.disabled = true;
  dot.className  = 'sim-dot syncing';
  status.textContent = 'Syncing data...';
  addLog('[ Sync ] Connecting to wearable device...');
  setTimeout(() => { addLog('[ Sync ] Reading biometric sensors...'); }, 300);
  setTimeout(() => { addLog('[ Sync ] Processing HRV & Recovery...'); }, 700);
  setTimeout(() => {
    const d = currentSliderValues();
    applyData(d);
    dot.className  = 'sim-dot done';
    status.textContent = 'Sync complete ✓';
    btn.disabled = false;
    addLog(`[ ✓ ] HR:${d.hr}bpm  HRV:${d.hrv}ms  SpO₂:${d.spo2}%  Recovery:${d.recovery}%`, 'success');
    buildHRVChart('7D');
  }, 1200);
}

function toggleLive() {
  state.liveMode = !state.liveMode;
  const btn  = document.getElementById('sim-live-btn');
  const dot  = document.getElementById('sim-status').querySelector('.sim-dot');
  const stTxt = document.getElementById('sim-status').querySelector('span');
  const lbl  = document.getElementById('live-label');
  if (state.liveMode) {
    btn.classList.add('active');
    lbl.textContent = '⏹ Stop Live';
    dot.className  = 'sim-dot live';
    stTxt.textContent = 'Live Mode Active';
    addLog('[ Live ] Real-time simulation started', 'success');
    if (!state.synced) simulateSync();
    state.liveInterval = setInterval(() => {
      const base = currentSliderValues();
      applyData({
        hr:       clamp(base.hr       + rand(-3, 3),  40, 200),
        spo2:     clamp(base.spo2     + rand(-1, 1),  85, 100),
        hrv:      clamp(base.hrv      + rand(-5, 5),  20, 160),
        recovery: clamp(base.recovery + rand(-2, 2),   0, 100),
        strain:   clamp(base.strain   + rand(-1, 1),   0, 100),
        sleep:    base.sleep,
      });
    }, 2000);
  } else {
    stopLive();
  }
}

function stopLive() {
  state.liveMode = false;
  clearInterval(state.liveInterval);
  const btn  = document.getElementById('sim-live-btn');
  const dot  = document.getElementById('sim-status').querySelector('.sim-dot');
  const stTxt = document.getElementById('sim-status').querySelector('span');
  const lbl  = document.getElementById('live-label');
  if (btn)   btn.classList.remove('active');
  if (lbl)   lbl.textContent = '▶ Live Mode';
  if (dot)   dot.className  = 'sim-dot idle';
  if (stTxt) stTxt.textContent = 'Ready to Simulate';
  addLog('[ Live ] Simulation stopped', 'warn');
}

function resetData() {
  stopLive();
  state.synced = false;
  localStorage.removeItem(LS.data);
  ['sl-hr','sl-spo2','sl-hrv','sl-recovery','sl-strain','sl-sleep'].forEach((id, i) => {
    const defaults = [72, 98, 107, 64, 14, 6.2];
    const el = document.getElementById(id);
    if (el) el.value = defaults[i];
  });
  ['hr','spo2','hrv','recovery','strain','sleep'].forEach((k, i) => {
    const defaults = [72, 98, 107, 64, 14, 6.2];
    const el = document.getElementById('disp-' + k);
    if (el) el.textContent = defaults[i];
  });
  resetDisplayToZero();
  addLog('[ Reset ] All data cleared — waiting for sync', 'warn');
}

/* ════════════════════════════════════════
   HRV CHART
════════════════════════════════════════ */
const hrvBase = {
  '7D':  [88, 92, 78, 105, 99, 112, 108],
  '30D': [72,80,85,78,90,95,88,92,76,84,98,102,88,94,78,86,92,105,99,88,94,107,100,96,88,102,99,112,108,104],
};

function buildHRVChart(range) {
  const container = document.getElementById('hrv-chart');
  const labels    = document.getElementById('hrv-labels');
  if (!container) return;
  let vals = hrvBase[range] || hrvBase['7D'];
  if (state.synced && state.hrv > 0) {
    vals = [...vals.slice(0, -1), state.hrv];
  }
  const max = Math.max(...vals);
  container.innerHTML = '';
  vals.forEach((v, i) => {
    const pct     = (v / max) * 100;
    const isToday = i === vals.length - 1;
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.style.cssText = `background:${isToday ? 'var(--green)' : '#2A2A38'};border-radius:4px 4px 0 0;flex:1;transition-delay:${i * 30}ms;`;
    col.title = `${v} ms`;
    container.appendChild(col);
    requestAnimationFrame(() => { setTimeout(() => { col.style.transform = 'scaleY(' + pct / 100 + ')'; }, 60); });
  });
  if (labels) {
    const dayMap = { '7D': ['Mon','Tue','Wed','Thu','Fri','Sat','Today'] };
    const dayLabels = dayMap[range] || Array.from({length: vals.length}, (_, i) => i + 1);
    labels.innerHTML = dayLabels.map(l => `<span>${l}</span>`).join('');
  }
}

function initTabGroups() {
  document.querySelectorAll('.tab-group').forEach(group => {
    group.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        group.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        buildHRVChart(tab.dataset.range || tab.textContent.trim());
      });
    });
  });
}

/* ════════════════════════════════════════
   DAILY MISSION
════════════════════════════════════════ */
const MISSIONS = [
  { id:'m1', text:'🌅 Morning Stretch (5 min)',   xp:'+10 XP' },
  { id:'m2', text:'💧 Drink 500ml Water',          xp:'+5 XP'  },
  { id:'m3', text:'🚶 Walk 10 Minutes',             xp:'+15 XP' },
  { id:'m4', text:'🧘 Meditation (5 min)',          xp:'+10 XP' },
  { id:'m5', text:'📵 No Screen 1hr Before Bed',   xp:'+20 XP' },
  { id:'m6', text:'🌙 Sleep Before 23:00',          xp:'+25 XP' },
];

function initMission() {
  const today     = new Date().toDateString();
  const savedDate = localStorage.getItem(LS.missionDate);
  let completed   = {};
  if (savedDate === today) {
    try { completed = JSON.parse(localStorage.getItem(LS.mission)) || {}; } catch(e) { completed = {}; }
  } else {
    localStorage.setItem(LS.missionDate, today);
    localStorage.setItem(LS.mission, JSON.stringify({}));
  }
  renderMission(completed);
}

function renderMission(completed) {
  const list = document.getElementById('mission-list');
  if (!list) return;
  list.innerHTML = '';
  MISSIONS.forEach(m => {
    const done = !!completed[m.id];
    const item = document.createElement('div');
    item.className = 'mission-item' + (done ? ' done' : '');
    item.innerHTML = `
      <div class="mission-cb">${done ? '✓' : ''}</div>
      <span class="mission-text">${m.text}</span>
      <span class="mission-xp">${m.xp}</span>`;
    item.addEventListener('click', () => toggleMission(m.id));
    list.appendChild(item);
  });
  updateMissionProgress(completed);
}

function toggleMission(id) {
  let completed = {};
  try { completed = JSON.parse(localStorage.getItem(LS.mission)) || {}; } catch(e) {}
  completed[id] = !completed[id];
  if (!completed[id]) delete completed[id];
  localStorage.setItem(LS.mission, JSON.stringify(completed));
  renderMission(completed);
}

function updateMissionProgress(completed) {
  const count   = Object.values(completed).filter(Boolean).length;
  const total   = MISSIONS.length;
  const pct     = Math.round((count / total) * 100);
  const bar     = document.getElementById('mission-bar');
  const txt     = document.getElementById('mission-progress-text');
  if (bar) bar.style.transform = 'scaleX(' + pct / 100 + ')';
  if (txt) txt.textContent = `${count}/${total}`;
}

/* ════════════════════════════════════════
   COACHING & STATUS
════════════════════════════════════════ */
function updateStatusBadge(type, d) {
  const badge = document.getElementById('status-badge');
  const text  = document.getElementById('status-text');
  if (!badge || !text) return;
  badge.className = 'status-badge';
  if (type === 'green') {
    badge.classList.add('green');
    text.textContent = 'READY TO PERFORM';
  } else if (type === 'amber') {
    badge.classList.add('amber');
    text.textContent = 'MODERATE DAY';
  } else if (type === 'red') {
    badge.classList.add('red');
    text.textContent = 'REST REQUIRED';
  } else {
    text.textContent = 'AWAITING SYNC';
  }
}

const COACHING = {
  green: {
    text: 'Recovery ดีเยี่ยม! HRV สูงกว่าเกณฑ์ ร่างกายพร้อมสำหรับการออกกำลังกายหนัก ฉวยโอกาสนี้ Push Strain ไปที่ 70–85%',
    tags: ['🏋️ Heavy Training', '⚡ Push Harder', '💪 PR Day'],
    chip: 'green',
  },
  amber: {
    text: 'Recovery อยู่ในระดับดี ออกกำลังกายได้ระดับปานกลาง แนะนำ Strain 50–70% และนอนก่อน 23:00 เพื่อ Recovery ที่ดีขึ้นพรุ่งนี้',
    tags: ['🏃 Moderate Training', '💤 Early Bedtime', '💧 Hydrate +500ml'],
    chip: 'amber',
  },
  red: {
    text: 'ร่างกายเหนื่อยล้าสูง Recovery ต่ำมาก วันนี้ควรพักผ่อนอย่างเต็มที่ หลีกเลี่ยงการออกกำลังกายหนัก Rest IS Training',
    tags: ['🛌 Full Rest Day', '🧘 Gentle Stretch Only', '😴 Sleep 8+ Hours'],
    chip: 'red',
  },
};

function updateCoaching(d) {
  const coachTxt  = document.getElementById('coaching-text');
  const coachTags = document.getElementById('coaching-tags');
  const chip      = document.getElementById('coaching-chip');
  const recTxt    = document.getElementById('recovery-coaching-text');
  const strTxt    = document.getElementById('strain-coaching-text');
  const slpTxt    = document.getElementById('sleep-coaching-text');
  const slpTags   = document.getElementById('sleep-tags');
  if (!d) {
    if (chip) { chip.className = 'chip'; chip.textContent = 'Waiting'; }
    return;
  }
  const level = d.recovery >= 67 ? 'green' : d.recovery >= 34 ? 'amber' : 'red';
  const c     = COACHING[level];
  if (coachTxt)  coachTxt.textContent  = c.text;
  if (coachTags) coachTags.innerHTML   = c.tags.map(t => `<span class="tag">${t}</span>`).join('');
  if (chip)      { chip.className = `chip ${c.chip}-chip`; chip.textContent = level === 'green' ? 'Optimal' : level === 'amber' ? 'Good' : 'Rest'; }
  if (recTxt)    recTxt.textContent = `Recovery ${d.recovery}% — HRV ${d.hrv}ms (avg baseline: 100ms). ${d.recovery >= 67 ? 'ดีเยี่ยม พร้อมออกกำลังกายหนัก Strain 70-85%' : d.recovery >= 34 ? 'ดี พร้อมออกกำลังกายปานกลาง Strain 50-70%' : 'ต่ำ — ควรพักให้เต็มที่วันนี้'}`;
  if (strTxt)    strTxt.textContent = `Strain ${d.strain}% — ${d.strain < 30 ? 'ยังเบา เพิ่ม intensity ได้' : d.strain < 70 ? 'ระดับปานกลาง เหมาะสม' : 'สูงแล้ว ระวัง overtraining'} Target วันนี้: ${calcStrainTarget(d.recovery)}%`;
  if (slpTxt)    slpTxt.textContent = `นอนหลับ ${d.sleep.toFixed(1)} ชม. — ${d.sleep >= 7.5 ? 'ดีเยี่ยม! Deep Sleep เพียงพอ' : d.sleep >= 6 ? 'พอใช้ได้ แนะนำให้นอนเพิ่ม 30-60 นาที' : 'น้อยเกินไป ส่งผลต่อ Recovery อย่างมีนัยสำคัญ'}`;
  if (slpTags)   slpTags.innerHTML = d.sleep >= 7.5
    ? '<span class="tag">✅ Sleep Goal Met</span>'
    : '<span class="tag">🌙 Sleep Before 23:00</span><span class="tag">📵 No Screen 90m</span>';
}

/* ════════════════════════════════════════
   MODAL — ADD ENTRY
════════════════════════════════════════ */
function openModal() {
  document.getElementById('modal-choice').classList.remove('hidden');
  document.getElementById('modal-activity').classList.add('hidden');
  document.getElementById('modal-wellness').classList.add('hidden');
  document.getElementById('modal-title').textContent = 'Add Entry';
  document.getElementById('add-modal').classList.remove('hidden');
}
function closeModal() { document.getElementById('add-modal').classList.add('hidden'); }
function closeModalOutside(e) { if (e.target === document.getElementById('add-modal')) closeModal(); }
function openForm(type) {
  document.getElementById('modal-choice').classList.add('hidden');
  document.getElementById('modal-title').textContent = type === 'activity' ? 'Log Activity' : 'Wellness Data';
  document.getElementById('modal-' + type).classList.remove('hidden');
}
function backToChoice() {
  document.getElementById('modal-activity').classList.add('hidden');
  document.getElementById('modal-wellness').classList.add('hidden');
  document.getElementById('modal-choice').classList.remove('hidden');
  document.getElementById('modal-title').textContent = 'Add Entry';
}
function saveEntry(type) {
  if (type === 'wellness') {
    const hr    = document.getElementById('wf-hr').value;
    const spo2  = document.getElementById('wf-spo2').value;
    const sleep = document.getElementById('wf-sleep').value;
    if (hr || spo2 || sleep) {
      const current = currentSliderValues();
      const newData = {
        hr:       hr    ? parseFloat(hr)    : current.hr,
        spo2:     spo2  ? parseFloat(spo2)  : current.spo2,
        sleep:    sleep ? parseFloat(sleep) : current.sleep,
        hrv:      current.hrv,
        recovery: current.recovery,
        strain:   current.strain,
      };
      if (hr)    { document.getElementById('sl-hr').value    = newData.hr;    document.getElementById('disp-hr').textContent    = newData.hr; }
      if (spo2)  { document.getElementById('sl-spo2').value  = newData.spo2;  document.getElementById('disp-spo2').textContent  = newData.spo2; }
      if (sleep) { document.getElementById('sl-sleep').value = newData.sleep; document.getElementById('disp-sleep').textContent = newData.sleep; }
      applyData(newData);
      addLog(`[ Manual ] HR:${newData.hr}  SpO₂:${newData.spo2}%  Sleep:${newData.sleep}h`, 'success');
    }
  }
  closeModal();
}

/* ════════════════════════════════════════
   DISMISSAL / MISC
════════════════════════════════════════ */
function dismissAlert() {
  const el = document.getElementById('ergo-alert');
  if (!el) return;
  el.style.transition = 'opacity .3s,transform .3s';
  el.style.opacity = '0'; el.style.transform = 'translateX(20px)';
  setTimeout(() => { el.style.display = 'none'; }, 300);
  addLog('[ Regent Hook ] 5-min walk initiated 🚶', 'success');
}

function notifyMe(btn) {
  btn.textContent = '✓ You\'ll be notified!';
  btn.style.background = 'var(--surface2)';
  btn.style.color = 'var(--green)';
  btn.style.border = '1px solid rgba(0,232,122,0.3)';
  btn.disabled = true;
}

function animateZoneBars() {
  ['zone1','zone2','zone3','zone4','zone5'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.transform = 'scaleX(0)'; setTimeout(() => { el.style.transform = 'scaleX(' + el.dataset.w / 100 + ')'; el.style.transition = 'transform 0.8s ease'; }, 100); }
  });
}

function animateBigRing(screenId) {
  const map = { recovery: 'big-ring-recovery', strain: 'big-ring-strain', sleep: 'big-ring-sleep' };
  const id = map[screenId];
  if (!id) return;
  const el = document.getElementById(id);
  if (el) {
    const cur = el.style.strokeDashoffset;
    el.style.strokeDashoffset = el.getAttribute('stroke-dasharray');
    setTimeout(() => { el.style.strokeDashoffset = cur; }, 80);
  }
}

/* ════════════════════════════════════════
   UTILITIES
════════════════════════════════════════ */
function setRing(id, offset, total) {
  const el = document.getElementById(id);
  if (el) el.style.strokeDashoffset = offset;
}
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function setBarWidth(id, pct) { const el = document.getElementById(id); if (el) el.style.transform = 'scaleX(' + Math.min(1, Math.max(0, pct / 100)) + ')'; }
function addLog(msg, type) {
  const log  = document.getElementById('sim-log');
  if (!log) return;
  const entry = document.createElement('div');
  entry.className = 'log-entry' + (type ? ' ' + type : '');
  entry.textContent = msg;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function rand(min, max)     { return Math.round(Math.random() * (max - min)) + min; }

function applyTrend(id, val, baseline, unit, invertGood, flat) {
  const el = document.getElementById(id);
  if (!el) return;
  if (flat) { el.className = 'metric-trend flat'; el.textContent = 'Optimal'; return; }
  const diff = val - baseline;
  const good = invertGood ? diff < 0 : diff > 0;
  el.className = 'metric-trend ' + (Math.abs(diff) < 3 ? 'flat' : good ? 'up' : 'down');
  el.textContent = (diff > 0 ? '↑ +' : '↓ ') + Math.abs(diff).toFixed(1) + unit;
}

function calcSleepScore(hours) { return Math.min(100, Math.round((hours / 8) * 100)); }
function calcDeepRem(hours)    { return hours > 0 ? 30 : 0; }
function calcBP(hr)            { const s = Math.round(110 + (hr - 60) * 0.3); return `${s}/${Math.round(s * 0.65)}`; }
function calcStrainTarget(rec) { return rec >= 67 ? '70–85' : rec >= 34 ? '50–70' : '< 30'; }

/* ════════════════════════════════════════
   BOOT — check for existing session
════════════════════════════════════════ */
window.addEventListener('load', () => {
  const savedUser = localStorage.getItem(LS.user);
  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      setUserUI(user);
      initApp();
    } catch(e) {
      localStorage.removeItem(LS.user);
    }
  }

  // "+" nav item for Add Modal
  document.querySelectorAll('[data-screen="add"]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });
});
