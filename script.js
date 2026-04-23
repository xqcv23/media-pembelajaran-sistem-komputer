 // ========= EFEK MENGETIK =========
  const typeEl = document.getElementById('typewriterText');
  const txt = "Pilih materi pembelajaran di bawah ini...";
  let i = 0;

  function typeWriter() {
    if (i < txt.length) {
      typeEl.innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, 50); 
    }
  }
  window.addEventListener('load', typeWriter);

function transitionToGame(e) {
    if(e) e.preventDefault();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-loader-overlay';
    
    overlay.innerHTML = `
        <div class="game-loader-content">
            <div class="game-loader-icon-container">
                <div class="game-loader-ring"></div>
                <div class="game-loader-icon">⚔️</div>
            </div>
            <div class="game-loader-text">Menyiapkan Arena...</div>
            <div class="game-loader-bar-container">
                <div class="game-loader-bar">
                    <div class="game-loader-progress" id="gameLoadProgress"></div>
                </div>
                <div class="game-loader-percentage" id="gameLoadPercent">0%</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Trigger animations safely
    requestAnimationFrame(() => {
        overlay.classList.add('active');
        
        // Simulate progress percentage
        let progress = 0;
        const percentText = document.getElementById('gameLoadPercent');
        const bar = document.getElementById('gameLoadProgress');
        
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 2;
            if (progress > 100) progress = 100;
            
            if (percentText) percentText.innerText = progress + '%';
            if (bar) bar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 150);
    });

    // Wait for the bar to fill, then redirect
    setTimeout(() => {
        window.location.href = 'games/index.html';
    }, 4500);
}