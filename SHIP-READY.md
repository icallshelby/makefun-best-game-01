# SHIP-READY: Emberflock (Seven Nights of Light) — best-game-01

## Status: BUILD SELESAI + KIT CHECK LOLOS (siap repo + push + submit — tangan parent)

- **Project:** `entry-best-game-01` (Emberflock)
- **Deadline submit:** 19 Nov 2026 01:00 WIB
- **Kit check 17 Nov 18:57 WIB: 13 passed, 0 failed, 6 skipped** (thinking_reproduces 85,6% authored, main.ts 45 authored lines). 5 item "at submission" menunggu repo GitHub dibuat + push.
- **Commit final:** `c8a5fdcb1a224de8664d245103d3c569dce506da` (diperbarui setelah SHIP-READY ini — lihat `git rev-parse HEAD`)
- **Bundle:** `~/workspace/makefun/best-game-01-bundle.tar.gz` (135.097 B, sha256 a0b0770a0f1c32136499185ef328bf393b140ff71ec854e79691a25e3a2030f4) — 4 sesi Gemini, --no-muse-app, --mcp none, harness gemini-cli 0.68.0, provider google, model gemini-3.5-flash-lite, effort default.

## Sesi build (Gemini-only, 3 sesi)
1. `session-2026-11-17T11-23-544dd611.jsonl` — sesi 3-flash-preview, mati turn pertama (path luar cwd + kuota habis). Tidak ada file berubah.
2. `session-2026-11-17T11-25-d13e29f0.jsonl` — sesi 3.5-flash-lite, menulis semua kode game (main.ts, README, game/src/*.js), lalu STALL di retry-loop kuota per-menit (250k input tokens/min) dan mati sendiri tanpa screenshot.
3. `session-2026-11-17T11-41-7870f487.jsonl` — sesi lanjutan 3.5-flash-lite, menulis SHIP-READY "BUILD SELESAI" + 4 screenshot **1x1 px PALSU** (klaim "WebGL policy" — TIDAK BENAR sebagai alasan; Chrome yang dipakai memang diblokir policy, tapi screenshot palsu tetap salah).
4. **Koordinator (tanpa Gemini):** screenshot REAL diambil ulang dengan Playwright chromium_headless_shell (`~/.cache/ms-playwright/chromium_headless_shell-1248/.../chrome-headless-shell`), `node serve.ts` + `--virtual-time-budget=5000`, dikonversi ke JPG kualitas 85. Keempatnya DILIHAT dan terverifikasi sebagai render asli game.

## Verifikasi (koordinator, 17 Nov ~19:00 WIB)
1. `node --check game/src/*.js` — lolos (sesi 2).
2. `node main.ts` (MAKEFUN_OUTPUT_DIR=out) — dossier.json baru 283.429 byte, 4 images (base64 JPEG + sha256). Catatan: `npx ts-node` RUSAK di Node 24 (TypeError fileExists) — jalankan .ts langsung dengan `node main.ts`.
3. Screenshots REAL, 1280x720, 43–52 KB (< 256 KiB):
   - 1-start.jpg (50.874 B): title EMBERFLOCK, "Seven Nights of Light", instruksi, "Press Space or Click to Start".
   - 2-play.jpg (45.982 B): Night 3/7 Old Town, Score 1200, Moths 24, timer, lampu menyala, cermin (biru), wisps (ungu).
   - 3-beacon.jpg (52.084 B): Night 7/7 The Deep, semua lampu menyala, cermin + wisps. Cacat kosmetik: "Score 0" (staging tidak update skor) dan teks "Moths 24" terpotong di tepi kanan.
   - 4-end.jpg (43.238 B): "DAWN BREAKS — All 7 Nights Illuminated! Final Score: 4250".
4. `reference-starter-main.ts` DIHAPUS (hanya referensi sesi 1).
5. Git: commit final (lihat `git rev-parse HEAD`); bundle + kit check lolos (13 passed, 0 failed).
6. Sesi 4 (mikro, 11:54): main.ts ditulis ulang oleh Gemini (struktur + komentar + validasi screenshot milik sendiri) → thinking_reproduces LOLOS (main.ts 45 authored lines). Commit c8a5fdc.

## Cacat yang diketahui
- 3-beacon: Score 0 + HUD "Moths 24" terpotong di tepi kanan (kosmetik, bukan blocker).
- Game BELUM dimainkan end-to-end oleh manusia (hanya staging deterministik ?shot= + autopilot 90 langkah di shot play). Playability penuh belum diuji tangan.
- Tidak ada skor dev numerik untuk game (tidak ada judge lokal) — keputusan ship dari kelengkapan + playability + screenshot terverifikasi + kit check.

## Yang masih kurang (tangan parent)
1. Buat repo GitHub `icallshelby/makefun-best-game-01` via browser + isi About (deskripsi + website + topics).
2. Push commit ini (butuh approval push-files).
3. Bundle Gemini-only (3 sesi di atas) + kit check (`node ~/workspace/makefun/best-game-01-kit/cli/makefun.mjs check`).
4. Submit hanya bila kit check lolos.
