#!/usr/bin/env bash
# Mikro best-game-01: tulis ulang main.ts (authored lines) via Gemini CLI 3.5-flash-lite.
set -uo pipefail
cd /home/hatch/workspace/makefun/entry-best-game-01
PROMPT_FILE=/home/hatch/workspace/makefun/gemini-cli/best-game-01-micro-main-prompt.txt
LOG=/home/hatch/workspace/makefun/entry-best-game-01/build-35flash-lite-micro.log
PREAMBLE='SESI MIKRO best-game-01: tulis ulang main.ts saja (kit gate thinking_reproduces menuntut entrypoint memuat baris yang kamu tulis sendiri). Jam ~19:00 WIB 17 Nov 2026, deadline submit 19 Nov 01:00 WIB. Ikuti micro prompt di bawah ini persis. JANGAN buat repo/push/bundle/submit.'
/home/hatch/workspace/makefun/gemini-cli/run-gemini.sh -p "$PREAMBLE

$(cat "$PROMPT_FILE")" --model gemini-3.5-flash-lite --yolo 2>&1 | tee "$LOG"
echo "GEMINI_EXIT=${PIPESTATUS[0]}" | tee -a "$LOG"
