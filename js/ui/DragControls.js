/**
 * DragControls.js — Kontrol kamera FPS tanpa pointer lock.
 *
 * Mendukung:
 *   - Drag mouse / touch (kanan layar) → putar pandangan
 *   - WASD / Arrow keys               → bergerak
 *   - Joystick virtual                → bergerak (mobile)
 *   - Batasan tabrakan dinding otomatis
 *
 * Dependensi: THREE (global), Joystick
 */

import { Joystick } from "./Joystick.js";

export class DragControls {
  /**
   * @param {THREE.PerspectiveCamera} camera
   * @param {HTMLCanvasElement}       canvas
   * @param {{ W: number, D: number }} roomSize
   */
  constructor(camera, canvas, roomSize) {
    this._cam      = camera;
    this._yaw      = Math.PI;
    this._pitch    = 0;
    this._dragging = false;
    this._lx       = 0;
    this._ly       = 0;
    this._keys     = new Set();
    this._halfW    = roomSize.W / 2 - 0.65;
    this._halfD    = roomSize.D / 2 - 0.65;

    this._joystick = new Joystick();

    this._initMouse(canvas);
    this._initTouch(canvas);
    this._initKeyboard();
  }

  _initMouse(canvas) {
    canvas.addEventListener("mousedown", (e) => {
      this._dragging = true;
      this._lx = e.clientX;
      this._ly = e.clientY;
      canvas.classList.add("dragging");
    });
    window.addEventListener("mouseup", () => {
      this._dragging = false;
      canvas.classList.remove("dragging");
    });
    window.addEventListener("mousemove", (e) => {
      if (!this._dragging) return;
      this._yaw   -= (e.clientX - this._lx) * 0.003;
      this._pitch -= (e.clientY - this._ly) * 0.003;
      this._pitch  = Math.max(-1.0, Math.min(1.0, this._pitch));
      this._lx = e.clientX;
      this._ly = e.clientY;
    });
  }

  _initTouch(canvas) {
    // Touch ID khusus untuk kamera — terpisah dari joystick
    this._camTouchId = null;

    canvas.addEventListener("touchstart", (e) => {
      // Cari touch yang BUKAN di area joystick (kiri bawah 160x160px)
      for (const t of e.changedTouches) {
        const isJoystickArea = t.clientX < 160 && t.clientY > window.innerHeight - 160;
        if (!isJoystickArea && this._camTouchId === null) {
          this._camTouchId = t.identifier;
          this._dragging   = true;
          this._lx = t.clientX;
          this._ly = t.clientY;
          break;
        }
      }
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === this._camTouchId) {
          this._camTouchId = null;
          this._dragging   = false;
        }
      }
    });

    window.addEventListener("touchcancel", (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === this._camTouchId) {
          this._camTouchId = null;
          this._dragging   = false;
        }
      }
    });

    window.addEventListener("touchmove", (e) => {
      if (!this._dragging) return;
      for (const t of e.changedTouches) {
        if (t.identifier === this._camTouchId) {
          this._yaw   -= (t.clientX - this._lx) * 0.003;
          this._pitch -= (t.clientY - this._ly) * 0.003;
          this._pitch  = Math.max(-1.0, Math.min(1.0, this._pitch));
          this._lx = t.clientX;
          this._ly = t.clientY;
          break;
        }
      }
    }, { passive: true });
  }

  _initKeyboard() {
    window.addEventListener("keydown", (e) => {
      this._keys.add(e.code);
      if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
    });
    window.addEventListener("keyup", (e) => this._keys.delete(e.code));
  }

  update(dt) {
    const speed   = 4.5 * dt;
    const allKeys = new Set([...this._keys, ...this._joystick.keys]);

    const forward = new THREE.Vector3(-Math.sin(this._yaw), 0, -Math.cos(this._yaw));
    const right   = new THREE.Vector3( Math.cos(this._yaw), 0, -Math.sin(this._yaw));

    if (allKeys.has("KeyW") || allKeys.has("ArrowUp"))
      this._cam.position.addScaledVector(forward,  speed);
    if (allKeys.has("KeyS") || allKeys.has("ArrowDown"))
      this._cam.position.addScaledVector(forward, -speed);
    if (allKeys.has("KeyA") || allKeys.has("ArrowLeft"))
      this._cam.position.addScaledVector(right, -speed);
    if (allKeys.has("KeyD") || allKeys.has("ArrowRight"))
      this._cam.position.addScaledVector(right,  speed);

    this._cam.position.x = Math.max(-this._halfW, Math.min(this._halfW, this._cam.position.x));
    this._cam.position.z = Math.max(-this._halfD, Math.min(this._halfD, this._cam.position.z));
    this._cam.position.y = 1.7;

    this._cam.rotation.order = "YXZ";
    this._cam.rotation.y     = this._yaw;
    this._cam.rotation.x     = this._pitch;
  }
}
