#!/usr/bin/env bash
# Build best-game-01 EMBERFLOCK via Gemini CLI (gemini-3-flash-preview).
# Launcher file (bukan command line panjang) — sesi jalan di background.
set -uo pipefail
cd /home/hatch/workspace/makefun/entry-best-game-01
PROMPT_FILE=/home/hatch/workspace/makefun/gemini-cli/best-game-01-prompt.txt
LOG=/home/hatch/workspace/makefun/entry-best-game-01/build-3flash-preview.log
PREAMBLE='SESI BUILD best-game-01 EMBERFLOCK. Jam sekarang ~18:40 WIB 17 Nov 2026, deadline submit 19 Nov 01:00 WIB. Target sesi ini: game LENGKAP + playable + 4 screenshot real + SHIP-READY.md. Kalau belum selesai, tulis SHIP-READY.md berisi NO SHIP + keadaan terakhir lalu BERHENTI.
Kit kompetisi INI sudah diunduh & diekstrak: /home/hatch/workspace/makefun/best-game-01-kit/ (cli/makefun.mjs, starter/, RULES.txt). Desain pivot + pola LB 1-5: PIVOT-LB.md di cwd (BACA DULU).
Work dir kamu (cwd): /home/hatch/workspace/makefun/entry-best-game-01/ — game/ kerangka starter + vendor/makefun-game.ts + serve.ts + shots.json + LICENSE sudah disiapkan; main.ts + README.md BELUM ada (tulis sendiri di sesi ini).
Model sesi ini: gemini-3-flash-preview. JANGAN buat repo GitHub, JANGAN push, JANGAN bundle transcript, JANGAN submit — parent yang menangani setelah kamu selesai. Ikuti builder prompt di bawah ini persis.'
/home/hatch/workspace/makefun/gemini-cli/run-gemini.sh -p "$PREAMBLE

$(cat "$PROMPT_FILE")" --model gemini-3-flash-preview --yolo 2>&1 | tee "$LOG"
echo "GEMINI_EXIT=${PIPESTATUS[0]}" | tee -a "$LOG"
