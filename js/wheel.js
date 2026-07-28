function initWheel() {
  const COLORS = ['#4f46e5','#f59e0b','#22c55e','#ef4444','#ec4899','#06b6d4','#8b5cf6','#f97316','#14b8a6','#e11d48'];
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const list = document.getElementById('wheelList');
  const result = document.getElementById('wheelResult');

  let isSpinning = false;
  let currentRotation = 0;

  function drawWheel(rotation) {
    const items = list.value.split('\n').map(s => s.trim()).filter(Boolean);
    const cx = 300, cy = 300, r = 280;

    ctx.clearRect(0, 0, 600, 600);

    if (!items.length) {
      ctx.font = '28px sans-serif'; ctx.fillStyle = '#999'; ctx.textAlign = 'center';
      ctx.fillText('請輸入選項', 300, 300);
      return;
    }

    const slice = (2 * Math.PI) / items.length;
    items.forEach((item, i) => {
      const start = i * slice + rotation;
      const end = start + slice;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end); ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + slice / 2);
      ctx.textAlign = 'right'; ctx.fillStyle = '#fff'; ctx.font = 'bold 20px sans-serif';
      ctx.fillText(item.length > 6 ? item.slice(0, 6) + '..' : item, r - 20, 6);
      ctx.restore();
    });
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff'; ctx.fill();
  }

  function getWinner(rotation) {
    const items = list.value.split('\n').map(s => s.trim()).filter(Boolean);
    if (!items.length) return '';
    const slice = (2 * Math.PI) / items.length;
    const pointer = 3 * Math.PI / 2;
    const adjusted = (((pointer - rotation) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    return items[Math.floor(adjusted / slice) % items.length];
  }

  document.getElementById('wheelSpinBtn').addEventListener('click', () => {
    if (isSpinning) return;
    const items = list.value.split('\n').map(s => s.trim()).filter(Boolean);
    if (!items.length) { result.textContent = '⚠️ 請輸入選項'; return; }

    isSpinning = true;
    result.textContent = '轉動中...';
    const targetSpin = (5 + Math.random() * 5) * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const startRot = currentRotation;
    const endRot = startRot + targetSpin;
    const duration = 3000;
    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      currentRotation = startRot + targetSpin * eased;
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        currentRotation = endRot;
        drawWheel(currentRotation);
        result.textContent = '🎉 ' + getWinner(currentRotation);
      }
    }
    requestAnimationFrame(animate);
  });

  list.addEventListener('input', () => drawWheel(currentRotation));
  drawWheel(0);
}
