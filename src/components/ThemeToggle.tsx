"use client";

import { THEME_KEY } from "./ThemeScript";

/**
 * ============================================================
 *  TOMBOL MODE GELAP / TERANG
 * ============================================================
 *  Tombol ini TIDAK menyimpan keadaan di React. Kedua ikon dan
 *  kedua keterangannya selalu dirender, lalu CSS yang memutuskan
 *  mana yang tampil — memakai syarat yang sama dengan paletnya.
 *
 *  Alasannya: kalau mana-ikon-yang-tampil ditentukan oleh state
 *  React, servernya tidak mungkin menebak dengan benar (ia tidak
 *  tahu setelan perangkat pengunjung), jadi ikonnya akan salah
 *  sekejap lalu berganti setelah hidrasi. Dengan CSS, ikon yang
 *  benar sudah benar sejak gambar pertama.
 *
 *  Hanya DUA keadaan, bukan tiga. Tidak ada pilihan "kembali ke
 *  setelan sistem": itu keadaan yang tidak kelihatan bedanya di
 *  sebuah tombol kecil, dan nyaris tidak ada yang memakainya.
 * ============================================================
 */

export function ThemeToggle({
  labels,
  className = "",
}: {
  labels: { toDark: string; toLight: string };
  className?: string;
}) {
  const toggle = () => {
    const root = document.documentElement;
    /* Mode yang BERLAKU sekarang, bukan yang tersimpan: kalau
       pengunjung belum pernah memilih, atributnya kosong dan yang
       menentukan adalah setelan perangkatnya. */
    const isDark =
      root.dataset.theme === "dark" ||
      (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const next = isDark ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* Tidak bisa diingat bukan alasan untuk tidak berganti sekarang. */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`grid h-9 w-9 shrink-0 place-items-center border border-line text-ink-soft transition-colors hover:border-palm-text hover:text-palm-text ${className}`}
    >
      {/* Matahari — tampil saat mode terang, artinya "tekan untuk gelap". */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 fill-none stroke-current stroke-[1.8] dark:hidden"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.4v2.4M12 19.2v2.4M2.4 12h2.4M19.2 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" />
      </svg>
      {/* Bulan — tampil saat mode gelap. */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="hidden h-4 w-4 fill-none stroke-current stroke-[1.8] dark:block"
      >
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
      </svg>
      {/* Keterangan untuk pembaca layar ikut bergantian, karena
          perbuatan tombolnya memang berbeda di tiap mode. */}
      <span className="sr-only dark:hidden">{labels.toDark}</span>
      <span className="sr-only hidden dark:inline">{labels.toLight}</span>
    </button>
  );
}
