/**
 * ============================================================
 *  APLIKASI HILIR — "BISA DIBUAT APA"
 * ============================================================
 *  Lima kategori industri yang memakai kolang-kaling sebagai bahan
 *  baku. Teksnya ada di dictionary: product.applications.items.<key>.
 *
 *  ⚠️ SIFAT FOTONYA. Gambar-gambar ini ILUSTRASI kategori produk,
 *  dibuat dengan bantuan AI. Bukan produk yang diproduksi CV Puji
 *  Jaya Putra. Halaman WAJIB menampilkan `product.applications.note`
 *  di dekat gambarnya — tanpa itu, pembeli akan membaca foto ini
 *  sebagai produk ritel yang sudah kami jual, lalu meminta sample
 *  yang tidak ada. Jangan hapus catatan itu.
 *
 *  Empat dari lima foto aslinya memasang label merek PALMKALING pada
 *  produk fiktif. Itu sudah dibuang sebelum masuk repo:
 *    - retail-jar & cosmetic-serum → DIPOTONG ke bagian tanpa label,
 *      jadi seluruh pikselnya asli (tambalan di label melengkung
 *      selalu meninggalkan jejak yang terlihat)
 *    - diet-jelly & nutraceutical → label direkonstruksi dari latar
 *      di sekitarnya; latarnya rata sehingga hasilnya tidak terlihat
 *    - cafe-topping → tidak pernah ada merek, dipakai apa adanya
 *
 *  `width`/`height` HARUS dimensi asli berkasnya (semua 4:3 640x480)
 *  supaya <Image> memesan ruang dan halaman tidak bergeser saat
 *  fotonya dimuat. Periksa dengan:
 *  `magick public/media/applications/<berkas> -format '%wx%h' info:`
 * ============================================================
 */
export const applications = [
  { key: "retail", src: "/media/applications/retail-jar.jpg", width: 640, height: 480 },
  { key: "cafe", src: "/media/applications/cafe-topping.jpg", width: 640, height: 480 },
  { key: "diet", src: "/media/applications/diet-jelly.jpg", width: 640, height: 480 },
  { key: "nutraceutical", src: "/media/applications/nutraceutical.jpg", width: 640, height: 480 },
  { key: "cosmetic", src: "/media/applications/cosmetic-serum.jpg", width: 640, height: 480 },
] as const;

export type ApplicationKey = (typeof applications)[number]["key"];
