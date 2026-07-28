function initPicker() {
  const display = document.getElementById('pickerDisplay');
  const list = document.getElementById('pickerList');
  let timer;

  document.getElementById('pickerGo').addEventListener('click', () => {
    const names = list.value.split('\n').map(s => s.trim()).filter(Boolean);
    if (!names.length) { display.textContent = '⚠️ 請輸入名單'; return; }
    if (timer) return;

    display.className = 'picker-display rolling';
    let count = 0;
    timer = setInterval(() => {
      display.textContent = names[Math.floor(Math.random() * names.length)];
      count++;
      if (count > 20) {
        clearInterval(timer);
        timer = null;
        display.className = 'picker-display done';
        display.textContent = '🎉 ' + names[Math.floor(Math.random() * names.length)];
      }
    }, 80);
  });

  document.getElementById('pickerReset').addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    display.className = 'picker-display';
    display.textContent = '準備好囉';
  });
}
