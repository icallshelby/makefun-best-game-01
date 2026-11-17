#!/usr/bin/env bash
# Lanjutan best-game-01 EMBERFLOCK via Gemini CLI (gemini-3.5-flash-lite).
# Sesi build sebelumnya menulis semua kode game lalu mati di retry-loop kuota.
# Sesi ini LEAN: hanya screenshot + verifikasi + SHIP-READY (konteks kecil = hemat token).
set -uo pipefail
cd /home/hatch/workspace/makefun/entry-best-game-01
PROMPT_FILE=/home/hatch/workspace/makefun/gemini-cli/best-game-01-continue-prompt.txt
LOG=/home/hatch/workspace/makefun/entry-best-game-01/build-35flash-lite-continue.log
PREAMBLE='SESI LANJUTAN best-game-01 EMBERFLOCK. Jam sekarang ~18:45 WIB 17 Nov 2026, deadline submit 19 Nov 01:00 WIB. Kode game SUDAH ditulis sesi sebelumnya (main.ts, README.md, game/src/*.js semua ada) — tugasmu HANYA: hapus reference-starter-main.ts, sesuaikan shots, verifikasi, 4 screenshot real, SHIP-READY.md. Jangan tulis ulang game. Kalau kuota habis di tengah, tulis SHIP-READY.md + keadaan terakhir lalu BERHENTI. JANGAN buat repo GitHub, JANGAN push, JANGAN bundle transcript, JANGAN submit — parent yang menangani setelah kamu selesai. Ikuti continue prompt di bawah ini persis.'
/home/hatch/workspace/makefun/gemini-cli/run-gemini.sh -p "$PREAMBLE

$(cat "$PROMPT_FILE")" --model gemini-3.5-flash-lite --yolo 2>&1 | tee "$LOG"
echo "GEMINI_EXIT=${PIPESTATUS[0]}" | tee -a "$LOG"
