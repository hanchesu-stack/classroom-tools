function renderGroups() {
  const page = document.getElementById('page-groups');
  page.innerHTML = `
    <div class="tool-card">
      <h2>👥 分組</h2>
      <div class="grid-2">
        <div>
          <label>名單（一行一個）</label>
          <textarea id="groupList" rows="6">學生一
學生二
學生三
學生四
學生五
學生六
學生七
學生八</textarea>
        </div>
        <div>
          <label>每組人數</label>
          <input type="number" id="groupSize" value="3" min="2" max="10">
          <label class="mt-2" style="display:block">或指定組數</label>
          <input type="number" id="groupCount" value="3" min="1" max="20">
          <p style="font-size:13px;color:var(--text-light);margin-top:4px">填每組人數或組數，留一個為 0</p>
        </div>
      </div>
      <div class="flex-center mt-2">
        <button class="btn btn-primary" id="groupGo">👥 開始分組</button>
      </div>
      <div class="group-output" id="groupOutput"></div>
    </div>
  `;

  document.getElementById('groupGo').addEventListener('click', () => {
    const names = document.getElementById('groupList').value.split('\n').map(s => s.trim()).filter(Boolean);
    const size = parseInt(document.getElementById('groupSize').value) || 0;
    const count = parseInt(document.getElementById('groupCount').value) || 0;

    if (!names.length) { document.getElementById('groupOutput').innerHTML = '<p style="color:red">請輸入名單</p>'; return; }

    const shuffled = [...names].sort(() => Math.random() - 0.5);
    let groups;

    if (size > 0) {
      groups = [];
      for (let i = 0; i < shuffled.length; i += size) {
        groups.push(shuffled.slice(i, i + size));
      }
    } else if (count > 0) {
      groups = Array.from({ length: count }, () => []);
      shuffled.forEach((name, i) => groups[i % count].push(name));
    } else {
      document.getElementById('groupOutput').innerHTML = '<p style="color:red">請填每組人數或組數</p>';
      return;
    }

    const output = document.getElementById('groupOutput');
    output.innerHTML = groups.map((g, i) =>
      `<div class="group-box">
        <h4>第 ${i + 1} 組（${g.length} 人）</h4>
        <div class="members">${g.map(n => `<span class="tag">${n}</span>`).join('')}</div>
      </div>`
    ).join('');
  });
}
