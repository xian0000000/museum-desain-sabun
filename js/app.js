/**
 * app.js — Entry point Museum 3D.
 *
 * ════════════════════════════════════════════════════════════════
 *  DENAH MUSEUM (top-view, sumbu Z positif = selatan)
 * ════════════════════════════════════════════════════════════════
 *
 *  z=-14  ╔══[P0 Arduino]═[P1 Cuaca]═[P2 Detektif]══╗
 *         ║          Galeri Utara                     ║
 *  z=-8   ║ [P5 Life Dash]     [P3 Chat Ocean]       ║  ← barat & timur
 *         ║                                           ║
 *         ║   ◻ GitHub      ◻ LinkedIn               ║
 *  z=-0.5 ║         ◻ Music ♪                        ║
 *         ║                                           ║
 *  z= 3   ║ [P6 StatLab]       [P4 Perpustakaan]    ║  ← barat & timur
 *         ║                                           ║
 *  z=+11  ║    [PAPAN SELAMAT DATANG]                ║
 *  z=+12  ║  ◻ Open to Work    ◻ Tech Stack          ║
 *  z=+14  ╚═══════════════════════════════════════════╝
 *
 *  Kamera start: (0, 1.7, 10) → menghadap utara (-z)
 * ════════════════════════════════════════════════════════════════
 *
 * ── Cara tambah pameran baru ────────────────────────────────────
 *  Lukisan : edit EXHIBITS (exhibits.js) + PAINTING_LAYOUT (bawah)
 *  Patung  : edit EXHIBITS (exhibits.js) + SCULPTURE_POSITIONS (bawah)
 *  Gaya UI : edit js/config/exhibit-styles.js
 * ════════════════════════════════════════════════════════════════
 */

import { EXHIBITS }          from "./data/exhibits.js";
import { buildMuseum, ROOM } from "./engine/Museum.js";
import { buildLighting }     from "./engine/Lighting.js";
import { createPainting }    from "./engine/Painting.js";
import { createSculpture }   from "./engine/Sculpture.js";
import { createWelcomeBoard} from "./engine/WelcomeBoard.js";
import { createMapBoard }    from "./engine/MapBoard.js";
import { MusicVisualizer }   from "./engine/MusicVisualizer.js";
import { InfoPanel }         from "./ui/InfoPanel.js";
import { DragControls }      from "./ui/DragControls.js";
import { runLoadingScreen, preWarmRenderer } from "./ui/LoadingScreen.js";
import { MusicPlayer }       from "./ui/MusicPlayer.js";

// ════════════════════════════════════════════════════════════════
//  KONSTANTA RUANGAN
// ════════════════════════════════════════════════════════════════

const { W, D } = ROOM;                    // W=22, D=28

const WALL = {
  N: -(D / 2) + 0.30,   // z = -13.70
  S:  (D / 2) - 0.30,   // z = +13.70
  E:  (W / 2) - 0.30,   // x = +10.70
  W: -(W / 2) + 0.30,   // x = -10.70
};

const FRAME_Y   = 2.65;   // ketinggian bingkai standar (eye-level)

// ════════════════════════════════════════════════════════════════
//  LAYOUT LUKISAN
//  idx = indeks dalam array paintings (EXHIBITS filtered type==="painting")
//  Untuk tambah lukisan: tambah slot baru di sini + data di exhibits.js
// ════════════════════════════════════════════════════════════════

const PAINTING_LAYOUT = [
  // Dinding Utara (3 bingkai)
  { idx: 0, pos: [-5.5, FRAME_Y, WALL.N], rotY: 0,            w: 3.0, h: 2.2 },
  { idx: 1, pos: [   0, FRAME_Y, WALL.N], rotY: 0,            w: 3.4, h: 2.4 },
  { idx: 2, pos: [ 5.5, FRAME_Y, WALL.N], rotY: 0,            w: 3.0, h: 2.2 },

  // Dinding Timur (2 bingkai, zona utara)
  { idx: 3, pos: [WALL.E, FRAME_Y, -8],   rotY: -Math.PI / 2, w: 3.0, h: 2.2 },
  { idx: 4, pos: [WALL.E, FRAME_Y,  3],   rotY: -Math.PI / 2, w: 3.0, h: 2.2 },

  // Dinding Barat (2 bingkai)
  { idx: 5, pos: [WALL.W, FRAME_Y, -8],   rotY:  Math.PI / 2, w: 3.0, h: 2.2 },
  { idx: 6, pos: [WALL.W, FRAME_Y,  3],   rotY:  Math.PI / 2, w: 3.0, h: 2.2 },

  // ── Bingkai kecil galeri foto — dinding Timur, zona selatan ──
  // idx 7, 8, 9, dst = urutan entri gallery di exhibits.js
  { idx: 7, pos: [WALL.E, 3.30,  7.5],  rotY: -Math.PI / 2, w: 1.4, h: 1.0 },
  { idx: 8, pos: [WALL.E, 3.30,  9.5],  rotY: -Math.PI / 2, w: 1.4, h: 1.0 },
  { idx: 9, pos: [WALL.E, 3.30, 11.5],  rotY: -Math.PI / 2, w: 1.4, h: 1.0 },
  { idx:10, pos: [WALL.E, 1.90,  8.5],  rotY: -Math.PI / 2, w: 1.4, h: 1.0 },
  { idx:11, pos: [WALL.E, 1.90, 10.5],  rotY: -Math.PI / 2, w: 1.4, h: 1.0 },
];

// ════════════════════════════════════════════════════════════════
//  POSISI PATUNG
//  Indeks harus sesuai urutan sculptures di EXHIBITS
//  Untuk tambah patung: tambah posisi baru di sini + data di exhibits.js
// ════════════════════════════════════════════════════════════════

const SCULPTURE_POSITIONS = [
  new THREE.Vector3(-3.5, 0, -4.0),   // [0] GitHub
  new THREE.Vector3( 3.5, 0, -4.0),   // [1] LinkedIn
  new THREE.Vector3(   0, 0, -0.5),   // [2] Music
  new THREE.Vector3(-5.0, 0, 11.0),   // [3] Open to Work
  new THREE.Vector3( 5.0, 0, 11.0),   // [4] Tech Stack
];

// ════════════════════════════════════════════════════════════════
//  LABEL RUANGAN
// ════════════════════════════════════════════════════════════════

function getRoomLabel(z) {
  if (z < -5.5) return "Galeri Utara — Lukisan Seni";
  if (z <  5.5) return "Aula Tengah — Kubus Interaktif";
  return "Galeri Selatan — Proyek Digital";
}

// ════════════════════════════════════════════════════════════════
//  ANIMASI PATUNG
//  Tambah baris baru jika menambah patung di SCULPTURE_POSITIONS
// ════════════════════════════════════════════════════════════════

const SCULPTURE_ANIM = [
  { rotY: 0.008, rotX: 0.003, bobFreq: 0.85 },   // [0] GitHub
  { rotY: 0.006, rotX: 0.004, bobFreq: 0.75 },   // [1] LinkedIn
  { rotY: 0.010, rotX: 0.002, bobFreq: 0.70 },   // [2] Music
  { rotY: 0.007, rotX: 0.004, bobFreq: 0.80 },   // [3] Open to Work
  { rotY: 0.009, rotX: 0.003, bobFreq: 0.78 },   // [4] Tech Stack
];

// ════════════════════════════════════════════════════════════════
//  MuseumApp
// ════════════════════════════════════════════════════════════════

class MuseumApp {
  constructor() {
    this._exhibits    = [];
    this._sculptures  = [];
    this._clock       = new THREE.Clock();
    this._rlNameEl    = document.getElementById("rl-name");
    this._musicViz    = null;
    this._musicPlayer = null;
  }

  // ── Inisialisasi renderer ─────────────────────────────────

  _initRenderer() {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
                  || window.innerWidth < 768;

    this._renderer = new THREE.WebGLRenderer({
      antialias:       !isMobile,
      powerPreference: "high-performance",
      precision:       isMobile ? "mediump" : "highp",
    });
    this._renderer.setSize(innerWidth, innerHeight);
    this._renderer.setPixelRatio(
      isMobile ? Math.min(devicePixelRatio, 1) : Math.min(devicePixelRatio, 1.5)
    );
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(this._renderer.domElement);
  }

  _initScene() {
    this._scene            = new THREE.Scene();
    this._scene.fog        = new THREE.FogExp2(0x0d0a06, 0.018);
    this._scene.background = new THREE.Color(0x0d0a06);
  }

  _initCamera() {
    this._camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.05, 60);
    this._camera.position.set(0, 1.7, 10);
  }

  _initResize() {
    window.addEventListener("resize", () => {
      this._camera.aspect = innerWidth / innerHeight;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(innerWidth, innerHeight);
    });
  }

  // ── Bangun semua pameran ──────────────────────────────────

  _buildExhibits() {
    const scene     = this._scene;
    const paintings  = EXHIBITS.filter(e => e.type === "painting");
    const sculptures = EXHIBITS.filter(e => e.type === "sculpture");

    // Lukisan di dinding
    for (const { idx, pos, rotY, w, h } of PAINTING_LAYOUT) {
      const data = paintings[idx];
      if (!data) continue;
      this._exhibits.push(
        createPainting(scene, data, new THREE.Vector3(...pos), rotY, w, h)
      );
    }

    // Papan selamat datang (lobby selatan)
    createWelcomeBoard(scene, { x: 0, z: 11.5, rotY: Math.PI });

    // Papan denah (dinding barat, zona selatan)
    createMapBoard(scene, { x: WALL.W, y: FRAME_Y, z: 9.0, rotY: Math.PI / 2 });

    // Patung di atas pedestal
    for (const [i, data] of sculptures.entries()) {
      const ex = createSculpture(scene, data, SCULPTURE_POSITIONS[i]);
      this._exhibits.push(ex);
      this._sculptures.push(ex.mesh);
    }

    // Visualizer musik (posisi patung musik = indeks 2)
    this._musicViz = new MusicVisualizer(scene, SCULPTURE_POSITIONS[2]);
  }

  // ── Musik ─────────────────────────────────────────────────

  _initMusic() {
    const musicSculpture = EXHIBITS.filter(e => e.type === "sculpture")
                                   .find(e => e.style === "music");
    const videoId = musicSculpture?.videoId ?? "5uDY6hEYfPc";

    this._musicPlayer = new MusicPlayer(videoId);

    this._musicPlayer.onStateChange((playing) => {
      this._musicViz.setPlaying(playing);
      const badge = document.getElementById("now-playing");
      if (badge) badge.style.display = playing ? "flex" : "none";
      document.dispatchEvent(
        new CustomEvent("museum:music-state", { detail: { playing } })
      );
    });

    document.addEventListener("museum:music-toggle", () => {
      this._musicPlayer.toggle();
    });
  }

  // ── Layar hint (selamat datang) ───────────────────────────

  _initHint() {
    const hint    = document.getElementById("hint");
    const dismiss = () => hint.classList.add("off");

    document.getElementById("enter-btn").addEventListener("click", dismiss);
    this._renderer.domElement.addEventListener("mousedown",  dismiss);
    this._renderer.domElement.addEventListener("touchstart", dismiss, { passive: true });
  }

  // ── Game loop ─────────────────────────────────────────────

  _loop() {
    requestAnimationFrame(() => this._loop());
    const dt = this._clock.getDelta();
    const t  = this._clock.elapsedTime;

    this._controls.update(dt);
    this._rlNameEl.textContent = getRoomLabel(this._camera.position.z);
    this._infoPanel.update(this._camera.position, this._exhibits);

    // Animasi patung
    this._sculptures.forEach((mesh, i) => {
      const anim = SCULPTURE_ANIM[i] ?? SCULPTURE_ANIM[0];
      mesh.rotation.y += anim.rotY;
      mesh.rotation.x += anim.rotX;
      mesh.position.y  = 1.65 + Math.sin(t * anim.bobFreq + i * 1.5) * 0.055;
    });

    if (this._musicViz) this._musicViz.update(t);
    this._renderer.render(this._scene, this._camera);
  }

  // ── Start ─────────────────────────────────────────────────

  async start() {
    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initResize();

    buildMuseum(this._scene);
    buildLighting(this._scene);
    this._buildExhibits();
    this._initMusic();

    this._infoPanel = new InfoPanel();
    this._controls  = new DragControls(this._camera, this._renderer.domElement, ROOM);

    this._initHint();

    await preWarmRenderer(this._renderer, this._scene, this._camera);
    await runLoadingScreen();
    this._loop();
  }
}

new MuseumApp().start();
