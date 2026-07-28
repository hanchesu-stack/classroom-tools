function renderBuzzer() {
  const page = document.getElementById('page-buzzer');
  page.innerHTML = `
    <div class="tool-card">
      <h2>🔴 搶答器</h2>
      <p>誰先按誰搶到！適合課堂搶答遊戲</p>
      <div class="flex-center mb-2">
        <input type="text" id="buzzerName" placeholder="學生姓名" style="max-width:200px">
        <button class="btn btn-primary btn-sm" id="addBuzzerPlayer">加入</button>
      </div>
      <div id="buzzerPlayers" class="mb-2"></div>
      <div class="text-center">
        <button class="buzzer-btn" id="buzzerBtn">搶答！</button>
      </div>
      <div class="buzzer-result" id="buzzerResult">等待搶答...</div>
      <div class="mt-2">
        <h4>記錄</h4>
        <ol id="buzzerLog"></ol>
        <button class="btn btn-outline btn-sm mt-2" id="clearBuzzerLog">清除記錄</button>
      </div>
    </div>
  `;

  let players = [];
  let locked = false;
  let currentPlayer = '';

  function renderPlayers() {
    const el = document.getElementById('buzzerPlayers');
    if (!players.length) { el.innerHTML = '<p style="color:#999">尚未加入學生</p>'; return; }
    el.innerHTML = players.map((p, i) =>
      `<span class="tag" style="background:var(--primary);color:#fff;padding:4px 12px;border-radius:16px;font-size:14px;display:inline-flex;align-items:center;gap:6px;margin:4px">
        ${p}
        <button class="remove-player" data-idx="${i}" style="background:none;border:none;color:#fff;cursor:pointer;font-weight:700">×</button>
      </span>`
    ).join('');

    el.querySelectorAll('.remove-player').forEach(btn => {
      btn.addEventListener('click', () => {
        players.splice(parseInt(btn.dataset.idx), 1);
        renderPlayers();
      });
    });
  }

  document.getElementById('addBuzzerPlayer').addEventListener('click', () => {
    const input = document.getElementById('buzzerName');
    const name = input.value.trim();
    if (!name) return;
    players.push(name);
    input.value = '';
    renderPlayers();
  });

  document.getElementById('buzzerBtn').addEventListener('click', () => {
    if (locked) return;
    if (!players.length) { document.getElementById('buzzerResult').textContent = '⚠️ 請先加入學生'; return; }

    locked = true;
    const idx = Math.floor(Math.random() * players.length);
    currentPlayer = players[idx];
    document.getElementById('buzzerResult').textContent = '🎉 ' + currentPlayer + ' 搶到了！';

    const log = document.getElementById('buzzerLog');
    const li = document.createElement('li');
    li.textContent = currentPlayer + ' — ' + new Date().toLocaleTimeString('zh-TW', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
    log.prepend(li);

    const btn = document.getElementById('buzzerBtn');
    btn.disabled = true;
    btn.textContent = '已鎖定';
  });

  document.getElementById('clearBuzzerLog').addEventListener('click', () => {
    document.getElementById('buzzerLog').innerHTML = '';
    locked = false;
    currentPlayer = '';
    document.getElementById('buzzerResult').textContent = '等待搶答...';
    const btn = document.getElementById('buzzerBtn');
    btn.disabled = false;
    btn.textContent = '搶答！';
  });

  renderPlayers();
}
