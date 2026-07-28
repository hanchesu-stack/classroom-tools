function renderRandomNum() {
  const page = document.getElementById('page-random-num');
  page.innerHTML = `
    <div class="tool-card">
      <h2>🔢 隨機號碼</h2>
      <div class="flex-center mb-2">
        <div>
          <label>最小值</label>
          <input type="number" id="randMin" value="1" style="width:100px">
        </div>
        <div>
          <label>最大值</label>
          <input type="number" id="randMax" value="50" style="width:100px">
        </div>
      </div>
      <div class="random-num-display" id="randDisplay">—</div>
      <div class="flex-center">
        <button class="btn btn-primary" id="randGo">🔢 抽號碼</button>
        <button class="btn btn-outline btn-sm" id="randHistoryClear">清除記錄</button>
      </div>
      <div class="mt-2">
        <h4>已抽過的號碼</h4>
        <div id="randHistory" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"></div>
      </div>
    </div>
  `;

  const display = document.getElementById('randDisplay');
  const minInput = document.getElementById('randMin');
  const maxInput = document.getElementById('randMax');
  const historyEl = document.getElementById('randHistory');
  let history = [];
  let isRolling = false;

  document.getElementById('randGo').addEventListener('click', () => {
    if (isRolling) return;
    const min = parseInt(minInput.value) || 1;
    const max = parseInt(maxInput.value) || 50;
    if (min >= max) { display.textContent = '⚠️ 最大值需大於最小值'; return; }

    const pool = [];
    for (let i = min; i <= max; i++) {
      if (!history.includes(i)) pool.push(i);
    }
    if (!pool.length) { display.textContent = '⚠️ 所有號碼都抽過了'; return; }

    isRolling = true;
    display.className = 'random-num-display rolling';
    let count = 0;
    const timer = setInterval(() => {
      display.textContent = Math.floor(Math.random() * (max - min + 1)) + min;
      count++;
      if (count > 15) {
        clearInterval(timer);
        const winner = pool[Math.floor(Math.random() * pool.length)];
        display.textContent = '🎯 ' + winner;
        display.className = 'random-num-display';
        isRolling = false;
        history.push(winner);
        renderHistory();
      }
    }, 80);
  });

  document.getElementById('randHistoryClear').addEventListener('click', () => {
    history = [];
    renderHistory();
  });

  function renderHistory() {
    if (!history.length) { historyEl.innerHTML = '<span style="color:#999">尚無記錄</span>'; return; }
    historyEl.innerHTML = history.map(n => `<span class="tag">${n}</span>`).join('');
  }

  renderHistory();
}
