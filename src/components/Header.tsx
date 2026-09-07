"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { company } from "@/config/company";
import { ProximityDock } from "./ProximityDock";
import { ThemeToggle } from "./ThemeToggle";
import { asset } from "@/config/paths";

type NavLabels = {
  home: string;
  product: string;
  supply: string;
  process: string;
  contact: string;
  quote: string;
  menu: string;
  close: string;
  language: string;
};

type ThemeLabels = { toDark: string; toLight: string };

/** Ruas URL tiap halaman. Ganti di sini kalau mau URL yang berbeda. */
const routes = [
  { slug: "", key: "home" },
  { slug: "product", key: "product" },
  { slug: "supply-network", key: "supply" },
  { slug: "export-process", key: "process" },
  { slug: "contact", key: "contact" },
] as const;

export function Header({
  locale,
  nav,
  theme,
}: {
  locale: Locale;
  nav: NavLabels;
  theme: ThemeLabels;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const href = (slug: string) => (slug ? `/${locale}/${slug}` : `/${locale}`);
  const isActive = (slug: string) => pathname === href(slug);

  /**
   * Menukar bahasa TANPA memindahkan pengunjung ke beranda: ruas
   * pertama URL (kode bahasa) ditukar, sisanya dipertahankan.
   */
  const swapLocale = (next: Locale) => {
    const rest = pathname.split("/").slice(2).join("/");
    return rest ? `/${next}/${rest}` : `/${next}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-4 sm:px-8">
        {/* Ikon dipasang sebagai gambar, tapi "PALMKALING" dirender
            sebagai TEKS. Wordmark logonya memakai Plus Jakarta Sans —
            font yang sudah kita muat — jadi ini reproduksi setia, bukan
            tiruan. Untungnya: tajam di segala ukuran, warnanya ikut mode
            malam sendiri, dan muatannya cuma ikon 6 KB alih-alih dua
            berkas wordmark ratusan KB. Wordmark rasternya sendiri tidak
            terpakai karena baris taglinenya jadi ~4px di tinggi header.

            Dua berkas ikon karena pelepah arennya hijau tua: di latar
            gelap ia tenggelam, jadi mode malam memakai versi siluet putih. */}
        <Link href={href("")} className="flex shrink-0 items-center gap-2.5">
          <Image
            src={asset("/brand/icon-palmkaling.png")}
            alt=""
            width={120}
            height={144}
            preload
            className="h-8 w-auto dark:hidden"
          />
          <Image
            src={asset("/brand/icon-palmkaling-white.png")}
            alt=""
            width={125}
            height={144}
            preload
            className="hidden h-8 w-auto dark:block"
          />
          <span className="font-display text-lg font-bold tracking-[0.06em] text-palm-text dark:text-ink sm:text-xl">
            {company.tradeName}
          </span>
          <span className="sr-only">— {company.tagline}</span>
        </Link>

        {/* Pemilih bahasa ditaruh di KIRI, tepat setelah nama perusahaan, dan
            selalu terbuka (tiga tombol datar, bukan dropdown). Alasannya:
            pengunjung Korea yang mendarat di halaman Inggris harus langsung
            melihat bahwa versi Korea ADA — kalau disembunyikan di dropdown
            pojok kanan, kebanyakan orang tidak akan mencarinya. */}
        <div
          className="mr-auto flex items-center border border-line"
          role="group"
          aria-label={nav.language}
        >
          {locales.map((l) => (
            <Link
              key={l}
              href={swapLocale(l)}
              hrefLang={l}
              aria-current={l === locale ? "true" : undefined}
              className={`type-cta px-2.5 py-1.5 text-xs transition-colors ${
                l === locale ? "bg-palm text-on-dark" : "text-ink-faint hover:text-palm-text"
              }`}
            >
              {localeNames[l].short}
            </Link>
          ))}
        </div>

        {/* Menu utama sebagai dock: tiap butir membesar dan turun sedikit
            saat kursor mendekat. Efeknya mati sendiri di layar sentuh dan
            saat pengguna mematikan animasi — lihat ProximityDock.tsx. */}
        <ProximityDock className="hidden items-end gap-1 lg:flex" label={nav.menu}>
          {routes.map((r) => (
            <Link
              key={r.key}
              href={href(r.slug)}
              data-dock-item
              aria-current={isActive(r.slug) ? "page" : undefined}
              className={`type-cta inline-flex shrink-0 items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors hover:text-palm-text ${
                isActive(r.slug) ? "bg-paper-deep font-semibold text-palm-text" : "text-ink-soft"
              }`}
            >
              {nav[r.key]}
            </Link>
          ))}
        </ProximityDock>

        <ThemeToggle labels={theme} className="hidden lg:grid" />

        <Link
          href={href("contact")}
          className="type-cta hidden bg-palm px-4 py-2 text-sm text-on-dark transition-colors hover:bg-palm-deep lg:inline-block"
        >
          {nav.quote}
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="type-cta border border-line px-3 py-2 text-sm lg:hidden"
        >
          {open ? nav.close : nav.menu}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-paper lg:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-5 py-2 sm:px-8">
            {routes.map((r) => (
              <Link
                key={r.key}
                href={href(r.slug)}
                onClick={() => setOpen(false)}
                className="type-cta border-b border-line py-3 text-base font-medium text-ink-soft"
              >
                {nav[r.key]}
              </Link>
            ))}
            {/* Tombol mode ditaruh DI SINI, bukan di baris atas. Baris
                atas di ponsel sudah memuat logo, tiga tombol bahasa, dan
                tombol menu — satu tombol lagi membuatnya berdesakan. */}
            <div className="flex items-center justify-between gap-4 py-3">
              <span className="type-label text-xs text-ink-faint">{nav.language}</span>
              <ThemeToggle labels={theme} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
