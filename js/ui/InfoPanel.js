/**
 * InfoPanel.js — Panel info pameran yang muncul saat pemain mendekat.
 *
 * ════════════════════════════════════════════════════════════════
 *  CARA TAMBAH TIPE PAMERAN BARU:
 *    1. Tambah entry di js/config/exhibit-styles.js
 *    2. Set showLink:true jika ada URL, showMusic:true untuk musik
 *    3. File ini tidak perlu diubah
 * ════════════════════════════════════════════════════════════════
 *
 * Dependensi: DOM saja, EXHIBIT_STYLES dari config
 */

import { EXHIBIT_STYLES, DEFAULT_STYLE } from "../config/exhibit-styles.js";

export class InfoPanel {
  constructor() {
    this._el        = document.getElementById("panel");
    this._title     = document.getElementById("p-title");
    this._desc      = document.getElementById("p-desc");
    this._meta      = document.getElementById("p-meta");
    this._tag       = document.getElementById("p-tag");
    this._linkWrap  = document.getElementById("p-link-wrap");
    this._link      = document.getElementById("p-link");
    this._musicWrap = document.getElementById("p-music-wrap");
    this._musicBtn  = document.getElementById("p-music-btn");
    this._last      = null;

    this._bindEvents();
  }

  // ── Update loop — dipanggil tiap frame ───────────────────────

  update(camPos, exhibits) {
    let nearest = null, minDist = Infinity;
    for (const ex of exhibits) {
      const d = camPos.distanceTo(ex.position);
      if (d < ex.radius && d < minDist) { minDist = d; nearest = ex; }
    }
    if (nearest === this._last) return;
    this._last = nearest;
    nearest ? this._show(nearest.data) : this._hide();
  }

  // ── Private ──────────────────────────────────────────────────

  _bindEvents() {
    // Hover efek pada tombol link
    this._link.addEventListener("mouseenter", () => {
      this._link.style.background = "#c8a050";
      this._link.style.color      = "#080604";
    });
    this._link.addEventListener("mouseleave", () => {
      this._link.style.background = "transparent";
      this._link.style.color      = "#c8a050";
    });

    // Tombol musik → dispatch event ke app.js
    this._musicBtn.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("museum:music-toggle"));
    });

    // Sinkron state tombol musik dari luar
    document.addEventListener("museum:music-state", (e) => {
      this._syncMusicBtn(e.detail.playing);
    });
  }

  _show(data) {
    this._title.textContent = data.title;
    this._desc.textContent  = data.desc;
    this._meta.textContent  = `${data.artist} · ${data.year}`;
    this._applyStyle(data);
    this._el.classList.add("on");
  }

  _hide() {
    this._el.classList.remove("on");
  }

  _applyStyle(data) {
    const style = EXHIBIT_STYLES[data.style] ?? DEFAULT_STYLE;

    this._tag.textContent       = style.tag;
    this._tag.style.borderColor = style.borderColor;
    this._tag.style.color       = style.textColor;

    if (style.showMusic) {
      this._musicWrap.style.display = "block";
      this._linkWrap.style.display  = "none";
    } else if (style.showLink && data.url) {
      this._link.href               = data.url;
      this._linkWrap.style.display  = "block";
      this._musicWrap.style.display = "none";
    } else {
      this._linkWrap.style.display  = "none";
      this._musicWrap.style.display = "none";
    }
  }

  _syncMusicBtn(playing) {
    if (!this._musicBtn) return;
    this._musicBtn.textContent = playing ? "⏸  Pause Musik" : "▶  Putar Musik";
    this._musicBtn.classList.toggle("playing", playing);
  }
}
