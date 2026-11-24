(() => {
  'use strict';
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  }
  const page = document.body.dataset.page;
  if (page === 'info') {
    const previousSections = ['guide', 'algorithm', 'news', 'places', 'feedback'];
    const section = location.hash.slice(1);
    if (previousSections.includes(section)) {
      location.replace(section + '.html');
      return;
    }
  }

  function switchTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    for (const id of ['dark', 'light']) {
      const button = document.getElementById(id);
      button.classList.toggle('active', id === theme);
      button.setAttribute('aria-pressed', String(id === theme));
    }
  }
  switchTheme(read('bus-theme', 'dark'));
  for (const theme of ['dark', 'light']) {
    document.getElementById(theme).addEventListener('click', () => {
      switchTheme(theme);
      write('bus-theme', theme);
    });
  }

  const toggle = document.getElementById('sound');
  const Audio = window.AudioContext || window.webkitAudioContext;
  let enabled = Boolean(Audio && read('bus-sound', true));
  let context;
  function updateSound() {
    toggle.title = enabled ? 'Tắt âm thanh khi nhấn' : 'Bật âm thanh khi nhấn';
    toggle.setAttribute('aria-pressed', String(enabled));
    const waves = enabled ? '<path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>' : '<path d="m16 9 6 6m0-6-6 6"/>';
    toggle.innerHTML = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z"/>' + waves + '</svg>';
  }
  async function tapSound() {
    if (!enabled || !Audio) return;
    try {
      context ??= new Audio();
      if (context.state === 'suspended') await context.resume();
      if (context.state !== 'running' || !enabled) return;
      const t = context.currentTime;
      const tone = context.createOscillator();
      const volume = context.createGain();
      tone.frequency.setValueAtTime(680, t);
      tone.frequency.exponentialRampToValueAtTime(430, t + 0.045);
      volume.gain.setValueAtTime(0.0001, t);
      volume.gain.exponentialRampToValueAtTime(0.045, t + 0.004);
      volume.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      tone.connect(volume).connect(context.destination);
      tone.onended = () => { tone.disconnect(); volume.disconnect(); };
      tone.start(t);
      tone.stop(t + 0.055);
    } catch { /* The browser may disable audio for this tab. */ }
  }
  toggle.disabled = !Audio;
  updateSound();
  toggle.addEventListener('click', () => {
    enabled = !enabled;
    write('bus-sound', enabled);
    updateSound();
    if (enabled) tapSound();
  });
  const controls = 'a[href], button:not(:disabled), summary';
  document.addEventListener('pointerdown', event => {
    const control = event.target.closest(controls);
    if (event.button === 0 && control && control !== toggle) tapSound();
  }, {passive: true});
  document.addEventListener('click', event => {
    const control = event.target.closest(controls);
    if (event.detail === 0 && control && control !== toggle) tapSound();
  });

  const feedback = document.getElementById('feedback-form');
  if (feedback) {
    const input = document.getElementById('feedback-text');
    const counter = document.getElementById('character-count');
    const status = document.getElementById('feedback-status');
    input.addEventListener('input', () => {
      counter.textContent = input.value.length + ' / 1000';
      input.setCustomValidity('');
      status.textContent = '';
    });
    feedback.addEventListener('submit', event => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) {
        input.setCustomValidity('Hãy nhập nội dung góp ý.');
        input.reportValidity();
        return;
      }
      const items = read('bus-feedback', []);
      if (Array.isArray(items) && write('bus-feedback', [...items, {text, at: new Date().toISOString()}])) {
        feedback.reset();
        counter.textContent = '0 / 1000';
        status.textContent = 'Đã lưu góp ý trên thiết bị này.';
      } else status.textContent = 'Trình duyệt chưa lưu được. Nội dung của bạn vẫn ở trong ô góp ý.';
    });
  }
  const swap = document.getElementById('home-swap');
  if (swap) swap.addEventListener('click', () => {
    const from = document.getElementById('home-from');
    const to = document.getElementById('home-to');
    [from.value, to.value] = [to.value, from.value];
  });
})();
