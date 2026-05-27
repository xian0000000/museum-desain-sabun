/**
 * LoadingScreen.js — Animasi layar muat saat museum pertama dibuka.
 *
 * Mengembalikan Promise yang resolve setelah animasi selesai.
 * Dependensi: DOM saja
 */

const STAGES = [
  "Memuat arsitektur…",
  "Memasang lukisan…",
  "Menyalakan lampu…",
  "Membuka pintu…",
];

/**
 * Jalankan animasi loading bar.
 * @returns {Promise<void>} resolve saat fade-out selesai
 */
export function runLoadingScreen() {
  return new Promise((resolve) => {
    const screen = document.getElementById("loading");
    const fill   = document.getElementById("l-fill");
    const label  = document.getElementById("l-lbl");

    let progress = 0;

    const tick = setInterval(() => {
      progress += Math.random() * 11 + 4;
      fill.style.width = `${Math.min(progress, 100)}%`;

      const stageIndex = Math.min(
        Math.floor(progress / 27),
        STAGES.length - 1,
      );
      label.textContent = STAGES[stageIndex];

      if (progress >= 100) {
        clearInterval(tick);
        fill.style.width = "100%";
        label.textContent = "Siap masuk…";
        setTimeout(() => {
          screen.style.opacity = "0";
          setTimeout(() => {
            screen.style.display = "none";
            resolve();
          }, 800);
        }, 300);
      }
    }, 160);
  });
}

/**
 * Pre-warm renderer — render beberapa frame tersembunyi agar semua
 * shader & texture sudah ter-compile di GPU sebelum user masuk.
 * Panggil SEBELUM runLoadingScreen() resolve.
 *
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene}         scene
 * @param {THREE.Camera}        camera
 * @param {number}              frames  jumlah frame pre-warm (default 10)
 */
export function preWarmRenderer(renderer, scene, camera, frames = 10) {
  // Compile semua shader & upload texture ke GPU
  renderer.compile(scene, camera);

  // Render beberapa frame agar GPU warm-up
  return new Promise((resolve) => {
    let count = 0;
    function warmFrame() {
      renderer.render(scene, camera);
      count++;
      if (count < frames) requestAnimationFrame(warmFrame);
      else resolve();
    }
    requestAnimationFrame(warmFrame);
  });
}
