function initSounds() {
  const sounds = [
    { emoji: '🔔', label: '上課鈴', freq: 880, dur: 0.4 },
    { emoji: '🔔', label: '下課鈴', freq: 660, dur: 0.6 },
    { emoji: '👏', label: '鼓掌', type: 'noise' },
    { emoji: '🎯', label: '答對', freq: 1200, dur: 0.15 },
    { emoji: '❌', label: '答錯', freq: 200, dur: 0.4 },
    { emoji: '⏰', label: '倒數', freq: 1000, dur: 0.1, rep: 3 },
    { emoji: '🎵', label: '提醒', freq: 660, dur: 0.2, rep: 2 },
    { emoji: '📢', label: '安靜', freq: 400, dur: 0.5 },
    { emoji: '🎉', label: '歡呼', type: 'cheer' },
    { emoji: '🤫', label: '噓', type: 'shush' },
    { emoji: '💡', label: '叮咚', freqs: [880, 1320], durs: [0.15, 0.15] },
    { emoji: '⏱', label: '時間到', freq: 440, dur: 0.8 },
  ];

  const grid = document.getElementById('soundGrid');
  let audioCtx = null;

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playSound(s) {
    const ctx = getCtx();

    if (s.type === 'noise') {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const g = ctx.createGain(); g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      src.connect(g).connect(ctx.destination); src.start();
      return;
    }
    if (s.type === 'cheer') {
      [440, 554, 660, 880].forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.frequency.value = f; o.type = 'sine';
        g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);
        o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + i * 0.08);
        o.stop(ctx.currentTime + i * 0.08 + 0.3);
      }); return;
    }
    if (s.type === 'shush') {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 1.0, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const g = ctx.createGain(); g.gain.setValueAtTime(0.25, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
      src.connect(g).connect(ctx.destination); src.start();
      return;
    }
    if (s.freqs) {
      s.freqs.forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.frequency.value = f; o.type = 'sine';
        const d = s.durs ? s.durs[i] || 0.15 : 0.15;
        g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + d);
        o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + d + 0.05);
      }); return;
    }
    const rep = s.rep || 1;
    for (let r = 0; r < rep; r++) {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = s.freq; o.type = 'sine';
      const t = ctx.currentTime + r * (s.dur + 0.08);
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + s.dur);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + s.dur + 0.05);
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
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
  });
}
