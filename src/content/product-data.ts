/**
 * ============================================================
 *  DATA PRODUK & SPESIFIKASI — ANGKA DAN SATUAN
 * ============================================================
 *  Sumber angka: README_KATALOG_ASET_EKSPOR.md dan
 *  09_Lembar_Spesifikasi_Ekspor_Kolang_Kaling.pdf (TDS).
 *
 *  PENTING: file ini hanya berisi ANGKA/SATUAN yang sama di semua
 *  bahasa. Nama barisnya ("Panjang", "Length", "길이") ada di
 *  src/i18n/dictionaries/*.json pada bagian `specLabels`.
 *  Jadi kalau spesifikasi berubah, cukup ganti di SINI SEKALI.
 *
 *  Sumber angkanya ada di catatan proyek, di luar repositori.
 * ============================================================
 */

/** `key` harus punya pasangan di dictionary → product.specLabels.<key> */
export type SpecRow = { key: string; value: string };

/** Spesifikasi teknis produk — tampil di halaman Product. */
export const productSpecs: SpecRow[] = [
  { key: "botanicalName", value: "Arenga pinnata (Wurmb) Merr." },
  { key: "grade", value: "Super Jumbo / Grade A Export Quality" },
  { key: "length", value: "30 – 35 mm" },
  { key: "width", value: "20 – 25 mm" },
  { key: "thickness", value: "10 – 15 mm" },
  { key: "defect", value: "< 1.5%" },
  { key: "chlorine", value: "Negative (0.00%)" },
  { key: "preservative", value: "Formalin & alum — not detected" },
  { key: "heavyMetals", value: "Within BPOM & CODEX limits" },
  { key: "medium", value: "Sterile water · mild brine · food-grade citric acid" },
  { key: "shelfLife", value: "6 – 12 months (cold chain)" },
  { key: "storage", value: "Reefer +2 °C to +5 °C" },
  { key: "hsCode", value: "2008.99.90 · 0802.99.00" },
];

/**
 * Sifat kualitatif yang lebih enak dibaca sebagai kalimat daripada
 * baris tabel. Teksnya ada di dictionary → product.qualities.<key>
 */
export const qualityPoints = ["appearance", "color", "texture", "odor"] as const;

/** Pilihan grade yang ditawarkan. `key` → dictionary product.grades.<key> */
export const grades = [
  { key: "gradeA", size: "30–35 mm", useCase: "premium" },
  { key: "gradeB", size: "20–30 mm", useCase: "industrial" },
] as const;

/** Opsi kemasan. `key` → dictionary product.packing.<key> */
export const packingOptions = [
  { key: "drum50", netWeight: "50 kg", perContainer: "≈ 360 drums / 20ft reefer" },
  { key: "drum100", netWeight: "100 kg", perContainer: "≈ 180 drums / 20ft reefer" },
  { key: "vacuum", netWeight: "1 / 5 / 10 kg", perContainer: "sesuai carton plan" },
] as const;

/** Syarat dagang — tampil di halaman Export Process. */
export const tradeTerms = [
  { key: "moq", value: "1 × 20ft reefer (≈ 18 MT)" },
  { key: "capacity", value: "60 MT / month" },
  { key: "container", value: "Reefer 20ft / 40ft · +2 °C to +5 °C" },
  { key: "incoterms", value: "FOB · CFR · CIF" },
  { key: "payment", value: "T/T 30% advance + 70% vs. B/L copy · L/C at sight" },
  { key: "leadTime", value: "21 – 30 days after PO" },
  { key: "sample", value: "1 kg, free (buyer pays courier)" },
] as const;

/** Angka besar di hero/homepage. `key` → dictionary home.stats.<key> */
export const headlineStats = [
  { key: "capacity", value: "60", unit: "MT/mo" },
  { key: "suppliers", value: "2", unit: "" },
  { key: "moq", value: "1", unit: "FCL" },
  { key: "leadTime", value: "21–30", unit: "days" },
] as const;

/**
 * ============================================================
 *  BUKTI VISUAL
 * ============================================================
 *  Foto pengukuran dengan penggaris adalah aset terkuat yang kamu
 *  punya: importir tidak percaya kata "Grade A", mereka percaya
 *  mistar di sebelah biji. Karena itu foto-foto ini ditaruh di
 *  halaman Produk, bukan di galeri terpisah.
 *
 *  File ada di public/media/. `captionKey` → dictionary
 *  product.evidence.<captionKey>
 *
 *  ⚠️ `width`/`height` HARUS sama dengan dimensi berkasnya. Angka ini
 *  yang dipakai <Image> untuk memesan ruang sebelum fotonya sampai;
 *  kalau salah, halaman bergeser saat foto dimuat. Periksa dengan
 *  `magick public/media/<berkas> -format '%wx%h' info:` sesudah
 *  mengganti atau menambah foto.
 * ============================================================
 */
export const evidencePhotos = [
  { src: "/media/dimensi-panjang.jpg", captionKey: "length", width: 1200, height: 896 },
  { src: "/media/dimensi-lebar.jpg", captionKey: "width", width: 896, height: 1200 },
  { src: "/media/dimensi-tebal.jpg", captionKey: "thickness", width: 896, height: 1200 },
  { src: "/media/keseragaman.jpg", captionKey: "uniformity", width: 896, height: 1200 },
  { src: "/media/timbangan-100kg.jpg", captionKey: "weighing", width: 896, height: 1200 },
] as const;

/**
 *  Video pendek proses. `captionKey` → dictionary supply.videos.<captionKey>
 *
 *  Rasio bebas: klip tegak maupun mendatar sama-sama boleh. Halaman
 *  membaca `width`/`height` di bawah dan menyesuaikan lebar kotaknya
 *  sendiri, jadi tidak ada rasio yang dipaksakan ke berkasnya.
 *
 *  ⚠️ `poster` WAJIB ada. Dengan `preload="none"` peramban tidak
 *  mengunduh apa pun sampai orang menekan play, jadi tanpa poster ia
 *  tidak punya frame maupun rasio: kotaknya jatuh ke ukuran bawaan
 *  <video> (300x150) dan tampil sebagai persegi gelap kosong — persis
 *  seperti video yang gagal dimuat, padahal berkasnya sehat.
 *
 *  `width`/`height` sama alasannya seperti pada foto: memesan ruang
 *  supaya halaman tidak bergeser. Angkanya HARUS dimensi asli video.
 *  Periksa dengan:
 *  `ffprobe -v error -show_entries stream=width,height -of csv=p=0:nk=1 public/media/<berkas>`
 *
 *  Membuat poster (frame di detik 1, bukan 0 — frame pertama sering
 *  masih gelap atau kabur):
 *  `ffmpeg -ss 1 -i public/media/<berkas>.mp4 -frames:v 1 -q:v 5 public/media/<berkas>-poster.jpg`
 */
export const evidenceVideos = [
  {
    src: "/media/gudang-sortir.mp4",
    poster: "/media/gudang-sortir-poster.jpg",
    captionKey: "warehouse",
    width: 464,
    height: 832,
  },
  {
    src: "/media/inspeksi-kualitas.mp4",
    poster: "/media/inspeksi-kualitas-poster.jpg",
    captionKey: "inspection",
    width: 464,
    height: 832,
  },
] as const;

/** Lembar spesifikasi resmi yang bisa diunduh importir. */
export const techDataSheet = "/media/technical-data-sheet.pdf";
