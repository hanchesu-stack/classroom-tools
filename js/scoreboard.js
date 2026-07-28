function initScoreboard() {
  const teams = [
    { name: '紅隊', score: 0 },
    { name: '藍隊', score: 0 },
    { name: '黃隊', score: 0 },
  ];

  function render() {
    const grid = document.getElementById('teamGrid');
    if (!teams.length) { grid.innerHTML = '<p style="color:var(--text-light)">尚未加入隊伍</p>'; return; }
    grid.innerHTML = teams.map((t, i) =>
      `<div class="team-card">
        <div class="name">${t.name}</div>
        <div class="score" id="ts-${i}">${t.score}</div>
        <div class="score-controls">
          <button class="btn btn-accent btn-sm sc-btn" data-i="${i}" data-d="1">+1</button>
          <button class="btn btn-accent btn-sm sc-btn" data-i="${i}" data-d="2">+2</button>
          <button class="btn btn-accent btn-sm sc-btn" data-i="${i}" data-d="5">+5</button>
          <button class="btn btn-danger btn-sm sc-btn" data-i="${i}" data-d="-1">-1</button>
          <button class="btn btn-outline btn-sm sc-del" data-i="${i}">×</button>
        </div>
      </div>`
    ).join('');

    grid.querySelectorAll('.sc-btn').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.dataset.i);
        const delta = parseInt(b.dataset.d);
        teams[idx].score = Math.max(0, teams[idx].score + delta);
        document.getElementById('ts-' + idx).textContent = teams[idx].score;
      });
    });
    grid.querySelectorAll('.sc-del').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.dataset.i);
        teams.splice(idx, 1);
        render();
      });
    });
  }

  document.getElementById('addTeamBtn').addEventListener('click', () => {
    const input = document.getElementById('teamNameInput');
    const name = input.value.trim();
    if (!name) return;
    teams.push({ name, score: 0 });
    input.value = '';
    render();
  });

  document.getElementById('resetAllScores').addEventListener('click', () => {
    teams.forEach(t => t.score = 0);
    render();
  });

  render();
}
