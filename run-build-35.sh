#!/usr/bin/env bash
# Build best-game-01 EMBERFLOCK via Gemini CLI (gemini-3.5-flash-lite).
# Launcher file (bukan command line panjang) — sesi jalan di background.
# SESI 1 (3-flash-preview) MATI di turn pertama: kuota 3-flash-preview habis (429, retry ~20 jam) + sesi tidak bisa baca file di luar cwd. Perbaikan: semua referensi sudah di dalam cwd (reference-starter-main.ts).
set -uo pipefail
cd /home/hatch/workspace/makefun/entry-best-game-01
PROMPT_FILE=/home/hatch/workspace/makefun/gemini-cli/best-game-01-prompt.txt
LOG=/home/hatch/workspace/makefun/entry-best-game-01/build-35flash-lite.log
PREAMBLE='SESI BUILD best-game-01 EMBERFLOCK (percobaan ke-2; sesi pertama mati di turn pertama karena kuota model habis — jangan ulangi baca file di luar cwd). Jam sekarang ~18:55 WIB 17 Nov 2026, deadline submit 19 Nov 01:00 WIB. Target sesi ini: game LENGKAP + playable + 4 screenshot real + SHIP-READY.md. Kalau belum selesai, tulis SHIP-READY.md berisi NO SHIP + keadaan terakhir lalu BERHENTI.
SEMUA referensi ada di dalam cwd ini (jangan baca path di luar cwd — CLI menolaknya): PIVOT-LB.md (desain + pola LB 1-5, BACA DULU), reference-starter-main.ts (template main.ts kit, HAPUS sebelum selesai), game/ kerangka starter, vendor/makefun-game.ts (JANGAN DIUBAH), serve.ts, shots.json, LICENSE.
Model sesi ini: gemini-3.5-flash-lite (kuota tersisa sedikit — kerja efisien, jangan buang turn untuk hal sepele; kalau kuota habis di tengah, tulis SHIP-READY.md + keadaan terakhir lalu BERHENTI). JANGAN buat repo GitHub, JANGAN push, JANGAN bundle transcript, JANGAN submit — parent yang menangani setelah kamu selesai. Ikuti builder prompt di bawah ini persis.'
/home/hatch/workspace/makefun/gemini-cli/run-gemini.sh -p "$PREAMBLE

$(cat "$PROMPT_FILE")" --model gemini-3.5-flash-lite --yolo 2>&1 | tee "$LOG"
echo "GEMINI_EXIT=${PIPESTATUS[0]}" | tee -a "$LOG"
