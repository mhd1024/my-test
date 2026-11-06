# Spesifikasi Desain UI/UX — Portofolio Mochamad Ramdhan

Dokumen ini menyusun ulang keputusan desain website portofolio mengikuti urutan kerja 1–11 pada *Prinsip dan Arahan Perancangan Desain UI/UX Website*. Bagian 10 mengevaluasi implementasi yang sudah online saat ini terhadap spesifikasi ini. Bagian 11 berisi rencana implementasi yang menunggu persetujuan.

Status: diimplementasikan. Bagian 10 adalah evaluasi terhadap versi sebelumnya (commit `86d1eb0`); semua temuan 1–12 sudah ditangani, temuan 13 menunggu data dari pemilik.

---

## 1. Tujuan Website dan Karakteristik Pengguna

**Tujuan utama:** memperlihatkan karya (proyek) dan mengubah kunjungan menjadi kontak.
**Tujuan sekunder:** membangun kredibilitas melalui latar belakang, keahlian, dan identitas visual yang matang.

| Pengguna | Kebutuhan | Pertanyaan yang harus terjawab dalam 10 detik | Tindakan yang diharapkan |
|---|---|---|---|
| Rekruter / HR studio kreatif atau perusahaan teknologi | Menilai kecocokan peran dengan cepat | Siapa dia, bidangnya apa, buktinya mana? | Membuka proyek, lalu menghubungi atau membuka GitHub |
| Klien (production house, pembuat konten) | Mencari orang yang bisa menyelesaikan masalah audio/video dengan teknologi | Pernah membuat apa yang relevan untuk saya? | Membuka detail proyek, lalu mengirim pesan |
| Kolaborator / komunitas developer | Melihat kode dan cara berpikir | Di mana repositorinya? | Membuka GitHub |

**Ukuran keberhasilan:** klik CTA "Lihat Proyek", pembukaan detail proyek, pengiriman pesan dari sheet kontak, dan klik tautan GitHub.

**Konteks perangkat:** sebagian besar tautan portofolio dibuka dari LinkedIn atau pesan di ponsel. Mobile diperlakukan sebagai tampilan utama yang setara dengan desktop, bukan versi turunan.

---

## 2. Design Direction

**Aliran utama: Liquid Glass** (bahasa material kaca optis yang terinspirasi iOS).
**Aliran pendukung: Minimalism.**

**Alasan konseptual:** pemilik portofolio berada di persimpangan teknologi dan film. Kaca optis adalah **lensa**, alat yang sama-sama dipakai di kamera dan di layar. Metafora "cahaya yang dibiaskan lensa" menjadi benang merah identitas. Latar berupa pita cahaya merepresentasikan cahaya sinematik, dan permukaan kaca adalah lensa yang membiaskannya.

**Aturan aliran (agar tidak menjadi glassmorphism generik):**

1. **Kaca hanya untuk lapisan fungsional:** navigasi, kontrol, kartu, panel, dan sheet. Konten (teks, foto) tidak pernah diberi efek kaca.
2. **Maksimal dua lapis kaca bertumpuk** di satu titik. Contohnya tombol di atas kartu; tidak lebih.
3. **Tidak ada dekorasi kaca yang mengambang tanpa fungsi.** Setiap bentuk kaca harus berupa komponen yang bisa disentuh atau wadah konten.
4. **Kaca bening, bukan buram.** Blur rendah (3–7 px) ditambah refraksi di tepi. Blur tinggi (14 px) hanya untuk sheet modal, agar fokus berpindah ke dialog.
5. **Minimalism mengatur jumlah.** Satu titik fokus per layar, satu aksen warna (biru-violet), dan ruang kosong yang luas.

---

## 3. Design Pattern dan Layout Architecture

| Pola | Dipakai di | Alasan |
|---|---|---|
| **Sticky Floating Header** (desktop) | Navigasi atas | Navigasi selalu terjangkau tanpa menutupi konten. Kaca melayang memperlihatkan kedalaman. |
| **Floating Tab Bar** (mobile) | Navigasi bawah | Berada di zona jempol, sesuai pola native iOS dan Android. |
| **Asymmetric Split Hero** | Beranda | Teks di kolom 1–6 dan foto di kolom 7–12 yang melebar sampai tepi layar. Keseimbangan asimetris: blok teks yang padat diimbangi foto besar yang ringan. |
| **Layered / Overlapping Composition** | Panel Tentang menumpuk 40 px di atas hero | Menegaskan kedalaman lapisan kaca dan menjembatani dua section. |
| **Card-Based Grid** | Proyek | Tiga kartu setara dalam 3 × 4 kolom, memberi irama pengulangan yang jelas. |
| **Modular Grouped Grid** | Keahlian | Keahlian dikelompokkan per kategori agar bisa dipindai, bukan 12 chip setara. |
| **Split Band** | Kontak | Ajakan di kiri dan tautan sosial di kanan; penutup halaman yang tegas. |

**Grid:**

| Breakpoint | Lebar | Kolom | Gutter | Margin |
|---|---|---|---|---|
| Desktop | ≥ 1024 px | 12 | 24 px | auto, konten maks 1180 px |
| Tablet | 721–1023 px | 8 | 20 px | 40 px |
| Mobile | ≤ 720 px | 4 | 16 px | 16 px |

---

## 4. Information Architecture dan User Flow

**Struktur halaman (single page dengan anchor):**

```
Beranda (Hero)
└─ Tentang
   ├─ Profil singkat + data diri
   └─ Keahlian (dikelompokkan)          ← dipindah ke bawah Tentang
Proyek
   └─ Detail proyek (sheet)             ← baru
Kontak
   └─ Form pesan (sheet)
Footer
```

**Usulan perubahan:** Keahlian dipindah menjadi sub-bagian Tentang. Alur ceritanya menjadi *siapa saya → apa yang saya kuasai → buktinya (proyek) → mari bekerja sama*. Navigasi tetap 4 item (Beranda, Tentang, Proyek, Kontak), dan highlight "Tentang" mencakup Keahlian, sehingga tidak ada section tanpa pasangan menu.

**User flow:**

```
Rekruter:     Hero ─[Lihat Proyek]→ Proyek ─[kartu]→ Sheet detail ─[Hubungi]→ Sheet kontak
Klien:        Hero → scroll → Proyek ─[filter AI/Film]→ Sheet detail ─[Diskusikan proyek serupa]→ Sheet kontak (subjek terisi)
Kolaborator:  Tentang ─[GitHub]→ github.com  |  Sheet detail ─[Lihat kode]→ repositori
```

---

## 5. Design System dan Visual Language

### 5.1 Warna

**Mode gelap (default)**

| Token | HEX | Penggunaan | Kontras di `bg` |
|---|---|---|---|
| `bg` | `#04061A` | Latar halaman | — |
| `bg-2` | `#0A0D2C` | Latar sekunder, gradasi | — |
| `surface-solid` | `#12163A` | Pengganti kaca saat *reduced transparency* | — |
| `ink` | `#EEF1FF` | Heading, teks utama | 17.8 : 1 |
| `ink-2` | `#C3C9E6` | Body, label | 12.3 : 1 |
| `ink-3` | `#9AA3C7` *(sebelumnya `#8A92B8`)* | Teks sekunder, metadata | 8.1 : 1; 4.8 : 1 di kaca paling terang |
| `accent` | `#6F8BFF` | Elemen interaktif aktif, slider, switch | 6.5 : 1 |
| `accent-2` | `#9B7BFF` | Pasangan gradasi aksen | — |
| `accent-soft` | `#A9B8FF` | Ikon/label tab aktif di atas kaca | 10.5 : 1 |
| `danger` | `#FF7A90` | Pesan error form | 8.1 : 1 |
| `success` | `#5FE3A8` | Konfirmasi | — |

**Gradasi identitas:** `#6C8CFF → #8F86FF → #B9A6FF` (100°). Hanya dipakai di nama belakang pada H1 dan tombol primer di sheet, sebagai satu titik penekanan warna per layar.

**Mode terang**

| Token | HEX | Kontras di `#E9ECF8` |
|---|---|---|
| `bg` | `#E9ECF8` | — |
| `ink` | `#0D1230` | 15.5 : 1 |
| `ink-2` | `#33395C` | 9.5 : 1 |
| `ink-3` | `#5A6185` *(sebelumnya `#646B8F`)* | 5.1 : 1 |
| `accent` | `#3D55C8` | 5.4 : 1 |

Semua pasangan teks memenuhi WCAG AA (≥ 4.5 : 1 untuk teks normal).

### 5.2 Material Kaca

| Token | Nilai | Dipakai di |
|---|---|---|
| `glass-frost-clear` | blur 3 px, refraksi 26 | Tombol, chip, ikon bulat, segmented control |
| `glass-frost-panel` | blur 7 px, refraksi 46 | Panel Tentang, Kontak, kartu, tab bar |
| `glass-frost-sheet` | blur 14 px | Sheet modal |
| `glass-tint` | `rgba(150,165,255,.06)` | Warna dasar kaca |
| `glass-rim` | gradasi 140°: `#FFFFFF` 85% → transparan di 32% | Pantulan tepi kiri atas |
| `glass-caustic` | inset −12 −16 26 −16 `rgba(140,150,255,.30)` | Cahaya terbias di kanan bawah |
| `dispersion` | R 100%, G 93%, B 86% skala refraksi | Efek pelangi tipis di tepi |

Refraksi nyata hanya aktif di browser Chromium. Safari dan Firefox memakai blur CSS dengan rim dan caustic yang sama.

### 5.3 Spacing (skala 4 pt)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

| Penggunaan | Nilai |
|---|---|
| Jarak ikon–label dalam komponen | 8–12 |
| Padding komponen kecil (chip, tombol) | 12 / 20 |
| Padding panel | 48 (desktop) · 24 (mobile) |
| Jarak antar elemen dalam section | 24–32 |
| Jarak antar section | 96 (desktop) · 64 (mobile) |

Nilai ad-hoc yang ada sekarang (22, 26, 30, 36, 44, 52, 80) dibulatkan ke skala ini.

### 5.4 Radius (konsentris)

Prinsip Apple: **radius dalam = radius luar − padding**, sehingga lengkung bersarang terlihat sejajar.

| Token | Nilai | Dipakai di |
|---|---|---|
| `r-pill` | 999 px | Tombol, chip, nav, tab bar, segmented control |
| `r-xl` | 36 px | Panel, sheet |
| `r-lg` | 28 px | Kartu proyek |
| `r-md` | 20 px | Field form di dalam sheet (36 − 16 padding) |
| `r-sm` | 12 px | Gambar kecil, ikon persegi |

### 5.5 Elevasi dan Gerak

| Token | Nilai |
|---|---|
| `shadow-float` | `0 30px 60px -30px rgba(0,0,10,.8)` |
| `shadow-thumb` | `0 3px 8px rgba(0,0,0,.3)` |
| `ease-spring` | `cubic-bezier(.3,1.4,.4,1)` untuk indikator, pill, dan tombol (pantulan cair) |
| `ease-standard` | `cubic-bezier(.2,.8,.2,1)` untuk muncul saat scroll dan perubahan opasitas |
| Durasi | 150 ms (tekan) · 300 ms (hover) · 550 ms (indikator) · 900 ms (reveal) |

---

## 6. Bedah Konten per Section

### 6.1 Navigasi

| Aspek | Spesifikasi |
|---|---|
| Fungsi | Berpindah antar section; menunjukkan posisi pengguna saat ini |
| Konten | Logo (link ke Beranda) · 4 item menu · tombol tema |
| Shape | Pill kaca 999 px; indikator aktif berupa pill kaca kedua di dalamnya |
| Layout desktop | Logo di kolom 1, menu di tengah, tema di kolom 12; tinggi 58 px; top 22 px → 12 px saat scroll |
| Layout mobile | Top bar berisi logo + tema; menu pindah ke tab bar bawah dengan lebar maks 380 px, jarak 14 px dari bawah + safe area |
| Tipografi | Label 14/20 · 400; aktif `ink`, lainnya `ink-3`. Tab: 11/13 · 500 |

### 6.2 Beranda (Hero)

| Level | Konten | Spesifikasi |
|---|---|---|
| Supporting text | "Halo, saya" | Body L 20/28 · 300 · `ink-2` |
| **H1** | "Mochamad / Ramdhan" | Display, 2 baris. "Mochamad" 400 dengan gradasi putih → `#B8BFDC`; "Ramdhan" 500 dengan gradasi identitas |
| Supporting text | Developer · Filmmaker · Creative Technologist | Label 15/20 · 400 · ls .06em. "Filmmaker" 500 `ink` sebagai penekanan peran pembeda. Pemisah berupa lingkaran 4 px (elemen shape, bukan karakter "•") |
| Shape | Garis 44 × 1 px dengan gradasi `ink-3` → transparan | Jeda visual antara identitas dan pernyataan |
| Body | "Membangun solusi kreatif melalui teknologi, untuk cerita yang lebih hidup." | Body L 17/28 · 300 · `ink-2`, maks 40 karakter per baris |
| **CTA primer** | "Lihat Proyek →" | Tombol pill kaca; scroll ke Proyek |
| Imagery | Foto potret | Kolom 7–12, melebar sampai tepi kanan, memudar ke latar di kiri, atas, dan bawah. Foto adalah satu-satunya fotografi di halaman, sehingga menjadi titik fokus kedua setelah H1 |
| Indikator | "Scroll" vertikal + ikon mouse | Desktop saja; disembunyikan di mobile |

**Urutan baca yang dirancang:** H1 → foto → peran → CTA.

### 6.3 Tentang

| Level | Konten | Spesifikasi |
|---|---|---|
| H2 (label section) | "Tentang Saya" | Eyebrow 13/18 · 500 · ls .04em · `ink-2` |
| Statement (H3 visual) | "Pengembang, Kreator, dan Pembelajar Seumur Hidup." | 28/36 · 500 (mobile 22/30) |
| Body | Paragraf profil | 15/26 · 400 · `ink-3`, maks 64 karakter per baris |
| CTA sekunder | "Selengkapnya" | **Memperluas paragraf di tempat** (bukan membuka form kontak) |
| Supporting list | Pendidikan · Lokasi · Email · GitHub | Ikon bulat kaca 40 px; label 12/16 `ink-2` + nilai 14/20 `ink`. Email dan GitHub bisa diklik |
| **Sub-bagian Keahlian** | 4 kelompok | Lihat 6.4 |
| Layout | Panel kaca `r-xl`, menumpuk 40 px di atas hero. Grid dalam: teks 7 kolom, garis pemisah vertikal, data diri 5 kolom. Mobile: satu kolom |
| Shape | Ornamen kaca kiri ("about-orb") **dihapus** karena tidak berfungsi (melanggar aturan 2.3) |

### 6.4 Keahlian (di dalam Tentang)

| Kelompok (H4) | Isi |
|---|---|
| AI & Machine Learning | Python, PyTorch, TensorFlow, Gradio, Machine Learning |
| Pengembangan | React |
| Film & Audio | Premiere Pro, DaVinci Resolve, Audio Processing, Video Editing |
| Desain | Figma, UI/UX Design |

| Aspek | Spesifikasi |
|---|---|
| Layout | Desktop 4 kolom (satu kolom per kelompok), chip tersusun vertikal. Mobile: kelompok bertumpuk, chip mengalir horizontal |
| Shape | Chip pill kaca `glass-frost-clear`, tinggi 40 px |
| Iconography | **Satu gaya ikon:** semua ikon monokrom `ink-2`, garis 1.6 px, grid 24 px. Warna merek hanya muncul saat hover sebagai penanda identitas, bukan dekorasi |
| Tipografi | H3 "Keahlian" 17/24 · 500; H4 nama kelompok 13/18 · 500 · `ink-3`; label chip 14/20 · 400 |

### 6.5 Proyek

| Level | Konten | Spesifikasi |
|---|---|---|
| H2 | "Proyek Pilihan" + garis 40 px | 20/28 · 500 |
| Kontrol | Segmented control: Semua · AI · Film | Menyaring kartu; kartu yang tidak cocok meredup (opasitas .28, saturasi .3) |
| H3 | Nama proyek | 17/24 · 500 |
| Supporting text | Deskripsi satu kalimat | 13/18 · 400 · `ink-2` (sebelumnya 11.5 px) |
| CTA | Ikon panah bulat dan seluruh kartu | Membuka **sheet detail proyek** |
| Imagery | Ilustrasi abstrak khusus per proyek, mewakili fungsi produk | VoiceCraft AI = gelombang audio yang dipulihkan · Simpul Creative Cloud = lempeng kaca bertumpuk (satu suite, banyak alat) · SimpulEyes 4 = dua lingkaran yang bertemu (dua sumber disinkronkan) |
| Layout | 3 kartu × 4 kolom, tinggi 220 px; area gambar 60% atas, kaca info 40% bawah. Mobile: carousel horizontal dengan snap, lebar kartu 82% (kartu berikutnya mengintip sebagai petunjuk geser) |

**Sheet detail proyek (baru):** judul (H2 di dalam dialog), tahun, peran, masalah → solusi (2–3 kalimat), stack (chip kecil), tombol "Lihat kode" atau "Demo" bila ada, dan CTA "Diskusikan proyek serupa" yang membuka sheet kontak dengan subjek terisi. *Konten detail perlu disediakan pemilik portofolio.*

### 6.6 Kontak

| Level | Konten | Spesifikasi |
|---|---|---|
| H2 | "Mari Terhubung" | 28/36 · 500 (mobile 22/30) |
| Body | "Saya selalu terbuka untuk diskusi, kolaborasi, atau sekadar berbincang." | 15/26 · `ink-3` |
| **CTA primer** | "Hubungi Saya" | Membuka sheet form kontak |
| CTA sekunder | GitHub · LinkedIn · YouTube · Email | Ikon bulat 44 px (target sentuh minimum), masing-masing dengan `aria-label` |
| Layout | Panel kaca `r-xl`; kiri 7 kolom teks, kanan 5 kolom ikon rata kanan. Mobile: bertumpuk |
| Shape | Gradasi cahaya radial di kanan bawah panel, melanjutkan motif pita cahaya |

### 6.7 Footer

Logo · nama · © tahun di kiri; "Build · Create · Share" di kanan dengan pemisah lingkaran 4 px. Ukuran 12/16 · `ink-2`. Di mobile ada padding bawah 120 px agar tidak tertutup tab bar.

---

## 7. Tipografi dan Elemen Grafis

### 7.1 Sistem Typeface

| Peran | Typeface | Alasan |
|---|---|---|
| **Primary** (heading, display) | SF Pro Display → fallback **Inter** (Google Fonts) | Selaras dengan bahasa desain Apple; Inter memiliki proporsi yang paling dekat |
| **Secondary** (body, UI) | SF Pro Text → fallback **Inter** | Satu keluarga huruf saja demi kesatuan (unity); hierarki dibangun dari ukuran dan weight |
| Display | Tidak dipakai | H1 sudah cukup kuat dengan ukuran besar dan gradasi; font ketiga hanya menambah kebisingan |

### 7.2 Skala Tipografi

| Token | Desktop | Mobile | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Display / H1 | 96 px (fluid `clamp(56px, 7.4vw, 96px)`) | 52 px | 400 / 500 | 0.98 | −0.035em |
| Statement | 28 px | 22 px | 500 | 1.3 | −0.01em |
| H2 | 20 px | 20 px | 500 | 1.4 | −0.01em |
| H3 | 17 px | 17 px | 500 | 1.4 | 0 |
| Body L | 17 px | 15 px | 300 | 1.6 | 0 |
| Body | 15 px | 15 px | 400 | 1.7 | 0 |
| Label | 14 px | 13 px | 400 / 500 | 1.4 | .01em |
| Caption | 13 px | 13 px | 400 | 1.4 | 0 |
| Eyebrow | 13 px | 13 px | 500 | 1.4 | .04em |
| Tab label | 11 px | 11 px | 500 | 1.2 | 0 |

**Ukuran minimum** adalah 13 px, kecuali label tab bar (11 px, mengikuti standar iOS dan selalu didampingi ikon).

### 7.3 Elemen Grafis Identitas

| Elemen | Makna | Lokasi |
|---|---|---|
| **Pita cahaya** (garis sinus berlapis) | Cahaya sinematik, gelombang audio | Latar halaman (animasi pelan, berhenti saat *reduced motion*) |
| **Lingkaran / elips** | Lensa, titik sinkronisasi | Kartu SimpulEyes, pemisah 4 px, ikon bulat |
| **Rounded rectangle konsentris** | Material kaca | Semua wadah |
| **Garis 1 px** | Jeda dan struktur | Rule di hero, garis judul section, pemisah data diri |
| **Tipografi sebagai grafis** | Nama besar bergradasi | H1 |

Tidak ada tanda pagar, centang, bintang, atau bullet dekoratif. Satu-satunya simbol teks adalah panah "→" pada CTA, yang berfungsi sebagai penanda arah tindakan.

---

## 8. Komponen UI dan Interaction Behavior

| Komponen | Default | Hover | Active (tekan) | Focus-visible | Lainnya |
|---|---|---|---|---|---|
| Item nav / tab | `ink-3` | `ink` | Indikator pill meluncur dengan `ease-spring` 550 ms; tab "memipih" sesaat (squish) | Ring 2 px `#AAB9FF` mengikuti bentuk pill | **Selected:** pindah seketika saat diklik; scroll-spy jeda sampai scroll selesai |
| Tombol pill (CTA) | Kaca + rim | Naik 2 px, panah bergeser 4 px | Skala .97 | Ring | **Loading** (sheet): label "Membuka email…" + tombol nonaktif |
| Ikon bulat | Kaca 36–44 px | Skala 1.08 | Skala .92 | Ring | — |
| Kartu proyek | Kaca | Naik 4 px, kilau mengikuti kursor | Skala .98 | Ring di seluruh kartu | **Dimmed** saat tersaring; seluruh kartu bisa diklik |
| Segmented control | Thumb di "Semua" | Label menjadi `ink` | Thumb meluncur dengan spring | Ring per tombol; panah kiri/kanan berpindah pilihan | `role="tablist"`, `aria-selected` |
| Chip keahlian | Ikon monokrom | Ikon berwarna merek, naik 2 px | — | — | Statis (bukan tombol) |
| Field form | Kaca `r-md` | — | — | Rim berubah `accent` | **Error:** rim `danger` + pesan 13 px di bawah field + `aria-invalid`. **Disabled:** opasitas .5 |
| Switch | Abu `rgba(120,130,180,.3)` | — | Kenop melebar 34 px | Ring | **On:** gradasi `accent` → `accent-2` |
| Slider | Track terisi `accent` | — | Thumb membesar | Ring | Nilai ditampilkan langsung ("4 minggu") |
| Sheet (kontak, detail) | Tersembunyi | — | Naik dari bawah dengan spring 600 ms | Fokus pindah ke field pertama; **focus trap** di dalam sheet | Tutup lewat Esc, tombol ×, atau klik latar; fokus kembali ke pemicu |
| Tombol tema | Ikon matahari/bulan | — | Skala .92 | Ring | Pilihan disimpan per perangkat |

**Aksesibilitas wajib:**

- Tautan "Lewati ke konten" di awal halaman.
- Hierarki heading semantik: satu H1 per halaman, H2 per section, H3 per kartu atau kelompok.
- `prefers-reduced-motion`: animasi latar, reveal, dan spring dimatikan.
- `prefers-reduced-transparency`: kaca diganti `surface-solid` `#12163A` tanpa blur atau refraksi.
- `prefers-contrast: more`: rim kaca 2 px dan `ink-3` dinaikkan ke `ink-2`.
- Target sentuh minimal 44 × 44 px.

---

## 9. Wireframe

**Desktop (1280 px)**

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Logo]          ( Beranda | Tentang | Proyek | Kontak )          (☼) │  header melayang
├──────────────────────────────────────────────────────────────────────┤
│ Halo, saya                                    ░░░░░░░░░░░░░░░░░░░░░░ │
│ MOCHAMAD                                      ░░░   FOTO POTRET  ░░░ │  hero: 6 + 6 kolom
│ RAMDHAN  (gradasi)                            ░░░  (bleed kanan) ░░░ │
│ Developer ● Filmmaker ● Creative Technologist ░░░░░░░░░░░░░░░░░░░░░░ │
│ ──                                            ░░░░░░░░░░░░░░░░░░░░░░ │
│ Membangun solusi kreatif …                    ░░░░░░░░░░░░░░░░░░░░░░ │
│ ( Lihat Proyek → )                            ░░░░░░░░░░░░░░░░░░░░░░ │
│ ╭────────────────────────────────────────────────────────────────╮   │  panel menumpuk −40 px
│ │ TENTANG SAYA                          │ (○) Pendidikan         │   │
│ │ Pengembang, Kreator, dan …            │ (○) Lokasi             │   │
│ │ Paragraf profil …                     │ (○) Email              │   │
│ │ Selengkapnya →                        │ (○) GitHub             │   │
│ │ ────────────────────────────────────────────────────────────── │   │
│ │ AI & ML        Pengembangan     Film & Audio      Desain       │   │  keahlian 4 kolom
│ │ (Python)       (React)          (Premiere Pro)    (Figma)      │   │
│ │ (PyTorch)                       (DaVinci)         (UI/UX)      │   │
│ ╰────────────────────────────────────────────────────────────────╯   │
│                                                                      │
│ Proyek Pilihan ──                             ( Semua | AI | Film )  │
│ ╭──────────────╮  ╭──────────────╮  ╭──────────────╮                 │  3 × 4 kolom
│ │  ~ gelombang │  │  ▱ lempeng   │  │  ◯◯ lingkaran│                 │
│ │ VoiceCraft AI│  │ Simpul Cloud │  │ SimpulEyes 4 │                 │
│ │ deskripsi (→)│  │ deskripsi (→)│  │ deskripsi (→)│                 │
│ ╰──────────────╯  ╰──────────────╯  ╰──────────────╯                 │
│                                                                      │
│ ╭────────────────────────────────────────────────────────────────╮   │
│ │ Mari Terhubung                                 (gh)(in)(yt)(✉) │   │  split band
│ │ Saya selalu terbuka …                                          │   │
│ │ ( Hubungi Saya → )                                             │   │
│ ╰────────────────────────────────────────────────────────────────╯   │
│ [Logo] Mochamad Ramdhan © 2026                 ── Build ● Create ● Share │
└──────────────────────────────────────────────────────────────────────┘
```

**Mobile (393 px)**

```
┌───────────────────────────────┐
│ [Logo]                    (☼) │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░  FOTO POTRET  ░░░░░░░░ │  400 px
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ Halo, saya                    │  teks menumpuk −70 px di atas foto
│ MOCHAMAD                      │
│ RAMDHAN                       │
│ Developer ● Filmmaker ● …     │
│ Membangun solusi kreatif …    │
│ ( Lihat Proyek → )            │
│ ╭───────────────────────────╮ │
│ │ Tentang + data diri       │ │
│ │ Keahlian per kelompok     │ │
│ ╰───────────────────────────╯ │
│ Proyek Pilihan ──             │
│ ( Semua | AI | Film )         │
│ ╭──────────────────────╮╭──   │  carousel snap, 82%
│ │ kartu                ││     │
│ ╰──────────────────────╯╰──   │
│ ╭───────────────────────────╮ │
│ │ Mari Terhubung            │ │
│ │ ( Hubungi Saya → )        │ │
│ │ (gh)(in)(yt)(✉)           │ │
│ ╰───────────────────────────╯ │
│  ╭─────────────────────────╮  │
│  │ ⌂     ◎     ▦     ◌    │  │  tab bar melayang
│  ╰─────────────────────────╯  │
└───────────────────────────────┘
```

Mockup high-fidelity adalah versi yang sudah online. Bagian 10 mencatat selisihnya terhadap spesifikasi ini.

---

## 10. Evaluasi Implementasi Saat Ini

| # | Temuan | Prinsip yang dilanggar | Prioritas | Perbaikan |
|---|---|---|---|---|
| 1 | "Selengkapnya" di Tentang membuka **form kontak** | Usability, CTA harus jelas | Tinggi | Perluas paragraf di tempat |
| 2 | Panah di kartu proyek mengarah ke `#` (tidak ke mana pun) | Usability, IA | Tinggi | Sheet detail proyek (6.5) |
| 3 | Heading tidak semantik: section memakai `h3`, kartu memakai `h4`, judul Tentang memakai `h2` sendirian | Accessibility, hierarki | Tinggi | H2 per section, H3 per kartu dan kelompok |
| 4 | Teks deskripsi kartu 11.5 px, label kecil 12 px | Accessibility, keterbacaan | Tinggi | Minimum 13 px (7.2) |
| 5 | `ink-3` `#8A92B8` hanya 3.9 : 1 di kaca terang | Kontras WCAG | Tinggi | `#9AA3C7` (4.8 : 1) |
| 6 | Sheet tanpa focus trap; tidak ada tautan "Lewati ke konten" | Keyboard navigation | Sedang | Lihat 8 |
| 7 | Form tanpa state error yang terlihat (hanya validasi bawaan browser) | Interaction states | Sedang | State error (8) |
| 8 | Ornamen kaca di kiri panel Tentang tidak berfungsi | Aturan design direction 2.3 | Sedang | Hapus; ruangnya dipakai untuk Keahlian |
| 9 | 12 chip keahlian setara tanpa kelompok; ikon campur berwarna merek dan monokrom | Unity, hierarki, IA | Sedang | Kelompokkan, ikon monokrom (6.4) |
| 10 | Spacing ad-hoc (22, 26, 30, 36, 44, 52, 80 px) | Design system, rhythm | Sedang | Skala 4 pt (5.3) |
| 11 | Belum ada fallback `prefers-reduced-transparency` dan `prefers-contrast` | Accessibility | Sedang | Lihat 8 |
| 12 | Pemisah "•" sebagai karakter teks di footer | Arahan elemen grafis | Rendah | Lingkaran 4 px seperti di hero |
| 13 | Email, GitHub, LinkedIn, YouTube, dan isi proyek masih contoh | Konten | Butuh data pemilik | — |

Yang sudah sesuai dan dipertahankan: material kaca dengan refraksi, satu titik penekanan warna di H1, hero asimetris, irama tiga kartu, tab bar di zona jempol, highlight navigasi yang berurutan, `prefers-reduced-motion`, dan tema terang/gelap.

---

## 11. Rencana Implementasi

1. Token CSS: warna (termasuk `ink-3` baru), spacing, radius, tipografi, dan glass sebagai variabel `:root`.
2. Struktur HTML: heading semantik, Keahlian dipindah ke dalam Tentang, ornamen kaca dihapus, skip link.
3. Komponen baru: sheet detail proyek dan paragraf Tentang yang bisa diperluas.
4. State interaksi: error dan loading form, focus trap sheet, keyboard di segmented control.
5. Fallback aksesibilitas: reduced transparency dan increased contrast.
6. Uji: screenshot desktop/tablet/mobile, mode terang/gelap, keyboard saja, dan hitung ulang kontras.
7. Deploy ke GitHub Pages.

Langkah 1–7 sudah dikerjakan. Tambahan dari tinjauan pola iOS 26: tab bar mengecil saat scroll ke bawah dan chip keahlian (konten statis) tidak lagi memakai filter refraksi, sehingga jumlah filter berkurang.
