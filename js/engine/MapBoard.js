/**
 * MapBoard.js — Papan denah lantai museum 3D.
 *
 * Papan ditempatkan di dinding timur, terlihat dari posisi awal kamera.
 * Dependensi: THREE (global)
 */

const BW = 3.6;   // lebar papan (Three.js units)
const BH = 2.6;   // tinggi papan
const TEX  = 1024;
const TEX_H = Math.round(TEX * (BH / BW));  // ~740

// ─── Helpers menggambar di canvas ─────────────────────────────────────────

function drawPainting(ctx, mx, my, w, h, color, label, isProject) {
  ctx.fillStyle = color + (isProject ? "ee" : "99");
  ctx.fillRect(mx - w / 2, my - h / 2, w, h);
  ctx.strokeStyle = isProject ? "#c8a050" : "rgba(200,160,80,0.45)";
  ctx.lineWidth = isProject ? 1.5 : 1;
  ctx.strokeRect(mx - w / 2, my - h / 2, w, h);
  ctx.fillStyle = isProject ? "#c8a050" : "rgba(180,150,100,0.65)";
  ctx.font = (isProject ? "bold " : "") + "10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, mx, my + h / 2 + 12);
}

function drawSculpture(ctx, mx, my, color, label) {
  ctx.beginPath();
  ctx.arc(mx, my, 10, 0, Math.PI * 2);
  ctx.fillStyle = color + "88";
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "rgba(180,150,100,0.6)";
  ctx.font = "9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, mx, my + 21);
}

// ─── Buat tekstur canvas denah ────────────────────────────────────────────

function makeMapTexture() {
  const canvas = document.createElement("canvas");
  canvas.width  = TEX;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0a0804";
  ctx.fillRect(0, 0, TEX, TEX_H);

  // Border emas
  const PAD = 18;
  ctx.strokeStyle = "#c8a050";
  ctx.lineWidth = 2;
  ctx.strokeRect(PAD, PAD, TEX - PAD * 2, TEX_H - PAD * 2);
  ctx.strokeStyle = "rgba(200,160,80,0.22)";
  ctx.lineWidth = 1;
  ctx.strokeRect(PAD + 6, PAD + 6, TEX - (PAD + 6) * 2, TEX_H - (PAD + 6) * 2);

  // Judul
  ctx.fillStyle = "#c8a050";
  ctx.font = "bold 32px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("DENAH MUSEUM", TEX / 2, 58);
  ctx.fillStyle = "#4a3a20";
  ctx.font = "14px sans-serif";
  ctx.fillText("FLOOR PLAN  \u00b7  MUSEUM 3D", TEX / 2, 80);

  // Garis bawah judul
  const lg = ctx.createLinearGradient(PAD + 40, 0, TEX - PAD - 40, 0);
  lg.addColorStop(0, "transparent"); lg.addColorStop(0.2, "#c8a050");
  lg.addColorStop(0.8, "#c8a050");  lg.addColorStop(1, "transparent");
  ctx.strokeStyle = lg; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + 40, 92); ctx.lineTo(TEX - PAD - 40, 92); ctx.stroke();

  // Area peta
  const MX = PAD + 40, MY = 104;
  const MW = TEX - MX * 2, MH = TEX_H - MY - 85;

  ctx.fillStyle = "#100c06";
  ctx.fillRect(MX, MY, MW, MH);

  // Grid lantai
  ctx.strokeStyle = "rgba(80,60,20,0.12)";
  ctx.lineWidth = 0.5;
  const gs = MW / 11;
  for (let i = 1; i < 11; i++) {
    ctx.beginPath(); ctx.moveTo(MX + i * gs, MY); ctx.lineTo(MX + i * gs, MY + MH); ctx.stroke();
  }
  for (let j = 1; j < Math.round(MH / gs); j++) {
    ctx.beginPath(); ctx.moveTo(MX, MY + j * gs); ctx.lineTo(MX + MW, MY + j * gs); ctx.stroke();
  }

  // Zona warna
  const zH = MH / 3;
  ctx.fillStyle = "rgba(64,160,80,0.14)";  ctx.fillRect(MX, MY,       MW, zH);
  ctx.fillStyle = "rgba(200,160,80,0.08)"; ctx.fillRect(MX, MY + zH,  MW, zH);
  ctx.fillStyle = "rgba(0,123,255,0.14)";  ctx.fillRect(MX, MY + zH*2,MW, zH);

  // Garis zona
  ctx.strokeStyle = "rgba(200,160,80,0.18)"; ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.beginPath(); ctx.moveTo(MX, MY + zH);    ctx.lineTo(MX + MW, MY + zH);    ctx.stroke();
  ctx.beginPath(); ctx.moveTo(MX, MY + zH * 2);ctx.lineTo(MX + MW, MY + zH * 2);ctx.stroke();
  ctx.setLineDash([]);

  // Label zona
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(80,160,80,0.7)";  ctx.fillText("GALERI UTARA",    MX + 8, MY + 16);
  ctx.fillStyle = "rgba(200,160,80,0.5)"; ctx.fillText("AULA TENGAH",     MX + 8, MY + zH + 16);
  ctx.fillStyle = "rgba(60,120,200,0.7)"; ctx.fillText("GALERI SELATAN",  MX + 8, MY + zH * 2 + 16);

  // Konversi koordinat dunia 3D -> pixel peta
  // Ruangan: W=22 (-11..11), D=28 (-14..14)
  const toMap = (wx, wz) => ({
    x: MX + MW / 2 + (wx / 11) * (MW / 2),
    y: MY + MH / 2 + (wz / 14) * (MH / 2),
  });

  // Pilar
  [[-7,-6],[7,-6],[-7,0],[7,0],[-7,6],[7,6]].forEach(([wx, wz]) => {
    const p = toMap(wx, wz);
    ctx.fillStyle = "rgba(90,65,20,0.85)";
    ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
    ctx.strokeStyle = "rgba(200,160,80,0.35)"; ctx.lineWidth = 0.8;
    ctx.strokeRect(p.x - 4, p.y - 4, 8, 8);
  });

  // Dinding Utara — Arduino, Cuaca, Detektif
  [{wx:-5.5,wz:-14,col:"#00ff88",lbl:"Arduino",    proj:true},
   {wx:   0,wz:-14,col:"#38bdf8",lbl:"Cuaca",      proj:true},
   {wx: 5.5,wz:-14,col:"#f0d080",lbl:"Detektif",   proj:true}
  ].forEach(({wx,wz,col,lbl,proj}) => { const p=toMap(wx,wz); drawPainting(ctx,p.x,p.y+5,28,9,col,lbl,proj); });

  // Dinding Timur zona utara — Chat Ocean, Perpustakaan
  [{wx:11,wz:-6,col:"#007bff",lbl:"Chat",   proj:true},
   {wx:11,wz: 3,col:"#2d6abf",lbl:"Perpus", proj:true}
  ].forEach(({wx,wz,col,lbl,proj}) => { const p=toMap(wx,wz); drawPainting(ctx,p.x-5,p.y,9,28,col,lbl,proj); });

  // Dinding Barat — Life Dashboard, StatLab
  [{wx:-11,wz:-6,col:"#a855f7",lbl:"LifeDash",proj:true},
   {wx:-11,wz: 3,col:"#00e5c8",lbl:"StatLab", proj:true}
  ].forEach(({wx,wz,col,lbl,proj}) => { const p=toMap(wx,wz); drawPainting(ctx,p.x+5,p.y,9,28,col,lbl,proj); });

  // Dinding Selatan — kosong
  // (tidak ada bingkai)

  // Galeri foto — dinding Timur zona selatan (G1-G5)
  [{wx:11,wz:8 },{wx:11,wz:9.5},{wx:11,wz:11},
   {wx:11,wz:8.8},{wx:11,wz:10.4}
  ].forEach(({wx,wz},i) => {
    const p=toMap(wx,wz);
    const isTop = i < 3;
    ctx.fillStyle = "rgba(150,130,80,0.6)";
    ctx.fillRect(p.x - (isTop?3:3), p.y - (isTop?5:3), isTop?6:6, isTop?10:6);
    ctx.strokeStyle = "rgba(200,160,80,0.5)"; ctx.lineWidth=0.8;
    ctx.strokeRect(p.x - (isTop?3:3), p.y - (isTop?5:3), isTop?6:6, isTop?10:6);
  });
  // Label galeri
  const gLabel = toMap(11, 9.5);
  ctx.fillStyle="rgba(180,150,100,0.6)"; ctx.font="8px sans-serif"; ctx.textAlign="center";
  ctx.fillText("Galeri", gLabel.x - 14, gLabel.y);

  // Patung tengah — GitHub, LinkedIn, Music
  [{wx:-3.5,wz:-4,  col:"#58a6ff",lbl:"GitHub"},
   {wx: 3.5,wz:-4,  col:"#0ea5e9",lbl:"LinkedIn"},
   {wx:   0,wz:-0.5,col:"#c8a050",lbl:"Music"}
  ].forEach(({wx,wz,col,lbl}) => { const p=toMap(wx,wz); drawSculpture(ctx,p.x,p.y,col,lbl); });

  // Patung selatan — Availability, Tech Stack
  [{wx:-5,wz:11,col:"#22c55e",lbl:"Available"},
   {wx: 5,wz:11,col:"#a78bfa",lbl:"TechStack"}
  ].forEach(({wx,wz,col,lbl}) => { const p=toMap(wx,wz); drawSculpture(ctx,p.x,p.y,col,lbl); });

  // Papan sambutan (ikon)
  const wb = toMap(0, 12);
  ctx.fillStyle = "rgba(200,160,80,0.5)";
  ctx.font = "12px sans-serif"; ctx.textAlign = "center";
  ctx.fillText("[W]", wb.x, wb.y);

  // Batas dinding tebal
  ctx.strokeStyle = "#4a3a1a"; ctx.lineWidth = 5;
  ctx.strokeRect(MX, MY, MW, MH);

  // Compass
  const cpx = MX + MW - 34, cpy = MY + 34;
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath(); ctx.arc(cpx, cpy, 22, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(200,160,80,0.35)"; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = "#c8a050"; ctx.font = "bold 14px serif"; ctx.textAlign = "center";
  ctx.fillText("U", cpx, cpy - 11);
  ctx.fillText("S", cpx, cpy + 18);
  ctx.fillStyle = "#6a5a3a"; ctx.font = "11px serif";
  ctx.fillText("B", cpx - 14, cpy + 4);
  ctx.fillText("T", cpx + 14, cpy + 4);
  ctx.strokeStyle = "rgba(200,160,80,0.4)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cpx, cpy - 8); ctx.lineTo(cpx, cpy + 8);  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cpx - 8, cpy); ctx.lineTo(cpx + 8, cpy);  ctx.stroke();

  // Legenda
  const ly = TEX_H - 72;
  ctx.strokeStyle = "rgba(200,160,80,0.18)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + 40, ly - 8); ctx.lineTo(TEX - PAD - 40, ly - 8); ctx.stroke();

  ctx.font = "12px sans-serif"; ctx.textAlign = "left";
  ctx.fillStyle = "#c8a050";                   ctx.fillText("\u25a0 Proyek Digital",  MX + 4,   ly + 2);
  ctx.fillStyle = "rgba(180,150,100,0.5)";     ctx.fillText("\u25a0 Galeri Foto",     MX + 4,   ly + 18);
  ctx.fillStyle = "rgba(180,150,100,0.5)";     ctx.fillText("\u25cf Patung Interaktif", MX + 200, ly + 2);
  ctx.fillStyle = "rgba(200,160,80,0.4)";      ctx.fillText("\u25a0 Pilar",           MX + 200, ly + 18);

  // Vignette
  const vig = ctx.createRadialGradient(TEX/2, TEX_H/2, TEX_H*0.15, TEX/2, TEX_H/2, TEX_H*0.85);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.42)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, TEX, TEX_H);

  const tex = new THREE.CanvasTexture(canvas);
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}

// ─────────────────────────────────────────────────────────────────────────────

export function createMapBoard(scene, { x = 10.9, y = 2.9, z = 0, rotY = Math.PI / 2 } = {}) {
  const group   = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  const goldMat = new THREE.MeshLambertMaterial({ color: 0xb8902a });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x0e0a04 });

  // Frame luar
  const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(BW + 0.24, BH + 0.24, 0.08), goldMat);
  group.add(outerFrame);

  // Frame dalam
  const innerFrame = new THREE.Mesh(new THREE.BoxGeometry(BW + 0.08, BH + 0.08, 0.09), darkMat);
  group.add(innerFrame);

  // Panel peta
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(BW, BH),
    new THREE.MeshLambertMaterial({ map: makeMapTexture() }),
  );
  panel.position.z = 0.06;
  group.add(panel);

  // Plakat bawah
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.04), goldMat);
  plaque.position.set(0, -(BH / 2 + 0.18), 0.04);
  group.add(plaque);

  // Teks plakat (mesh biasa, bukan Sprite)
  const lblCanvas = document.createElement("canvas");
  lblCanvas.width = 512; lblCanvas.height = 64;
  const lc = lblCanvas.getContext("2d");
  lc.fillStyle = "#c8a050";
  lc.font = "bold 26px Georgia, serif";
  lc.textAlign = "center";
  lc.textBaseline = "middle";
  lc.fillText("DENAH LANTAI", 256, 32);
  const lblMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 0.055),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lblCanvas), transparent: true }),
  );
  lblMesh.position.set(0, -(BH / 2 + 0.18), 0.075);
  group.add(lblMesh);

  // Bracket kiri & kanan
  [-BW / 2 + 0.1, BW / 2 - 0.1].forEach((bx) => {
    const br = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.18), goldMat);
    br.position.set(bx, -(BH / 2 + 0.02), -0.08);
    group.add(br);
  });

  // Spotlight
  const light = new THREE.PointLight(0xfff8e8, 0.8, 5);
  light.position.set(0, 1.5, -2);
  group.add(light);

  scene.add(group);
}
