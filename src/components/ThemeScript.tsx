/**
 * ============================================================
 *  SKRIP ANTI-KEDIP
 * ============================================================
 *  Situs ini statis: HTML-nya sudah tercetak jauh sebelum tahu
 *  pengunjungnya suka mode gelap atau terang. Kalau penerapan
 *  temanya menunggu React hidup, halaman muncul TERANG dulu lalu
 *  berkedip jadi gelap — dan kedipan itu justru paling mengganggu
 *  di mata yang memang sedang memilih mode gelap.
 *
 *  Karena itu ini <script> sebaris biasa, BUKAN next/script:
 *  yang dibutuhkan eksekusi sinkron sebelum baris pertama halaman
 *  digambar. next/script mengatur PEMUATAN skrip; di sini tidak
 *  ada yang perlu dimuat.
 *
 *  Perhatikan yang TIDAK dilakukannya: kalau pengunjung belum
 *  pernah menekan tombol, skrip ini tidak menempelkan apa pun.
 *  Blok `@media (prefers-color-scheme: dark)` di globals.css yang
 *  mengurus kasus itu — jadi mode gelap tetap berlaku bahkan bila
 *  JavaScript mati sama sekali.
 * ============================================================
 */

export const THEME_KEY = "palmkaling-theme";

/* Ditulis rapat dan TANPA komentar: string ini ikut terkirim di setiap
   halaman, jadi tiap huruf di dalamnya adalah muatan yang dibayar
   pengunjung. Penjelasannya ada di komentar di atas, yang tidak ikut.

   `catch` yang kosong itu disengaja: sebagian browser melempar error
   saat localStorage dibaca dalam mode privat. Kalau itu terjadi,
   biarkan setelan perangkat yang menentukan. */
const script =
  `(function(){try{var v=localStorage.getItem("${THEME_KEY}");` +
  `if(v==="dark"||v==="light")document.documentElement.dataset.theme=v}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
