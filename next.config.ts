import type { NextConfig } from "next";

/**
 * ============================================================
 *  KONFIGURASI — DISIAPKAN UNTUK GITHUB PAGES
 * ============================================================
 *  GitHub Pages hanya menyajikan berkas statis; tidak ada Node.js
 *  yang berjalan di sana. Konsekuensinya nyata dan sudah ditimbang:
 *
 *  1. `output: "export"` membuat `next build` menulis situs jadi HTML
 *     biasa ke folder out/. Semua halaman sudah SSG (setiap rute punya
 *     generateStaticParams), jadi tidak ada yang hilang di sisi ini.
 *
 *  2. Optimasi gambar DIMATIKAN karena butuh server. Foto dikirim apa
 *     adanya — tanpa WebP dan tanpa penyesuaian ukuran per layar. Ini
 *     harga terbesar dari memilih Pages, dan paling terasa di galeri
 *     foto pengukuran di ponsel.
 *
 *  3. src/proxy.ts DIHAPUS. Dokumen resmi Next menyebut Proxy sebagai
 *     fitur yang tidak didukung `output: export`. Penggantinya
 *     public/index.html yang mendeteksi bahasa di sisi browser.
 *
 *  basePath diisi dari variabel lingkungan, bukan ditulis di sini,
 *  supaya `npm run dev` tetap melayani di / (tanpa awalan) sementara
 *  build untuk Pages memakai /palmkaling. Kalau nanti dipasang domain
 *  palmkaling.com, kosongkan variabelnya dan tidak ada kode yang perlu
 *  disentuh.
 * ============================================================
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",

  /* Pages menyajikan folder, jadi tiap rute perlu berakhir dengan "/"
     dan berisi index.html — kalau tidak, /id/product akan 404. */
  trailingSlash: true,

  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,

  images: {
    /* Wajib untuk static export: tidak ada server yang bisa mengubah
       ukuran gambar saat diminta. */
    unoptimized: true,
    qualities: [75, 90],
  },
};

export default nextConfig;
