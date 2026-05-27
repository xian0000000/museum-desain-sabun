/**
 * MusicVisualizer.js — Visualizer audio 3D yang mengelilingi patung musik.
 *
 * Terdiri dari:
 *   · 20 batang equalizer (BoxGeometry) melingkar di sekitar pedestal
 *   · 3 cincin gelombang (TorusGeometry) yang mengembang keluar
 *   · 100 partikel bintang yang berputar dan melayang ke atas
 *   · 1 PointLight yang berdenyut mengikuti "beat"
 *
 * Semua elemen start opacity=0, animate ke aktif saat setPlaying(true).
 * Karena YouTube CORS tidak memberi data audio asli, amplitudo
 * disimulasikan dari kombinasi sin waves frekuensi berbeda.
 *
 * Dependensi: THREE (global)
 */

export class MusicVisualizer {
  /**
   * @param {THREE.Scene}   scene
   * @param {THREE.Vector3} basePos – posisi XZ pedestal (Y diabaikan, pakai 0)
   */
  constructor(scene, basePos) {
    this._playing = false;
    this._group   = new THREE.Group();
    this._group.position.set(basePos.x, 0, basePos.z);
    scene.add(this._group);

    this._bars       = [];
    this._rings      = [];
    this._particles  = null;
    this._beatLight  = null;

    this._buildBars();
    this._buildRings();
    this._buildParticles();
    this._buildBeatLight();
  }

  // ── Konstruksi ───────────────────────────────────────────────

  _buildBars() {
    const N = 20, R = 1.06;
    // Simulasi N frekuensi band — kombinasi sin untuk variasi acak
    const FREQS = [2.1,3.4,1.8,4.2,2.7,1.3,3.8,2.5,4.6,1.6,
                   3.1,2.2,4.9,1.9,3.6,2.4,1.4,4.0,2.9,3.3];
    for (let i = 0; i < N; i++) {
      const a    = (i / N) * Math.PI * 2;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.055, 1.0, 0.055),
        new THREE.MeshLambertMaterial({
          color:       0xc8a050,
          emissive:    new THREE.Color(0x8a5c10),
          emissiveIntensity: 0.4,
          transparent: true,
          opacity:     0,
        }),
      );
      mesh.position.set(Math.cos(a) * R, 0.1, Math.sin(a) * R);
      mesh.scale.y  = 0.05;
      mesh._phase   = (i / N) * Math.PI * 6;
      mesh._freq    = FREQS[i];
      this._bars.push(mesh);
      this._group.add(mesh);
    }
  }

  _buildRings() {
    const COLORS = [0xc8a050, 0xffd060, 0xe8b030];
    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.75, 0.013, 8, 80),
        new THREE.MeshBasicMaterial({ color: COLORS[i], transparent: true, opacity: 0 }),
      );
      mesh.rotation.x = Math.PI / 2;
      mesh._startPhase = i * (Math.PI * 2 / 3);  // 3 ring → 120° versatz
      mesh._speed      = 0.50 + i * 0.08;
      this._rings.push(mesh);
      this._group.add(mesh);
    }
  }

  _buildParticles() {
    const N   = 100;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    this._pData = [];
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.45 + Math.random() * 1.5;
      const y = Math.random() * 3.0;
      pos[i * 3]     = Math.cos(a) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(a) * r;
      this._pData.push({
        a, r,
        angV:   (0.25 + Math.random() * 0.45) * (Math.random() > .5 ? 1 : -1),
        riseV:  0.012 + Math.random() * 0.022,
        maxY:   2.6 + Math.random() * 1.0,
      });
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this._particles = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffe060, size: 0.048, transparent: true, opacity: 0,
    }));
    this._group.add(this._particles);
  }

  _buildBeatLight() {
    this._beatLight = new THREE.PointLight(0xc8a050, 0, 5.5);
    this._beatLight.position.set(0, 2.6, 0);
    this._group.add(this._beatLight);
  }

  // ── API publik ───────────────────────────────────────────────

  setPlaying(v) { this._playing = v; }

  /** Panggil setiap frame — t = THREE.Clock.elapsedTime */
  update(t) {
    this._updateBars(t);
    this._updateRings(t);
    this._updateParticles(t);
    this._updateBeatLight(t);
  }

  // ── Update internal ─────────────────────────────────────────

  _updateBars(t) {
    this._bars.forEach((bar) => {
      // Amplitudo simulasi: 2 sin wave berbeda frekuensi dijumlah
      const amp = this._playing
        ? Math.abs(Math.sin(t * bar._freq + bar._phase) * 0.5
            + Math.sin(t * bar._freq * 1.7 + bar._phase * 0.5) * 0.35) + 0.12
        : 0.04;

      bar.scale.y    += (amp - bar.scale.y) * 0.20;
      bar.position.y  = bar.scale.y * 0.5 + 0.05;

      const opTarget  = this._playing
        ? 0.45 + Math.abs(Math.sin(t * bar._freq + bar._phase)) * 0.45
        : 0;
      bar.material.opacity += (opTarget - bar.material.opacity) * 0.14;
    });
  }

  _updateRings(t) {
    this._rings.forEach((ring) => {
      // Progres 0→1 berbasis waktu, loop terus
      const prog  = ((t * ring._speed + ring._startPhase) % (Math.PI * 2)) / (Math.PI * 2);
      const sc    = 1.0 + prog * 1.35;
      const opMax = this._playing ? 0.55 : 0;
      // Fade in → fade out sepanjang siklus
      const op    = opMax * (prog < 0.3 ? prog / 0.3 : (1 - prog) / 0.7);

      ring.scale.setScalar(ring.scale.x + (sc - ring.scale.x) * 0.15);
      ring.material.opacity += (op - ring.material.opacity) * 0.12;
      ring.position.y = 0.04 + prog * 0.25;
    });
  }

  _updateParticles(t) {
    const opTarget = this._playing ? 0.80 : 0;
    this._particles.material.opacity += (opTarget - this._particles.material.opacity) * 0.08;

    if (this._playing) {
      const pos = this._particles.geometry.attributes.position;
      this._pData.forEach((p, i) => {
        p.a              += p.angV * 0.012;
        const y           = pos.array[i * 3 + 1] + p.riseV;
        pos.array[i * 3]     = Math.cos(p.a) * p.r;
        pos.array[i * 3 + 1] = y > p.maxY ? 0 : y;
        pos.array[i * 3 + 2] = Math.sin(p.a) * p.r;
      });
      pos.needsUpdate = true;
    }
  }

  _updateBeatLight(t) {
    const target = this._playing
      ? 1.4 + Math.sin(t * 4.2) * 0.6 + Math.sin(t * 2.1) * 0.3
      : 0;
    this._beatLight.intensity += (target - this._beatLight.intensity) * 0.12;
  }
}
