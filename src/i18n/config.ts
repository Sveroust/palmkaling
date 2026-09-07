/**
 * ============================================================
 *  KONFIGURASI BAHASA
 * ============================================================
 *  Menambah bahasa baru (mis. Arab) = 3 langkah:
 *   1. Tambah kodenya di array `locales` di bawah.
 *   2. Tambah label + bendera di `localeNames`.
 *   3. Buat file src/i18n/dictionaries/<kode>.json (copy dari en.json).
 *  Tidak ada file lain yang perlu diubah.
 * ============================================================
 */

export const locales = ["id", "en", "ko"] as const;

export type Locale = (typeof locales)[number];

/** Bahasa yang dipakai kalau URL tidak menyebut bahasa apa pun. */
export const defaultLocale: Locale = "en";

/** Label di tombol pemilih bahasa. */
export const localeNames: Record<Locale, { label: string; short: string }> = {
  id: { label: "Bahasa Indonesia", short: "ID" },
  en: { label: "English", short: "EN" },
  ko: { label: "한국어", short: "KO" },
};

/** Dipakai di tag <html lang="..."> dan metadata hreflang. */
export const htmlLang: Record<Locale, string> = {
  id: "id-ID",
  en: "en",
  ko: "ko-KR",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
