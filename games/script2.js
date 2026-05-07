/* =========================================
   TECH QUEST — ANIMATED GIF BATTLE ENGINE
   ========================================= */

// ============ EXTERNAL SPRITE LIBRARY (PLACEHOLDERS) ============
// Menggunakan referensi link public (Poke API Gen5 Animated) sebagai 
// contoh sementara. Kamu bisa mengganti URL-URL ini dengan file GIF download-an mu.
const heroImages = {
    knight: "assets/sprites/scizor.gif",
    mage: "assets/sprites/mismagius.gif",
    rogue: "assets/sprites/weavile.gif",
    admin: "assets/sprites/aggron.gif",
    designer: "assets/sprites/gardevoir.gif",
    engineer: "assets/sprites/rotom.gif"
};

const monsterImages = {
    slime: "assets/sprites/haunter.gif",
    wolf: "assets/sprites/houndoom.gif",
    golem: "assets/sprites/metagross.gif",
    dragon: "assets/sprites/hydreigon.gif",
    boss: "assets/sprites/giratina-origin.gif"
};

const projFX = {
    knight:   { class: 'knight',   color: "#00e5ff", styles: ['melee','jump','ranged'], hitVfx: 'slash'     },
    mage:     { class: 'mage',     color: "#b74dff", styles: ['ranged','ranged','jump'], hitVfx: 'magic'     },
    rogue:    { class: 'rogue',    color: "#00ffaa", styles: ['melee','melee','ranged'], hitVfx: 'shatter'   },
    admin:    { class: 'admin',    color: "#00e676", styles: ['jump','ranged','jump'],   hitVfx: 'block'     },
    designer: { class: 'designer', color: "#ff4da6", styles: ['ranged','ranged','jump'], hitVfx: 'blob'      },
    engineer: { class: 'engineer', color: "#ffd700", styles: ['ranged','melee','jump'],  hitVfx: 'lightning' },
    monster:  { class: 'monster',  color: "#ff0033", styles: ['melee','jump','ranged'],  hitVfx: 'blood'     }
};

// Per-monster unique projectile FX (replaces generic monster projectile)
const monsterProjFX = {
    slime:  { color: "#aa00ff", styles: ['melee', 'jump', 'dash', 'ranged', 'cast'], hitVfx: 'magic'     },
    wolf:   { color: "#ff4400", styles: ['melee', 'jump', 'dash', 'ranged', 'cast'], hitVfx: 'slash'     },
    golem:  { color: "#5588ff", styles: ['melee', 'jump', 'dash', 'ranged', 'cast'], hitVfx: 'block'     },
    dragon: { color: "#cc44cc", styles: ['melee', 'jump', 'dash', 'ranged', 'cast'], hitVfx: 'lightning' },
    boss:   { color: "#ff0033", styles: ['melee', 'jump', 'dash', 'ranged', 'cast'], hitVfx: 'shatter'   },
};

const heroAttackVariants = {
    knight: [
        { style: 'melee',  color: '#00e5ff', hitVfx: 'slash' },
        { style: 'jump',   color: '#4d9fff', hitVfx: 'slash' },
        { style: 'dash',   color: '#00ffff', hitVfx: 'lightning' },
        { style: 'ranged', color: '#00ccff', hitVfx: 'slash' },
        { style: 'cast',   color: '#00e5ff', hitVfx: 'magic' },
    ],
    mage: [
        { style: 'ranged', color: '#b74dff', hitVfx: 'magic' },
        { style: 'cast',   color: '#ff44ff', hitVfx: 'magic' },
        { style: 'jump',   color: '#9900ff', hitVfx: 'magic' },
        { style: 'dash',   color: '#d488ff', hitVfx: 'lightning' },
        { style: 'melee',  color: '#8800ff', hitVfx: 'slash' },
    ],
    rogue: [
        { style: 'dash',   color: '#00ffaa', hitVfx: 'slash' },
        { style: 'melee',  color: '#00ffcc', hitVfx: 'shatter' },
        { style: 'ranged', color: '#00ff80', hitVfx: 'shatter' },
        { style: 'jump',   color: '#33ffaa', hitVfx: 'slash' },
        { style: 'cast',   color: '#00ffaa', hitVfx: 'magic' },
    ],
    admin: [
        { style: 'jump',   color: '#00ff44', hitVfx: 'block' },
        { style: 'cast',   color: '#00e676', hitVfx: 'block' },
        { style: 'dash',   color: '#44ffaa', hitVfx: 'slash' },
        { style: 'ranged', color: '#00cc44', hitVfx: 'block' },
        { style: 'melee',  color: '#00ff44', hitVfx: 'shatter' },
    ],
    designer: [
        { style: 'cast',   color: '#ff4da6', hitVfx: 'blob' },
        { style: 'ranged', color: '#00e5ff', hitVfx: 'magic' },
        { style: 'jump',   color: '#ff80c0', hitVfx: 'blob' },
        { style: 'dash',   color: '#ff66b3', hitVfx: 'slash' },
        { style: 'melee',  color: '#ff4da6', hitVfx: 'magic' },
    ],
    engineer: [
        { style: 'ranged', color: '#ffd700', hitVfx: 'lightning' },
        { style: 'dash',   color: '#ff9100', hitVfx: 'slash' },
        { style: 'cast',   color: '#ffcc00', hitVfx: 'lightning' },
        { style: 'jump',   color: '#ffee00', hitVfx: 'lightning' },
        { style: 'melee',  color: '#ffd700', hitVfx: 'shatter' },
    ],
};

let lastHeroStyle = null;
function getAttackVariant(heroClass) {
    const variants = heroAttackVariants[heroClass];
    if (!variants) return projFX[heroClass] || projFX.knight;
    
    let available = variants.filter(v => v.style !== lastHeroStyle);
    if (available.length === 0) available = variants;
    
    const v = available[Math.floor(Math.random() * available.length)];
    lastHeroStyle = v.style;
    return { ...projFX[heroClass], style: v.style, color: v.color, hitVfx: v.hitVfx };
}

// ============ AUDIO SYSTEM (BGM & SFX) ============
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let bgmOsc = null; let currentBgmInt = null; let isBgmOn = true; let currentTrack = null;

document.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
        if (isBgmOn && !currentTrack) playLoopingTrack('menu');
    }
}, {once: true});

// Epic high-quality RPG audio tracks
const audioTracks = {
    menu: new Audio('assets/audio/menu-bgm.mp3'),
    battle: new Audio('assets/audio/battle-bgm.mp3') // High energy battle!
};

Object.values(audioTracks).forEach(a => { a.loop = true; a.volume = 0.4; });

function playLoopingTrack(type) {
    currentTrack = type;
    Object.values(audioTracks).forEach(a => a.pause());
    if (!isBgmOn) return;
    if (audioTracks[type]) {
        audioTracks[type].play().catch(e => {
            console.warn("BGM gagal dimuat:", e.message);
            const existing = document.getElementById('bgmFailNote');
            if (!existing) {
                const note = document.createElement('div');
                note.id = 'bgmFailNote';
                note.style.cssText = 'position:fixed;bottom:60px;right:12px;background:rgba(0,0,0,0.75);color:rgba(255,255,255,0.5);padding:5px 10px;border-radius:8px;font-size:0.45rem;font-family:monospace;z-index:9999;border:1px solid rgba(255,255,255,0.1);pointer-events:none;';
                note.textContent = '🔇 BGM offline';
                document.body.appendChild(note);
                setTimeout(() => note.remove(), 4000);
            }
        });
    }
}

function toggleBgm() {
    isBgmOn = !isBgmOn;
    document.getElementById('btnBgm').textContent = isBgmOn ? '🔊 BGM ON' : '🔇 BGM OFF';
    if (!isBgmOn) {
        Object.values(audioTracks).forEach(a => a.pause());
    } else if (currentTrack) {
        playLoopingTrack(currentTrack);
    }
}

async function forceLandscape() {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        }
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock('landscape');
        }
    } catch(err) {
        console.warn("Auto-rotate failed:", err.message);
    }
}

async function toggleLandscape() {
    try {
        if (!document.fullscreenElement) {
            await forceLandscape();
        } else {
            if (document.exitFullscreen) await document.exitFullscreen();
            if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
        }
    } catch(err) {
        console.warn("Rotate failed:", err.message);
        alert("Rotasi otomatis tidak didukung di browser ini. Mohon putar layar ponsel Anda secara manual!");
    }
}

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = audioCtx.currentTime;
    if (type === 'typing') { playTone(1200 + Math.random()*200, 'square', 0.03, t, null, 0.02); }
    else if (type === 'jump') { playTone(300, 'sine', 0.15, t, 100, 0.05); }
    else if (type === 'correct') { playTone(600, 'square', 0.1, t); playTone(800, 'square', 0.15, t + 0.1); }
    else if (type === 'wrong') { playTone(300, 'sawtooth', 0.15, t); playTone(200, 'sawtooth', 0.2, t + 0.15); }
    else if (type === 'attack_knight') { playTone(800, 'triangle', 0.25, t, 100); }
    else if (type === 'attack_mage') { playTone(400, 'sine', 0.35, t, 1200); }
    else if (type === 'attack_rogue') { playTone(1200, 'square', 0.1, t, 600); playTone(1200, 'square', 0.1, t + 0.1, 600); }
    else if (type === 'hit_magic') {
        const dur = 0.6; 
        const bufferSize = audioCtx.sampleRate * dur; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0); for (let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1; 
        const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.Q.value = 5;
        filter.frequency.setValueAtTime(1000, t); filter.frequency.exponentialRampToValueAtTime(50, t + dur); 
        const gainLog = audioCtx.createGain(); gainLog.gain.setValueAtTime(3.0, t); gainLog.gain.exponentialRampToValueAtTime(0.01, t + dur);
        noise.connect(filter); filter.connect(gainLog); gainLog.connect(audioCtx.destination); noise.start(t);
        const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(800, t); o.frequency.exponentialRampToValueAtTime(100, t + 0.1);
        g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + 0.1);
    }
    else if (type === 'hit_physical') {
        const dur = 0.25;
        const bufferSize = audioCtx.sampleRate * 0.1; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0); for (let i=0; i<bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i/bufferSize);
        const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = 2000;
        const gainLog = audioCtx.createGain(); gainLog.gain.setValueAtTime(2.0, t); gainLog.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        noise.connect(filter); filter.connect(gainLog); gainLog.connect(audioCtx.destination); noise.start(t);
        const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(30, t + dur);
        g.gain.setValueAtTime(2.5, t); g.gain.exponentialRampToValueAtTime(0.01, t + dur);
        o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + dur);
    } else if (type === 'win') { [440, 554, 659, 880, 1108].forEach((freq, i) => playTone(freq, 'square', 0.25, t + i * 0.15)); }
    else if (type === 'lose') { [440, 415, 392, 349, 293].forEach((freq, i) => playTone(freq, 'sawtooth', 0.35, t + i * 0.3)); }
}
function playTone(freq, type, duration, time, endFreq, vol=0.1) {
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type = type; o.frequency.setValueAtTime(freq, time);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, time + duration);
    g.gain.setValueAtTime(0, time); g.gain.linearRampToValueAtTime(vol, time + duration * 0.1);
    g.gain.exponentialRampToValueAtTime(0.01, time + duration);
    o.connect(g); g.connect(audioCtx.destination); o.start(time); o.stop(time + duration);
}

// ============ QUESTION DATABASE ============
const questionDB = {
    hardware: [
        { q: "Apa kepanjangan dari CPU?", opts: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], ans: 0, exp: "CPU = Central Processing Unit, 'otak' komputer." },
        { q: "Manakah yang termasuk perangkat INPUT?", opts: ["Monitor", "Printer", "Keyboard", "Speaker"], ans: 2, exp: "Keyboard memasukkan data ke komputer." },
        { q: "RAM bersifat volatil, artinya...", opts: ["Data tetap ada saat mati", "Data hilang saat mati", "RAM tidak bisa ditulis", "RAM hanya untuk gambar"], ans: 1, exp: "Volatil = data hilang saat daya terputus." },
        { q: "Fungsi ALU pada CPU adalah...", opts: ["Menyimpan data permanen", "Mengatur tampilan", "Operasi matematika & logika", "Koneksi internet"], ans: 2, exp: "ALU menangani operasi hitung dan perbandingan." },
        { q: "Berikut yang termasuk OUTPUT device...", opts: ["Mouse", "Scanner", "Barcode Reader", "Monitor"], ans: 3, exp: "Monitor menampilkan data visual (softcopy)." },
        { q: "SSD dan HDD termasuk kategori...", opts: ["Input Device", "Processing Unit", "Storage/Memori Sekunder", "Output Device"], ans: 2, exp: "SSD dan HDD = penyimpanan permanen." },
        { q: "Touch Screen termasuk perangkat...", opts: ["Hanya Output", "Hanya Input", "Input & Output", "Processing"], ans: 2, exp: "Touch Screen bisa input (sentuh) & output (tampil)." },
        { q: "Control Unit pada CPU bertugas...", opts: ["Menghitung angka", "Mengatur alur data", "Menyimpan file", "Mencetak dokumen"], ans: 1, exp: "CU mengatur lalu lintas data & koordinasi." },
        { q: "Satuan kecepatan prosesor diukur dalam...", opts: ["MB/s", "GHz", "GB", "Watt"], ans: 1, exp: "GHz = GigaHertz, mengukur kecepatan clock CPU." },
        { q: "VGA Card berfungsi untuk...", opts: ["Menyimpan file", "Mengolah grafis & tampilan", "Koneksi ke printer", "Manajemen memori"], ans: 1, exp: "GPU/VGA Card memproses rendering visual." },
        { q: "Cache memory terletak di...", opts: ["Harddisk", "RAM eksternal", "Di dalam/dekat CPU", "Motherboard saja"], ans: 2, exp: "Cache ada di dalam / sangat dekat dengan CPU." },
        { q: "Motherboard berfungsi sebagai...", opts: ["Penyimpan data utama", "Media output video", "Penghubung semua komponen", "Unit pemroses grafis"], ans: 2, exp: "Motherboard = papan induk penghubung semua hardware." },
        { q: "Port USB digunakan untuk...", opts: ["Hanya mengisi daya", "Transfer data & koneksi perangkat", "Koneksi internet wireless saja", "Hanya untuk keyboard"], ans: 1, exp: "USB = Universal Serial Bus untuk berbagai perangkat." },
        { q: "Register pada CPU berfungsi untuk...", opts: ["Menyimpan data sementara di CPU", "Mengatur tampilan monitor", "Mengirim sinyal jaringan", "Menyimpan file permanen"], ans: 0, exp: "Register = memori super cepat di dalam CPU." },
    ],
    software: [
        { q: "Yang BUKAN Software adalah...", opts: ["Microsoft Word", "Windows 11", "Harddisk", "Python"], ans: 2, exp: "Harddisk = Hardware (fisik)." },
        { q: "Sistem Operasi termasuk software...", opts: ["Aplikasi", "Utility", "Sistem", "Bahasa Pemrograman"], ans: 2, exp: "OS adalah software sistem mendasar." },
        { q: "Antivirus termasuk jenis software...", opts: ["Sistem Operasi", "Bahasa Pemrograman", "Utility", "Aplikasi Perkantoran"], ans: 2, exp: "Antivirus = Utility pelindung." },
        { q: "Contoh bahasa pemrograman...", opts: ["Word", "Python", "Windows", "Chrome"], ans: 1, exp: "Python = bahasa pemrograman." },
        { q: "Software pembantu sehari-hari disebut...", opts: ["Sistem Operasi", "Driver", "Aplikasi", "BIOS"], ans: 2, exp: "Aplikasi untuk tujuan spesifik pengguna." },
        { q: "Tanpa OS, komputer...", opts: ["Tetap bisa dipakai", "Hanya game", "Tak bisa jalankan aplikasi", "Lebih cepat"], ans: 2, exp: "OS harus ada agar aplikasi berjalan." },
        { q: "Apa itu Open Source Software?", opts: ["Software berbayar premium", "Software kode tertutup", "Software kode terbuka, bebas dimodifikasi", "Software buatan pemerintah"], ans: 2, exp: "Open Source = kode bisa dilihat & dimodifikasi siapa saja." },
        { q: "BIOS termasuk jenis software...", opts: ["Aplikasi Office", "Utility biasa", "Firmware/Sistem", "Bahasa Pemrograman"], ans: 2, exp: "BIOS = Firmware, software tertanam di chip hardware." },
        { q: "Contoh software pengolah angka adalah...", opts: ["Microsoft Word", "Adobe Photoshop", "Microsoft Excel", "VLC Media Player"], ans: 2, exp: "Excel = software spreadsheet untuk pengolahan angka." },
        { q: "Kompiler (Compiler) berfungsi untuk...", opts: ["Mencetak dokumen", "Jadi driver hardware", "Menerjemahkan kode program ke bahasa mesin", "Mengatur jaringan"], ans: 2, exp: "Compiler menerjemahkan source code menjadi executable." },
        { q: "PDF Reader termasuk jenis software...", opts: ["Sistem Operasi", "Utility/Aplikasi Viewer", "Bahasa Pemrograman", "Driver perangkat"], ans: 1, exp: "PDF Reader adalah utilitas/aplikasi pembaca dokumen." },
    ],
    os: [
        { q: "Fungsi utama Sistem Operasi...", opts: ["Cetak dokumen", "Penghubung manusia & hardware", "Buat website", "Percepat internet"], ans: 1, exp: "OS menjembatani manusia & hardware." },
        { q: "Tugas Driver pada komputer...", opts: ["Tampilkan gambar", "Kontrol hardware agar dikenali OS", "Simpan file", "Percepat koneksi"], ans: 1, exp: "Driver menerjemahkan perintah OS." },
        { q: "Hardware yang tak perlu driver khusus...", opts: ["Printer", "VGA Card", "Keyboard & Mouse", "Webcam"], ans: 2, exp: "Keyboard & Mouse didukung driver OS." },
        { q: "Urutan klik Print di Word...", opts: ["Printer→OS→Word", "Word→OS→Driver→Printer", "User→Printer langsung", "Driver→Word→Monitor"], ans: 1, exp: "Instruksi: Aplikasi→OS→Driver→Hardware." },
        { q: "OS multitasking artinya...", opts: ["1 tugas saja", "Banyak tugas sekaligus", "Tak bisa mati", "Selalu online"], ans: 1, exp: "Multitasking = banyak proses bersamaan." },
        { q: "Saat komputer nyala, pertama jalan...", opts: ["Word", "Chrome", "Sistem Operasi", "Antivirus"], ans: 2, exp: "OS di-boot pertama kali." },
        { q: "Apa itu Kernel pada Sistem Operasi?", opts: ["Antarmuka pengguna grafis", "Inti OS yang mengelola hardware langsung", "Program antivirus bawaan", "Browser default OS"], ans: 1, exp: "Kernel = inti paling dalam OS yang langsung ke hardware." },
        { q: "Proses booting diawali oleh...", opts: ["RAM", "CPU", "BIOS/UEFI", "Harddisk"], ans: 2, exp: "BIOS/UEFI adalah firmware yang mengawali proses booting." },
        { q: "Manajemen memori oleh OS bertujuan...", opts: ["Mempercantik tampilan", "Mengatur distribusi RAM ke program", "Menginstal software baru", "Scan virus otomatis"], ans: 1, exp: "OS mengalokasikan RAM agar setiap program berjalan lancar." },
        { q: "Format file sistem Windows umum adalah...", opts: ["ext4", "APFS", "NTFS", "ZFS"], ans: 2, exp: "NTFS = New Technology File System, standar Windows." },
        { q: "Perintah 'dir' pada CMD berfungsi untuk...", opts: ["Menghapus file", "Menampilkan daftar file/folder", "Merestart sistem", "Format disk"], ans: 1, exp: "'dir' (Windows) = tampilkan isi direktori saat ini." },
    ],
    hci: [
        { q: "HCI singkatan dari...", opts: ["Human Control Input", "Human-Computer Interaction", "Hardware Computer Interface", "High Computing Input"], ans: 1, exp: "HCI = Interaksi Manusia Komputer." },
        { q: "CLI berbasis...", opts: ["Grafik & ikon", "Teks & perintah ketik", "Suara", "Sentuhan"], ans: 1, exp: "CLI = Command Line Interface, berbasis teks." },
        { q: "GUI menggunakan elemen...", opts: ["Teks perintah", "Ikon, jendela, menu grafis", "Kode", "Suara"], ans: 1, exp: "GUI = antarmuka visual." },
        { q: "Kelebihan CLI vs GUI...", opts: ["Lebih cantik", "Lebih hemat memori", "Lebih mudah pemula", "Lebih banyak gambar"], ans: 1, exp: "CLI ringan, tak perlu render grafis." },
        { q: "CMD pada Windows contoh dari...", opts: ["GUI", "CLI", "Driver", "BIOS"], ans: 1, exp: "CMD = aplikasi CLI bawaan Windows." },
        { q: "Kekurangan GUI...", opts: ["Sulit dipelajari", "Banyak makan RAM", "Tak ada gambar", "Tak interaktif"], ans: 1, exp: "GUI butuh RAM besar untuk visual." },
        { q: "Feedback HCI bisa berupa...", opts: ["Hanya suara", "Dialog box, pesan sukses/error", "Hanya getaran", "Tak ada"], ans: 1, exp: "Feedback: kotak dialog, pesan, dsb." },
        { q: "Prinsip 'User Friendly' artinya...", opts: ["Tampilannya berwarna-warni", "Mudah dipelajari & digunakan siapa saja", "Banyak fitur tersembunyi", "Khusus untuk programmer"], ans: 1, exp: "User Friendly = mudah dipahami pengguna dari berbagai latar." },
        { q: "Aksesibilitas dalam HCI bertujuan...", opts: ["Membuat UI lebih cantik saja", "Memastikan semua orang bisa menggunakan sistem", "Mempercepat prosesor komputer", "Mengurangi jumlah fitur"], ans: 1, exp: "Aksesibilitas = desain inklusif untuk semua pengguna." },
        { q: "UX (User Experience) berfokus pada...", opts: ["Estetika visual saja", "Keseluruhan pengalaman pengguna saat berinteraksi", "Kecepatan koneksi internet", "Kapasitas storage device"], ans: 1, exp: "UX = seluruh pengalaman pengguna, bukan hanya tampilan." },
        { q: "Error message yang baik seharusnya...", opts: ["Menggunakan kode angka saja", "Memberitahu penyebab & solusi dengan jelas", "Muncul terus-menerus", "Hanya dalam Bahasa Inggris"], ans: 1, exp: "Error message baik = informatif, jelas, dan solutif." },
        { q: "Touchscreen termasuk antarmuka...", opts: ["CLI saja", "GUI berbasis sentuhan / NUI", "Hanya untuk program CLI", "Voice User Interface"], ans: 1, exp: "Touchscreen = Natural User Interface berbasis sentuh." },
    ]
};

const monsterDB = [
    { name: "GHOST VIRUS", imgKey: "slime", hp: 60, atk: 8, level: 1 },
    { name: "VIRUS WOLF", imgKey: "wolf", hp: 80, atk: 10, level: 2 },
    { name: "TROJAN GOLEM", imgKey: "golem", hp: 100, atk: 12, level: 3 },
    { name: "MALWARE DRAGON", imgKey: "dragon", hp: 130, atk: 15, level: 4 },
    { name: "DARK KERNEL", imgKey: "boss", hp: 160, atk: 18, level: 5 },
];

const heroClasses = {
    knight: { name: "Cyber Knight", imgKey: "knight", hp: 120, atk: 15, def: 4, timeBonus: 0 },
    mage:   { name: "Data Mage",    imgKey: "mage",   hp: 100, atk: 20, def: 2, timeBonus: 0 },
    rogue:  { name: "Speed Hacker", imgKey: "rogue",  hp: 100, atk: 15, def: 2, timeBonus: 5 },
    admin:  { name: "System Admin", imgKey: "admin",  hp: 160, atk: 12, def: 6, timeBonus: 0 },
    designer: { name: "UX Designer",imgKey: "designer",hp: 90, atk: 25, def: 1, timeBonus: 0 },
    engineer: { name: "Net Engineer",imgKey:"engineer",hp: 110, atk: 12, def: 3, timeBonus: 10 },
};

let state = {
    heroClass: 'knight', dungeon: 'all', hero: { hp:0, maxHp:0, atk:0, def:0, xp:0 },
    monster: { hp:0, maxHp:0, atk:0 }, wave: 0, questions: [], currentQ: 0, score: 0,
    totalAnswered: 0, timer: null, timeLeft: 0, baseTime: 25, isAnswering: false,
    combo: 0, bossRageTriggered: false, isPlaying: false, consecutiveWrongs: 0
};

// Injection Factory for Pixel Art
function createPixelSprite(src) {
    return `<img src="${src}" class="pixel-sprite" alt="Sprite">`;
}

document.addEventListener('DOMContentLoaded', () => {
    // UI SFX Logic
    document.querySelectorAll('button, .hero-option, .dungeon-option').forEach(el => {
        el.addEventListener('mouseenter', () => playSound('typing'));
        el.addEventListener('click', () => playSound('typing'));
    });

    const savedName = localStorage.getItem('techPlayerName') || '';
    document.getElementById('playerName').value = savedName;
    
    document.getElementById('previewKnight').innerHTML = createPixelSprite(heroImages.knight);
    document.getElementById('previewMage').innerHTML = createPixelSprite(heroImages.mage);
    document.getElementById('previewRogue').innerHTML = createPixelSprite(heroImages.rogue);
    document.getElementById('previewAdmin').innerHTML = createPixelSprite(heroImages.admin);
    document.getElementById('previewDesigner').innerHTML = createPixelSprite(heroImages.designer);
    document.getElementById('previewEngineer').innerHTML = createPixelSprite(heroImages.engineer);
    updateLeaderboardUI();

    // === INJECT HERO STAT BARS ===
    const heroStatConfig = {
        knight:   { hp: 75,  atk: 60  },
        mage:     { hp: 63,  atk: 80  },
        rogue:    { hp: 63,  atk: 60  },
        admin:    { hp: 100, atk: 48  },
        designer: { hp: 56,  atk: 100 },
        engineer: { hp: 69,  atk: 48  },
    };
    document.querySelectorAll('.hero-option').forEach(opt => {
        const heroKey = opt.dataset.hero;
        const stats = heroStatConfig[heroKey];
        if (!stats) return;
        const hClass = heroClasses[heroKey];
        const spdLabel = hClass.timeBonus > 0 ? 'SPD' : 'DEF';
        const spdPct = hClass.timeBonus > 0 ? Math.round((hClass.timeBonus / 10) * 100) : Math.round((hClass.def / 6) * 100);
        opt.insertAdjacentHTML('beforeend', `
            <div class="hero-stats">
                <div class="hero-stat"><span class="hero-stat-label">HP</span><div class="stat-bar"><div class="stat-fill stat-hp" style="width:${stats.hp}%"></div></div></div>
                <div class="hero-stat"><span class="hero-stat-label">ATK</span><div class="stat-bar"><div class="stat-fill stat-atk" style="width:${stats.atk}%"></div></div></div>
                <div class="hero-stat"><span class="hero-stat-label">${spdLabel}</span><div class="stat-bar"><div class="stat-fill stat-spd" style="width:${spdPct}%"></div></div></div>
            </div>
        `);
    });

    // === DUNGEON LOCK LOGIC ===
    const unlockedLevel = parseInt(localStorage.getItem('techUnlockedLevel') || '1');
    const reqMap = { 'all': 0, 'hardware': 1, 'software': 2, 'os': 3, 'hci': 4 };
    
    document.querySelectorAll('.dungeon-option').forEach(opt => {
        const req = reqMap[opt.dataset.dungeon];
        if (req > unlockedLevel) {
            opt.classList.add('locked');
            opt.onclick = function(e) {
                e.preventDefault(); e.stopPropagation();
                showToast("🔒 Dungeon Terkunci! Selesaikan materi sebelumnya.");
                playSound('wrong');
            };
            opt.querySelector('.dungeon-name').innerHTML += ' <span style="font-size:0.6rem; opacity:0.6;">🔒</span>';
        }
    });

});

function saveName() {
    const val = document.getElementById('playerName').value;
    localStorage.setItem('techPlayerName', val);
}

function selectHero(el) {
    document.querySelectorAll('.hero-option').forEach(h => h.classList.remove('selected', 'hero-pop'));
    el.classList.add('selected');
    void el.offsetWidth; // Trigger reflow to restart animation
    el.classList.add('hero-pop');
    state.heroClass = el.dataset.hero;
    
    const sfxMap = {
        knight: 'attack_knight', mage: 'attack_mage', rogue: 'attack_rogue',
        admin: 'attack_knight', designer: 'attack_mage', engineer: 'attack_rogue'
    };
    playSound(sfxMap[state.heroClass] || 'jump');
}
function selectDungeon(el) { document.querySelectorAll('.dungeon-option').forEach(d => d.classList.remove('selected')); el.classList.add('selected'); state.dungeon = el.dataset.dungeon; playSound('typing'); }
function switchScreen(from, to) { 
    document.getElementById(from).classList.remove('active'); 
    document.getElementById(to).classList.add('active'); 
    
    // Auto-manage back & exit button visibility
    var btnBack = document.getElementById('btnBackGame');
    var btnExit = document.getElementById('btnExitGame');
    
    if (to === 'mainMenu') {
        if (btnBack) btnBack.style.display = 'none';
        if (btnExit) btnExit.style.display = 'block';
    } else {
        if (btnBack) btnBack.style.display = 'block';
        if (btnExit) btnExit.style.display = 'none';
    }
}

// ============ LEADERBOARD & ACHIEVEMENTS ============
const cheatsDB = {
    os: "💡 RINGKASAN OS: Multitasking = banyak proses. Kernel = inti OS. BIOS = booting pertama. GUI = Ikon/Grafis. CLI = Teks/Perintah.",
    hardware: "💡 RINGKASAN HARDWARE: CPU = Otak. RAM = Memori Sementara (Volatil). SSD/HDD = Penyimpanan Permanen. GPU = Grafis.",
    hci: "💡 RINGKASAN IMK: User Friendly = Mudah digunakan. CLI hemat RAM tapi sulit pemula. Komputer butuh Feedback untuk tiap input."
};

function updateLeaderboardUI() {
    const best = localStorage.getItem('techQuestBest') || 0;
    const name = localStorage.getItem('techQuestName') || "Anonym";
    document.getElementById('miniLeaderboard').textContent = `🏆 Best: ${best} (${name})`;
}

function showBriefing() {
    const mascotLines = [
        "Waspada! Sektor database sedang dikunci oleh malware. Kita butuh otak pintarmu!",
        "Lapor Komandan! Monster virus terdeteksi di area kernel. Bersihkan sekarang!",
        "Peringatan! Sistem mengalami overload. Jawaban benarmu adalah kuncinya!"
    ];
    document.getElementById('mascotText').textContent = mascotLines[Math.floor(Math.random() * mascotLines.length)];
    
    const titles = { all: "MISI: TOTAL CLEANUP", os: "MISI: OS RECOVERY", hardware: "MISI: HARDWARE REPAIR", hci: "MISI: INTERFACE FIX" };
    document.getElementById('missionTitle').textContent = titles[state.dungeon] || "MISI: SYSTEM BOOT";
    
    switchScreen('mainMenu', 'briefingScreen');
}

function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = "position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:10px 20px; border-radius:30px; z-index:10000; font-family:sans-serif; font-size:12px; border:1px solid var(--accent-cyan); animation: fadeOut 3s forwards;";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function handleBackAction() {
    state.isPlaying = false; // Hentikan semua proses game
    clearInterval(state.timer);
    if (typeof typeInterval !== 'undefined') clearInterval(typeInterval);
    if (state.atmosInt) clearInterval(state.atmosInt);
    
    var btnBack = document.getElementById('btnBackGame');
    
    if (document.getElementById('battleScreen').classList.contains('active')) {
        switchScreen('battleScreen', 'mainMenu');
        playLoopingTrack('menu');
    } else if (document.getElementById('briefingScreen').classList.contains('active')) {
        switchScreen('briefingScreen', 'mainMenu');
    } else if (document.getElementById('resultScreen').classList.contains('active')) {
        switchScreen('resultScreen', 'mainMenu');
        playLoopingTrack('menu');
    } else {
        // Fallback: jika tombol ditekan saat sudah di menu (karena tidak sengaja muncul)
        if (btnBack) btnBack.style.display = 'none';
    }
}

// Fungsi keluar dari menu RPG ke halaman pilihan games (index.html)
function exitToGamesList() {
    // Feedback visual klik
    const btn = document.getElementById('btnExitGame');
    if (btn) {
        btn.style.background = '#ff4444';
        btn.style.transform = 'scale(0.8)';
        setTimeout(() => { btn.style.background = ''; btn.style.transform = ''; }, 150);
    }

    try {
        // Kirim sinyal ke parent (prep-quest.html)
        if (window.parent) {
            window.parent.postMessage('TECH_QUEST_EXIT', '*');
        }
        
        // Panggil langsung jika memungkinkan
        if (window.parent !== window && typeof window.parent.showExitConfirm === 'function') {
            window.parent.showExitConfirm();
            return;
        }
    } catch(e) { console.warn("Parent comm failed:", e); }
    
    // Backup: jika masih gagal, gunakan confirm native
    if (confirm('Keluar dari permainan?')) {
        window.top.location.href = 'index.html';
    }
}

function startQuest() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const hClass = heroClasses[state.heroClass];
    state.hero = { hp: hClass.hp, maxHp: hClass.hp, atk: hClass.atk, def: hClass.def, xp: 0 };
    
    let pool = [];
    if (state.dungeon === 'all') Object.values(questionDB).forEach(a => pool.push(...a));
    else pool = [...(questionDB[state.dungeon] || [])];
    
    state.questions = shuffle(pool); state.currentQ = 0; state.wave = 0; state.score = 0; state.totalAnswered = 0;
    state.combo = 0; state.bossRageTriggered = false; state.isPlaying = true;
    
    forceLandscape();

    document.getElementById('heroSprite').innerHTML = createPixelSprite(heroImages[hClass.imgKey]);
    document.getElementById('heroNameBattle').textContent = hClass.name;
    document.querySelector('.arena-bg').className = 'arena-bg bg-' + state.heroClass;

    // Show dramatic battle intro cutscene FIRST
    showBattleIntro(() => {
        playLoopingTrack('battle');
        switchScreen('briefingScreen', 'battleScreen');
        if (window.innerHeight > window.innerWidth) showToast("📱 Disarankan putar layar (Landscape) untuk pengalaman terbaik!");
        startAtmosParticles();
        nextWave();
    });
}

function showBattleIntro(callback) {
    const overlay = document.getElementById('battleIntroOverlay');
    const heroLabel = document.getElementById('introHeroLabel');
    const monsterLabel = document.getElementById('introMonsterLabel');
    const countdown = document.getElementById('introCountdown');
    
    heroLabel.textContent = heroClasses[state.heroClass].name;
    monsterLabel.textContent = monsterDB[0].name;
    countdown.textContent = '3';
    countdown.className = 'intro-countdown pop';
    overlay.classList.add('active');
    playSound('jump');
    
    let count = 3;
    const tick = setInterval(() => {
        count--;
        if (count > 0) {
            countdown.className = 'intro-countdown';
            void countdown.offsetWidth;
            countdown.textContent = count;
            countdown.classList.add('pop');
            playSound('jump');
        } else {
            clearInterval(tick);
            countdown.className = 'intro-countdown';
            void countdown.offsetWidth;
            countdown.textContent = 'FIGHT!';
            countdown.classList.add('fight');
            playSound('correct');
            setTimeout(() => {
                overlay.classList.remove('active');
                callback();
            }, 800);
        }
    }, 900);
}

function startAtmosParticles() {
    if (state.atmosInt) clearInterval(state.atmosInt);
    const container = document.getElementById('atmosLayer');
    
    // Remove old specific particles but keep fog/torch
    Array.from(container.children).forEach(c => {
        if(c.classList.contains('particle')) c.remove();
    });

    state.atmosInt = setInterval(() => {
        if (!document.getElementById('battleScreen').classList.contains('active')) return;
        
        // OPTIMIZATION: Cap particles at 8 (was 12) for low-end mobile
        if(document.querySelectorAll('.particle').length > 8) return;
        
        const p = document.createElement('div');
        
        if (state.heroClass === 'knight') {
            p.className = 'particle';
            const size = Math.random() * 5 + 2;
            p.style.cssText = `left:${Math.random()*100}%;bottom:-5%;width:${size}px;height:${size}px;background:rgba(0,229,255,0.9);border-radius:50%;animation:p_floatUp ${Math.random()*3+3}s cubic-bezier(0.25,1,0.5,1) forwards;`;
        } else if (state.heroClass === 'mage') {
            p.className = 'particle';
            const runes = ['✧','⚝','★','❈','✦'];
            p.textContent = runes[Math.floor(Math.random()*runes.length)];
            p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;color:#b74dff;font-size:${Math.random()*12+10}px;font-family:serif;animation:p_runeFade ${Math.random()*2+3}s ease-in-out forwards;`;
        } else if (state.heroClass === 'rogue') {
            p.className = 'particle';
            p.style.cssText = `left:${Math.random()*100}%;top:-10%;width:${Math.random()*2+1}px;height:${Math.random()*35+15}px;background:linear-gradient(to bottom,transparent,#00ffaa);animation:p_matrixDrop ${Math.random()*1+0.5}s linear forwards;`;
        } else if (state.heroClass === 'admin') {
            p.className = 'particle';
            p.style.cssText = `left:${Math.random()>0.5?'8%':'78%'};top:${Math.random()*100}%;width:${Math.random()*35+8}px;height:3px;background:#00e676;border-radius:2px;animation:p_serverDash ${Math.random()*1+0.5}s linear forwards;`;
        } else if (state.heroClass === 'designer') {
            p.className = 'particle';
            const isCircle = Math.random() > 0.5;
            p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${Math.random()*35+12}px;aspect-ratio:1;border:2px solid rgba(255,77,166,0.5);border-radius:${isCircle?'50%':'10%'};animation:p_blobFloat ${Math.random()*4+4}s ease-in-out forwards;`;
        } else if (state.heroClass === 'engineer') {
            p.className = 'particle';
            p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:7px;height:7px;background:#ffd700;border-radius:50%;animation:p_nodePulse ${Math.random()*2+2}s ease-in-out forwards;`;
        }
        
        container.appendChild(p);
        setTimeout(() => p.remove(), 4000);
    }, 500); // Spawn less frequently
}

function nextWave() {
    if (state.wave >= monsterDB.length || state.currentQ >= state.questions.length) { endQuest(); return; }
    const m = monsterDB[state.wave]; state.monster = { hp: m.hp, maxHp: m.hp, atk: m.atk };
    
    const bg = document.querySelector('.arena-bg');
    if (m.imgKey === 'boss') {
        state.baseTime = 10 + heroClasses[state.heroClass].timeBonus;
        state.bossRageTriggered = false;
        bg.classList.add('boss-panic');
        playSound('lose');
        showToast('💀 DARK KERNEL MUNCUL! Serangan GANDA aktif!');
        setTimeout(() => showDamagePopup('monsterDamage', '⚠ FINAL BOSS!', 'dmg-taken'), 500);
    } else {
        state.baseTime = 25 + heroClasses[state.heroClass].timeBonus;
        bg.classList.remove('boss-panic');
    }

    document.getElementById('monsterName').textContent = m.name;
    document.getElementById('monsterLevel').textContent = `Lv.${m.level}`;
    const ms = document.getElementById('monsterSprite'); 
    ms.innerHTML = createPixelSprite(monsterImages[m.imgKey]); 
    ms.classList.remove('death', 'death-blow', 'monster-rage', 'monster-entering');
    
    // Scale boss naturally bigger
    if (m.imgKey === 'boss') {
        ms.querySelector('img').style.transform = 'scale(1.5)';
    }

    // Trigger entrance animation
    setTimeout(() => ms.classList.add('monster-entering'), 50);
    setTimeout(() => ms.classList.remove('monster-entering'), 900);

    document.getElementById('waveCounter').textContent = `Wave ${state.wave+1}/${monsterDB.length}`;
    updateHpBars(); showQuestion();
}

let typeInterval;
function showQuestion() {
    if (!state.isPlaying) return;
    if (state.currentQ >= state.questions.length || state.hero.hp <= 0) { endQuest(); return; }
    const q = state.questions[state.currentQ];
    
    const ag = document.getElementById('answerGrid');
    ag.innerHTML = q.opts.map((o,i) => `<button class="answer-btn" onclick="selectAnswer(${i})" id="ans-${i}"><span class="ans-label">${['A','B','C','D'][i]}</span><span>${o}</span></button>`).join('');
    ag.style.opacity = '0'; ag.style.pointerEvents = 'none';
    
    const fb = document.getElementById('battleFeedback'); fb.className = 'battle-feedback'; fb.innerHTML = '';
    
    const qt = document.getElementById('questionText');
    qt.innerHTML = ''; let cursor = document.createElement('span'); cursor.className = 'type-cursor'; qt.appendChild(cursor);
    
    let i = 0; if(typeInterval) clearInterval(typeInterval);
    typeInterval = setInterval(() => {
        cursor.insertAdjacentText('beforebegin', q.q.charAt(i));
        if (i % 3 === 0) playSound('typing');
        i++;
        if (i >= q.q.length) {
            clearInterval(typeInterval); ag.style.opacity = '1'; ag.style.pointerEvents = 'auto'; state.isAnswering = true; startTimer();
        }
    }, 40);
}

function startTimer() {
    state.timeLeft = state.baseTime; updateTimerDisplay();
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(() => { state.timeLeft--; updateTimerDisplay(); if (state.timeLeft <= 0) { clearInterval(state.timer); timeUp(); } }, 1000);
}
function updateTimerDisplay() {
    const timerText = document.getElementById('battleTimer');
    const container = document.getElementById('battleTimerContainer');
    const ring = document.getElementById('timerRingFill');

    timerText.textContent = state.timeLeft;

    // Animate circular ring
    const circumference = 87.96;
    const pct = Math.max(0, state.timeLeft / state.baseTime);
    if (ring) ring.style.strokeDashoffset = circumference * (1 - pct);

    // Color transition: cyan → gold → red
    const isDanger  = state.timeLeft <= 5;
    const isWarning = state.timeLeft <= 10 && !isDanger;
    const isUrgent  = state.timeLeft <= 8;
    container.classList.toggle('urgent',  isUrgent);
    container.classList.toggle('warning', isWarning);
    container.classList.toggle('danger',  isDanger);
}
function timeUp() {
    if (!state.isAnswering || !state.isPlaying) return; state.isAnswering = false; const q = state.questions[state.currentQ];
    disableAnswers(); document.getElementById(`ans-${q.ans}`).classList.add('correct');
    showFeedback(false, `⏰ Waktu habis! ${q.exp}`); setTimeout(() => monsterAttack(), 300);
}

function selectAnswer(i) {
    if (!state.isAnswering) return; state.isAnswering = false; clearInterval(state.timer);
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const q = state.questions[state.currentQ]; state.totalAnswered++; disableAnswers();
    const isCritical = state.timeLeft >= state.baseTime - 5 && i === q.ans;
    
    // Dramatic flash overlay
    const flashOverlay = document.getElementById('answerFlashOverlay');
    const flashText = document.getElementById('answerFlashText');
    
    if (i === q.ans) {
        state.score++; 
        state.combo++;
        state.consecutiveWrongs = 0; // Reset mascot counter
        document.getElementById('battleMascot').classList.remove('show');
        if (state.combo >= 2) showCombo();
        document.getElementById(`ans-${i}`).classList.add('correct');
        showFeedback(true, `⚔️ Jawaban Benar! ${q.exp}`);
        // Trigger green flash
        flashText.textContent = isCritical ? '💥 CRITICAL BENAR!' : '✅ BENAR!';
        flashOverlay.className = '';
        void flashOverlay.offsetWidth;
        flashOverlay.className = 'flash-correct';
        setTimeout(() => { flashOverlay.className = ''; }, 900);
        setTimeout(() => heroAttack(isCritical), 200);
    } else {
        state.combo = 0;
        document.getElementById('comboCounter').classList.remove('show');
        if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
        document.getElementById(`ans-${i}`).classList.add('wrong'); document.getElementById(`ans-${q.ans}`).classList.add('correct');
        showFeedback(false, `💥 Jawaban Salah! ${q.exp}`);
        // Trigger red flash
        flashText.textContent = '❌ SALAH!';
        flashOverlay.className = '';
        void flashOverlay.offsetWidth;
        flashOverlay.className = 'flash-wrong';
        setTimeout(() => { flashOverlay.className = ''; }, 800);
        
        // Mascot logic
        state.consecutiveWrongs++;
        if (state.consecutiveWrongs >= 2) {
            const mascotTips = [
                "Hei, ayo fokus! Coba baca opsi lainnya!", 
                "Ingat materi kemarin, kamu pasti bisa!", 
                "Jangan menyerah! Tarik napas sebentar!", 
                "Perhatikan kata kuncinya di pertanyaan!"
            ];
            document.getElementById('battleMascotText').textContent = mascotTips[Math.floor(Math.random() * mascotTips.length)];
            document.getElementById('battleMascot').classList.add('show');
            state.consecutiveWrongs = 0; // reset for next trigger
            
            // Auto hide after 4 seconds
            setTimeout(() => {
                document.getElementById('battleMascot').classList.remove('show');
            }, 4000);
        }

        setTimeout(() => monsterAttack(), 200);
    }
}

function showCombo() {
    const el = document.getElementById('comboCounter');
    el.textContent = `${state.combo}X COMBO!`;
    el.classList.remove('show');
    void el.offsetWidth; // Trigger reflow
    el.classList.add('show');
    playSound('typing');
}
function disableAnswers() { document.querySelectorAll('.answer-btn').forEach(b => b.classList.add('disabled')); }
function scheduleNext() {
    setTimeout(() => {
        if (!state.isPlaying) return;
        state.currentQ++;
        if (state.monster.hp <= 0) {
            // Wait for death animation to finish, then show wave cleared
            setTimeout(() => {
                if (!state.isPlaying) return;
                state.wave++;
                state.hero.xp += 20 + (state.wave * 10);
                state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + 15);
                updateHpBars();
                if (state.wave >= monsterDB.length) {
                    endQuest();
                } else {
                    showWaveCleared(state.wave, () => nextWave());
                }
            }, 900); // Wait for death-blow animation
        } else if (state.hero.hp <= 0) {
            endQuest();
        } else {
            showQuestion();
        }
    }, 2500);
}

function showWaveCleared(nextWaveNum, callback) {
    const overlay = document.getElementById('waveClearedOverlay');
    const text = document.getElementById('waveClearedText');
    const sub = document.getElementById('waveNextText');
    const icon = overlay.querySelector('.wave-cleared-icon');
    
    text.textContent = `WAVE ${nextWaveNum} CLEARED!`;
    sub.textContent = nextWaveNum >= monsterDB.length - 1 ? '⚡ Bos Terakhir Mendekat!' : `Gelombang ${nextWaveNum + 1} dimulai...`;
    icon.textContent = nextWaveNum >= monsterDB.length - 1 ? '💀' : '⚔️';
    
    overlay.className = 'show';
    playSound('win');
    setTimeout(() => {
        overlay.className = '';
        callback();
    }, 2000);
}

// ============ COMBAT ============
function playMovementAnim(style, aEl, dEl, fxInfo, onHit) {
    const aRect = aEl.getBoundingClientRect(), dRect = dEl.getBoundingClientRect();
    let isAttackerLeft = aRect.left < dRect.left;
    const ax = aRect.left; const ay = aRect.top;
    
    // On mobile landscape, combatants are CSS-scaled to 0.65.
    // We detect this by checking orientation + height, matching the CSS media query.
    // We cannot use getComputedStyle because JS .animate() overwrites the transform,
    // making the computed value unreliable during animation.
    const isMobileLandscape = window.innerWidth > window.innerHeight && window.innerHeight <= 500;
    const scale = isMobileLandscape ? 0.65 : 1;
    
    const dx = dRect.left + (isAttackerLeft ? -20 : 20);
    const dy = dRect.top;

    const executeMove = (aura) => {
        if (style === 'melee') {
            playSound('jump');
            // Divide by scale so the element travels the full screen distance
            const moveX = (dx - ax) / scale; const moveY = (dy - ay) / scale;
            const anim = aEl.animate([
                { transform: 'translate(0,0) skewX(0)', offset: 0 },
                { transform: `translate(${moveX*0.2}px, ${moveY*0.2}px) skewX(${isAttackerLeft ? -20 : 20}deg)`, offset: 0.2 },
                { transform: `translate(${moveX}px, ${moveY}px) skewX(0)` }
            ], { duration: 250, easing: 'ease-in', fill: 'both' });
            anim.onfinish = () => {
                onHit(() => {
                    const bAnim = aEl.animate([
                        { transform: `translate(${moveX}px, ${moveY}px)` },
                        { transform: 'translate(0,0)' }
                    ], { duration: 300, easing: 'ease-out', fill: 'both' });
                    bAnim.onfinish = () => { anim.cancel(); bAnim.cancel(); aEl.style.transform = ''; if(aura) aura.remove(); };
                });
            };
        } else if (style === 'jump') {
            const moveX = (dx - ax)/scale; const moveY = ((dy - ay) * 0.3)/scale; playSound('jump');
            const duckRot = isAttackerLeft ? '-10deg' : '10deg'; const arcRot = isAttackerLeft ? '25deg' : '-25deg'; const slamRot = isAttackerLeft ? '10deg' : '-10deg';
            const anim = aEl.animate([ 
                { transform: 'translate(0,0) scale(1) rotate(0deg)' }, 
                { transform: `translate(${- (isAttackerLeft? -80:80)*0.3}px, 0) scaleX(1.3) scaleY(0.7) rotate(${duckRot})`, offset: 0.15 },
                { transform: `translate(${moveX*0.6}px, ${moveY - 200}px) scaleX(0.8) scaleY(1.3) rotate(${arcRot})`, offset: 0.6 },
                { transform: `translate(${moveX}px, ${moveY}px) scaleX(1.4) scaleY(0.6) rotate(${slamRot})` }
            ], { duration: 400, easing: 'cubic-bezier(0.2, 0, 1, 1)', fill: 'both' });
            anim.onfinish = () => {
                onHit(() => {
                    const bAnim = aEl.animate([
                        { transform: `translate(${moveX}px, ${moveY}px)` },
                        { transform: `translate(${moveX*0.4}px, ${moveY*0.4 - 100}px) scaleX(0.9) scaleY(1.1) rotate(0deg)`, offset: 0.5 },
                        { transform: 'translate(0,0) scaleX(1) scaleY(1)' }
                    ], { duration: 350, easing: 'ease-out', fill: 'both' });
                    bAnim.onfinish = () => { anim.cancel(); bAnim.cancel(); aEl.style.transform = ''; if(aura) aura.remove(); };
                });
            };
        } else if (style === 'dash') {
            playSound('jump');
            const moveX = (dx - ax)/scale; const moveY = (dy - ay)/scale;
            const anim = aEl.animate([
                { transform: 'translate(0,0) skewX(0)', opacity: 1 },
                { transform: `translate(${moveX*0.5}px, ${moveY*0.5}px) skewX(${isAttackerLeft ? -30 : 30}deg)`, opacity: 0.5, offset: 0.5 },
                { transform: `translate(${moveX}px, ${moveY}px) skewX(0)`, opacity: 1 }
            ], { duration: 150, easing: 'linear', fill: 'both' });
            
            anim.onfinish = () => {
                onHit(() => {
                    const bAnim = aEl.animate([
                        { transform: `translate(${moveX}px, ${moveY}px)`, opacity: 1 },
                        { transform: `translate(${moveX*0.5}px, ${moveY*0.5}px)`, opacity: 0.5, offset: 0.4 },
                        { transform: 'translate(0,0)', opacity: 1 }
                    ], { duration: 200, easing: 'ease-out', fill: 'both' });
                    bAnim.onfinish = () => { anim.cancel(); bAnim.cancel(); aEl.style.transform = ''; if(aura) aura.remove(); };
                });
            };
        } else if (style === 'cast') {
            const anim = aEl.animate([
                { transform: 'translate(0,0)', filter: 'brightness(1)' },
                { transform: 'translate(0, -30px)', filter: 'brightness(1.5)', offset: 0.5 },
                { transform: 'translate(0, -50px)', filter: 'brightness(1.8)' }
            ], { duration: 400, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' });
            
            anim.onfinish = () => {
                onHit(() => {
                    const bAnim = aEl.animate([
                        { transform: 'translate(0, -50px)', filter: 'brightness(1.8)' },
                        { transform: 'translate(0,0)', filter: 'brightness(1)' }
                    ], { duration: 300, easing: 'ease-in', fill: 'both' });
                    bAnim.onfinish = () => { anim.cancel(); bAnim.cancel(); aEl.style.transform = ''; if(aura) aura.remove(); };
                });
            };
        } else {
            // ranged (Wind up and hold, ball forms here!)
            const windupX = isAttackerLeft ? -15 : 15;
            const anim = aEl.animate([
                { transform: 'translate(0,0)' },
                { transform: `translate(${windupX}px, 0)` }
            ], { duration: 250, easing: 'ease-out', fill: 'both' });
            
            anim.onfinish = () => {
                onHit(() => {
                    const bAnim = aEl.animate([
                        { transform: `translate(${windupX}px, 0)` },
                        { transform: 'translate(0,0)' }
                    ], { duration: 350, easing: 'ease-out', fill: 'both' });
                    bAnim.onfinish = () => { anim.cancel(); bAnim.cancel(); aEl.style.transform = ''; if(aura) aura.remove(); };
                });
            };
        }
    };

    // UNIVERSAL CHARGE AURA FOR ALL ATTACKS! (Squat -> Power up -> particles)
    const chargeDur = 750;
    const aura = document.createElement('div');
    aura.style.cssText = `position:absolute; left:-20%; top:-20%; width:140%; height:140%; z-index:-1; mix-blend-mode: screen; pointer-events: none; overflow: visible;`;
    aEl.appendChild(aura);

    aEl.style.transformOrigin = 'bottom center';
    aEl.animate([
        { transform: 'translate(0,0) scale(1)' },
        { transform: 'translate(0, 10px) scaleY(0.7) scaleX(1.2)', offset: 0.1 },
        { transform: 'translate(-4px, 10px) scaleY(0.7) scaleX(1.2)', offset: 0.2 },
        { transform: 'translate(4px, 10px) scaleY(0.7) scaleX(1.2)', offset: 0.4 },
        { transform: 'translate(-4px, 10px) scaleY(0.7) scaleX(1.2)', offset: 0.6 },
        { transform: 'translate(4px, 10px) scaleY(0.7) scaleX(1.2)', offset: 0.8 },
        { transform: 'translate(0, 10px) scaleY(0.7) scaleX(1.2)', offset: 0.95 },
        { transform: 'translate(0,0) scale(1)' }
    ], { duration: chargeDur, iterations: 1 }).onfinish = () => {
        aEl.style.transformOrigin = '';
        executeMove(aura); // The specific attack triggers AFTER the gathering phase
    };

    const particleCount = 35;
    const totalAuraDur = 1200;
    for (let i = 0; i < particleCount; i++) {
        const par = document.createElement('div');
        
        const left = Math.random() * 100;
        const delay = Math.random() * 400;
        const dur = 300 + Math.random() * 400;
        const size = 3 + Math.random() * 5; 
        
        let pShape = `width: ${size}px; height: ${size*1.5}px; border-radius: 50%; background: ${fxInfo.color}; box-shadow: 0 0 10px ${fxInfo.color}, 0 0 20px ${fxInfo.color};`;
        
        par.style.cssText = `position:absolute; left:${left}%; bottom: 0%; opacity: 0; ${pShape}`;
        aura.appendChild(par);
        
        const moveUp = -250 - Math.random() * 200;
        const moveX = -20 + Math.random() * 40;
        
        par.animate([
            { transform: `translate(0, 10px) scale(0)`, opacity: 0 },
            { transform: `translate(${moveX/2}px, ${moveUp/2}px) scale(1)`, opacity: 1, offset: 0.3 },
            { transform: `translate(${moveX}px, ${moveUp}px) scale(0.5)`, opacity: 0 }
        ], { duration: dur, delay: delay, iterations: Math.ceil((totalAuraDur+chargeDur)/dur), easing: 'ease-out' });
    }
}

function screenShake() { const arena = document.querySelector('.battle-arena'); arena.classList.add('shake-hard'); setTimeout(() => arena.classList.remove('shake-hard'), 450); }

function heroAttack(isCritical = false) {
    if (!state.isPlaying) return;
    playSound('correct');
    
    let dmg = state.hero.atk + Math.floor(Math.random() * 5);
    if (isCritical) dmg = Math.floor(dmg * 1.5);

    // Boss Berserker trigger (only once per boss wave)
    const isBoss = monsterDB[state.wave]?.imgKey === 'boss';
    const wasAboveThreshold = state.monster.hp > state.monster.maxHp * 0.3;
    state.monster.hp = Math.max(0, state.monster.hp - dmg);
    if (isBoss && wasAboveThreshold && !state.bossRageTriggered && state.monster.hp > 0 && state.monster.hp <= state.monster.maxHp * 0.3) {
        state.bossRageTriggered = true;
        showToast('⚠️ BOSS BERSERK! Double Strike AKTIF!');
        screenShake();
    }

    const heroEl = document.getElementById('heroSprite'); const monsterEl = document.getElementById('monsterSprite');
    
    // Use varied attack variant for this hero
    const fxInfo = getAttackVariant(state.heroClass);
    const style = fxInfo.style;
    
    playMovementAnim(style, heroEl, monsterEl, fxInfo, (returnJump) => {
        playSound('attack_' + state.heroClass); 
        firePremiumProjectile(style, heroEl, monsterEl, fxInfo, true, isCritical, () => {
            playSound(['cast', 'ranged'].includes(style) ? 'hit_magic' : 'hit_physical'); monsterEl.classList.add('hit'); spawnPremiumImpact(monsterEl, fxInfo, isCritical);
            
            if (isCritical) screenShake();
            showDamagePopup('monsterDamage', isCritical ? `CRIT -${dmg}!` : `-${dmg}`, 'dmg-dealt'); screenFlash('green');
            
            setTimeout(() => {
                monsterEl.classList.remove('hit');
                if (state.monster.hp <= 0) monsterEl.classList.add('death-blow');
                returnJump();
                scheduleNext();
            }, 300);
            state.hero.xp += 5; updateHpBars();
        });
    });
}
function monsterAttack() {
    if (!state.isPlaying) return;
    playSound('wrong');
    const monsterKey = monsterDB[state.wave]?.imgKey || 'boss';
    const isBoss = monsterKey === 'boss';

    // Boss deals 1.5x damage; berserking boss deals 2x
    const isBerserking = isBoss && state.monster.hp <= state.monster.maxHp * 0.3;
    const dmgMult = isBerserking ? 2.0 : isBoss ? 1.5 : 1.0;
    const rawDmg = state.monster.atk + Math.floor(Math.random() * 4);
    const dmg = Math.max(1, Math.floor((rawDmg - state.hero.def) * dmgMult));
    state.hero.hp = Math.max(0, state.hero.hp - dmg);

    const monsterEl = document.getElementById('monsterSprite');
    const heroEl = document.getElementById('heroSprite');

    // Monster-specific projectile
    const fxInfo = monsterProjFX[monsterKey] || monsterProjFX.boss;
    
    if (typeof window.lastMonsterStyle === 'undefined') window.lastMonsterStyle = null;
    let availableStyles = fxInfo.styles.filter(s => s !== window.lastMonsterStyle);
    if (availableStyles.length === 0) availableStyles = fxInfo.styles;
    const style = availableStyles[Math.floor(Math.random() * availableStyles.length)];
    window.lastMonsterStyle = style;

    // Boss has 35% double strike chance (100% when berserking)
    const doDoubleStrike = isBoss && (isBerserking || Math.random() < 0.35);

    playMovementAnim(style, monsterEl, heroEl, fxInfo, (returnJump) => {
        playSound('attack_monster'); 
        firePremiumProjectile(style, monsterEl, heroEl, fxInfo, false, isBoss, () => {
            playSound(['cast', 'ranged'].includes(style) ? 'hit_magic' : 'hit_physical');
            heroEl.classList.add('hit');
            spawnPremiumImpact(heroEl, fxInfo, isBoss);

            if (dmg > 8 || isBoss) screenShake();
            showDamagePopup('heroDamage', isBoss ? `💀 -${dmg}` : `-${dmg}`, 'dmg-taken');
            screenFlash('red');

            setTimeout(() => {
                heroEl.classList.remove('hit');
                returnJump();
                updateHpBars();

                if (doDoubleStrike && state.hero.hp > 0) {
                    // Boss double strike: second hit after short delay
                    setTimeout(() => {
                        const dmg2 = Math.max(1, Math.floor(state.monster.atk * 0.55));
                        state.hero.hp = Math.max(0, state.hero.hp - dmg2);
                        showDamagePopup('heroDamage', `DOUBLE! -${dmg2}`, 'dmg-taken');
                        screenFlash('red');
                        screenShake();
                        updateHpBars();
                        scheduleNext();
                    }, 600);
                } else {
                    scheduleNext();
                }
            }, 300);
        });
    });
}

function firePremiumProjectile(style, aEl, dEl, fxInfo, isHtoM, isCrit, cb) {
    if(!fxInfo) return cb();
    const fx = document.getElementById('projectileLayer'); const a = aEl.getBoundingClientRect(), d = dEl.getBoundingClientRect(), f = fx.getBoundingClientRect();
    
    const ax = a.left+a.width/2-f.left; const ay = a.top+a.height/2-f.top;
    const dx = d.left+d.width/2-f.left; const dy = d.top+d.height/2-f.top;

    if(style !== 'ranged' && style !== 'cast') { 
        setTimeout(() => cb(), 50); 
        return; 
    }

    let ang = Math.atan2(dy - ay, dx - ax) * 180 / Math.PI; 
    if(!isHtoM) ang-=180;
    
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;left:${ax}px;top:${ay}px;width:30px;height:10px;border-radius:10px;background:${fxInfo.color};box-shadow:0 0 20px ${fxInfo.color}, 0 0 40px ${fxInfo.color};transform:translate(-50%,-50%) rotate(${ang}deg);`;
    
    if(fxInfo.hitVfx === 'magic') { p.style.width = '40px'; p.style.height = '40px'; p.style.borderRadius = '50%'; p.style.background = `radial-gradient(circle, #fff, ${fxInfo.color})`; } 
    else if(fxInfo.hitVfx === 'lightning') { p.style.width = '80px'; p.style.height = '4px'; p.style.borderRadius = '0'; p.style.boxShadow = `0 0 10px #fff, 0 0 20px ${fxInfo.color}`; } 
    else if(fxInfo.hitVfx === 'shatter') { p.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'; p.style.width = '30px'; p.style.height = '30px'; p.style.background = '#fff'; }
    else if(fxInfo.hitVfx === 'blob') { p.style.width = '35px'; p.style.height = '35px'; p.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%'; }
    
    fx.appendChild(p);

    const chargeDur = style === 'cast' ? 600 : 400;

    const gatherCount = style === 'cast' ? 6 : 4;
    for(let i=0; i<gatherCount; i++) {
        const par = document.createElement('div');
        const angleConfig = (Math.PI * 2 / gatherCount) * i + Math.random();
        const dist = 40 + Math.random()*30;
        par.style.cssText = `position:absolute;left:${ax}px;top:${ay}px;width:6px;height:6px;background:${fxInfo.color};border-radius:50%;box-shadow:0 0 10px ${fxInfo.color};transform:translate(-50%,-50%);pointer-events:none;`;
        fx.appendChild(par);
        par.animate([
            { transform: `translate(-50%,-50%) rotate(${angleConfig}rad) translateY(${dist}px) scale(0)`, opacity: 0 },
            { transform: `translate(-50%,-50%) rotate(${angleConfig}rad) translateY(${dist*0.5}px) scale(1)`, opacity: 1, offset: 0.5 },
            { transform: `translate(-50%,-50%) rotate(${angleConfig}rad) translateY(0) scale(0)`, opacity: 1 }
        ], { duration: chargeDur, easing: 'ease-in' }).onfinish = () => par.remove();
    }

    p.style.opacity = '0';
    p.animate([
        { transform: `translate(-50%,-50%) rotate(${ang}deg) scale(0)`, opacity: 0, filter: 'brightness(2)' },
        { transform: `translate(-50%,-50%) rotate(${ang}deg) scale(1.3)`, opacity: 1, filter: 'brightness(1.5)', offset: 0.8 },
        { transform: `translate(-50%,-50%) rotate(${ang}deg) scale(1)`, opacity: 1, filter: 'brightness(1)' }
    ], { duration: chargeDur, easing: 'ease-out' }).onfinish = () => {
        p.style.opacity = '1';
        
        if (style === 'ranged') {
            const thrustX = ax < dx ? 35 : -35;
            aEl.animate([
                { transform: aEl.style.transform || `translate(${ax < dx ? -15 : 15}px, 0)` },
                { transform: `translate(${thrustX}px, 0) scale(1.1) rotate(${ax<dx?10:-10}deg)`, offset: 0.2 },
                { transform: aEl.style.transform || `translate(${ax < dx ? -15 : 15}px, 0)` }
            ], { duration: 350, easing: 'ease-out' });
        }

        const dur = isCrit ? 150 : 250;
        p.animate([
            { transform: `translate(-50%,-50%) rotate(${ang}deg) scale(1)` },
            { transform: `translate(${dx-ax}px, ${dy-ay}px) rotate(${ang}deg) scale(${isCrit?2:1.2})` }
        ], {duration: dur, easing: 'ease-in'}).onfinish=()=>{ p.remove(); cb(); };
    };
}

function spawnPremiumImpact(tEl, fxInfo, isCrit) {
    const fx = document.getElementById('projectileLayer'); const r = tEl.getBoundingClientRect(), f = fx.getBoundingClientRect(); const cx = r.left+r.width/2-f.left, cy = r.top+r.height/2-f.top;
    
    // OPTIMIZATION: Cap sparks at 5 crit / 3 normal for 60fps on low-end mobile
    const count = isCrit ? 5 : 3; const dur = isCrit ? 550 : 380;
    
    const flash = document.createElement('div');
    flash.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:150px;height:150px;background:radial-gradient(circle, #fff 10%, ${fxInfo.color} 50%, transparent 80%);transform:translate(-50%,-50%);mix-blend-mode:screen;border-radius:50%;pointer-events:none;`;
    fx.appendChild(flash);
    flash.animate([{transform:'translate(-50%,-50%) scale(0.5)', opacity:1},{transform:`translate(-50%,-50%) scale(${isCrit?3:2})`, opacity:0}], {duration: dur, easing: 'ease-out'}).onfinish=()=>flash.remove();

    if(fxInfo.hitVfx === 'slash') {
        const slash = document.createElement('div');
        slash.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:200px;height:10px;background:#fff;box-shadow:0 0 30px ${fxInfo.color}, 0 0 60px ${fxInfo.color};transform:translate(-50%,-50%) rotate(${Math.random()*180}deg);border-radius:10px;`;
        fx.appendChild(slash);
        slash.animate([{transform:slash.style.transform+' scaleY(5)'},{transform:slash.style.transform+' scaleY(0)'}],{duration:300,easing:'ease-out'}).onfinish=()=>slash.remove();
    }
    
    for(let i=0; i<count; i++) {
        const spark = document.createElement('div');
        const angle = (Math.PI * 2 / count) * i + Math.random();
        const dist = 100 + Math.random() * (isCrit?150:100);
        
        let shape = 'border-radius:50%;'; 
        if(fxInfo.hitVfx === 'slash' || fxInfo.hitVfx === 'lightning') shape = 'border-radius:10px; height: 35px;';
        if(fxInfo.hitVfx === 'block') shape = 'border-radius:4px;';
        if(fxInfo.hitVfx === 'shatter') shape = 'clip-path:polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); width: 25px; height: 25px; background: #fff;';

        spark.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:8px;height:8px;background:${fxInfo.color};box-shadow:0 0 10px ${fxInfo.color};${shape}transform:translate(-50%,-50%);pointer-events:none;`;
        fx.appendChild(spark);
        
        spark.animate([
            { transform: `translate(-50%,-50%) rotate(${angle}rad) translateY(0) scale(1)`, opacity: 1 },
            { transform: `translate(-50%,-50%) rotate(${angle}rad) translateY(-${dist}px) scale(0)`, opacity: 0 }
        ], { duration: 300 + Math.random()*300, easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)' }).onfinish = ()=>spark.remove();
    }
}

function showDamagePopup(id, text, cls) { const el = document.getElementById(id); el.textContent = text; el.className = `damage-popup show ${cls}`; setTimeout(() => { el.className = 'damage-popup'; }, 1000); }
function screenFlash(color) { const f = document.createElement('div'); f.className = `screen-flash flash-${color}`; document.body.appendChild(f); setTimeout(() => f.remove(), 400); }
function updateHpBars() {
    const mFill = document.getElementById('monsterHpFill');
    const mGhost = document.getElementById('monsterHpGhost');
    const hFill = document.getElementById('heroHpFill');
    const hGhost = document.getElementById('heroHpGhost');
    
    const mPct = Math.max(0, (state.monster.hp / state.monster.maxHp) * 100) + '%';
    const hPct = Math.max(0, (state.hero.hp / state.hero.maxHp) * 100) + '%';

    mFill.style.width = mPct;
    hFill.style.width = hPct;
    
    // Smooth ghost bar catching up
    setTimeout(() => {
        if (mGhost) mGhost.style.width = mPct;
        if (hGhost) hGhost.style.width = hPct;
    }, 600);

    document.getElementById('monsterHpText').textContent = `${Math.max(0,state.monster.hp)}/${state.monster.maxHp}`;
    document.getElementById('heroHpText').textContent = `${Math.max(0,state.hero.hp)}/${state.hero.maxHp}`;
    
    const xpFill = document.getElementById('xpFill');
    if (xpFill) xpFill.style.width = Math.min(100, (state.hero.xp / 200) * 100) + '%';
    
    // MONSTER RAGE when HP drops below 30%
    const monsterEl = document.getElementById('monsterSprite');
    if (monsterEl && state.monster.hp > 0) {
        if (state.monster.hp <= state.monster.maxHp * 0.3) {
            monsterEl.classList.add('monster-rage');
        } else {
            monsterEl.classList.remove('monster-rage');
        }
    }
}
function showFeedback(ok, text) { const fb = document.getElementById('battleFeedback'); fb.className = `battle-feedback show ${ok ? 'correct-fb' : 'wrong-fb'}`; fb.innerHTML = text; }

// ============ END QUEST ============
function endQuest() {
    state.isPlaying = false;
    clearInterval(state.timer); playLoopingTrack(null); document.querySelector('.arena-bg').classList.remove('boss-panic');
    if (state.atmosInt) clearInterval(state.atmosInt);
    
    const won = state.hero.hp > 0 && state.wave >= monsterDB.length; setTimeout(() => playSound(won ? 'win' : 'lose'), 500);
    const pct = state.totalAnswered > 0 ? Math.round((state.score / state.totalAnswered) * 100) : 0;
    
    // Leaderboard Update
    const finalScore = (state.score * 10) + (state.combo * 5) + state.hero.xp;
    const best = localStorage.getItem('techQuestBest') || 0;
    if (finalScore > best) {
        localStorage.setItem('techQuestBest', finalScore);
        localStorage.setItem('techQuestName', document.getElementById('playerName').value || "Siswa");
        showToast("🌟 REKOR BARU!");
    }
    updateLeaderboardUI();
    if (won) setTimeout(spawnConfetti, 400);

    // Achievements calculation
    const isPerfect = pct === 100;
    const isSurvivor = state.hero.hp < (state.hero.maxHp * 0.2);
    const hasMedal = won || isPerfect || isSurvivor;

    let emoji, headline, hClass, message;
    if (won) { 
        emoji = '🏆'; headline = 'VICTORY!'; hClass = 'victory'; message = pct >= 90 ? 'Tech Master sejati! Semua monster takluk! 🌟' : 'Kamu berhasil menembus kernel sistem!'; 
        
        // Unlock next dungeon
        const dungeonSequence = ['hardware', 'software', 'os', 'hci'];
        const currentIndex = dungeonSequence.indexOf(state.dungeon);
        if (currentIndex !== -1 && currentIndex < 3) {
            const nextLevel = currentIndex + 2; // hardware=1, next is 2
            const currentUnlocked = parseInt(localStorage.getItem('techUnlockedLevel') || '1');
            if (nextLevel > currentUnlocked) {
                localStorage.setItem('techUnlockedLevel', nextLevel.toString());
                setTimeout(() => showToast("🔓 Dungeon Baru Telah Terbuka!"), 1500);
            }
        }
    }
    else { emoji = '💀'; headline = 'DEFEATED...'; hClass = 'defeat'; message = 'Sistem terinfeksi berat. Coba lagi!'; }

    const medalsHTML = `
        <div class="medals-container">
            <div class="medal ${won ? 'active' : ''}"><div class="medal-icon">🥇</div><div class="medal-label">Winner</div></div>
            <div class="medal ${isPerfect ? 'active' : ''}"><div class="medal-icon">💎</div><div class="medal-label">Perfect</div></div>
            <div class="medal ${isSurvivor ? 'active' : ''}"><div class="medal-icon">🔥</div><div class="medal-label">Survivor</div></div>
        </div>
    `;

    document.getElementById('resultContainer').innerHTML = `
        <div class="result-big-emoji">${emoji}</div>
        <div class="result-headline ${hClass}">${headline}</div>
        ${medalsHTML}
        <div class="result-stats-grid">
            <div class="result-stat-card"><div class="result-stat-value gold">${finalScore}</div><div class="result-stat-label">Total Score</div></div>
            <div class="result-stat-card"><div class="result-stat-value green">${pct}%</div><div class="result-stat-label">Akurasi</div></div>
            <div class="result-stat-card"><div class="result-stat-value red">${state.hero.hp}</div><div class="result-stat-label">Sisa HP</div></div>
        </div>
        <div class="result-message">${message}</div>
        ${won ? `<div class="btn-cheat-code show" onclick="alert(cheatsDB[state.dungeon] || cheatsDB.os)">📜 LIHAT KUNCI MATERI</div>` : ''}
        <div class="result-buttons">
            <button class="btn-result btn-retry-quest" onclick="retryQuest()">⚔️ ULANGI</button>
            <button class="btn-result btn-menu" onclick="backToMenu()">🏠 MENU</button>
        </div>
    `;
    switchScreen('battleScreen', 'resultScreen');
}
function retryQuest() { 
    switchScreen('resultScreen','mainMenu'); 
    setTimeout(startQuest, 100); 
}
function backToMenu() { 
    switchScreen('resultScreen','mainMenu'); 
    if (isBgmOn) playLoopingTrack('menu'); 
}
function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

function spawnConfetti() {
    const colors = ['#ffd700','#ff4da6','#00e5ff','#00e676','#b74dff','#ff9100','#ffffff','#ff4444'];
    const shapes = ['50%', '2px', '0'];
    // OPTIMIZATION: Capped at 55 pieces (was 100) to prevent mobile stutter
    for (let i = 0; i < 55; i++) {
        setTimeout(() => {
            const c = document.createElement('div');
            c.className = 'confetti-piece';
            const size = Math.random() * 10 + 6;
            c.style.cssText = `left:${Math.random()*100}vw;width:${size}px;height:${size*(Math.random()>0.5?1:2.5)}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${shapes[Math.floor(Math.random()*shapes.length)]};animation-duration:${Math.random()*3+2}s;animation-delay:${Math.random()*0.3}s;`;
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 5500);
        }, i * 35);
    }
}

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
        window.location.href = 'games/games.html';
    }, 4500);
}