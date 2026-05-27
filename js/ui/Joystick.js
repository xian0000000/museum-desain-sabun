/**
 * Joystick.js — Virtual joystick untuk kontrol gerak di mobile.
 *
 * Fitur:
 *   - Base lingkaran transparan (fixed)
 *   - Knob yang bisa diseret dalam radius tertentu
 *   - Normalisasi vektor arah → set virtual key (ArrowUp/Down/Left/Right)
 *   - Auto-reset knob ke tengah saat jari diangkat
 *   - Threshold deadzone agar tidak terlalu sensitif
 *   - Hanya muncul di perangkat touch (hidden di desktop dengan pointer)
 *
 * Integrasi:
 *   const joy = new Joystick();
 *   // Di loop update:
 *   const { x, y } = joy.getVector(); // -1..1
 *   // Atau pakai virtual keys yang sudah di-set:
 *   joy.keys  // Set<string> berisi "ArrowUp" / "ArrowDown" / dll
 *
 * Dependensi: DOM saja (tidak butuh Three.js)
 */

/** Deadzone — minimal pergerakan sebelum dianggap input (0..1) */
const DEADZONE = 0.18;

export class Joystick {
  constructor() {
    this._active  = false;
    this._ox      = 0;   // origin touch X
    this._oy      = 0;   // origin touch Y
    this._dx      = 0;   // delta X (knob displacement)
    this._dy      = 0;   // delta Y (knob displacement)
    this._vx      = 0;   // normalized vector X (-1..1)
    this._vy      = 0;   // normalized vector Y (-1..1)

    /** Set virtual key yang sedang aktif — dibaca oleh DragControls */
    this.keys = new Set();

    this._createDOM();
    this._bind();
  }

  // ── DOM ────────────────────────────────────────────────────────

  _createDOM() {
    // Base
    this._base = document.createElement("div");
    this._base.id = "joystick-base";
    this._base.innerHTML = `
      <div id="joystick-ring"></div>
      <div id="joystick-knob"></div>
    `;
    const wrap = document.getElementById('joystick-wrap') || document.body;
    wrap.appendChild(this._base);

    this._ring = document.getElementById("joystick-ring");
    this._knob = document.getElementById("joystick-knob");
  }

  // ── Events ─────────────────────────────────────────────────────

  _bind() {
    const base = this._base;

    base.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      this._touchId = t.identifier;
      this._ox = t.clientX;
      this._oy = t.clientY;
      this._active = true;
      this._base.classList.add("active");
    }, { passive: false });

    window.addEventListener("touchmove", (e) => {
      if (!this._active) return;
      const t = [...e.changedTouches].find(t => t.identifier === this._touchId);
      if (!t) return;

      const RADIUS = 52; // pixel — radius maksimal knob dari pusat
      let dx = t.clientX - this._ox;
      let dy = t.clientY - this._oy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Clamp ke radius
      if (dist > RADIUS) {
        dx = (dx / dist) * RADIUS;
        dy = (dy / dist) * RADIUS;
      }

      this._dx = dx;
      this._dy = dy;
      this._vx = dx / RADIUS;
      this._vy = dy / RADIUS;

      // Posisi knob visual
      this._knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

      this._updateKeys();
    }, { passive: true });

    const release = () => {
      if (!this._active) return;
      this._active = false;
      this._dx = 0; this._dy = 0;
      this._vx = 0; this._vy = 0;
      this._knob.style.transform = "translate(-50%, -50%)";
      this._base.classList.remove("active");
      this.keys.clear();
    };

    window.addEventListener("touchend",    release);
    window.addEventListener("touchcancel", release);
  }

  // ── Logika arah ────────────────────────────────────────────────

  _updateKeys() {
    this.keys.clear();
    const { _vx: vx, _vy: vy } = this;

    if (vy < -DEADZONE) this.keys.add("ArrowUp");
    if (vy >  DEADZONE) this.keys.add("ArrowDown");
    if (vx < -DEADZONE) this.keys.add("ArrowLeft");
    if (vx >  DEADZONE) this.keys.add("ArrowRight");
  }

  // ── API publik ─────────────────────────────────────────────────

  /** Kembalikan vektor arah yang dinormalisasi { x, y } */
  getVector() {
    return { x: this._vx, y: this._vy };
  }
}
