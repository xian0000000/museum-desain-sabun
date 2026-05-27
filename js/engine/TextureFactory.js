/**
 * TextureFactory.js — Pembuat tekstur canvas procedural.
 *
 * Setiap fungsi mengembalikan THREE.CanvasTexture yang siap dipakai.
 * Untuk menambah tekstur baru, tambahkan fungsi baru di dalam IIFE
 * dan sertakan di objek return.
 *
 * Dependensi global: THREE (three.min.js via CDN)
 */

/* ─── helper internal ─────────────────────────────────── */
function makeTexture(drawFn, size, repeatX = 1, repeatY = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  drawFn(canvas.getContext("2d"), size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  return tex;
}

/* ─── export ──────────────────────────────────────────── */
export const TextureFactory = {
  /** Lantai marmer krem dengan serat acak */
  floor() {
    return makeTexture((ctx, S) => {
      const g = ctx.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, "#ede5d5");
      g.addColorStop(0.5, "#f0eae0");
      g.addColorStop(1, "#ddd5c0");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, S);

      for (let i = 0; i < 14; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(140,115,82,${0.07 + Math.random() * 0.14})`;
        ctx.lineWidth = 0.5 + Math.random() * 1.2;
        let x = Math.random() * S, y = Math.random() * S;
        ctx.moveTo(x, y);
        for (let j = 0; j < 7; j++) {
          x += (Math.random() - 0.5) * 60;
          y += (Math.random() - 0.5) * 38;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }, 512, 8, 8);
  },

  /** Dinding bata gelap */
  wall() {
    return makeTexture((ctx, S) => {
      ctx.fillStyle = "#1c1610";
      ctx.fillRect(0, 0, S, S);
      const rh = 48;
      for (let r = 0; r * rh < S + rh; r++) {
        const bw = r % 2 === 0 ? 88 : 72;
        for (let x = 0; x < S; x += bw) {
          const v = 13 + Math.random() * 9;
          ctx.fillStyle = `rgb(${v + 5},${v + 1},${v - 2})`;
          ctx.fillRect(x + 1, r * rh + 1, bw - 2, rh - 2);
        }
        ctx.fillStyle = "rgba(0,0,0,.5)";
        ctx.fillRect(0, r * rh, S, 1);
        for (let x = 0; x < S; x += r % 2 === 0 ? 88 : 72)
          ctx.fillRect(x, r * rh, 1, rh);
      }
    }, 256, 3, 2);
  },

  /** Langit-langit dengan panel kayu */
  ceiling() {
    return makeTexture((ctx, S) => {
      ctx.fillStyle = "#18140e";
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = "rgba(75,55,28,.38)";
      ctx.lineWidth = 2.5;
      for (let i = 0; i <= S; i += 128) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke();
      }
    }, 256, 5, 5);
  },

  /**
   * Lukisan abstrak prosedural acak.
   * @param {string[]} colors – array hex, minimal 2 warna
   */
  painting(colors) {
    return makeTexture((ctx, S) => {
      const H = S * 0.8;
      const g = ctx.createLinearGradient(0, 0, S, H);
      g.addColorStop(0, colors[0]);
      g.addColorStop(1, colors[1] || colors[0]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, H);

      const style = Math.floor(Math.random() * 4);
      if (style === 0) {
        // Brush strokes abstrak
        for (let i = 0; i < 10; i++) {
          ctx.fillStyle = colors[i % colors.length] +
            Math.floor(70 + Math.random() * 85).toString(16);
          ctx.save();
          ctx.translate(Math.random() * S, Math.random() * H);
          ctx.rotate((Math.random() - 0.5) * 0.7);
          ctx.fillRect(-50 - Math.random() * 75, -24 - Math.random() * 50,
            78 + Math.random() * 105, 42 + Math.random() * 75);
          ctx.restore();
        }
      } else if (style === 1) {
        // Lingkaran gradasi
        for (let i = 0; i < 6; i++) {
          const cx = Math.random() * S, cy = Math.random() * H, r = 44 + Math.random() * 88;
          const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          rg.addColorStop(0, colors[i % colors.length] + "dd");
          rg.addColorStop(1, colors[(i + 1) % colors.length] + "00");
          ctx.fillStyle = rg;
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        }
      } else if (style === 2) {
        // Lapisan horizontal
        [0.5, 0.72, 1].forEach((b, i, a) => {
          const from = H * (a[i - 1] || 0), to = H * b;
          const bg = ctx.createLinearGradient(0, from, 0, to);
          bg.addColorStop(0, colors[i % colors.length] + "cc");
          bg.addColorStop(1, colors[(i + 1) % colors.length] + "cc");
          ctx.fillStyle = bg;
          ctx.fillRect(0, from, S, to - from);
        });
      } else {
        // Kurva bezier
        for (let i = 0; i < 28; i++) {
          ctx.strokeStyle = colors[i % colors.length] +
            Math.floor(80 + Math.random() * 95).toString(16);
          ctx.lineWidth = 4 + Math.random() * 12;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(Math.random() * S, Math.random() * H);
          ctx.bezierCurveTo(Math.random() * S, Math.random() * H,
            Math.random() * S, Math.random() * H,
            Math.random() * S, Math.random() * H);
          ctx.stroke();
        }
      }

      // Vignette
      const vig = ctx.createRadialGradient(S / 2, H / 2, H * 0.1, S / 2, H / 2, H * 0.78);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,.36)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, S, H);
    }, 256, 1, 1);
  },

  /** Rak buku perpustakaan kuno */
  library() {
    return makeTexture((ctx, S) => {
      ctx.fillStyle = "#1a0e06";
      ctx.fillRect(0, 0, S, S);

      const shelfH = Math.floor(S / 4);
      const bookColors = [
        "#8B1a1a","#1a4a8B","#1a6b2a","#7a5a10","#5a1a6b","#8B4a1a",
        "#1a5a5a","#6b3a10","#2a2a8B","#8B6a1a","#3a6b1a","#6b1a3a",
        "#1a3a6b","#8B3a10","#4a8B1a","#8B1a5a","#107a7a","#5a8B10",
      ];

      for (let row = 0; row < 4; row++) {
        const sy = row * shelfH;
        const sg = ctx.createLinearGradient(0, sy + shelfH - 10, 0, sy + shelfH);
        sg.addColorStop(0, "#6b4a20"); sg.addColorStop(1, "#3a2408");
        ctx.fillStyle = sg;
        ctx.fillRect(0, sy + shelfH - 10, S, 10);
        ctx.fillStyle = "rgba(0,0,0,.5)";
        ctx.fillRect(0, sy + shelfH, S, 4);

        let x = 4;
        while (x < S - 8) {
          const bw = 14 + Math.floor(Math.random() * 18);
          const bh = shelfH - 18 - Math.floor(Math.random() * 14);
          const by = sy + shelfH - 10 - bh;
          const ci = Math.floor(Math.random() * bookColors.length);
          const bg = ctx.createLinearGradient(x, 0, x + bw, 0);
          bg.addColorStop(0, bookColors[ci] + "cc");
          bg.addColorStop(0.3, bookColors[ci]);
          bg.addColorStop(1, bookColors[(ci + 3) % bookColors.length] + "99");
          ctx.fillStyle = bg;
          ctx.fillRect(x, by, bw, bh);
          ctx.fillStyle = "rgba(0,0,0,.35)";
          ctx.fillRect(x, by, 1, bh);
          ctx.fillRect(x + bw - 1, by, 1, bh);
          ctx.fillStyle = "rgba(255,255,255,.18)";
          ctx.fillRect(x + 2, by + Math.floor(bh * 0.25), bw - 4, Math.floor(bh * 0.12));
          x += bw + 1;
        }
      }

      const vig = ctx.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S * 0.75);
      vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,.55)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, S, S);

      ctx.fillStyle = "rgba(200,160,80,.82)";
      ctx.font = "bold 22px Georgia,serif";
      ctx.textAlign = "center";
      ctx.fillText("PERPUSTAKAAN", S / 2, S * 0.88);
      ctx.fillStyle = "rgba(200,160,80,.45)";
      ctx.font = "12px Georgia,serif";
      ctx.fillText("DIGITAL", S / 2, S * 0.93);
    }, 512, 1, 1);
  },

  /** Dashboard statistik — bingkai StatLab */
  statistic() {
    return makeTexture((ctx, S) => {
      // Background gelap
      ctx.fillStyle = "#0a1628";
      ctx.fillRect(0, 0, S, S);

      // Grid halus
      ctx.strokeStyle = "rgba(0,229,200,0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= S; i += S / 8) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke();
      }

      // Bar chart
      const bars = [0.38, 0.62, 0.51, 0.78, 0.43, 0.88, 0.66, 0.57, 0.73, 0.45];
      const areaX = S * 0.08, areaW = S * 0.84;
      const baseY = S * 0.76, maxH = S * 0.46;
      const barW = areaW / bars.length;

      bars.forEach((h, i) => {
        const x = areaX + i * barW;
        const bh = h * maxH;
        const grad = ctx.createLinearGradient(x, baseY - bh, x, baseY);
        grad.addColorStop(0, "#00e5c8");
        grad.addColorStop(1, "rgba(0,100,180,0.6)");
        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, baseY - bh, barW - 5, bh);
      });

      // Garis kurva di atas bar
      ctx.strokeStyle = "#ffcc00";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.beginPath();
      bars.forEach((h, i) => {
        const x = areaX + (i + 0.5) * barW;
        const y = baseY - h * maxH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Titik data
      bars.forEach((h, i) => {
        const x = areaX + (i + 0.5) * barW;
        const y = baseY - h * maxH;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffcc00";
        ctx.fill();
      });

      // Garis dasar
      ctx.strokeStyle = "rgba(0,229,200,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(areaX, baseY);
      ctx.lineTo(areaX + areaW, baseY);
      ctx.stroke();

      // Angka sumbu Y (kiri)
      ctx.fillStyle = "rgba(0,229,200,0.45)";
      ctx.font = `${S * 0.04}px monospace`;
      ctx.textAlign = "right";
      ["1.0", "0.5", "0.0"].forEach((lbl, i) => {
        ctx.fillText(lbl, areaX - 4, baseY - [maxH, maxH / 2, 0][i] + 4);
      });

      // Mini pie chart kanan atas
      const pcx = S * 0.78, pcy = S * 0.22, pr = S * 0.1;
      const slices = [
        { pct: 0.35, color: "#00e5c8" },
        { pct: 0.28, color: "#00aaf5" },
        { pct: 0.22, color: "#ffcc00" },
        { pct: 0.15, color: "#ff6b6b" },
      ];
      let startAngle = -Math.PI / 2;
      slices.forEach(({ pct, color }) => {
        const angle = pct * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(pcx, pcy);
        ctx.arc(pcx, pcy, pr, startAngle, startAngle + angle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        startAngle += angle;
      });
      ctx.strokeStyle = "#0a1628";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(pcx, pcy, pr, 0, Math.PI * 2); ctx.stroke();

      // Vignette
      const vig = ctx.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S * 0.78);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, S, S);

      // Judul utama
      ctx.fillStyle = "rgba(0,229,200,0.95)";
      ctx.font = `bold ${S * 0.09}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText("STATLAB", S / 2, S * 0.13);

      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = `${S * 0.038}px monospace`;
      ctx.fillText("v2.0  —  Analisis Statistik", S / 2, S * 0.21);

      // Label bawah
      ctx.fillStyle = "rgba(0,229,200,0.4)";
      ctx.font = `${S * 0.032}px monospace`;
      ctx.fillText("Riset · Lab · Keuangan", S / 2, S * 0.9);
    }, 512, 1, 1);
  },

  /** Tekstur wajah kubus 3D — icon besar + label + ornamen border */
  cubeFace(label, icon, bgHex, accentHex) {
    const S   = 256;
    const cv  = document.createElement("canvas");
    cv.width  = cv.height = S;
    const ctx = cv.getContext("2d");

    ctx.fillStyle = bgHex; ctx.fillRect(0,0,S,S);

    ctx.strokeStyle = accentHex+"1a"; ctx.lineWidth = 0.8;
    for (let i=0; i<S; i+=S/8) {
      ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(S,i); ctx.stroke();
    }

    ctx.strokeStyle = accentHex+"70"; ctx.lineWidth=6;
    ctx.strokeRect(10,10,S-20,S-20);
    ctx.strokeStyle = accentHex+"30"; ctx.lineWidth=1.5;
    ctx.strokeRect(18,18,S-36,S-36);

    [[18,18],[S-18,18],[18,S-18],[S-18,S-18]].forEach(([cx,cy]) => {
      const dx=cx<S/2?1:-1, dy=cy<S/2?1:-1;
      ctx.strokeStyle=accentHex+"cc"; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+dx*18,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx,cy+dy*18); ctx.stroke();
    });

    const g=ctx.createRadialGradient(S/2,S/2,0,S/2,S/2,S*0.4);
    g.addColorStop(0,accentHex+"2a"); g.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=g; ctx.fillRect(0,0,S,S);

    ctx.fillStyle=accentHex;
    ctx.font=`bold ${Math.round(S*0.30)}px monospace`;
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(icon,S/2,S*0.42);

    ctx.fillStyle=accentHex+"ee";
    ctx.font=`bold ${Math.round(S*0.074)}px sans-serif`;
    ctx.textBaseline="alphabetic";
    ctx.fillText(label,S/2,S*0.83);

    const t=new THREE.CanvasTexture(cv);
    t.encoding=THREE.sRGBEncoding;
    return t;
  },

  /** Life Dashboard — progress rings + habit grid + sparkline */
  lifeDashboard() {
    return makeTexture((ctx, S) => {
      const H = S * 0.82;

      // Background gelap ungu
      ctx.fillStyle = "#0a0f1e";
      ctx.fillRect(0, 0, S, H);

      // Grid dots subtle
      ctx.fillStyle = "rgba(124,58,237,0.10)";
      for (let x = 16; x < S; x += 22) {
        for (let y = 16; y < H; y += 22) {
          ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
        }
      }

      // ── Progress rings (kiri) ─────────────────────────────
      const rings = [
        { pct: 0.78, color: "#a855f7", label: "Habit", r: 54 },
        { pct: 0.62, color: "#06b6d4", label: "Sleep", r: 38 },
        { pct: 0.91, color: "#10b981", label: "Goal",  r: 22 },
      ];
      const rcx = S * 0.28, rcy = H * 0.42;

      rings.forEach(({ pct, color, r }) => {
        // Track
        ctx.beginPath();
        ctx.arc(rcx, rcy, r, 0, Math.PI * 2);
        ctx.strokeStyle = color + "22";
        ctx.lineWidth = 6;
        ctx.stroke();
        // Fill arc
        ctx.beginPath();
        ctx.arc(rcx, rcy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      // Center text
      ctx.fillStyle = "#e2e8f0";
      ctx.font = `bold ${S * 0.075}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("78%", rcx, rcy);
      ctx.fillStyle = "rgba(200,200,220,0.45)";
      ctx.font = `${S * 0.038}px sans-serif`;
      ctx.fillText("today", rcx, rcy + S * 0.065);

      // ── Habit grid (kanan atas) ──────────────────────────
      const gx = S * 0.54, gy = H * 0.10;
      const cols = 10, rows = 5, cell = 14, gap = 4;
      const filled = [1,1,0,1,1,1,0,1,1,0, 1,0,1,1,1,0,1,1,0,1,
                       1,1,1,0,1,1,1,0,1,1, 0,1,1,1,0,1,1,1,1,0,
                       1,1,0,1,1,1,0,1,1,1];
      for (let r = 0; r < rows; r++) {
        for (let co = 0; co < cols; co++) {
          const i = r * cols + co;
          ctx.fillStyle = filled[i]
            ? `rgba(168,85,247,${0.45 + (filled[i] * 0.45)})`
            : "rgba(124,58,237,0.12)";
          const rx = gx + co * (cell + gap);
          const ry = gy + r  * (cell + gap);
          ctx.fillRect(rx, ry, cell, cell);
        }
      }
      ctx.fillStyle = "rgba(200,180,255,0.5)";
      ctx.font = `${S * 0.038}px sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText("Habits  ·  50/50", gx, gy - 8);

      // ── Sparkline (bawah kanan) ──────────────────────────
      const sx = S * 0.52, sy = H * 0.62, sw = S * 0.42, sh = H * 0.22;
      const pts = [0.4,0.55,0.48,0.72,0.65,0.80,0.68,0.75,0.88,0.82,0.91];
      ctx.fillStyle = "rgba(16,185,129,0.08)";
      ctx.beginPath();
      ctx.moveTo(sx, sy + sh);
      pts.forEach((v, i) => {
        ctx.lineTo(sx + (i / (pts.length - 1)) * sw, sy + sh * (1 - v));
      });
      ctx.lineTo(sx + sw, sy + sh);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      pts.forEach((v, i) => {
        const px = sx + (i / (pts.length - 1)) * sw;
        const py = sy + sh * (1 - v);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
      // Last point dot
      const lx = sx + sw, ly = sy + sh * (1 - pts[pts.length - 1]);
      ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981"; ctx.fill();

      ctx.fillStyle = "rgba(200,255,220,0.45)";
      ctx.font = `${S * 0.038}px sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText("Progress  ·  7 days", sx, sy - 8);

      // ── Stats row ────────────────────────────────────────
      const stats = [
        { val: "12", lbl: "Habits" },
        { val: "7h", lbl: "Sleep"  },
        { val: "3",  lbl: "Tasks"  },
      ];
      stats.forEach(({ val, lbl }, i) => {
        const bx = S * (0.10 + i * 0.30), by = H * 0.78;
        ctx.fillStyle = "rgba(124,58,237,0.18)";
        ctx.fillRect(bx, by, S*0.24, S*0.10);
        ctx.fillStyle = "#c084fc";
        ctx.font = `bold ${S * 0.068}px monospace`;
        ctx.textAlign = "center";
        ctx.fillText(val, bx + S*0.12, by + S*0.07);
        ctx.fillStyle = "rgba(200,180,255,0.45)";
        ctx.font = `${S * 0.032}px sans-serif`;
        ctx.fillText(lbl, bx + S*0.12, by + S*0.095);
      });

      // ── Judul ─────────────────────────────────────────────
      ctx.fillStyle = "#a855f7";
      ctx.font = `bold ${S * 0.082}px monospace`;
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(168,85,247,0.4)";
      ctx.shadowBlur = 10;
      ctx.fillText("LIFE", S / 2, H * 0.096);
      ctx.fillStyle = "#c084fc";
      ctx.font = `bold ${S * 0.060}px monospace`;
      ctx.fillText("DASHBOARD", S / 2, H * 0.160);
      ctx.shadowBlur = 0;

      // Vignette
      const vig = ctx.createRadialGradient(S/2,H/2,H*0.1,S/2,H/2,H*0.78);
      vig.addColorStop(0,"rgba(0,0,0,0)");
      vig.addColorStop(1,"rgba(0,0,0,0.40)");
      ctx.fillStyle = vig; ctx.fillRect(0,0,S,H);

    }, 512, 1, 1);
  },

  /**
   * Placeholder untuk slot galeri foto saat PNG belum ada.
   * Menampilkan nomor slot + ikon kamera + border emas.
   * @param {number} idx – nomor slot (1-5)
   */
  galleryPlaceholder(idx) {
    return makeTexture((ctx, S) => {
      const H = S;
      ctx.fillStyle = "#0e0c08";
      ctx.fillRect(0, 0, S, H);

      // Border emas
      ctx.strokeStyle = "rgba(200,160,80,0.6)";
      ctx.lineWidth = 6;
      ctx.strokeRect(12, 12, S - 24, H - 24);
      ctx.strokeStyle = "rgba(200,160,80,0.2)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, 20, S - 40, H - 40);

      // Sudut ornamen
      [[20,20],[S-20,20],[20,H-20],[S-20,H-20]].forEach(([cx,cy]) => {
        const dx = cx < S/2 ? 1 : -1, dy = cy < H/2 ? 1 : -1;
        ctx.strokeStyle = "rgba(200,160,80,0.8)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+dx*20,cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx,cy+dy*20); ctx.stroke();
      });

      // Ikon kamera (garis)
      const ccx = S/2, ccy = H * 0.42, cw = S*0.28, ch = S*0.20;
      ctx.strokeStyle = "rgba(200,160,80,0.35)"; ctx.lineWidth = 2;
      ctx.strokeRect(ccx - cw/2, ccy - ch/2, cw, ch);
      // Lensa
      ctx.beginPath(); ctx.arc(ccx, ccy, cw*0.28, 0, Math.PI*2);
      ctx.stroke();
      // Flash bump
      const bx = ccx - cw*0.28, by = ccy - ch/2;
      ctx.strokeRect(bx, by - ch*0.25, cw*0.2, ch*0.25);

      // Nomor slot
      ctx.fillStyle = "rgba(200,160,80,0.7)";
      ctx.font = `bold ${S*0.10}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("0" + idx, S/2, H * 0.70);

      // Label
      ctx.fillStyle = "rgba(200,160,80,0.35)";
      ctx.font = `${S*0.045}px sans-serif`;
      ctx.fillText("Galeri " + idx, S/2, H * 0.84);

      // Vignette
      const vig = ctx.createRadialGradient(S/2,H/2,H*0.12,S/2,H/2,H*0.72);
      vig.addColorStop(0,"rgba(0,0,0,0)");
      vig.addColorStop(1,"rgba(0,0,0,0.50)");
      ctx.fillStyle = vig; ctx.fillRect(0,0,S,H);
    }, 256, 1, 1);
  },

};
