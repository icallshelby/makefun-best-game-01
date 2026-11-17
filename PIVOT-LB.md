# best-game-01 — PIVOT DESIGN (perintah user 17 Nov 18:15 WIB: "contek yg lb 1-5")

## Pola leaderboard 1-5 (diambil live 17 Nov 18:16 WIB, source_withheld=true jadi hanya judul + rank yang terlihat)
1. Lanternkeep — "the lantern's light is your weapon; bounce it off mirror shards through ten nights across four realms"
2. SUNDERING LOOM — "weave tension wires into traps, pluck them to cut, 6 tapestries and the Porcelain Regent"
3. LANTERNWAKE — "light the lamps and hold the Beacon for seven nights"
4. Lamplight Tide — "bend the lighthouse beam through prisms to hold back seven nights of the deep"
5. Lumen Reef — "evolve a lantern-jelly through 4 Aspects, ride currents, sonar-break 2 bosses"

Pola pemenang: CAHAYA sebagai mekanik inti + PROGRESI MALAM (7-10 nights) + realm/boss + cermin/prisma. 4 dari 5 bertema lentera/cahaya.

## GESERAN (bukan copy): EMBERFLOCK — "Seven Nights of Light"
MURMURATION (boids flock) yang sudah didesain digeser ke pola pemenang: kawanan bukan burung jalak, tapi **kawanan ember-moth (ngengat bara)** yang cahayanya dipakai untuk menyalakan lampu. Mekanik inti TETAP flock-steering (boids: separation/alignment/cohesion + target ikuti mouse) — itu yang membedakan dari Lanternkeep (cahaya = senjata) dan LANTERNWAKE (nyalakan lampu statis). Di sini cahaya dibawa oleh kawanan yang bergerak.

- **Fantasi:** "Aku adalah Penjaga yang menggiring kawanan ngengat bara menyalakan lampu-lampu sebelum fajar."
- **Goal tiap malam:** nyalakan SEMUA lampu di realm sebelum timer malam habis. Lampu menyala saat kawanan melewatinya.
- **Cermin:** pecahan cermin memantulkan pijar kawanan — lampu yang terhalang tembok hanya bisa dinyalakan lewat pantulan (beam dari kawanan → cermin → lampu). Bonus pantulan +50.
- **Musuh:** shadow-wisps (gumpalan gelap) memangsa ngengat yang terpisah dari kawanan; kena = -3 ngengat. Kawanan < 12 ekor = kalah.
- **Progresi:** 7 malam, 3 realm — 1 Meadow (malam 1-2, tanpa wisp) · 2 Old Town (malam 3-5, cermin + 1-2 wisp) · 3 The Deep (malam 6-7, cermin + 3 wisp, cahaya meredup, lampu makin penting).
- **Skor:** lampu 100 · pantulan cermin 50 · near-miss wisp 15 · bonus sisa waktu per detik · bonus formasi rapat +25.
- **Menang game:** selesaikan 7 malam → layar "Dawn Breaks" + total skor + restart. **Kalah:** timer habis ATAU kawanan < 12.
- **Kontrol:** mouse = titik pimpin; klik/Space = burst (laju + formasi rapat, stamina); P pause, R restart, M mute.
- **Palet (disiplin):** langit senja 3-band (indigo dalam → ungu → amber horizon); ngengat emas berpijar dengan glow; lampu emas hangat; cermin perak-biru; HUD putih tulang. TIDAK ada warna di luar palet kecuali wisp (hitam-ungu) dan aksen.
- **Audio:** 100% prosedural WebAudio (desir, denting saat lampu menyala, detak saat wisp dekat). Tanpa aset eksternal.
- **Screenshot (4, staged, real renders):** 1-start (judul + kawanan + lampu pertama) · 2-play (kawanan + pantulan cermin + HUD malam 3) · 3-beacon (Beacon menyala, malam 7) · 4-end (Dawn Breaks / game over + skor + restart).
