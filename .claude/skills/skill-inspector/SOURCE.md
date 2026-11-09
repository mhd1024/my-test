# Sumber skill ini

- Asal: [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector), folder `skills/skill-inspector/`
- Versi: commit `e48d771` (SkillSpector 2.12.0), disalin tanpa perubahan
- Lisensi: Apache License 2.0 (lihat `LICENSE` di folder ini)

Skill ini memakai CLI `skillspector` bila tersedia. Tanpa CLI, skill tetap
berjalan dengan pemeriksaan manual (lihat bagian "Manual Fallback" di `SKILL.md`).

Pasang CLI (sekali per mesin/lingkungan):

```bash
uv tool install git+https://github.com/NVIDIA/skillspector.git
```

Pemakaian aman yang disarankan: `skillspector scan <target> --no-llm`
(tanpa `--no-llm`, isi file dikirim ke penyedia AI yang dikonfigurasi).
