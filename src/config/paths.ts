/**
 * ============================================================
 *  AWALAN ALAMAT (basePath)
 * ============================================================
 *  Di GitHub Pages situs ini tidak tinggal di akar domain, tapi di
 *  /palmkaling. Next mengurus itu sendiri untuk <Link>, tapi TIDAK
 *  untuk gambar.
 *
 *  Ini penting dan mudah salah sangka: ketika `images.unoptimized`
 *  menyala — dan di static export ia WAJIB menyala — <Image>
 *  meneruskan `src` apa adanya tanpa menambahkan basePath. (Dengan
 *  optimasi aktif, alamatnya berubah jadi /_next/image?url=... yang
 *  memang dapat awalan; itulah sumber salah sangkanya.) Hasil build
 *  yang membuktikannya: 108 alamat gambar menunjuk ke akar domain
 *  dan akan 404 di Pages.
 *
 *  Jadi `asset()` dipakai untuk SEMUA alamat aset yang ditulis
 *  tangan: `src` pada <Image>, <source> video, dan href unduhan PDF.
 *  Yang TIDAK boleh dibungkus adalah alamat rute (<Link href>) —
 *  di sana Next sudah menambahkan awalannya, jadi hasilnya akan
 *  ganda: /palmkaling/palmkaling/id.
 * ============================================================
 */

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
