import "server-only";
import type { Locale } from "./config";

/**
 * Kamus teks dimuat per-bahasa dan hanya di server, jadi pengunjung
 * yang membuka versi Inggris tidak ikut mengunduh teks Korea.
 */
const dictionaries = {
  id: () => import("./dictionaries/id.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  ko: () => import("./dictionaries/ko.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

/** Bentuk kamus diambil dari en.json — en.json adalah acuan strukturnya. */
export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>;
