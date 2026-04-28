/* ================= EFEK ANIMASI PENGETIKAN ================= */
const textToType = "Pilih misi dan kumpulkan semua gelar kehormatan!";
let typeIndex = 0;
function typeWriterEffect() {
    if (typeIndex < textToType.length) {
        document.getElementById("typing-text").innerHTML += textToType.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriterEffect, 60);
    }
}
setTimeout(typeWriterEffect, 600);

/* ================= LOGIKA UI DRAGGABLE ================= */
const balloon = document.getElementById('drag-balloon');
let isDraggingBalloon = false, didMoveBalloon = false, startX, startY, initialLeft, initialTop;
balloon.addEventListener('mousedown', dragStart); window.addEventListener('mousemove', dragMove); window.addEventListener('mouseup', dragEnd);
balloon.addEventListener('touchstart', dragStart, { passive: false }); window.addEventListener('touchmove', dragMove, { passive: false }); window.addEventListener('touchend', dragEnd);
function dragStart(e) { if (e.type === 'touchstart') { startX = e.touches[0].clientX; startY = e.touches[0].clientY; } else { startX = e.clientX; startY = e.clientY; } let rect = balloon.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top; isDraggingBalloon = true; didMoveBalloon = false; }
function dragMove(e) { if (!isDraggingBalloon) return; e.preventDefault(); let currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX; let currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY; let diffX = currentX - startX; let diffY = currentY - startY; if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) didMoveBalloon = true; let newLeft = initialLeft + diffX; let newTop = initialTop + diffY; let maxX = window.innerWidth - balloon.offsetWidth; let windowHeight = window.innerHeight - balloon.offsetHeight; if (newLeft < 0) newLeft = 0; if (newLeft > maxX) newLeft = maxX; if (newTop < 0) newTop = 0; if (newTop > windowHeight) newTop = windowHeight; balloon.style.left = newLeft + 'px'; balloon.style.top = newTop + 'px'; }
function dragEnd(e) { isDraggingBalloon = false; }

balloon.addEventListener('click', (e) => {
    if (!didMoveBalloon) { openInventory(); }
});

/* ==============================================================
   LOGIKA SPA (TUKAR LAYAR - AUTO RATA ATAS)
   ============================================================== */
let currentGameId = 0;
let playerData = JSON.parse(localStorage.getItem('sman8_gamedata')) || { name: "", badges: [] };
let currentView = 'menu-view';
let previousView = 'menu-view';

function switchView(targetView) {
    previousView = currentView;

    document.getElementById('menu-view').style.display = 'none';
    document.getElementById('game-view').style.display = 'none';
    document.getElementById('pledge-view').style.display = 'none';
    document.getElementById('inventory-view').style.display = 'none';

    let target = document.getElementById(targetView);
    if (targetView === 'menu-view') {
        target.style.display = 'block';
        document.getElementById('drag-balloon').style.display = 'flex';
    } else if (targetView === 'game-view') {
        target.style.display = 'flex';
        document.getElementById('drag-balloon').style.display = 'none';
    } else {
        target.style.display = 'flex';
        document.getElementById('drag-balloon').style.display = 'none';
    }

    currentView = targetView;

    // Auto-scroll ke paling atas setiap ganti layar, agar pop-up di atas langsung kelihatan
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);
}

function openGame(gameId, linkEmbed) {
    currentGameId = gameId;
    document.getElementById("game-iframe").src = linkEmbed;
    switchView('game-view');
}

function closeGame() {
    document.getElementById("game-iframe").src = "";
    currentGameId = 0;
    switchView('menu-view');
}

function openPledgeModal() {
    if (playerData.badges.includes(currentGameId)) {
        alert("Gelar Misi ini sudah diamankan di Koleksi Gelar!"); return;
    }
    switchView('pledge-view');
}

function closePledgeModal() {
    switchView('game-view');
}

function claimReward() {
    fireConfetti();
    setTimeout(() => {
        if (!playerData.name) {
            let inputName = prompt("Misi Selesai! Masukkan Nickname untuk dicetak di Koleksi Gelar:");
            playerData.name = inputName ? inputName : "Hacker Anonim";
        }
        if (!playerData.badges.includes(currentGameId)) {
            playerData.badges.push(currentGameId);
            localStorage.setItem('sman8_gamedata', JSON.stringify(playerData));
        }
        openInventory();
    }, 800);
}

function openInventory() {
    document.getElementById('player-name-display').innerText = playerData.name ? `AKSES: ${playerData.name}` : "AKSES: DATA KOSONG";
    for (let i = 1; i <= 3; i++) {
        let badgeCard = document.getElementById('badge-' + i);
        let statusText = document.getElementById('status-' + i);
        if (playerData.badges.includes(i)) {
            badgeCard.classList.add('unlocked'); statusText.innerText = "SYSTEM UNLOCKED";
        } else {
            badgeCard.classList.remove('unlocked'); statusText.innerText = "TERKUNCI";
        }
    }
    switchView('inventory-view');
}

function closeInventory() {
    if (previousView === 'pledge-view') {
        closeGame();
    } else {
        switchView('menu-view');
    }
}

function fireConfetti() { const container = document.getElementById('confetti-container'); const colors = ['#3b82f6', '#06b6d4', '#ec4899', '#f59e0b', '#ffffff']; for (let i = 0; i < 80; i++) { let conf = document.createElement('div'); conf.classList.add('confetti-piece'); conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; conf.style.left = Math.random() * 100 + '%'; conf.style.top = '-20px'; conf.style.animationDuration = (Math.random() * 2 + 1) + 's'; conf.style.animationDelay = (Math.random() * 0.5) + 's'; container.appendChild(conf); setTimeout(() => conf.remove(), 3000); } }

/* LOGIKA NATIVE FULLSCREEN */
function openFullscreenSafe() {
    const iframe = document.getElementById('game-iframe');
    const link = iframe.src;
    if (!link) return;

    const part1 = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><title>Misi Layar Penuh</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet"><style>* { box-sizing: border-box; } body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; font-family: 'Outfit', sans-serif; display: flex; flex-direction: column; } .game-wrapper { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 10; background: #000; } iframe { width: 100%; height: 100%; border: none; } #start-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(4, 9, 20, 0.85); backdrop-filter: blur(5px); z-index: 1000; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; } .overlay-box { background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98)); width: 90%; max-width: 450px; border-radius: 30px 5px 30px 5px; border: 2px solid #06b6d4; border-left: 5px solid #ec4899; padding: 40px 30px; text-align: center; color: white; box-shadow: -10px 10px 0px rgba(6, 182, 212, 0.15), 0 0 40px rgba(6, 182, 212, 0.3); animation: hologramOn 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; display: flex; flex-direction: column; align-items: center; } @keyframes hologramOn { 0% { transform: scaleY(0.01) scaleX(0); opacity: 0; } 50% { transform: scaleY(0.01) scaleX(1); opacity: 1; } 100% { transform: scaleY(1) scaleX(1); opacity: 1; } } .overlay-box svg { width: 70px; height: 70px; fill: none; stroke: #06b6d4; stroke-width: 2; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(6,182,212,0.5)); animation: rotatePhone 3s ease-in-out infinite; transform-origin: center center; } @keyframes rotatePhone { 0%, 15% { transform: rotate(0deg); } 35%, 65% { transform: rotate(-90deg); } 85%, 100% { transform: rotate(0deg); } } .overlay-box h2 { margin-bottom: 15px; font-size: 22px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; } .overlay-box p { color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 25px; } #resume-text { display: none; } .warning-text { color: #f59e0b; font-weight: 800; display: block; margin-top: 10px; animation: blink 1s infinite; font-size: 14px;} @keyframes blink { 50% { opacity: 0.5; } } .btn-fs { background: linear-gradient(90deg, #3b82f6, #06b6d4); box-shadow: 0 5px 20px rgba(6, 182, 212, 0.4); border: none; padding: 15px 30px; border-radius: 50px; color: #fff; font-weight: 800; font-size: 15px; cursor: pointer; transition: 0.3s; margin-bottom: 15px; width: 100%; animation: floatBtn 3s infinite ease-in-out; } @keyframes floatBtn { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } } .btn-fs:hover { filter: brightness(1.2); transform: scale(1.05); } .btn-close { background: transparent; border: none; color: #94a3b8; font-weight: 600; text-decoration: underline; font-size: 14px; cursor: pointer; padding: 10px; transition: 0.3s; } .btn-close:hover { color: #ef4444; } </style></head><body><div class="game-wrapper"><iframe id="game-frame" src="" data-url="${link}" allow="autoplay; fullscreen" allowfullscreen="true"></iframe></div><div id="start-overlay"><div class="overlay-box"><svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg><h2 id="title-text">Persiapan Bermain</h2><p id="desc-text">Silakan klik tombol di bawah untuk membuka permainan dalam mode Layar Penuh. Tampilan otomatis akan menyesuaikan menjadi mendatar (Landscape).</p><p id="resume-text">Layar Penuh Tertutup!<br><span class="warning-text">⚠️ WAKTU GAME TETAP BERJALAN!</span></p><button id="btn-start" class="btn-fs" onclick="forceFullscreen()">⛶ Masuk Layar Penuh</button><button class="btn-close" onclick="window.close()">✖ Tutup Layar & Klaim Gelar</button></div></div>`;
    const part2 = "<scr" + "ipt>";
    const part3 = `let isGameLoaded = false; function forceFullscreen() { let docEl = document.documentElement; let requestFS = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen; if (requestFS) { requestFS.call(docEl).then(() => { lockAndLoad(); }).catch(err => { lockAndLoad(); }); } else { lockAndLoad(); } } function lockAndLoad() { if (screen.orientation && screen.orientation.lock) { screen.orientation.lock('landscape').then(() => { initGame(); }).catch(err => { initGame(); }); } else { initGame(); } } function initGame() { let overlay = document.getElementById('start-overlay'); let frame = document.getElementById('game-frame'); setTimeout(() => { if (!isGameLoaded) { frame.src = frame.getAttribute('data-url'); isGameLoaded = true; document.getElementById('title-text').innerText = "GAME DIJEDA"; document.getElementById('desc-text').style.display = 'none'; document.getElementById('resume-text').style.display = 'block'; document.getElementById('btn-start').innerHTML = "⛶ Segera Lanjutkan Misi!"; } overlay.style.display = 'none'; }, 600); } document.addEventListener("fullscreenchange", function() { if (!document.fullscreenElement) { let overlay = document.getElementById('start-overlay'); overlay.style.display = 'none'; setTimeout(() => { overlay.style.display = 'flex'; }, 20); } });`;
    const part4 = "</scr" + "ipt></body></html>";

    const winHtml = part1 + part2 + part3 + part4;
    let newWin = window.open("", "_blank");
    if (newWin) { newWin.document.open(); newWin.document.write(winHtml); newWin.document.close(); } else { alert("Pop-up diblokir!"); }
}

function transitionToGame(e) {
    if (e) e.preventDefault();

    // Buka jendela baru seperti Misi 1-3, berisi Persiapan Bermain + Loading + game
    const gameUrl = 'games.html';

    const htmlPrep = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Tech Quest RPG - Persiapan Bermain</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body, html { width:100%; height:100%; background: #04091a; font-family: 'Outfit', sans-serif; overflow: hidden; }

/* ===== PREP OVERLAY ===== */
#prepScreen {
    position: fixed; inset: 0; z-index: 9999;
    background: linear-gradient(135deg, #04091a 0%, #0a1628 50%, #04091a 100%);
    display: flex; justify-content: center; align-items: center; padding: 20px;
    animation: prepFadeIn 0.4s ease forwards;
}
#prepScreen::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(6,182,212,0.07) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 50%, rgba(236,72,153,0.07) 0%, transparent 60%);
}
.prep-box {
    background: linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.99));
    width: 90%; max-width: 440px;
    border-radius: 30px 5px 30px 5px;
    border: 2px solid #06b6d4;
    border-left: 5px solid #ec4899;
    padding: 45px 35px;
    text-align: center; color: white;
    box-shadow: -10px 10px 0px rgba(6,182,212,0.15), 0 0 50px rgba(6,182,212,0.3);
    animation: hologramOn 0.6s cubic-bezier(0.68,-0.55,0.27,1.55) forwards;
    display: flex; flex-direction: column; align-items: center;
    position: relative; overflow: hidden;
}
.prep-glow-line {
    position: absolute; top: 0; left: 0; width: 100%; height: 3px;
    background: linear-gradient(90deg, transparent, #06b6d4, #ec4899, transparent);
    animation: glowLine 3s linear infinite;
}
.prep-phone-icon {
    width: 75px; height: 75px; fill: none; stroke: #06b6d4; stroke-width: 1.8;
    margin-bottom: 22px;
    filter: drop-shadow(0 0 12px rgba(6,182,212,0.6));
    animation: rotatePhone 4s ease-in-out infinite;
    transform-origin: center center;
}
.prep-title {
    font-size: 20px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;
    background: linear-gradient(135deg, #fff, #06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 14px;
}
.prep-desc {
    color: #94a3b8; font-size: 14px; line-height: 1.7; margin-bottom: 28px;
}
.btn-enter {
    background: linear-gradient(90deg, #3b82f6, #06b6d4);
    border: none; padding: 16px 30px; border-radius: 50px;
    color: #fff; font-weight: 800; font-size: 15px;
    cursor: pointer; width: 100%; margin-bottom: 16px;
    font-family: 'Outfit', sans-serif; letter-spacing: 0.5px;
    animation: floatBtn 3s infinite ease-in-out, glowPulse 2s infinite;
    transition: filter 0.2s, transform 0.2s;
}
.btn-enter:hover { filter: brightness(1.2); transform: scale(1.03); }
.btn-enter:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-cancel {
    background: transparent; border: none; color: #64748b;
    font-weight: 600; font-size: 13px; cursor: pointer;
    padding: 8px 20px; font-family: 'Outfit', sans-serif;
    transition: color 0.2s;
}
.btn-cancel:hover { color: #ef4444; }

/* ===== LOADING SCREEN ===== */
#loadScreen {
    position: fixed; inset: 0; z-index: 9998;
    background: linear-gradient(135deg, #04091a, #0a1628, #04091a);
    display: none; flex-direction: column;
    justify-content: center; align-items: center;
    opacity: 0; transition: opacity 0.5s ease;
}
#loadScreen.active { display: flex; opacity: 1; }
#loadScreen.fade-out { opacity: 0; }
.load-icon-wrap { position: relative; width: 100px; height: 100px; margin-bottom: 30px; }
.load-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #06b6d4;
    animation: spin 1.2s linear infinite;
}
.load-ring-2 {
    inset: 10px;
    border-top-color: #ec4899;
    animation: spin 0.8s linear infinite reverse;
}
.load-sword {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-size: 36px; animation: swordPulse 1.5s ease-in-out infinite;
}
.load-title {
    font-size: 28px; font-weight: 900; letter-spacing: 4px;
    background: linear-gradient(90deg, #06b6d4, #ec4899, #3b82f6, #06b6d4);
    background-size: 300% 100%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: gradShift 3s linear infinite; margin-bottom: 16px;
}
.load-status {
    color: #94a3b8; font-size: 14px; margin-bottom: 24px;
    transition: opacity 0.3s;
}
.load-bar-wrap { width: 280px; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.load-bar-track {
    flex: 1; height: 8px; background: rgba(255,255,255,0.08);
    border-radius: 100px; overflow: hidden; position: relative;
}
.load-bar-fill {
    height: 100%; width: 0%; border-radius: 100px;
    background: linear-gradient(90deg, #3b82f6, #06b6d4, #ec4899);
    background-size: 200% 100%;
    animation: gradShift 2s linear infinite;
    transition: width 0.3s ease;
}
.load-bar-shine {
    position: absolute; inset: 0; border-radius: 100px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
    animation: shine 2s linear infinite;
}
.load-pct { color: #06b6d4; font-size: 13px; font-weight: 800; width: 36px; text-align: right; }
.load-tip { color: #334155; font-size: 12px; max-width: 280px; text-align: center; }

/* ===== KEYFRAMES ===== */
@keyframes prepFadeIn { from{opacity:0;} to{opacity:1;} }
@keyframes hologramOn { 0%{transform:scaleY(0.01) scaleX(0);opacity:0;} 50%{transform:scaleY(0.01) scaleX(1);opacity:1;} 100%{transform:scaleY(1) scaleX(1);opacity:1;} }
@keyframes glowLine { 0%{background-position:200% center;} 100%{background-position:-200% center;} }
@keyframes rotatePhone {
    0%   { transform: rotate(0deg); }
    20%  { transform: rotate(0deg); }
    40%  { transform: rotate(-90deg); }
    60%  { transform: rotate(-90deg); }
    80%  { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
}
@keyframes floatBtn { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-5px);} }
@keyframes glowPulse { 0%,100%{box-shadow:0 5px 20px rgba(6,182,212,0.4);} 50%{box-shadow:0 5px 30px rgba(6,182,212,0.7),0 0 60px rgba(6,182,212,0.4);} }
@keyframes spin { to{transform:rotate(360deg);} }
@keyframes swordPulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.15);} }
@keyframes gradShift { 0%{background-position:0% 50%;} 100%{background-position:300% 50%;} }
@keyframes shine { 0%{transform:translateX(-100%);} 100%{transform:translateX(300%);} }
</style>
</head>
<body>

<!-- PREP SCREEN -->
<div id="prepScreen">
    <div class="prep-box">
        <div class="prep-glow-line"></div>
        <svg class="prep-phone-icon" viewBox="0 0 24 24">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        <div class="prep-title">Persiapan Bermain</div>
        <p class="prep-desc">
            Silakan klik tombol di bawah untuk membuka permainan dalam mode
            <strong style="color:#06b6d4;">Layar Penuh</strong>.
            Tampilan otomatis akan menyesuaikan menjadi mendatar
            <strong style="color:#ec4899;">(Landscape)</strong>.
        </p>
        <button class="btn-enter" id="btnEnter" onclick="startFullscreen()">⛶ Masuk Layar Penuh</button>
        <button class="btn-cancel" onclick="window.close()">✕ Batal</button>
    </div>
</div>

<!-- LOADING SCREEN -->
<div id="loadScreen">
    <div class="load-icon-wrap">
        <div class="load-ring"></div>
        <div class="load-ring load-ring-2"></div>
        <div class="load-sword">⚔️</div>
    </div>
    <div class="load-title">TECH QUEST</div>
    <div class="load-status" id="loadStatus">Memuat arena pertempuran...</div>
    <div class="load-bar-wrap">
        <div class="load-bar-track">
            <div class="load-bar-fill" id="loadBar"></div>
            <div class="load-bar-shine"></div>
        </div>
        <div class="load-pct" id="loadPct">0%</div>
    </div>
    <div class="load-tip">💡 Tip: Jawab soal lebih cepat untuk mendapat CRITICAL HIT!</div>
</div>

<script>
async function startFullscreen() {
    const btn = document.getElementById('btnEnter');
    btn.innerHTML = '⏳ Memuat...';
    btn.disabled = true;

    // Request fullscreen
    try {
        let docEl = document.documentElement;
        let requestFS = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
        if (requestFS) await requestFS.call(docEl);
    } catch(e) { console.log('Fullscreen failed:', e); }

    // Lock landscape
    try {
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape');
        }
    } catch(e) { console.log('Orientation lock failed:', e); }

    // Sembunyikan prep, tampilkan loading
    const prep = document.getElementById('prepScreen');
    prep.style.opacity = '0';
    prep.style.transition = 'opacity 0.4s';
    setTimeout(() => {
        prep.style.display = 'none';
        startLoadingBar();
    }, 400);
}

function startLoadingBar() {
    const loadScreen = document.getElementById('loadScreen');
    loadScreen.classList.add('active');

    const statusMessages = [
        "Memuat arena pertempuran...",
        "Memanggil monster dari kernel...",
        "Mempersiapkan senjata hero...",
        "Mengkalibrasi sistem pertanyaan...",
        "Sinkronisasi database dungeon...",
        "Arena siap! Bersiaplah bertarung..."
    ];

    let progress = 0;
    let msgIndex = 0;
    const bar = document.getElementById('loadBar');
    const pct = document.getElementById('loadPct');
    const status = document.getElementById('loadStatus');

    const interval = setInterval(() => {
        const step = Math.floor(Math.random() * 3) + 1;
        progress = Math.min(progress + step, 100);

        if (bar) bar.style.width = progress + '%';
        if (pct) pct.textContent = progress + '%';

        const newIdx = Math.floor((progress / 100) * statusMessages.length);
        if (newIdx !== msgIndex && newIdx < statusMessages.length) {
            msgIndex = newIdx;
            if (status) {
                status.style.opacity = '0';
                setTimeout(() => {
                    status.textContent = statusMessages[msgIndex];
                    status.style.opacity = '1';
                }, 200);
            }
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadScreen.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = 'games.html';
                }, 500);
            }, 400);
        }
    }, 280);
}
<\/script>
</body>
</html>`;

    const newWin = window.open('', '_blank');
    if (newWin) {
        newWin.document.open();
        newWin.document.write(htmlPrep);
        newWin.document.close();
    } else {
        alert('Pop-up diblokir oleh browser! Izinkan pop-up untuk halaman ini.');
    }
}