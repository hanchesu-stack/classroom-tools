function initGroups() {
  document.getElementById('groupGo').addEventListener('click', () => {
    const names = document.getElementById('groupList').value.split('\n').map(s => s.trim()).filter(Boolean);
    const size = parseInt(document.getElementById('groupSize').value) || 0;
    const count = parseInt(document.getElementById('groupCount').value) || 0;

    if (!names.length) { document.getElementById('groupOutput').innerHTML = '<p style="color:red">請輸入名單</p>'; return; }
    if (!size && !count) { document.getElementById('groupOutput').innerHTML = '<p style="color:red">請填每組人數或組數</p>'; return; }

    const shuffled = [...names].sort(() => Math.random() - 0.5);
    let groups;

    if (size > 0) {
      groups = [];
      for (let i = 0; i < shuffled.length; i += size) groups.push(shuffled.slice(i, i + size));
    } else {
      groups = Array.from({ length: count }, () => []);
      shuffled.forEach((name, i) => groups[i % count].push(name));
    }

    document.getElementById('groupOutput').innerHTML = groups.map((g, i) =>
      `<div class="group-box"><h4>第 ${i + 1} 組（${g.length} 人）</h4><div class="members">${
        g.map(n => `<span class="tag">${n}</span>`).join('')
      }</div></div>`
    ).join('');
  });
}
