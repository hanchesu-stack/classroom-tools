const TOOLS = [
  { id: 'picker',   icon: '🎲', label: '抽籤' },
  { id: 'wheel',    icon: '🎡', label: '轉盤' },
  { id: 'sounds',   icon: '🔊', label: '音效' },
  { id: 'timer',    icon: '⏱', label: '計時器' },
  { id: 'buzzer',   icon: '🔴', label: '搶答器' },
  { id: 'groups',   icon: '👥', label: '分組' },
  { id: 'scoreboard', icon: '🏆', label: '計分板' },
  { id: 'random-num', icon: '🔢', label: '隨機號碼' },
];

const INITIALIZED = {};

function switchTool(id) {
  document.querySelectorAll('.tool-page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tool-nav button').forEach(el => el.classList.remove('active'));

  const page = document.getElementById(`page-${id}`);
  if (page) page.classList.add('active');

  const btn = document.querySelector(`.tool-nav button[data-tool="${id}"]`);
  if (btn) btn.classList.add('active');
}

function initApp() {
  const nav = document.getElementById('toolNav');
  TOOLS.forEach(t => {
    const btn = document.createElement('button');
    btn.dataset.tool = t.id;
    btn.textContent = `${t.icon} ${t.label}`;
    btn.addEventListener('click', () => switchTool(t.id));
    nav.appendChild(btn);
  });

  const inits = {
    picker: initPicker,
    wheel: initWheel,
    sounds: initSounds,
    timer: initTimer,
    buzzer: initBuzzer,
    groups: initGroups,
    scoreboard: initScoreboard,
    'random-num': initRandomNum,
  };

  TOOLS.forEach(t => {
    if (inits[t.id]) {
      inits[t.id]();
      INITIALIZED[t.id] = true;
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);
