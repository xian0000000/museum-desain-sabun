/**
 * MusicPlayer.js — HTML5 Audio player untuk museum.
 *
 * Menggantikan YouTube IFrame API dengan <audio> tag biasa,
 * sehingga bisa memutar file MP3 lokal tanpa bergantung embed YouTube.
 *
 * Cara pakai:
 *   1. Letakkan file MP3 kamu di folder: music/lagu.mp3
 *   2. Di app.js, ganti pemanggilan menjadi:
 *      this._musicPlayer = new MusicPlayer("music/lagu.mp3");
 *
 * Dependensi: DOM saja, tidak butuh library eksternal.
 */

export class MusicPlayer {
  constructor(src) {
    this._src       = src;
    this._audio     = null;
    this._playing   = false;
    this._ready     = false;
    this._callbacks = [];

    this._initAudio();
    this._setBtn("ready");
  }

  // ── Audio setup ──────────────────────────────────────────────

  _initAudio() {
    this._audio = new Audio(this._src);
    this._audio.loop   = true;   // putar berulang otomatis
    this._audio.volume = 0.6;    // volume default 60%, bisa diubah

    this._audio.addEventListener("canplaythrough", () => {
      this._ready = true;
      this._setBtn("ready");
    });

    this._audio.addEventListener("play", () => {
      this._playing = true;
      this._setBtn("ready");
      this._callbacks.forEach(fn => fn(true));
    });

    this._audio.addEventListener("pause", () => {
      this._playing = false;
      this._setBtn("ready");
      this._callbacks.forEach(fn => fn(false));
    });

    this._audio.addEventListener("ended", () => {
      // Tidak akan terjadi karena loop=true, tapi jaga-jaga
      this._playing = false;
      this._setBtn("ready");
      this._callbacks.forEach(fn => fn(false));
    });

    this._audio.addEventListener("error", () => {
      console.warn("MusicPlayer: gagal memuat file audio →", this._src);
      this._showLoadError();
    });

    // Preload
    this._audio.load();
  }

  // ── Button state helper ──────────────────────────────────────

  _setBtn(phase) {
    const btn = document.getElementById("p-music-btn");
    if (!btn) return;
    if (phase === "loading") {
      btn.textContent = "⏳  Memuat…";
      btn.disabled    = true;
      btn.classList.remove("playing");
    } else {
      btn.disabled    = false;
      btn.textContent = this._playing ? "⏸  Pause Musik" : "▶  Putar Musik";
    }
  }

  // ── Error helper ─────────────────────────────────────────────

  _showLoadError() {
    const desc = document.getElementById("p-desc");
    if (desc) {
      const orig = desc.textContent;
      desc.textContent = "❌ File musik tidak ditemukan. Pastikan file MP3 ada di folder music/.";
      setTimeout(() => { desc.textContent = orig; }, 5000);
    }
  }

  // ── API publik ───────────────────────────────────────────────

  toggle() {
    if (!this._audio) return;

    if (this._playing) {
      this._audio.pause();
    } else {
      // play() mengembalikan Promise — tangkap error autoplay policy browser
      this._audio.play().catch(err => {
        console.warn("MusicPlayer: autoplay diblokir browser →", err);
      });
    }
  }

  stop() {
    if (!this._audio) return;
    this._audio.pause();
    this._audio.currentTime = 0;
  }

  get isPlaying() { return this._playing; }
  onStateChange(fn) { this._callbacks.push(fn); }
}
