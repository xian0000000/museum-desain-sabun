/**
 * exhibit-styles.js — Konfigurasi gaya visual untuk setiap tipe pameran.
 *
 * ════════════════════════════════════════════════════════════════
 *  CARA TAMBAH TIPE BARU:
 *    1. Tambah entry baru di EXHIBIT_STYLES dengan key unik
 *    2. Set tag, borderColor, textColor sesuai tema
 *    3. Opsional: showLink:true (tombol URL) atau showMusic:true (tombol musik)
 *    4. Gunakan key tersebut sebagai field `style` di exhibits.js
 * ════════════════════════════════════════════════════════════════
 *
 * Tidak ada dependensi lain — file ini murni data konfigurasi.
 */

// ── Gaya per tipe pameran ────────────────────────────────────────────────────
export const EXHIBIT_STYLES = {

  // ── Lukisan / Paintings ───────────────────────────────────────────────────
  arduino: {
    tag:         "Arduino Project",
    borderColor: "#00ff88",
    textColor:   "#00cc66",
  },
  cuaca: {
    tag:         "Aplikasi Cuaca",
    borderColor: "#38bdf8",
    textColor:   "#7dd3fc",
  },
  detektif: {
    tag:         "Detektif Produktivitas",
    borderColor: "#e8b84b",
    textColor:   "#f5d278",
  },
  chatocean: {
    tag:         "Chat Ocean",
    borderColor: "#007bff",
    textColor:   "#4da6ff",
  },
  library: {
    tag:         "Perpustakaan Kuno",
    borderColor: "#2d6abf",
    textColor:   "#7eb8f7",
  },
  lifedashboard: {
    tag:         "Life Dashboard",
    borderColor: "#a855f7",
    textColor:   "#c084fc",
  },
  statistic: {
    tag:         "StatLab",
    borderColor: "#00e5c8",
    textColor:   "#00e5c8",
  },

  // ── Patung / Sculptures ───────────────────────────────────────────────────
  github: {
    tag:         "GitHub",
    borderColor: "#58a6ff",
    textColor:   "#58a6ff",
    showLink:    true,
  },
  linkedin: {
    tag:         "LinkedIn",
    borderColor: "#0ea5e9",
    textColor:   "#0ea5e9",
    showLink:    true,
  },
  music: {
    tag:         "Musik",
    borderColor: "#c8a050",
    textColor:   "#ffd060",
    showMusic:   true,
  },
  availability: {
    tag:         "Open to Work",
    borderColor: "#22c55e",
    textColor:   "#4ade80",
    showLink:    true,
  },
  stack: {
    tag:         "Tech Stack",
    borderColor: "#a78bfa",
    textColor:   "#c4b5fd",
  },
};

// Gaya fallback jika tipe tidak dikenali
export const DEFAULT_STYLE = {
  tag:         "Koleksi Tetap",
  borderColor: "#3a2e18",
  textColor:   "#5a4a28",
};
