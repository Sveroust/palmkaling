import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "../globals.css";
import { DraftBanner } from "@/components/DraftBanner";
import { ThemeScript } from "@/components/ThemeScript";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { company } from "@/config/company";
import { getDictionary } from "@/i18n/getDictionary";
import { htmlLang, isLocale, locales, type Locale } from "@/i18n/config";

/**
 * Ini ROOT LAYOUT-nya (tag <html> ada di sini, bukan di src/app/layout.tsx).
 * Polanya mengikuti contoh i18n resmi Next.js: karena setiap halaman berada
 * di bawah /[locale], layout inilah yang paling atas — sehingga atribut
 * lang="ko" benar-benar ada di HTML yang diterima Google, bukan ditempel
 * belakangan lewat JavaScript.
 */

/* ============================================================
   RACIKAN FONT — Plus Jakarta Sans + Inter
   ============================================================
   Plus Jakarta Sans memegang semua yang berperan sebagai "suara":
   judul, tagline, tombol, dan angka besar. Bentuknya geometris
   dengan potongan huruf yang tegas — modern dan yakin, bukan
   mewah-editorial.

   Inter memegang semua yang dibaca sungguhan: paragraf, keterangan,
   label. Inter dirancang untuk layar; tinggi x-nya besar sehingga
   teks 16px tetap enak dibaca di ponsel.

   Keduanya font VARIABEL, jadi `weight` sengaja tidak disebut:
   satu berkas per font sudah melayani 400–700. Menyebut weight
   satu per satu justru memaksa Next mengunduh berkas statis
   terpisah untuk tiap ketebalan.

   Gaya miring TIDAK dimuat — bukan kelalaian, tapi keputusan:
   italic memberi kesan editorial/mewah, dan racikan ini ingin
   tegas. Aturan penggantinya ada di globals.css (<em> dirender
   tebal, bukan miring).
   ============================================================ */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Ketiga bahasa dirender jadi HTML statis saat build. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(company.siteUrl),
    title: {
      default: `${company.tradeName} — ${dict.meta.titleSuffix}`,
      template: `%s — ${company.tradeName}`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      /* hreflang memberi tahu Google bahwa ketiga versi ini adalah halaman
         yang sama dalam bahasa berbeda — bukan konten duplikat. */
      languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])),
    },
    openGraph: {
      type: "website",
      siteName: company.tradeName,
      locale: htmlLang[locale],
      title: `${company.tradeName} — ${dict.meta.titleSuffix}`,
      description: dict.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    /* Variabel font WAJIB menempel di <html>, bukan <body>. Tema Tailwind
       menghitung --font-display di :root; kalau --font-jakarta baru ada di
       body, nilainya sudah terlanjur invalid dan judul jatuh ke font default. */
    <html
      lang={htmlLang[locale]}
      className={`${jakarta.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Harus anak PERTAMA <body>: ia menempelkan data-theme sebelum
            satu baris pun halaman digambar. Lihat ThemeScript.tsx. */}
        <ThemeScript />
        <div className="flex min-h-screen flex-col">
          <DraftBanner message={dict.common.draftBanner} />
          <Header locale={locale} nav={dict.nav} theme={dict.common.theme} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} dict={dict} />
        </div>
      </body>
    </html>
  );
}
