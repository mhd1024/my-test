# Sumber skill ini

- Asal: [vercel-labs/skills](https://github.com/vercel-labs/skills), folder `skills/find-skills/`
- Versi: commit `d3701c1` (CLI `skills` 1.7.6)
- Lisensi: MIT (lihat `LICENSE` di folder ini)
- Perubahan lokal: bagian **Local Guardrails** di akhir `SKILL.md` ditambahkan di repo ini
  (wajib review dengan `skill-inspector` sebelum memasang, tanpa `-y` tanpa persetujuan,
  utamakan pemasangan per proyek, matikan telemetri CLI). Sisanya tidak diubah.

Hasil SkillSpector (`--no-llm`): skor 12/100, LOW, SAFE. 12 temuan MEDIUM "MCP Rug Pull"
semuanya karena `npx skills` disebut tanpa versi tetap; bukan perilaku berbahaya.
