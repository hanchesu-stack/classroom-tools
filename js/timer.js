function initTimer() {
  const display = document.getElementById('timerDisplay');
  const preset = document.getElementById('timerPreset');
  const custom = document.getElementById('timerCustom');
  let totalSeconds = 180, remaining = 180, isRunning = false, interval = null;

  function formatTime(s) {
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function updateDisplay() {
    display.textContent = formatTime(remaining);
    display.className = 'timer-display';
    if (remaining <= 10 && remaining > 0) display.classList.add('danger');
    else if (remaining <= 30) display.classList.add('warning');
  }

  function setTime(seconds) { remaining = seconds; totalSeconds = seconds; updateDisplay(); }

  preset.addEventListener('change', () => {
    const v = parseInt(preset.value);
    if (v === 0) { custom.disabled = false; setTime(parseInt(custom.value) * 60 || 300); }
    else { custom.disabled = true; setTime(v); }
  });

  custom.addEventListener('input', () => {
    if (preset.value === '0') setTime(parseInt(custom.value) * 60 || 60);
  });

  document.getElementById('timerStart').addEventListener('click', () => {
    if (isRunning) return;
    if (remaining <= 0) setTime(totalSeconds);
    isRunning = true;
    interval = setInterval(() => {
      remaining--;
      updateDisplay();
      if (remaining <= 0) {
        clearInterval(interval); interval = null; isRunning = false;
        display.textContent = '⏰ 時間到！';
        display.className = 'timer-display danger';
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          [440, 660, 880].forEach((f, i) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.frequency.value = f; o.type = 'square';
            g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.25);
            g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.25 + 0.3);
            o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + i * 0.25);
            o.stop(ctx.currentTime + i * 0.25 + 0.3);
          });
        } catch(e) {}
      }
    }, 1000);
  });

  document.getElementById('timerPause').addEventListener('click', () => {
    clearInterval(interval); interval = null; isRunning = false;
  });

  document.getElementById('timerReset').addEventListener('click', () => {
    clearInterval(interval); interval = null; isRunning = false;
    setTime(totalSeconds);
  });

  updateDisplay();
}
