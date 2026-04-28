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

    // Buat overlay loading screen
    const overlay = document.createElement('div');
    overlay.id = 'rpgLoadOverlay';
    overlay.innerHTML = `
        <div class="rpg-load-content">
            <div class="rpg-load-icon-wrap">
                <div class="rpg-load-ring"></div>
                <div class="rpg-load-ring rpg-load-ring-2"></div>
                <div class="rpg-load-sword">⚔️</div>
            </div>
            <div class="rpg-load-title">TECH QUEST</div>
            <div class="rpg-load-status" id="rpgLoadStatus">Memuat arena pertempuran...</div>
            <div class="rpg-load-bar-wrap">
                <div class="rpg-load-bar-track">
                    <div class="rpg-load-bar-fill" id="rpgLoadBar"></div>
                    <div class="rpg-load-bar-shine"></div>
                </div>
                <div class="rpg-load-pct" id="rpgLoadPct">0%</div>
            </div>
            <div class="rpg-load-tip">💡 Tip: Jawab soal lebih cepat untuk mendapat CRITICAL HIT!</div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

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
    const bar = document.getElementById('rpgLoadBar');
    const pct = document.getElementById('rpgLoadPct');
    const status = document.getElementById('rpgLoadStatus');

    const interval = setInterval(() => {
        const step = Math.floor(Math.random() * 6) + 3;
        progress = Math.min(progress + step, 100);

        if (bar) bar.style.width = progress + '%';
        if (pct) pct.textContent = progress + '%';

        const newMsgIndex = Math.floor((progress / 100) * statusMessages.length);
        if (newMsgIndex !== msgIndex && newMsgIndex < statusMessages.length) {
            msgIndex = newMsgIndex;
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
                overlay.classList.add('fade-out');
                // Langsung navigasi ke games.html (halaman penuh, tanpa iframe)
                setTimeout(() => {
                    window.location.href = 'games.html';
                }, 500);
            }, 400);
        }
    }, 120);
}