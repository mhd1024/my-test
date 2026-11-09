# Sumber skill ini

- Asal: [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify), file `graphify/skill.md`
  plus `graphify/skills/claude/references/` (sama dengan yang dipasang `graphify install` untuk Claude Code)
- Versi: commit `6c8002e` (paket `graphifyy` 0.9.104)
- Lisensi: Apache License 2.0 (`LICENSE`, `NOTICE`)

## Perubahan lokal (versi aman)

Hanya `SKILL.md` yang diubah; `references/` disalin apa adanya.

1. **Pemicu dipersempit.** Deskripsi asli: "Use for any question about a codebase…", yang membuat skill
   aktif di hampir setiap permintaan. Sekarang hanya aktif saat pengguna mengetik `/graphify` atau
   eksplisit meminta graph graphify.
2. **Tidak ada pemasangan diam-diam.** Langkah 1 asli menjalankan `uv tool install --upgrade graphifyy`
   atau `pip install graphifyy --break-system-packages` bila CLI belum ada, dan deteksinya memakai
   `uv tool run --from graphifyy` yang ikut mengunduh dan menjalankan paket. Keduanya diganti:
   deteksi hanya melihat yang sudah terpasang, dan bila belum ada, AI berhenti dan meminta izin untuk
   `uv tool install graphifyy==0.9.104` (versi tetap).
3. **Konfirmasi sebelum boros token.** Ekstraksi semantik (dokumen, PDF, gambar, video) menjalankan
   banyak subagent; AI harus menyebut perkiraan jumlahnya dan menunggu persetujuan. Ekstraksi kode
   saja (AST, tanpa LLM) tetap jalan tanpa konfirmasi.
4. `graphify-out/` tidak di-commit tanpa permintaan.

Tidak memasang hook dan tidak mengubah `CLAUDE.md` (yang biasanya dilakukan `graphify install`).

## Hasil pemeriksaan

- Tidak ada telemetri; log kueri hanya aktif bila diaktifkan lewat environment variable.
- SkillSpector `--no-llm`: skor 100/100 baik sebelum maupun sesudah perubahan. Setelah dicek baris per
  baris, semua temuan HIGH adalah salah tanda: `rm -f graphify-out/.graphify_*.json` (menghapus cache
  miliknya sendiri) dan frasa "without warning"/"NO warning" yang justru instruksi keamanan.
  Dua temuan "unpinned package" dari perintah unduh otomatis hilang setelah perubahan.
- Penilaian akhir: CAUTION. Aman dipakai dengan guardrail di atas; paling berguna untuk codebase besar.
