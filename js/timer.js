function renderTimer() {
  const page = document.getElementById('page-timer');
  page.innerHTML = `
    <div class="tool-card">
      <h2>⏱ 計時器</h2>
      <div class="flex-center mb-2">
        <select id="timerPreset">
          <option value="60">1 分鐘</option>
          <option value="120">2 分鐘</option>
          <option value="180" selected>3 分鐘</option>
          <option value="300">5 分鐘</option>
          <option value="600">10 分鐘</option>
          <option value="900">15 分鐘</option>
          <option value="1800">30 分鐘</option>
          <option value="0">自訂</option>
        </select>
        <input type="number" id="timerCustom" min="1" max="3600" value="5" placeholder="分鐘" style="width:100px" disabled>
      </div>
      <div class="timer-display" id="timerDisplay">03:00</div>
      <div class="flex-center">
        <button class="btn btn-primary" id="timerStart">▶ 開始</button>
        <button class="btn btn-outline" id="timerPause">⏸ 暫停</button>
        <button class="btn btn-danger" id="timerReset">⟳ 重置</button>
      </div>
    </div>
  `;

  const display = document.getElementById('timerDisplay');
  const preset = document.getElementById('timerPreset');
  const custom = document.getElementById('timerCustom');
  let totalSeconds = 180;
  let remaining = 180;
  let isRunning = false;
  let interval;

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  function updateDisplay() {
    display.textContent = formatTime(remaining);
    display.className = 'timer-display';
    if (remaining <= 10 && remaining > 0) display.classList.add('danger');
    else if (remaining <= 30) display.classList.add('warning');
  }

  function setTime(seconds) {
    remaining = seconds;
    totalSeconds = seconds;
    updateDisplay();
  }

  preset.addEventListener('change', () => {
    const val = parseInt(preset.value);
    if (val === 0) {
      custom.disabled = false;
      setTime(parseInt(custom.value) * 60 || 300);
    } else {
      custom.disabled = true;
      setTime(val);
    }
  });

  custom.addEventListener('input', () => {
    if (preset.value === '0') setTime(parseInt(custom.value) * 60 || 60);
  });

  document.getElementById('timerStart').addEventListener('click', () => {
    if (isRunning) return;
    if (remaining <= 0) { setTime(totalSeconds); }
    isRunning = true;
    interval = setInterval(() => {
      remaining--;
      updateDisplay();
      if (remaining <= 0) {
        clearInterval(interval);
        isRunning = false;
        display.textContent = '⏰ 時間到！';
        display.className = 'timer-display danger';
        playAlarm();
      }
    }, 1000);
  });

  document.getElementById('timerPause').addEventListener('click', () => {
    clearInterval(interval);
    isRunning = false;
  });

  document.getElementById('timerReset').addEventListener('click', () => {
    clearInterval(interval);
    isRunning = false;
    setTime(totalSeconds);
  });

  function playAlarm() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [440, 660, 880].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = f;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.25 + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.25);
        osc.stop(ctx.currentTime + i * 0.25 + 0.3);
      });
    } catch(e) {}
  }

  updateDisplay();
}
