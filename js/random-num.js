function initRandomNum() {
  const display = document.getElementById('randDisplay');
  const historyEl = document.getElementById('randHistory');
  const history = [];

  document.getElementById('randGo').addEventListener('click', () => {
    const min = parseInt(document.getElementById('randMin').value) || 1;
    const max = parseInt(document.getElementById('randMax').value) || 50;
    if (min >= max) { display.textContent = '⚠️ 最大值需大於最小值'; return; }

    const pool = [];
    for (let i = min; i <= max; i++) if (!history.includes(i)) pool.push(i);
    if (!pool.length) { display.textContent = '⚠️ 所有號碼都抽過了'; return; }

    let count = 0;
    display.className = 'random-num-display rolling';
    const timer = setInterval(() => {
      display.textContent = Math.floor(Math.random() * (max - min + 1)) + min;
      count++;
      if (count > 15) {
        clearInterval(timer);
        const winner = pool[Math.floor(Math.random() * pool.length)];
        display.textContent = '🎯 ' + winner;
        display.className = 'random-num-display';
        history.push(winner);
        historyEl.innerHTML = history.map(n => `<span class="tag">${n}</span>`).join('');
      }
    }, 80);
  });

  document.getElementById('randHistoryClear').addEventListener('click', () => {
    history.length = 0;
    historyEl.innerHTML = '<span style="color:#999">尚無記錄</span>';
  });
}
