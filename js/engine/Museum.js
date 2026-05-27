/**
 * Museum.js — Geometri ruangan museum.
 *
 * Ruangan: W=22 (x: -11..+11), D=28 (z: -14..+14), H=5.5
 * Pilar  : x = ±7, z = -6 / 0 / +6
 *
 * Dependensi: THREE (global), Materials
 */

import { Materials } from "./Materials.js";

export const ROOM = { W: 22, D: 28, H: 5.5 };

/** Tambahkan Mesh ke scene dengan posisi & rotasi Y */
function place(scene, geo, mat, x, y, z, ry = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if (ry) m.rotation.y = ry;
  scene.add(m);
  return m;
}

export function buildMuseum(scene) {
  const mat        = Materials.get();
  const { W, D, H } = ROOM;

  // ── Lantai ──────────────────────────────────────────────────
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat.floor);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // ── Langit-langit ────────────────────────────────────────────
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat.ceiling);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  scene.add(ceiling);

  // ── Dinding utama (4 sisi) ────────────────────────────────────
  const wNS = new THREE.PlaneGeometry(W, H);
  const wEW = new THREE.PlaneGeometry(D, H);

  place(scene, wNS,        mat.wall,  0,   H/2, -D/2);            // Utara
  place(scene, wNS.clone(),mat.wall,  0,   H/2,  D/2, Math.PI);   // Selatan
  place(scene, wEW,        mat.wall,  W/2, H/2,  0,  -Math.PI/2); // Timur
  place(scene, wEW.clone(),mat.wall, -W/2, H/2,  0,   Math.PI/2); // Barat

  // ── Pilar ───────────────────────────────────────────────────
  const pGeo   = new THREE.BoxGeometry(0.55, H, 0.55);
  const capGeo = new THREE.BoxGeometry(0.80, 0.14, 0.80);
  const basGeo = new THREE.BoxGeometry(0.80, 0.12, 0.80);

  const pillarGrid = [
    [-7, -6], [7, -6],
    [-7,  0], [7,  0],
    [-7,  6], [7,  6],
  ];

  pillarGrid.forEach(([x, z]) => {
    place(scene, pGeo,   mat.wall,     x, H / 2, z);
    place(scene, capGeo, mat.gold,     x, H - 0.07, z);
    place(scene, basGeo, mat.gold,     x, 0.06, z);
  });

  // ── Molding cornice atas (bingkai langit-langit) ──────────────
  const mW  = new THREE.BoxGeometry(W, 0.10, 0.18);
  const mD  = new THREE.BoxGeometry(D, 0.10, 0.18);
  const mY  = H - 0.05;

  place(scene, mW.clone(), mat.gold, 0, mY, -D/2 + 0.10);
  place(scene, mW.clone(), mat.gold, 0, mY,  D/2 - 0.10);
  place(scene, mD.clone(), mat.gold, -W/2 + 0.10, mY, 0, Math.PI/2);
  place(scene, mD.clone(), mat.gold,  W/2 - 0.10, mY, 0, Math.PI/2);

  // ── Baseboard bawah (skirting) ────────────────────────────────
  const bW  = new THREE.BoxGeometry(W, 0.10, 0.16);
  const bD  = new THREE.BoxGeometry(D, 0.10, 0.16);

  place(scene, bW.clone(), mat.darkGold, 0, 0.05, -D/2 + 0.09);
  place(scene, bW.clone(), mat.darkGold, 0, 0.05,  D/2 - 0.09);
  place(scene, bD.clone(), mat.darkGold, -W/2 + 0.09, 0.05, 0, Math.PI/2);
  place(scene, bD.clone(), mat.darkGold,  W/2 - 0.09, 0.05, 0, Math.PI/2);

  // ── Chair rail — garis horizontal di tengah dinding ───────────
  // Seperti wainscoting di museum klasik
  const crW = new THREE.BoxGeometry(W, 0.06, 0.12);
  const crD = new THREE.BoxGeometry(D, 0.06, 0.12);
  const crY = 1.05;  // setinggi sandaran kursi

  place(scene, crW.clone(), mat.darkGold, 0, crY, -D/2 + 0.07);
  place(scene, crW.clone(), mat.darkGold, 0, crY,  D/2 - 0.07);
  place(scene, crD.clone(), mat.darkGold, -W/2 + 0.07, crY, 0, Math.PI/2);
  place(scene, crD.clone(), mat.darkGold,  W/2 - 0.07, crY, 0, Math.PI/2);
}
