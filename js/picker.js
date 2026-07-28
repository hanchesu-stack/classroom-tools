function renderPicker() {
  const page = document.getElementById('page-picker');
  page.innerHTML = `
    <div class="tool-card">
      <h2>🎲 抽籤</h2>
      <p>輸入名單（一行一個），按抽籤隨機選出一個人</p>
      <textarea id="pickerList" rows="6">學生一
學生二
學生三
學生四
學生五
學生六
學生七
學生八</textarea>
      <div class="picker-display" id="pickerDisplay">準備好囉</div>
      <div class="flex-center">
        <button class="btn btn-primary" id="pickerGo">🎲 抽籤</button>
        <button class="btn btn-outline btn-sm" id="pickerReset">重置</button>
      </div>
    </div>
  `;

  let isRolling = false;
  const display = document.getElementById('pickerDisplay');
  const list = document.getElementById('pickerList');
  let timer;

  document.getElementById('pickerGo').addEventListener('click', () => {
    const names = list.value.split('\n').map(s => s.trim()).filter(Boolean);
    if (!names.length) { display.textContent = '⚠️ 請輸入名單'; return; }
    if (isRolling) return;

    isRolling = true;
    display.className = 'picker-display rolling';
    let count = 0;
    timer = setInterval(() => {
      display.textContent = names[Math.floor(Math.random() * names.length)];
      count++;
      if (count > 20) {
        clearInterval(timer);
        isRolling = false;
        display.className = 'picker-display done';
        display.textContent = '🎉 ' + names[Math.floor(Math.random() * names.length)];
      }
    }, 80);
  });

  document.getElementById('pickerReset').addEventListener('click', () => {
    clearInterval(timer);
    isRolling = false;
    display.className = 'picker-display';
    display.textContent = '準備好囉';
  });
}
