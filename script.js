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

  // ========= DATA MATERI =========
  const materials = {
    materi1: {
      title: "Sistem Komputer & Komponennya",
      content: `
        <div class="intro-section">
          <h4>1. Konsep Sistem Komputer</h4>
          <p><strong>Sistem Komputer</strong> adalah kumpulan elemen-elemen yang saling berinteraksi satu sama lain dalam satu kesatuan untuk mencapai tujuan tertentu. Sistem komputer terdiri dari tiga komponen utama yang tidak dapat dipisahkan:</p>
          <ul class="item-list">
             <li><strong>Hardware (Perangkat Keras)</strong>: Komponen fisik mesin.</li>
             <li><strong>Software (Perangkat Lunak)</strong>: Program yang mengontrol mesin.</li>
             <li><strong>Brainware (Manusia)</strong>: Pengguna yang mengoperasikan komputer.</li>
          </ul>
          <p>Alur kerja dasar sistem komputer dimulai dari <strong>Input</strong> (masukan data), kemudian data diolah di bagian <strong>Proses</strong>, dan akhirnya menghasilkan informasi dalam bentuk <strong>Output</strong>.</p>  
        </div>

        <div style="margin-top:20px; border-top: 1px dashed #cbd5e1; padding-top:20px;">
          <div class="tab-nav">
            <button class="tab-btn active" onclick="switchTab(event, 'tabHard')">Hardware</button>
            <button class="tab-btn" onclick="switchTab(event, 'tabSoft')">Software</button>
            <button class="tab-btn" onclick="switchTab(event, 'tabBrain')">Brainware</button>
            <button class="tab-btn" onclick="switchTab(event, 'tabClass')">Penggolongan</button>
          </div>

          <!-- 1. HARDWARE -->
          <div id="tabHard" class="content-section active">
            <h4>a. Perangkat Keras (Hardware)</h4>
            <p>Merupakan komponen fisik sistem komputer yang dapat disentuh dan dilihat. Hardware dikategorikan menjadi empat bagian utama:</p>
            
            <div class="materi-box">
              <span class="materi-title">1) Perangkat Masukan (Input Device)</span>
              <p>Berfungsi untuk memasukkan data, perintah, atau instruksi ke dalam komputer.</p>
              <ul class="item-list">
                  <li><strong>Mouse:</strong> Perangkat penunjuk kursor. Memiliki fungsi <em>klik kanan</em> (menu shortcut), <em>klik kiri</em> (pilih), <em>scroll</em> (gulir halaman), dan <em>drag & drop</em>.</li>
                  <li><strong>Keyboard:</strong> Papan ketik untuk input karakter. Terdiri dari:
                    <br>- <em>Typing Keys</em>: Huruf, angka, tanda baca.
                    <br>- <em>Function Keys (F1-F12)</em>: Fungsi khusus.
                    <br>- <em>Numeric Keys</em>: Tombol angka (seperti kalkulator).
                    <br>- <em>Control Keys</em>: Ctrl, Alt, Esc, Arrow keys.
                  </li>
                  <li><strong>Touch Screen:</strong> Layar sentuh yang memungkinkan input instruksi melalui sentuhan jari atau stylus (banyak dipakai di HP/Tablet).</li>
                  <li><strong>Barcode Reader:</strong> Pemindai kode batang (barcode) menggunakan cahaya untuk membaca kode digital, kemudian dikirim ke komputer (sering di kasir).</li>
              </ul>
            </div>

            <div class="materi-box">
              <span class="materi-title">2) Unit Pemrosesan (Processing Unit)</span>
              <p>Bagian ini adalah "otak" komputer yang mengolah data input menjadi informasi.</p>
              <ul class="item-list">
                  <li><strong>CPU (Central Processing Unit):</strong> Komponen elektronik utama (mikroprosesor) yang mengontrol semua fungsi sistem. CPU terdiri dari:
                     <br>- <strong>Unit Kontrol (Control Unit):</strong> Mengatur lalu lintas data, mengambil instruksi dari memori, dan mengoordinasikan perangkat I/O.
                     <br>- <strong>ALU (Arithmetic Logic Unit):</strong> Melakukan operasi matematika (tambah, kurang) dan logika (AND, OR, perbandingan).
                  </li>
                  <li>Cara kerjanya: CPU mengambil instruksi dari memori (fetch), menerjemahkannya (decode), dan menjalankannya (execute).</li>
              </ul>
            </div>

            <div class="materi-box">
              <span class="materi-title">3) Unit Memori (Storage)</span>
              <p>Tempat penyimpanan data dan instruksi.</p>
              <ul class="item-list">
                  <li><strong>Memori Utama (RAM - Random Access Memory):</strong> Menyimpan data sementara saat program berjalan. Bersifat <em>volatil</em> (data hilang jika listrik mati).</li>
                  <li><strong>ROM (Read Only Memory):</strong> Menyimpan program dasar untuk <em>booting</em> awal komputer.</li>
                  <li><strong>Memori Sekunder (Storage):</strong> Penyimpanan permanen dan berkapasitas besar. Bersifat <em>non-volatil</em> (data tetap ada walau listrik mati). Contoh: Harddisk (HDD), SSD, Flashdrive.</li>
              </ul>
            </div>

            <div class="materi-box">
              <span class="materi-title">4) Perangkat Keluaran (Output Device)</span>
              <p>Menampilkan hasil pemrosesan data kepada pengguna.</p>
              <ul class="item-list">
                  <li><strong>Monitor:</strong> Menampilkan output visual/layar secara langsung (softcopy).</li>
                  <li><strong>Printer:</strong> Mencetak hasil output ke dalam bentuk kertas (hardcopy).</li>
                  <li><strong>Speaker:</strong> Mengeluarkan output dalam bentuk suara/audio.</li>
              </ul>
            </div>
          </div>
          
          <!-- 2. SOFTWARE -->
          <div id="tabSoft" class="content-section">
            <h4>b. Perangkat Lunak (Software)</h4>
            <p>Kumpulan kode program yang membantu hardware bekerja. Software tidak memiliki wujud fisik, tetapi berupa instruksi digital.</p>
            
            <div class="materi-box">
              <span class="materi-title">1) Sistem Operasi (Operating System)</span>
              <p>Software paling mendasar yang berfungsi sebagai penghubung antara manusia dan hardware. OS mengelola sumber daya komputer.</p>
              <ul class="item-list">
                  <li><strong>Contoh Umum:</strong> Microsoft Windows, MacOS (Apple), Linux, Android (Mobile), Chrome OS.</li>
              </ul>
            </div>

            <div class="materi-box">
              <span class="materi-title">2) Bahasa Pemrograman (Programming Language)</span>
              <p>Software yang berisi instruksi untuk membuat program lain, memungkinkan manusia berkomunikasi dengan mesin melalui kode.</p>
              <ul class="item-list">
                  <li><strong>Contoh:</strong> Python, Java, PHP, JavaScript, C++, Ruby.</li>
              </ul>
            </div>

            <div class="materi-box">
              <span class="materi-title">3) Aplikasi (Application)</span>
              <p>Software yang dibuat untuk tujuan spesifik membantu tugas sehari-hari pengguna.</p>
              <ul class="item-list">
                  <li><strong>Pengolah Kata/Angka:</strong> Microsoft Office (Word, Excel, PowerPoint).</li>
                  <li><strong>Database/Presentasi:</strong> Aplikasi basis data dan slide presentasi.</li>
              </ul>
            </div>

            <div class="materi-box">
              <span class="materi-title">4) Utility (Program Bantu)</span>
              <p>Program tambahan untuk memelihara dan melindungi kinerja sistem komputer.</p>
              <ul class="item-list">
                  <li><strong>Contoh:</strong> Antivirus (Norton, McAfee, Kaspersky), Disk Defragmenter, Screensaver, Firewall.</li>
              </ul>
            </div>
          </div>

          <!-- 3. BRAINWARE -->
          <div id="tabBrain" class="content-section">
            <h4>c. Brainware (Pengguna)</h4>
            <p>Brainware adalah orang yang menggunakan, mengoperasikan, atau mengatur sistem komputer. Tanpa manusia, komputer tidak bisa berjalan sendiri. Berikut adalah tingkatan dan jenis brainware:</p>
            
            <div class="materi-box">
              <ul class="item-list">
                  <li><strong>1. Operator Komputer:</strong> Pengguna akhir yang menjalankan instruksi/aplikasi (contoh: mengetik dokumen, input data).</li>
                  <li><strong>2. Teknisi Komputer:</strong> Orang yang ahli memperbaiki kerusakan fisik hardware dan masalah perangkat. Bertanggung jawab atas pemeliharaan.</li>
                  <li><strong>3. Manajer Proyek:</strong> Memimpin proyek pengembangan sistem, mengatur waktu, dan koordinasi antar tim.</li>
                  <li><strong>4. Trainer:</strong> Orang yang memiliki pengetahuan untuk mendidik/mengajar orang lain tentang komputer.</li>
                  <li><strong>5. Spesialis Jaringan:</strong> Ahli dalam mengelola, merancang, dan memelihara jaringan komputer (network).</li>
                  <li><strong>6. Konsultan:</strong> Penasihat yang memberikan rekomendasi solusi terkait masalah sistem komputer.</li>
                  <li><strong>7. Sistem Analis:</strong> Bertanggung jawab merancang sistem yang akan dibangun, memprediksi kebutuhan, dan mengevaluasi sistem.</li>
                  <li><strong>8. Programmer:</strong> Orang yang menulis kode program untuk menciptakan software/aplikasi pendukung sistem.</li>
                  <li><strong>9. Administrator Database:</strong> Mengelola, memonitor, dan merawat basis data organisasi.</li>
                  <li><strong>10. Desainer Grafis:</strong> Memiliki keahlian membuat objek visual/animasi menggunakan komputer.</li>
              </ul>
            </div>
          </div>

          <!-- 4. PENGGOLONGAN KOMPUTER -->
          <div id="tabClass" class="content-section">
             <h4>d. Penggolongan Komputer</h4>
             <p>Komputer dapat diklasifikasikan berdasarkan data yang diolah, penggunaan, kapasitas, dan generasinya.</p>

             <div class="materi-box">
               <span class="materi-title">1) Berdasarkan Data yang Diolah</span>
               <ul class="item-list">
                  <li><strong>Komputer Analog:</strong> Mengolah data kualitatif/fisik (suhu, tekanan). Contoh: Termometer, Voltmeter, Seismometer.</li>
                  <li><strong>Komputer Digital:</strong> Mengolah data angka/logika. Contoh: Laptop, Kalkulator, Mesin ATM.</li>
                  <li><strong>Komputer Hybrid:</strong> Kombinasi keduanya. Contoh: Mesin di rumah sakit (EKG), Mesin Dispenser SPBU.</li>
               </ul>
             </div>

             <div class="materi-box">
               <span class="materi-title">2) Berdasarkan Penggunaannya</span>
               <ul class="item-list">
                  <li><strong>Special Purpose Computer:</strong> Untuk satu tujuan khusus. Contoh: Server, Router, Mikrokontroler.</li>
                  <li><strong>General Purpose Computer:</strong> Untuk berbagai tujuan umum. Contoh: Laptop, PC Desktop.</li>
               </ul>
             </div>

             <div class="materi-box">
               <span class="materi-title">3) Berdasarkan Kapasitas & Ukuran</span>
               <ul class="item-list">
                  <li><strong>Komputer Mikro:</strong> PC Desktop, Laptop.</li>
                  <li><strong>Komputer Mini:</strong> Komputer server menengah (IBM AS/400).</li>
                  <li><strong>Komputer Kecil:</strong> Small-scale mainframe.</li>
                  <li><strong>Komputer Menengah:</strong> Medium-scale mainframe.</li>
                  <li><strong>Komputer Besar:</strong> Mainframe (untuk sensus/perbankan besar).</li>
                  <li><strong>Komputer Super:</strong> Kecepatan proses sangat tinggi. Contoh: IBM ASCI White (simulasi nuklir).</li>
               </ul>
             </div>

             <div class="materi-box">
               <span class="materi-title">4) Berdasarkan Generasi</span>
               <ul class="item-list">
                  <li><strong>Generasi 1 (1940-1956):</strong> Tabung vakum, besar (ENIAC, EDVAC).</li>
                  <li><strong>Generasi 2 (1957-1963):</strong> Transistor (IBM 1401).</li>
                  <li><strong>Generasi 3 (1964-1971):</strong> Integrated Circuit/IC (CDC 1700).</li>
                  <li><strong>Generasi 4 (1972-sekarang):</strong> Mikroprosesor (IBM PC, Apple).</li>
                  <li><strong>Generasi 5:</strong> AI & masa depan (sedang dikembangkan).</li>
               </ul>
             </div>
          </div>
        </div>
      `
    },
    materi2: { 
      title: "Interaksi Manusia dan Komputer", 
      content: `
        <div class="intro-section">
            <h4>1. Konsep Dasar & Definisi</h4>
            <div class="materi-box">
                <p><strong>Human-Computer Interaction (HCI)</strong> atau interaksi manusia dan komputer adalah sebuah hubungan antara manusia dan komputer yang mempunyai karakteristik tertentu untuk mencapai suatu tujuan tertentu dengan menjalankan sistem yang disebut <strong>Interface (Antarmuka)</strong>.</p>
                <p>Tujuan utama dari antarmuka adalah:</p>
                <ul class="item-list">
                    <li>Menciptakan komunikasi yang efektif antara perangkat dan manusia.</li>
                    <li>Menutup atau menyembunyikan kerumitan/kompleksitas sistem agar mudah digunakan.</li>
                </ul>
            </div>

            <div class="materi-box">
                <span class="materi-title">Alur Proses Komunikasi</span>
                <p>Proses ini diawali dari unit <strong>Input</strong> (menggunakan perangkat input), masuk ke <strong>Unit Pemrosesan/CPU</strong>, lalu disimpan di <strong>Storage</strong>, dan berujung pada <strong>Output</strong> (layar atau print out).</p>
                <p>Pada proses ini akan menghasilkan sebuah <strong>Feedback (Umpan Balik)</strong> yang menjadi bentuk interaksi nyata. Jenis feedback dapat berupa:</p>
                <ul class="item-list">
                    <li>Kotak Dialog (Dialog Box).</li>
                    <li>Pesan sukses (sesuai).</li>
                    <li>Pesan <em>Error</em> (kesalahan).</li>
                </ul>
            </div>
            
            <div class="materi-box">
                <span class="materi-title">Ilmu Gabungan</span>
                <p>Dalam perkembangannya, HCI menjadi ilmu gabungan dari berbagai disiplin ilmu seperti <strong>Psikologi</strong>, <strong>Desain Grafis</strong>, <strong>Tipografi</strong>, dan <strong>Ergonomik</strong>. Hal ini bertujuan agar pengguna tidak hanya terampil, tetapi juga merasa nyaman saat menggunakan komputer.</p>
            </div>
        </div>

        <div style="margin-top:20px; border-top: 1px dashed #cbd5e1; padding-top:20px;">
            <div class="tab-nav">
                <button class="tab-btn active" onclick="switchTab(event, 'tabCLI')">CLI (Text)</button>
                <button class="tab-btn" onclick="switchTab(event, 'tabGUI')">GUI (Visual)</button>
                <button class="tab-btn" onclick="switchTab(event, 'tabBanding')">Perbedaan</button>
            </div>

            <!-- TAB CLI -->
            <div id="tabCLI" class="content-section active">
                <h4>2. Command Line Interface (CLI)</h4>
                <div class="materi-box">
                    <span class="materi-title">Definisi CLI</span>
                    <p>CLI merupakan jenis antarmuka berbasis teks. Pengguna mengetikkan perintah (<em>command</em>) tertentu lalu diakhiri dengan menekan tombol <strong>Enter</strong> pada keyboard. Aplikasi CLI pada Windows dikenal dengan nama <strong>Command Prompt (CMD)</strong> yang sudah ada sejak zaman MS-DOS.</p>
                </div>

                <div class="materi-box">
                    <span class="materi-title">Cara Mengakses CMD di Windows</span>
                    <ul class="item-list">
                        <li><strong>Cara 1:</strong> Buka kotak <em>Run</em> (kombinasi tombol Win + R), ketik "cmd" atau "CMD", lalu klik OK.</li>
                        <li><strong>Cara 2:</strong> Buka Start Menu -> Windows System -> Command Prompt.</li>
                        <li><strong>Cara 3:</strong> Gunakan fasilitas <em>Search</em>, ketik "cmd", lalu pilih Command Prompt.</li>
                    </ul>
                </div>

                <div class="materi-box">
                    <span class="materi-title">Contoh Perintah Dasar CLI</span>
                    <p>Tampilan awal CMD biasanya menunjukkan lokasi folder pengguna saat ini (misal: <code>C:\\Users\\NamaUser></code>). Berikut beberapa perintah dasar:</p>
                    <ul class="item-list">
                        <li><strong>dir</strong>: Menampilkan daftar direktori, file, dan folder yang ada di lokasi aktif.</li>
                        <li><strong>tree</strong>: Menampilkan struktur folder dan subfolder secara visual menyerupai pohon (tree) yang terhubung garis.</li>
                        <li><strong>help</strong>: Meminta bantuan informasi tentang perintah apa saja yang disediakan oleh CMD.</li>
                    </ul>
                </div>
            </div>

            <!-- TAB GUI -->
            <div id="tabGUI" class="content-section">
                <h4>3. Graphic User Interface (GUI)</h4>
                <div class="materi-box">
                    <span class="materi-title">Definisi GUI</span>
                    <p>GUI merupakan jenis interaksi pengguna dengan perangkat yang menggunakan kotak dialog secara visual. Interaksi dilakukan melalui gambar, ikon, jendela (window), dan menu.</p>
                </div>

                <div class="materi-box">
                    <span class="materi-title">Karakteristik & Interaksi</span>
                    <ul class="item-list">
                        <li>Menggunakan sentuhan lewat mouse, stylus (touch pen), atau jari pada layar sentuh.</li>
                        <li>Tampilan berupa grafik dan teks yang minimal.</li>
                        <li>Bersifat interaktif: pengguna hanya perlu mengeklik tampilan (ikon/menu) yang diinginkan.</li>
                        <li><strong>Contoh Populer:</strong> Microsoft Windows, MacOS (Apple), dan Android (Smartphone).</li>
                    </ul>
                </div>

                <div class="materi-box">
                    <span class="materi-title">Kelebihan & Kekurangan GUI</span>
                    <p><strong>Kelebihan:</strong> Lebih sederhana, mudah digunakan (user-friendly), secara visual menarik dan tidak membosankan. Sangat cocok bagi pemula karena mudah dipelajari (hanya klik ikon/dialog).</p>
                    <p><strong>Kekurangan:</strong> Tidak cocok untuk perangkat dengan spesifikasi rendah karena <strong>memakan memori (RAM) yang cukup besar</strong>. Kecepatan proses tampilan GUI sangat bergantung pada kemampuan hardware.</p>
                </div>
            </div>

            <!-- TAB PERBANDINGAN -->
            <div id="tabBanding" class="content-section">
                <h4>4. Perbedaan CLI dan GUI</h4>
                <div class="materi-box">
                    <p>Berikut adalah perbedaan mendasar dalam proses interaksi antara pengguna dan komputer melalui CLI dan GUI:</p>
                    <ul class="item-list">
                        <li><strong>Bentuk Perintah:</strong>
                            <br> - CLI: Perintah dalam bentuk teks (diketik).
                            <br> - GUI: Perintah dalam bentuk grafis/gambar (diklik).
                        </li>
                        <li><strong>Pemahaman Pengguna:</strong>
                            <br> - CLI: Pengguna <strong>harus memahami/menghafal</strong> sintaks perintah (misal: harus ketik "DIR" dengan benar, jika salah ketik maka error).
                            <br> - GUI: Tidak memerlukan pengetahuan mendalam tentang kode/sintaks, cukup memilih ikon.
                        </li>
                        <li><strong>Penggunaan Memori (Resource):</strong>
                            <br> - CLI: <strong>Tidak</strong> menggunakan banyak memori, sangat ringan.
                            <br> - GUI: Menggunakan memori yang <strong>cukup besar</strong> untuk merender visual.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      ` 
    },
    materi3: { 
      title: "Peran OS & Driver dalam Interaksi", 
      content: `
        <div class="intro-section">
            <h4>1. Pengertian Sistem Operasi</h4>
            <p><strong>Sistem Operasi (OS)</strong> adalah perangkat lunak yang berfungsi sebagai penghubung antara manusia dengan perangkat yang digunakan sehingga dapat berfungsi dengan baik. Saat komputer pertama kali dinyalakan (booting), komputer akan menjalankan sistem operasi terlebih dahulu sebelum aplikasi lain (seperti Word atau Browser) bisa berjalan.</p>
        </div>

        <div style="margin-top:20px; border-top: 1px dashed #cbd5e1; padding-top:20px;">
          <div class="tab-nav">
            <button class="tab-btn active" onclick="switchTab(event, 'tabFungsi')">Fungsi OS</button>
            <button class="tab-btn" onclick="switchTab(event, 'tabDriver')">Driver & Interaksi</button>
            <button class="tab-btn" onclick="switchTab(event, 'tabInstall')">Kategori & Instalasi</button>
          </div>

          <!-- TAB FUNGSI OS -->
          <div id="tabFungsi" class="content-section active">
            <h4>Fungsi Utama Sistem Operasi</h4>
            <div class="materi-box">
                <ul class="item-list">
                    <li><strong>a. Menjalankan Operasi Dasar:</strong> OS adalah perangkat lunak pertama yang harus diinstal. Tanpanya, aplikasi lain tidak bisa berjalan.</li>
                    <li><strong>b. Mengatur Kerja Hardware dan Software:</strong> OS berperan sebagai jembatan yang mengelola RAM, CPU, dan perangkat lain agar bekerja selaras.</li>
                    <li><strong>c. Wadah Program atau Aplikasi:</strong> Aplikasi "hidup" dan menyatu di dalam OS, tidak bisa berdiri sendiri.</li>
                    <li><strong>d. Menyajikan Tampilan:</strong> Menampilkan antarmuka (teks atau grafis) di layar monitor agar bisa dibaca pengguna.</li>
                    <li><strong>e. Mengkoordinasikan Kerja Perangkat:</strong> Menyederhanakan instruksi hardware yang kompleks agar aplikasi bisa bekerja lebih efisien.</li>
                    <li><strong>f. Mengoptimalkan Fungsi Perangkat:</strong> Mengatur waktu kerja CPU dan penyimpanan data di memori untuk kinerja terbaik.</li>
                    <li><strong>g. Mengawasi dan Melindungi:</strong> Memberikan hak akses (siapa yang boleh membuka file) dan menjaga keamanan sistem dari pengguna yang tidak berhak.</li>
                </ul>
            </div>
          </div>

          <!-- TAB DRIVER & INTERAKSI -->
          <div id="tabDriver" class="content-section">
            <h4>2. Driver dan Model Interaksi</h4>
            <div class="materi-box">
                <span class="materi-title">Apa itu Driver?</span>
                <p>Driver adalah <strong>software</strong> khusus yang bertugas mengontrol setiap hardware yang dipasang. Berbeda dengan aplikasi biasa, driver bersifat spesifik untuk menerjemahkan perintah OS agar dimengerti oleh hardware tertentu.</p>
            </div>
            
            <div class="materi-box">
                <span class="materi-title">Model Tingkatan Interaksi</span>
                <p>Bayangkan saat kamu mengeklik tombol "Print" di Microsoft Word. Prosesnya berlapis dari atas ke bawah:</p>
                <div style="background:#eff6ff; padding:15px; border-radius:8px; text-align:center; font-weight:bold; color:#1e3a8a; border:1px solid #bfdbfe;">
                    Pengguna (Klik Print) <br>⬇<br> 
                    Aplikasi (Word) <br>⬇<br> 
                    Sistem Operasi (Windows) <br>⬇<br> 
                    Driver (Printer Driver) <br>⬇<br> 
                    BIOS <br>⬇<br> 
                    Perangkat Keras (Printer mencetak)
                </div>
                <p style="margin-top:15px; font-size:0.9rem;"><em>Catatan:</em> Sistem operasi bekerja secara <strong>multitasking</strong> (mampu menjalankan banyak perintah sekaligus) dan memprioritaskan instruksi mana yang harus dikerjakan driver terlebih dahulu.</p>
            </div>
          </div>

          <!-- TAB KATEGORI & INSTALASI -->
          <div id="tabInstall" class="content-section">
             <h4>3. Kategori Perangkat & Instalasi</h4>
             <p>Tidak semua hardware membutuhkan instalasi driver manual. Sistem operasi modern biasanya sudah memiliki <em>driver generik</em> (bawaan).</p>
             
             <div class="materi-box">
                <span class="materi-title">Tabel Kebutuhan Driver</span>
                <table class="custom-table">
                    <tr>
                        <th width="50%">Tidak Perlu Driver Khusus (Biasanya langsung jalan)</th>
                        <th width="50%">Mungkin Perlu Driver Khusus</th>
                    </tr>
                    <tr>
                        <td>CPU, Harddisk, Motherboard, Keyboard, Mouse, Monitor, RAM, Speaker, UPS.</td>
                        <td>Modem, Network Card, Printer, Scanner, Sound Card, Bluetooth, VGA Card, Wi-Fi, Webcam.</td>
                    </tr>
                </table>
             </div>

             <div class="materi-box">
                <span class="materi-title">Proses Instalasi Driver</span>
                <p>Jika hardware tidak dikenali, kamu perlu menginstal driver secara manual. Caranya:</p>
                <ul class="item-list">
                    <li>Masukkan CD/DVD driver atau unduh dari website resmi.</li>
                    <li>Jalankan file instalasi dan ikuti petunjuk di layar (klik Install/Next).</li>
                    <li>Tunggu hingga selesai.</li>
                    <li>Lakukan <strong>Restart</strong> komputer agar driver bisa berfungsi sempurna.</li>
                </ul>
             </div>
          </div>
        </div>
      ` 
    }
  };

  const modal = document.getElementById('materiModal');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');

  function openModal(key) {
    const data = materials[key];
    if(data) {
        titleEl.innerText = data.title;
        bodyEl.innerHTML = data.content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        bodyEl.scrollTop = 0; 
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function switchTab(evt, tabName) {
    const wrapper = evt.target.closest('.modal-body-wrapper') || document; 
    wrapper.querySelectorAll('.content-section').forEach(c => c.classList.remove('active'));
    wrapper.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const targetContent = wrapper.querySelector('#' + tabName);
    if(targetContent) targetContent.classList.add('active');
    evt.currentTarget.classList.add('active');
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });