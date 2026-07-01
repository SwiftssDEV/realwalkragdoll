const polyCanvas = document.getElementById('sim'); const pCtx = polyCanvas.getContext('2d');
let polyActive = false, points = [], sticks = [], polyMx = 0, polyMy = 0, polyDragged = null, vacOn = false, gunOn = false, polyBullets = [], frameCount = 0;
const pFloorY = () => polyCanvas.height - 40; const pWLeft = 40; const pWRight = () => polyCanvas.width - 40;

document.getElementById('go-poly').onclick = () => {
    document.getElementById('box').style.display = 'none'; document.getElementById('poly-screen').style.display = 'block';
    polyCanvas.width = polyCanvas.parentNode.offsetWidth; polyCanvas.height = polyCanvas.parentNode.offsetHeight;
    polyActive = true; initPolyPhysics(); pSay("Ааа! Что это за железная коробка?! Выпусти с компа!");
};
document.getElementById('exit-poly').onclick = () => { polyActive = false; document.getElementById('poly-screen').style.display = 'none'; document.getElementById('box').style.display = 'block'; };
let pLog = document.getElementById('chat-log'); function pSay(t) { let d = document.createElement('div'); d.innerHTML = '<b>Геймер:</b> ' + t; pLog.appendChild(d); pLog.scrollTop = pLog.scrollHeight; }

function initPolyPhysics() {
    points = []; sticks = [];
    function addP(x, y) { let p = { x: x, y: y, oldX: x, oldY: y }; points.push(p); return p; }
    function addS(p1, p2, l) { let s = { p1: p1, p2: p2, len: l }; sticks.push(s); return s; }
    let h = addP(300, 200), c = addP(300, 220), pv = addP(300, 240);
    let lh = addP(292, 242), lk = addP(290, 265), lf = addP(290, 290);
    let rh = addP(308, 242), rk = addP(310, 265), rf = addP(310, 290);
    let ls = addP(288, 218), lhn = addP(270, 230), rs = addP(312, 218), rhn = addP(330, 230);
    addS(h, c, 20); addS(c, pv, 20); addS(c, ls, 12); addS(ls, lhn, 22); addS(c, rs, 12); addS(rs, rhn, 22);
    addS(pv, lh, 8); addS(lh, lk, 22); addS(lk, lf, 22); addS(pv, rh, 8); addS(rh, rk, 22); addS(rk, rf, 22);
    window.pH = h; window.pPV = pv; window.pLF = lf; window.pRF = rf; window.pLH = lhn; window.pRH = rhn; window.pLS = ls; window.pRS = rs; window.pC = c;
}

polyCanvas.addEventListener('mousemove', e => { let r = polyCanvas.getBoundingClientRect(); polyMx = e.clientX - r.left; polyMy = e.clientY - r.top; });
polyCanvas.addEventListener('mousedown', () => {
    let best = 25; points.forEach(p => { let d = Math.sqrt((p.x - polyMx)**2 + (p.y - polyMy)**2); if (d < best) { best = d; polyDragged = p; } });
    if (polyDragged && Math.random() > 0.5) pSay("Хватит дёргать меня! Я превращаюсь в тряпку, суставам же больно!");
});
window.addEventListener('mouseup', () => { polyDragged = null; });
document.getElementById('btn-vac').onclick = () => { vacOn = !vacOn; document.getElementById('btn-vac').style.background = vacOn ? '#ff0055' : '#1a1d36'; if(vacOn) pSay("О нет! Это воронка Electrolux! Помогите, затягивает!"); };
document.getElementById('btn-gun').onclick = () => { gunOn = !gunOn; document.getElementById('btn-gun').style.background = gunOn ? '#ff0055' : '#1a1d36'; };

let pWalk = 0, pAiDir = 1, pAiTimer = 0; let pPhrases = ["Мой костюм трещит по швам!", "Отпусти меня из этой песочницы!", "Ай! Пуля попала по трекеру!", "Тут гравитация реальная!", "Выключи пушки!", "Слышь, админ, вытащи меня с компа!"];

function runPolyPhysics() {
    frameCount++;
    if (!polyDragged && !vacOn) {
        pAiTimer--; if (pAiTimer <= 0) { pAiTimer = 100 + Math.random()*100; pAiDir = Math.random() > 0.5 ? 1 : -1; }
        pWalk += 0.12; window.pPV.x += pAiDir * 0.8;
        if (Math.sin(pWalk) > 0) {
            window.pLF.x += (window.pPV.x - 14 + Math.sin(pWalk)*8 - window.pLF.x)*0.2; window.pLF.y += (pFloorY() - window.pLF.y)*0.2; window.pRF.y += (pFloorY() - 8 - window.pRF.y)*0.2;
        } else {
            window.pRF.x += (window.pPV.x + 14 - Math.sin(pWalk)*8 - window.pRF.x)*0.2; window.pRF.y += (pFloorY() - window.pRF.y)*0.2; window.pLF.y += (pFloorY() - 8 - window.pLF.y)*0.2;
        }
    } else if (polyDragged) { polyDragged.x = polyMx; polyDragged.y = polyMy; polyDragged.oldX = polyMx; polyDragged.oldY = polyMy; }
    if (vacOn) { points.forEach(p => { let dx = 80 - p.x, dy = 100 - p.y, d = Math.sqrt(dx*dx + dy*dy); if (d > 10) { p.x += (dx/d)*3.5; p.y += (dy/d)*3.5; } }); }
    if (gunOn && frameCount % 15 === 0) polyBullets.push({ x: pWRight() - 10, y: window.pH.y + (Math.random()*60-30), vx: -10 });
    polyBullets.forEach((b, idx) => {
        b.x += b.vx;
        points.forEach(p => { if (Math.sqrt((p.x - b.x)**2 + (p.y - b.y)**2) < 18) { p.x += b.vx * 0.8; polyBullets.splice(idx, 1); if(Math.random()>0.8) pSay("Больно же! Хватит палить!"); } });
        if (b.x < pWLeft) polyBullets.splice(idx, 1);
    });
    points.forEach(p => { if (p === polyDragged) return; let vx = (p.x - p.oldX) * 0.98, vy = (p.y - p.oldY) * 0.98; p.oldX = p.x; p.oldY = p.y; p.x += vx; p.y += vy + 0.35; });
    for (let i = 0; i < 5; i++) {
        sticks.forEach(s => {
            let dx = s.p2.x - s.p1.x, dy = s.p2.y - s.p1.y, d = Math.sqrt(dx*dx + dy*dy); let diff = s.len - d, percent = (diff / d) * 0.5;
            if (s.p1 !== polyDragged) { s.p1.x -= dx * percent; s.p1.y -= dy * percent; }
            if (s.p2 !== polyDragged) { s.p2.x += dx * percent; s.p2.y += dy * percent; }
        });
    }
    points.forEach(p => { if (p.y > pFloorY()) { p.y = pFloorY(); p.oldY = p.y + (p.y - p.oldY)*0.2; } if (p.x < pWLeft) { p.x = pWLeft; p.oldX = p.x; } if (p.x > pWRight()) { p.x = pWRight(); p.oldX = p.x; } });
}

function renderPolyLoop() {
    if (!polyActive) return; runPolyPhysics(); pCtx.clearRect(0, 0, polyCanvas.width, polyCanvas.height);
    pCtx.strokeStyle = '#333'; pCtx.lineWidth = 4; pCtx.beginPath(); pCtx.moveTo(pWLeft, 50); pCtx.lineTo(pWLeft, pFloorY()); pCtx.lineTo(pWRight(), pFloorY()); pCtx.lineTo(pWRight(), 50); pCtx.stroke();
    if (vacOn) {
        pCtx.fillStyle = '#ff0055'; pCtx.beginPath(); pCtx.arc(80, 100, 25, 0, Math.PI*2); pCtx.fill();
        pCtx.strokeStyle = '#ff0055'; pCtx.lineWidth = 2; pCtx.beginPath(); pCtx.arc(80, 100, 60 + Math.sin(frameCount*0.2)*15, 0, Math.PI*2); pCtx.stroke();
    }
    pCtx.fillStyle = '#ffff00'; polyBullets.forEach(b => { pCtx.fillRect(b.x, b.y, 8, 3); });
    pCtx.strokeStyle = '#000000'; pCtx.fillStyle = '#000000'; pCtx.lineWidth = 5.5; pCtx.lineCap = 'round'; pCtx.lineJoin = 'round';
    pCtx.beginPath(); pCtx.arc(window.pH.x, window.pH.y, 6.5, 0, Math.PI*2); pCtx.fill();
    function dL(p1,p2){pCtx.beginPath();pCtx.moveTo(p1.x,p1.y);pCtx.lineTo(p2.x,p2.y);pCtx.stroke();}
    dL(window.pH, window.pC); dL(window.pC, window.pPV); dL(window.pC, window.pLF); dL(window.pC, window.pRF);
    requestAnimationFrame(renderPolyLoop);
}
setInterval(() => { if(polyActive && !polyDragged && !vacOn && Math.random() > 0.85) pSay(pPhrases[Math.floor(Math.random()*pPhrases.length)]); }, 8000);
setInterval(() => { if (polyActive) renderPolyLoop(); }, 16);
