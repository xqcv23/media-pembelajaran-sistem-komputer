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

  // ========= PROGRESS TRACKING =========
  const materiList = ['sistem-komputer', 'interaksi-manusia-komputer', 'sistem-operasi'];

  // Bersihkan nama section agar lebih readable
  function cleanSectionName(name) {
    if (!name) return '';
    // Hapus emoji di awal (unicode emoji pattern)
    name = name.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}⚙️⌨️🖱️🖥️🖨️🔊📱📋📦💡👥⚡✧]+\s*/gu, '');
    // Hapus numbering seperti "1) ", "2) ", "a. ", "b. "
    name = name.replace(/^[0-9]+\)\s*/, '');
    name = name.replace(/^[a-z]\.\s*/i, '');
    // Hapus prefix "Penjelasan Animasi: "
    name = name.replace(/^Penjelasan Animasi:\s*/i, '');
    return name.trim();
  }

  function loadProgress() {
    materiList.forEach(function(key) {
      const badge = document.getElementById('badge-' + key);
      const bar = document.getElementById('progress-' + key);
      const detail = document.getElementById('detail-' + key);

      if (!badge || !bar) return;

      // Baca data progress (section-based)
      var dataStr = localStorage.getItem('progress_data_' + key);
      var data = dataStr ? JSON.parse(dataStr) : null;

      var progress = 0;
      var lastSection = '';
      var seenCount = 0;
      var totalSections = 0;

      if (data && data.seen) {
        seenCount = data.seen.length;
        totalSections = data.totalSections || 1;
        progress = Math.min(100, Math.round((seenCount / totalSections) * 100));
        lastSection = data.lastSection || '';
      }

      // Update progress bar
      bar.style.width = progress + '%';

      // Update badge & detail
      badge.classList.remove('unread', 'reading', 'done');

      if (progress >= 100) {
        badge.classList.add('done');
        badge.innerHTML = '✅ Sudah Dibaca Semua';
        bar.classList.add('complete');
        if (detail) detail.innerHTML = 'Semua materi selesai dibaca 🎉';
      } else if (progress > 0) {
        badge.classList.add('reading');
        badge.innerHTML = '📖 Sedang Dibaca (' + progress + '%)';
        bar.classList.remove('complete');
        var cleanName = cleanSectionName(lastSection);
        if (detail && cleanName) {
          detail.innerHTML = 'Terakhir dibaca materi: <strong>' + cleanName + '</strong>';
        }
      } else {
        badge.classList.add('unread');
        badge.innerHTML = '📖 Belum Dibaca';
        bar.classList.remove('complete');
        if (detail) detail.innerHTML = '';
      }
    });
  }

  window.addEventListener('load', loadProgress);
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) loadProgress();
  });
