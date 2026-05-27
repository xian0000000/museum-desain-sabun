/**
 * WelcomeBoard.js — Papan selamat datang 3D di lobby museum.
 *
 * Terdiri dari:
 *   - Rangka kayu gelap (BoxGeometry)
 *   - Panel latar kain/beludru (BoxGeometry)
 *   - Tekstur canvas: judul, garis ornamen, teks sambutan, nama pembuat
 *   - Dua tiang penyangga kiri & kanan
 *   - Spotlight hangat dari atas yang menerangi papan
 *
 * Cara mengubah isi teks:
 *   Edit konstanta BOARD_TEXT di bawah, lalu refresh browser.
 *
 * Dependensi: THREE (global)
 */

// ─── Konten Teks Papan ────────────────────────────────────────────────────────
const BOARD_TEXT = {
  subtitle:  "SELAMAT DATANG DI",
  title:     "MUSEUM 3D",
  tagline:   "Galeri Seni Digital Interaktif",
  divider:   "✦  ✦  ✦",
  body: [
    "Jelajahi koleksi lukisan dan patung",
    "dalam ruang tiga dimensi.",
  ],
  controls: "W A S D  ·  DRAG MOUSE  ·  SENTUH LAYAR",
  creator:  "Dibuat oleh  Xina  ·  2026",
};

// ─── Ukuran papan (unit Three.js) ────────────────────────────────────────────
const W = 4.2;  // lebar papan
const H = 2.8;  // tinggi papan

// ─────────────────────────────────────────────────────────────────────────────

/** Buat tekstur canvas untuk panel papan */
function makeTexture() {
  const SIZE = 1024;
  const HALF_H = 640;  // tinggi konten dalam pixel

  const canvas = document.createElement("canvas");
  canvas.width  = SIZE;
  canvas.height = HALF_H;
  const ctx = canvas.getContext("2d");

  // ── Background beludru gelap dengan vignette ──────────────────
  const bg = ctx.createLinearGradient(0, 0, SIZE, HALF_H);
  bg.addColorStop(0,   "#0e0a04");
  bg.addColorStop(0.5, "#16110a");
  bg.addColorStop(1,   "#0e0a04");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, HALF_H);

  // ── Border ornamen emas ───────────────────────────────────────
  const PAD = 22;
  ctx.strokeStyle = "#c8a050";
  ctx.lineWidth = 2;
  ctx.strokeRect(PAD, PAD, SIZE - PAD * 2, HALF_H - PAD * 2);

  ctx.strokeStyle = "rgba(200,160,80,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(PAD + 7, PAD + 7, SIZE - (PAD + 7) * 2, HALF_H - (PAD + 7) * 2);

  // Sudut ornamen
  const corners = [
    [PAD, PAD], [SIZE - PAD, PAD],
    [PAD, HALF_H - PAD], [SIZE - PAD, HALF_H - PAD],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#c8a050";
    ctx.fill();
  });

  // ── Subtitle ──────────────────────────────────────────────────
  ctx.fillStyle = "#7a6040";
  ctx.font = "600 28px Georgia, serif";
  ctx.textAlign = "center";
  
  ctx.fillText(BOARD_TEXT.subtitle, SIZE / 2, 110);

  // ── Judul Utama ───────────────────────────────────────────────
  ctx.fillStyle = "#c8a050";
  ctx.font = "bold 112px Georgia, serif";
  
  // Bayangan judul
  ctx.shadowColor = "rgba(200,160,80,0.35)";
  ctx.shadowBlur = 18;
  ctx.fillText(BOARD_TEXT.title, SIZE / 2, 220);
  ctx.shadowBlur = 0;

  // Garis bawah judul
  const lineY = 240;
  const lineGrad = ctx.createLinearGradient(PAD + 30, 0, SIZE - PAD - 30, 0);
  lineGrad.addColorStop(0,   "transparent");
  lineGrad.addColorStop(0.2, "#c8a050");
  lineGrad.addColorStop(0.8, "#c8a050");
  lineGrad.addColorStop(1,   "transparent");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD + 30, lineY);
  ctx.lineTo(SIZE - PAD - 30, lineY);
  ctx.stroke();

  // ── Tagline ───────────────────────────────────────────────────
  ctx.fillStyle = "#9a8060";
  ctx.font = "italic 34px Georgia, serif";
  
  ctx.fillText(BOARD_TEXT.tagline, SIZE / 2, 292);

  // ── Divider ornamen ───────────────────────────────────────────
  ctx.fillStyle = "rgba(200,160,80,0.45)";
  ctx.font = "24px serif";
  
  ctx.fillText(BOARD_TEXT.divider, SIZE / 2, 346);

  // ── Body teks ─────────────────────────────────────────────────
  ctx.fillStyle = "#7a6a50";
  ctx.font = "28px Georgia, serif";
  
  BOARD_TEXT.body.forEach((line, i) => {
    ctx.fillText(line, SIZE / 2, 400 + i * 44);
  });

  // ── Garis pembatas bawah ──────────────────────────────────────
  const line2Y = 510;
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + 80, line2Y);
  ctx.lineTo(SIZE - PAD - 80, line2Y);
  ctx.stroke();

  // ── Petunjuk kontrol ──────────────────────────────────────────
  ctx.fillStyle = "#3a2e18";
  ctx.font = "22px monospace";
  
  ctx.fillText(BOARD_TEXT.controls, SIZE / 2, 556);

  // ── Nama pembuat ──────────────────────────────────────────────
  // Background kecil di belakang nama
  const nameW = 440, nameH = 38;
  const nameX = SIZE / 2 - nameW / 2;
  ctx.fillStyle = "rgba(200,160,80,0.08)";
  ctx.fillRect(nameX, HALF_H - 76, nameW, nameH);

  ctx.fillStyle = "#c8a050";
  ctx.font = "bold 24px Georgia, serif";
  
  ctx.fillText(BOARD_TEXT.creator, SIZE / 2, HALF_H - 50);

  // Vignette penutup
  const vig = ctx.createRadialGradient(SIZE / 2, HALF_H / 2, HALF_H * 0.15,
    SIZE / 2, HALF_H / 2, HALF_H * 0.85);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, SIZE, HALF_H);

  const tex = new THREE.CanvasTexture(canvas);
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}

/**
 * Buat dan tambahkan papan selamat datang ke scene.
 *
 * @param {THREE.Scene} scene
 * @param {object}      [opts]
 * @param {number}      [opts.x=0]    – posisi X
 * @param {number}      [opts.z=10]   – posisi Z (default dekat pintu selatan)
 * @param {number}      [opts.rotY=0] – rotasi Y dalam radian
 */
export function createWelcomeBoard(scene, { x = 0, z = 10, rotY = 0 } = {}) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotY;

  const goldMat   = new THREE.MeshLambertMaterial({ color: 0xb8902a });
  const darkMat   = new THREE.MeshLambertMaterial({ color: 0x1a1208 });
  const postMat   = new THREE.MeshLambertMaterial({ color: 0x2a1e08 });

  // ── Rangka luar kayu gelap ─────────────────────────────────
  const outerFrame = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.28, H + 0.28, 0.10),
    goldMat,
  );
  outerFrame.position.y = H / 2 + 1.05;
  group.add(outerFrame);

  // ── Frame dalam (latar) ────────────────────────────────────
  const innerFrame = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.08, H + 0.08, 0.11),
    darkMat,
  );
  innerFrame.position.y = H / 2 + 1.05;
  group.add(innerFrame);

  // ── Panel teks ─────────────────────────────────────────────
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    new THREE.MeshLambertMaterial({ map: makeTexture() }),
  );
  panel.position.set(0, H / 2 + 1.05, 0.07);
  group.add(panel);

  // ── Plakat nama di bawah (seperti lukisan) ─────────────────
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.07, 0.05),
    goldMat,
  );
  plaque.position.set(0, 0.9, 0.04);
  group.add(plaque);

  // ── Tiang kiri ─────────────────────────────────────────────
  const postGeo   = new THREE.CylinderGeometry(0.055, 0.07, 3.6, 12);
  const capGeo    = new THREE.SphereGeometry(0.1, 10, 10);
  const baseGeo   = new THREE.CylinderGeometry(0.16, 0.18, 0.12, 12);

  [-W / 2 - 0.12, W / 2 + 0.12].forEach((px) => {
    // Batang tiang
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(px, 1.8, 0);
    group.add(post);

    // Kepala tiang (ornamen bola emas)
    const cap = new THREE.Mesh(capGeo, goldMat);
    cap.position.set(px, 3.72, 0);
    group.add(cap);

    // Alas tiang
    const base = new THREE.Mesh(baseGeo, goldMat);
    base.position.set(px, 0.06, 0);
    group.add(base);

    // Ring tengah ornamen
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.018, 8, 20),
      goldMat,
    );
    ring.position.set(px, 2.6, 0);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  });

  // ── Rel penghubung dua tiang (atas & bawah) ────────────────
  const railGeo = new THREE.CylinderGeometry(0.025, 0.025, W + 0.24, 8);
  railGeo.rotateZ(Math.PI / 2);

  const railTop = new THREE.Mesh(railGeo, goldMat);
  railTop.position.set(0, 3.5, 0);
  group.add(railTop);

  const railBot = new THREE.Mesh(railGeo.clone(), goldMat);
  railBot.position.set(0, 0.95, 0);
  group.add(railBot);

  // ── Spotlight hangat dari atas ─────────────────────────────
  const light = new THREE.PointLight(0xfff4d0, 1.2, 7);
  light.position.set(0, 5.5, -1.5);
  group.add(light);

  scene.add(group);
}
