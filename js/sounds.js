function renderSounds() {
  const page = document.getElementById('page-sounds');
  const sounds = [
    { emoji: '🔔', label: '上課鈴', freq: 880, dur: 0.4 },
    { emoji: '🔔', label: '下課鈴', freq: 660, dur: 0.6 },
    { emoji: '👏', label: '鼓掌', freq: 0, type: 'noise' },
    { emoji: '🎯', label: '答對', freq: 1200, dur: 0.15 },
    { emoji: '❌', label: '答錯', freq: 200, dur: 0.4 },
    { emoji: '⏰', label: '倒數', freq: 1000, dur: 0.1, rep: 3 },
    { emoji: '🎵', label: '提醒', freq: 660, dur: 0.2, rep: 2 },
    { emoji: '📢', label: '安靜', freq: 400, dur: 0.5 },
    { emoji: '🎉', label: '歡呼', freq: 0, type: 'cheer' },
    { emoji: '🤫', label: '噓', freq: 0, type: 'shush' },
    { emoji: '💡', label: '叮咚', freq: [880, 1320], dur: [0.15, 0.15] },
    { emoji: '⏱', label: '時間到', freq: 440, dur: 0.8 },
  ];

  page.innerHTML = `
    <div class="tool-card">
      <h2>🔊 音效板</h2>
      <p>點擊按鈕播放音效，控制課堂節奏</p>
      <div class="sound-grid" id="soundGrid"></div>
      <div class="flex-center mt-3">
        <button class="btn btn-danger btn-sm" id="stopAllBtn">🔇 停止所有音效</button>
      </div>
    </div>
  `;

  const grid = document.getElementById('soundGrid');
  let audioCtx;

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playSound(s) {
    const ctx = getCtx();

    if (s.type === 'noise') {
      const bufSize = ctx.sampleRate * 0.3;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      src.connect(gain).connect(ctx.destination);
      src.start();
      return;
    }

    if (s.type === 'cheer') {
      [440, 554, 660, 880].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = f;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
      return;
    }

    if (s.type === 'shush') {
      const bufSize = ctx.sampleRate * 1.0;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * (1 - t);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
      src.connect(gain).connect(ctx.destination);
      src.start();
      return;
    }

    if (Array.isArray(s.freq)) {
      s.freq.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = f;
        osc.type = 'sine';
        const d = Array.isArray(s.dur) ? s.dur[i] || 0.15 : 0.15;
        const start = ctx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + d);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + d + 0.05);
      });
      return;
    }

    const rep = s.rep || 1;
    for (let r = 0; r < rep; r++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = s.freq;
      osc.type = 'sine';
      const start = ctx.currentTime + r * (s.dur + 0.08);
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + s.dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + s.dur + 0.05);
    }
  }

  sounds.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'sound-btn';
    btn.innerHTML = `${s.emoji}<span class="label">${s.label}</span>`;
    btn.addEventListener('click', () => playSound(s));
    grid.appendChild(btn);
  });

  document.getElementById('stopAllBtn').addEventListener('click', () => {
    if (audioCtx) audioCtx.close();
    audioCtx = null;
  });
}
