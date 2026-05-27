/**
 * Painting.js — Membuat bingkai lukisan 3D di dinding museum.
 *
 * Semua lukisan menggunakan tekstur canvas prosedural (TextureFactory.painting).
 * Tidak ada loading gambar dari file — sepenuhnya generatif berdasarkan `colors`.
 *
 * ════════════════════════════════════════════════════════════════
 *  CARA TAMBAH JENIS LUKISAN BARU:
 *    1. Tambah entry di exhibits.js dengan type:"painting" dan style baru
 *    2. Tambah key style di js/config/exhibit-styles.js
 *    3. File ini tidak perlu diubah sama sekali
 * ════════════════════════════════════════════════════════════════
 *
 * Dependensi: THREE (global), Materials, TextureFactory
 */

import { Materials }      from "./Materials.js";
import { TextureFactory } from "./TextureFactory.js";

/**
 * Buat satu lukisan dan tambahkan ke scene.
 *
 * @param {THREE.Scene}   scene
 * @param {object}        data    — dari EXHIBITS (type:"painting")
 * @param {THREE.Vector3} pos
 * @param {number}        rotY
 * @param {number}        [w=3.0]
 * @param {number}        [h=2.2]
 * @returns {{ position, radius, data }}
 */
export function createPainting(scene, data, pos, rotY, w = 3.0, h = 2.2) {
  const mat   = Materials.get();
  const group = new THREE.Group();
  group.position.copy(pos);
  group.rotation.y = rotY;

  // ── Bingkai luar emas ────────────────────────────────────
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.20, h + 0.20, 0.09), mat.gold));

  // ── Bingkai dalam emas gelap ─────────────────────────────
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.05, h + 0.05, 0.10), mat.darkGold));

  // ── Kanvas — tekstur prosedural dari colors ──────────────
  // ── Kanvas — tekstur prosedural atau PNG ──────────────────
const tex      = TextureFactory.painting(data.colors);
const canvasMat = new THREE.MeshLambertMaterial({ map: tex });

// Kalau ada field `png`, coba load — jika gagal tetap pakai prosedural
if (data.png) {
  new THREE.TextureLoader().load(
    data.png,
    (loaded) => {
      loaded.encoding       = THREE.sRGBEncoding;
      canvasMat.map         = loaded;
      canvasMat.needsUpdate = true;
    }
    // error diabaikan → tetap pakai fallback prosedural
  );
}
  const canvas   = new THREE.Mesh(new THREE.PlaneGeometry(w, h), canvasMat);
  canvas.position.z = 0.065;
  group.add(canvas);

  // ── Plakat emas bawah ────────────────────────────────────
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(Math.min(w * 0.45, 1.2), 0.06, 0.045), mat.gold);
  plaque.position.set(0, -(h / 2 + 0.20), 0.04);
  group.add(plaque);

  scene.add(group);

  return {
    position: pos.clone().setY(1.7),
    radius:   Math.max(w, 2.2),
    data,
  };
}
