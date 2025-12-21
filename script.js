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

  