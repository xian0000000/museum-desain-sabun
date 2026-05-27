/**
 * Materials.js — Singleton material Three.js yang dipakai bersama.
 *
 * Semua material dibuat sekali lalu di-cache.
 * Untuk menambah material baru, tambahkan properti di dalam objek cache.
 *
 * Dependensi: THREE (global), TextureFactory
 */

import { TextureFactory } from "./TextureFactory.js";

let _cache = null;

export const Materials = {
  /** Kembalikan objek berisi semua material. Dibuat sekali (lazy). */
  get() {
    if (_cache) return _cache;

    _cache = {
      floor:    new THREE.MeshLambertMaterial({ map: TextureFactory.floor() }),
      wall:     new THREE.MeshLambertMaterial({ map: TextureFactory.wall() }),
      ceiling:  new THREE.MeshLambertMaterial({ map: TextureFactory.ceiling() }),
      gold:     new THREE.MeshLambertMaterial({ color: 0xb8902a }),
      darkGold: new THREE.MeshLambertMaterial({ color: 0x7a5c18 }),
      pedestal: new THREE.MeshLambertMaterial({ color: 0x1e1c18 }),
      glass:    new THREE.MeshLambertMaterial({ color: 0x88c0d8, transparent: true, opacity: 0.26 }),
    };

    return _cache;
  },
};
