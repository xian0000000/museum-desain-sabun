/**
 * MusicPlayer.js — Wrapper YouTube IFrame API untuk museum.
 *
 * BUG FIX: toggle() sebelumnya langsung window.open() kalau API
 * belum siap — ini penyebab tab YouTube terbuka.
 *
 * Sekarang:
 *   · Saat toggle() dipanggil sebelum API ready → simpan _pendingPlay=true
 *   · Saat onReady() dipicu → jika _pendingPlay → langsung playVideo()
 *   · window.open() hanya jika API error permanen (bukan belum siap)
 *   · Tombol dinonaktifkan + teks "Memuat..." selama API belum siap
 *
 * Dependensi: DOM, YouTube IFrame API
 */

export class MusicPlayer {
  constructor(videoId) {
    this._videoId     = videoId;
    this._player      = null;
    this._ready       = false;
    this._playing     = false;
    this._pendingPlay = false;   // ← antrian play sebelum API siap
    this._error       = false;
    this._callbacks   = [];

    this._initDOM();
    this._loadAPI();
  }

  // ── DOM ─────────────────────────────────────────────────────

  _initDOM() {
    const wrap = document.createElement("div");
    wrap.id    = "yt-player-wrap";
    // Benar-benar tersembunyi — width/height 1px agar browser tidak skip
    wrap.style.cssText =
      "position:fixed;width:1px;height:1px;bottom:0;right:0;" +
      "opacity:0;pointer-events:none;overflow:hidden;z-index:-1";
    wrap.innerHTML = '<div id="yt-iframe-target"></div>';
    document.body.appendChild(wrap);
  }

  // ── YouTube IFrame API ──────────────────────────────────────

  _loadAPI() {
    window.onYouTubeIframeAPIReady = () => this._createPlayer();

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement("script");
      s.src   = "https://www.youtube.com/iframe_api";
      // Tidak async agar callback tidak race dengan user click
      document.head.appendChild(s);
    } else {
      // API sudah ada di DOM (mis. hot reload) — buat player langsung
      if (window.YT && window.YT.Player) this._createPlayer();
    }
  }

  _createPlayer() {
    this._player = new YT.Player("yt-iframe-target", {
      videoId:    this._videoId,
      width:      1,
      height:     1,
      playerVars: {
        autoplay:       0,
        controls:       0,
        disablekb:      1,
        fs:             0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel:            0,
        playsinline:    1,
        origin:         location.origin,
      },
      events: {
        onReady: () => {
          this._ready = true;
          this._setBtn("ready");
          // Jalankan play yang sempat diantri
          if (this._pendingPlay) {
            this._pendingPlay = false;
            this._player.playVideo();
          }
        },
        onStateChange: (e) => this._onState(e.data),
        onError: (e) => {
          // Error code 2/100/101/150 = video tidak bisa diputar via embed
          console.warn("YT Player error", e.data);
          this._error = true;
          this._ready = false;
          this._setBtn("ready");
        },
      },
    });
  }

  // ── State ───────────────────────────────────────────────────

  _onState(state) {
    // 1=PLAYING 2=PAUSED 0=ENDED 3=BUFFERING 5=CUED
    const was     = this._playing;
    this._playing = (state === 1 || state === 3);
    if (was !== this._playing) {
      this._callbacks.forEach(fn => fn(this._playing));
    }
    if (state === 0) {
      // Video selesai → emit stop
      this._playing = false;
      this._callbacks.forEach(fn => fn(false));
    }
  }

  // ── Button state helper ─────────────────────────────────────

  _setBtn(phase) {
    const btn = document.getElementById("p-music-btn");
    if (!btn) return;
    if (phase === "loading") {
      btn.textContent = "⏳  Memuat…";
      btn.disabled    = true;
      btn.classList.remove("playing");
    } else {
      btn.disabled = false;
      btn.textContent = this._playing ? "⏸  Pause Musik" : "▶  Putar Musik";
    }
  }

  // ── API publik ──────────────────────────────────────────────

  toggle() {
    if (this._error) {
      // Error permanen — tidak bisa embed, tapi JANGAN buka tab otomatis
      // Tampilkan notif di panel saja
      this._showEmbedError();
      return;
    }

    if (!this._ready || !this._player) {
      // API belum siap — antri, jangan buka YouTube
      this._pendingPlay = !this._pendingPlay;
      this._setBtn("loading");
      return;
    }

    if (this._playing) {
      this._player.pauseVideo();
    } else {
      this._player.playVideo();
    }
  }

  _showEmbedError() {
    const desc = document.getElementById("p-desc");
    if (desc) {
      const orig = desc.textContent;
      desc.textContent = "Video tidak bisa diputar via embed. Coba buka langsung di YouTube.";
      setTimeout(() => { desc.textContent = orig; }, 4000);
    }
  }

  stop() {
    if (this._ready && this._player) this._player.stopVideo();
  }

  get isPlaying() { return this._playing; }
  onStateChange(fn) { this._callbacks.push(fn); }
}
