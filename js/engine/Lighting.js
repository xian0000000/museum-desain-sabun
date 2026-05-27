/**
 * Lighting.js — Sistem pencahayaan museum tiga zona.
 *
 * Zona:
 *   - Galeri Utara  (z < -5) : cahaya hangat lebih terang
 *   - Aula Tengah   (-5..+5) : cahaya netral medium
 *   - Galeri Selatan (z > +5) : cahaya sedikit lebih dingin (lobby)
 *
 * Dependensi: THREE (global)
 */

import { ROOM } from "./Museum.js";

const H = ROOM.H;   // 5.5

export function buildLighting(scene) {
  // ── Ambient — cahaya dasar hangat seperti torchlight museum ──
  scene.add(new THREE.AmbientLight(0x2e2010, 0.9));

  // ── Bohlam geometry (shared) ──────────────────────────────────
  const bulbGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe8aa });

  function addCeilingLight(x, z, intensity = 0.5, color = 0xfff0cc, radius = 14) {
    const pt = new THREE.PointLight(color, intensity, radius);
    pt.position.set(x, H - 0.28, z);
    scene.add(pt);
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.copy(pt.position);
    scene.add(bulb);
  }

  // ── Galeri Utara — 2 lampu radius besar ──────────────────
  [[-3, -10], [3, -10],
  ].forEach(([x, z]) => addCeilingLight(x, z, 0.65, 0xfff2d0, 18));

  // ── Aula Tengah — 2 lampu ────────────────────────────────
  [[-3, -1], [3, -1],
  ].forEach(([x, z]) => addCeilingLight(x, z, 0.55, 0xffe8c0, 18));

  // ── Galeri Selatan — 2 lampu ─────────────────────────────
  [[-3, 9], [3, 9],
  ].forEach(([x, z]) => addCeilingLight(x, z, 0.55, 0xffeedd, 18));

  // ── Lampu pojok kiri & kanan tengah ──────────────────────
  [[-9.5, 0, 0.35], [9.5, 0, 0.35],
  ].forEach(([x, z, i]) => addCeilingLight(x, z, i, 0xffeedd, 14));
}
