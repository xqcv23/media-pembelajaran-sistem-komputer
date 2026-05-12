function switchTab(evt, tabName) {
    const wrapper = evt.target.closest('.modal-body-wrapper') || document; 
    wrapper.querySelectorAll('.content-section').forEach(c => c.classList.remove('active'));
    wrapper.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const targetContent = wrapper.querySelector('#' + tabName);
    if(targetContent) targetContent.classList.add('active');
    evt.currentTarget.classList.add('active');

    // Re-observe sections di tab baru
    if (window._reobserveSections) window._reobserveSections();
}

function resizeIframe(iframe) {
    iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    iframe.style.width = "100%";
}

function goToTab(index) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    if(tabBtns[index]) {
        tabBtns[index].click();
        const nav = document.querySelector('.tab-nav');
        if(nav) nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========= SECTION-BASED PROGRESS TRACKING =========
(function() {
    // Hardcode materiKey untuk modul ini agar tidak bentrok
    var materiKey = 'interaksi-manusia-komputer';

    var storageKey = 'progress_data_' + materiKey;

    // Load existing data
    var progressData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (!progressData.seen) progressData.seen = [];

    function saveProgress(sectionName) {
        // Tambah ke daftar seen jika belum ada
        if (progressData.seen.indexOf(sectionName) === -1) {
            progressData.seen.push(sectionName);
        }
        progressData.lastSection = sectionName;
        progressData.totalSections = getAllSectionNames().length;
        progressData.percentage = Math.round((progressData.seen.length / progressData.totalSections) * 100);
        localStorage.setItem(storageKey, JSON.stringify(progressData));
        updateProgressBar();
    }

    function getAllSectionNames() {
        var names = [];
        document.querySelectorAll('.materi-title').forEach(function(el) {
            var name = el.textContent.trim();
            if (name && names.indexOf(name) === -1) names.push(name);
        });
        return names;
    }

    // === SCROLL PROGRESS BAR ===
    var progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    function updateProgressBar() {
        var total = getAllSectionNames().length;
        if (total === 0) return;
        var pct = Math.round((progressData.seen.length / total) * 100);
        pct = Math.min(100, pct);
        progressBar.style.width = pct + '%';
        if (pct >= 100) {
            progressBar.classList.add('complete');
        } else {
            progressBar.classList.remove('complete');
        }
    }

    // === INTERSECTION OBSERVER ===
    var observer = null;

    function setupObserver() {
        if (observer) observer.disconnect();

        observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var titleEl = entry.target.querySelector('.materi-title');
                    if (titleEl) {
                        var name = titleEl.textContent.trim();
                        if (name) saveProgress(name);
                    }
                }
            });
        }, {
            threshold: 0.3 // 30% terlihat = dianggap dibaca
        });

        // Observe semua materi-box yang punya title
        document.querySelectorAll('.materi-box').forEach(function(box) {
            var title = box.querySelector('.materi-title');
            if (title) observer.observe(box);
        });
    }

    // Re-observe saat ganti tab (karena content-section berubah display)
    window._reobserveSections = function() {
        setTimeout(setupObserver, 200);
    };

    // Initial setup
    window.addEventListener('load', function() {
        setTimeout(function() {
            setupObserver();
            updateProgressBar();
        }, 300);
    });
})();