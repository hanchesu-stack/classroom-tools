function initBuzzer() {
  const players = [];
  let locked = false;

  function renderPlayers() {
    const el = document.getElementById('buzzerPlayers');
    if (!players.length) { el.innerHTML = '<p style="color:#999;margin:8px 0">尚未加入學生</p>'; return; }
    el.innerHTML = players.map((p, i) =>
      `<span style="background:var(--primary);color:#fff;padding:4px 12px;border-radius:16px;font-size:14px;display:inline-flex;align-items:center;gap:6px;margin:4px">
        ${p}
        <button class="rm-player" data-i="${i}" style="background:none;border:none;color:#fff;cursor:pointer;font-size:16px;padding:0">×</button>
      </span>`
    ).join('');
    el.querySelectorAll('.rm-player').forEach(b => {
      b.addEventListener('click', () => { players.splice(parseInt(b.dataset.i), 1); renderPlayers(); });
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
    const winner = players[Math.floor(Math.random() * players.length)];
    document.getElementById('buzzerResult').textContent = '🎉 ' + winner + ' 搶到了！';
    const li = document.createElement('li');
    li.textContent = winner + ' — ' + new Date().toLocaleTimeString('zh-TW', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
    document.getElementById('buzzerLog').prepend(li);
    const btn = document.getElementById('buzzerBtn');
    btn.disabled = true; btn.textContent = '已鎖定';
  });

  document.getElementById('clearBuzzerLog').addEventListener('click', () => {
    document.getElementById('buzzerLog').innerHTML = '';
    locked = false;
    document.getElementById('buzzerResult').textContent = '等待搶答...';
    const btn = document.getElementById('buzzerBtn');
    btn.disabled = false; btn.textContent = '搶答！';
  });

  renderPlayers();
}
