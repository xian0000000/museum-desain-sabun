/**
 * exhibits.js — Data seluruh pameran museum.
 *
 * ════════════════════════════════════════════════════════════════
 *  CARA TAMBAH PAMERAN BARU:
 *
 *  Lukisan (painting):
 *    1. Tambah objek baru ke array EXHIBITS dengan type:"painting"
 *    2. Set style ke salah satu key di exhibit-styles.js
 *       (atau tambah key baru di sana jika perlu gaya baru)
 *    3. Isi title, artist, year, desc, dan colors (array 2-4 hex)
 *    4. Posisi di denah diatur dari PAINTING_LAYOUT di app.js
 *
 *  Patung (sculpture):
 *    1. Tambah objek baru ke array EXHIBITS dengan type:"sculpture"
 *    2. Set icon (emoji/teks), bg (warna latar), accent (warna aksen)
 *    3. Set url jika ada link yang mau dibuka
 *    4. Tambah posisi baru di SCULPTURE_POSITIONS di app.js
 *
 * ════════════════════════════════════════════════════════════════
 *
 * ── Layout lukisan (diatur di app.js → PAINTING_LAYOUT) ────────
 *  [0-2]  Dinding Utara   (3 slot)
 *  [3-4]  Dinding Timur   (2 slot, zona utara)
 *  [5-6]  Dinding Barat   (2 slot)
 *
 * ── Catatan ────────────────────────────────────────────────────
 *  - Semua lukisan menggunakan tekstur canvas prosedural (dari `colors`)
 *  - Patung menggunakan canvas texture dari icon + bg + accent
 * ════════════════════════════════════════════════════════════════
 */

export const EXHIBITS = [

  // ══════════════════════════════════════════════════════════════
  //  LUKISAN (type: "painting")
  //  Urutan = indeks layout di PAINTING_LAYOUT (app.js)
  // ══════════════════════════════════════════════════════════════

  // ── [0-2] Dinding Utara ────────────────────────────────────
  {
    type:   "painting",
    style:  "arduino",
    title:  "Mobil Radar Pendeteksi Suhu",
    artist: "Xina",
    year:   "2026",
    desc:   "Proyek Arduino: mobil pintar berbasis sensor ultrasonik & suhu DHT. Deteksi objek + monitoring suhu real-time via Tinkercad.",
    colors: ["#0a1a0a", "#003300", "#00aa44", "#00ff88"],
  },
  {
    type:   "painting",
    style:  "cuaca",
    title:  "Perkiraan Cuaca Bekasi",
    artist: "Xina",
    year:   "2026",
    desc:   "Aplikasi cuaca real-time untuk Kota Bekasi — tampilkan suhu, kelembaban, dan prakiraan harian.",
    colors: ["#0a1628", "#1a3a6b", "#38bdf8", "#7dd3fc"],
  },
  {
    type:   "painting",
    style:  "detektif",
    title:  "Detektif Produktivitas",
    artist: "Xina",
    year:   "2026",
    desc:   "Lacak dan analisis produktivitasmu layaknya seorang detektif — temukan kebiasaan tersembunyi, pecahkan kasus prokrastinasi.",
    colors: ["#0d0d0d", "#1a1a2e", "#c8a050", "#f0d080"],
  },

  // ── [3-4] Dinding Timur ────────────────────────────────────
  {
    type:   "painting",
    style:  "chatocean",
    title:  "Chat Ocean",
    artist: "Xina",
    year:   "2026",
    desc:   "Platform obrolan inovatif berbasis web.",
    colors: ["#007bff", "#0056b3", "#003366", "#001133"],
  },
  {
    type:   "painting",
    style:  "library",
    title:  "Perpustakaan Kuno",
    artist: "Xina",
    year:   "2026",
    desc:   "Koleksi buku, artikel, dan referensi digital.",
    colors: ["#0a1628", "#1a3a6b", "#2d6abf", "#7eb8f7"],
  },

  // ── [5-6] Dinding Barat ────────────────────────────────────
  {
    type:   "painting",
    style:  "lifedashboard",
    title:  "Life Dashboard",
    artist: "Xina",
    year:   "2026",
    desc:   "Dashboard kehidupan interaktif — pantau kebiasaan, target, dan progres harianmu.",
    colors: ["#0a0f1e", "#0d2137", "#7c3aed", "#a855f7"],
  },
  {
    type:   "painting",
    style:  "statistic",
    title:  "StatLab",
    artist: "Xina",
    year:   "2026",
    desc:   "Platform analisis statistik interaktif — riset, lab, dan keuangan.",
    colors: ["#0a1628", "#0d2137", "#00e5c8", "#00aaf5"],
  },

  // ══════════════════════════════════════════════════════════════
  //  PATUNG (type: "sculpture")
  //  Urutan = indeks posisi di SCULPTURE_POSITIONS (app.js)
  // ══════════════════════════════════════════════════════════════

  {
    type:   "sculpture",
    style:  "github",
    title:  "GitHub",
    artist: "Xina",
    year:   "2026",
    desc:   "Lihat semua proyek dan kontribusi open source. Kunjungi profil GitHub.",
    icon:   "</>",
    bg:     "#0d1117",
    accent: "#58a6ff",
    url:    "https://github.com/xian0000000",
  },
  {
    type:   "sculpture",
    style:  "linkedin",
    title:  "LinkedIn",
    artist: "Xina",
    year:   "2026",
    desc:   "Terhubung secara profesional. Kunjungi profil LinkedIn.",
    icon:   "in",
    bg:     "#08121f",
    accent: "#0ea5e9",
    url:    "https://www.linkedin.com/in/afriansyah-saputro-5638b7362",
  },
  {
    type:   "sculpture",
    style:  "music",
    title:  "Music",
    artist: "Xina",
    year:   "2026",
    desc:   "Putar musik museum dan nikmati visualizer audio 3D yang mengelilingi patung.",
    icon:   "\u266a",
    bg:     "#0e0a04",
    accent: "#c8a050",
    videoId: "5uDY6hEYfPc",
    url:    "https://youtu.be/5uDY6hEYfPc",
  },
  {
    type:   "sculpture",
    style:  "availability",
    title:  "Open to Work",
    artist: "Xina",
    year:   "2026",
    desc:   "Sedang mencari peluang baru — full-time, freelance, atau kolaborasi. Klik untuk kirim email.",
    icon:   "\u26a1",
    bg:     "#0a1a0a",
    accent: "#22c55e",
    url:    "mailto:afriansyahs235@gmail.com",
  },
  {
    type:   "sculpture",
    style:  "stack",
    title:  "Tech Stack",
    artist: "Xina",
    year:   "2026",
    desc:   "",
    icon:   "{ }",
    bg:     "#0f0a1e",
    accent: "#a78bfa",
  },

// ── Galeri Foto ────────────────────────────────────────────
  { type:"painting", style:"gallery", title:"Foto I",  artist:"Nama", year:"2026",
    desc:"Deskripsi foto.", colors:["#111","#222","#888","#aaa"],
    png:"screenshots/bg.png" },  // ← taruh file gambar di folder root (sama dengan index.html)

  { type:"painting", style:"gallery", title:"Foto II", artist:"Nama", year:"2026",
    desc:"Deskripsi foto.", colors:["#111","#222","#888","#aaa"],
    png:"foto2.jpg" },
];
