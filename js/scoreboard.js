function renderScoreboard() {
  const page = document.getElementById('page-scoreboard');
  page.innerHTML = `
    <div class="tool-card">
      <h2>🏆 計分板</h2>
      <div class="flex-center mb-2">
        <input type="text" id="teamNameInput" placeholder="隊伍名稱" style="max-width:180px">
        <button class="btn btn-primary btn-sm" id="addTeamBtn">新增隊伍</button>
      </div>
      <div class="scoreboard-teams" id="teamGrid"></div>
      <div class="flex-center mt-3">
        <button class="btn btn-outline btn-sm" id="resetAllScores">重設所有分數</button>
      </div>
    </div>
  `;

  let teams = [
    { name: '紅隊', score: 0 },
    { name: '藍隊', score: 0 },
    { name: '黃隊', score: 0 },
  ];

  function renderTeams() {
    const grid = document.getElementById('teamGrid');
    if (!teams.length) {
      grid.innerHTML = '<p style="color:#999">尚未加入隊伍</p>';
      return;
    }
    grid.innerHTML = teams.map((t, i) =>
      `<div class="team-card">
        <div class="name">${t.name}</div>
        <div class="score" id="teamScore-${i}">${t.score}</div>
        <div class="score-controls">
          <button class="btn btn-accent btn-sm score-btn" data-idx="${i}" data-delta="1">+1</button>
          <button class="btn btn-accent btn-sm score-btn" data-idx="${i}" data-delta="2">+2</button>
          <button class="btn btn-accent btn-sm score-btn" data-idx="${i}" data-delta="5">+5</button>
          <button class="btn btn-danger btn-sm score-btn" data-idx="${i}" data-delta="-1">-1</button>
          <button class="btn btn-outline btn-sm" onclick="if(confirm('刪除 ${t.name}？')){teams.splice(${i},1);renderTeams();}">×</button>
        </div>
      </div>`
    ).join('');

    grid.querySelectorAll('.score-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const delta = parseInt(btn.dataset.delta);
        teams[idx].score = Math.max(0, teams[idx].score + delta);
        const el = document.getElementById(`teamScore-${idx}`);
        if (el) el.textContent = teams[idx].score;
      });
    });
  }

  document.getElementById('addTeamBtn').addEventListener('click', () => {
    const input = document.getElementById('teamNameInput');
    const name = input.value.trim();
    if (!name) return;
    teams.push({ name, score: 0 });
    input.value = '';
    renderTeams();
  });

  document.getElementById('resetAllScores').addEventListener('click', () => {
    teams.forEach(t => t.score = 0);
    renderTeams();
  });

  window.teams = teams;
  window.renderTeams = renderTeams;
  renderTeams();
}
