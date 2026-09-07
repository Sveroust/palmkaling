/**
 * ============================================================
 *  DATA PERUSAHAAN — SATU-SATUNYA TEMPAT EDIT INFO KONTAK/LEGAL
 * ============================================================
 *  Semua halaman menarik datanya dari sini. Ganti nomor WA di
 *  file ini, maka SEMUA tombol WhatsApp di seluruh situs ikut
 *  berubah. Jangan hardcode nomor/email di file lain.
 *
 *  ⚠️ YANG SENGAJA TIDAK DITARUH DI SINI:
 *  Nomor KTP dan NPWP (pemilik maupun usaha). Keduanya ada di
 *  dokumen NIB, tapi tidak boleh dipajang di situs publik —
 *  itu bahan mentah untuk pemalsuan identitas dan pembukaan
 *  rekening atas namamu. Importir yang serius memang meminta
 *  NPWP, tapi lewat email saat due diligence, bukan dari website.
 *
 *  Field yang belum terisi terdaftar di `pendingFields` di bawah.
 * ============================================================
 */

export const company = {
  /**
   * Merek yang dipajang: header, judul halaman, dan materi ekspor.
   * Importir mengingat merek, bukan nama CV — dan seluruh suite
   * logo dibangun di atas nama ini.
   */
  tradeName: "PALMKALING",

  /**
   * Badan hukum sesuai NIB. Tempatnya di footer dan halaman Kontak,
   * bukan di header: yang membutuhkannya adalah tim due diligence,
   * dan mereka memang mencarinya di dua tempat itu.
   */
  legalName: "CV Puji Jaya Putra",

  /** Tagline resmi, ikut di suite logo. */
  tagline: "Premium Sugar Palm Fruit Export",

  /** Tahun NIB terbit (8 Agustus 2020). Dipakai di footer. */
  founded: 2020,

  /** NIB dari dokumen OSS — aman dan lazim dipublikasikan. */
  nib: "0220001810988",

  /** KBLI usaha, menunjukkan izin dagangnya memang untuk pangan. */
  kbli: "46339 — Perdagangan Besar Makanan dan Minuman Lainnya",

  /** Kode HS produk. 2008.99 = buah diolah/diawetkan lainnya. */
  hsCode: "2008.99.90",

  address: {
    street: "Kp. Telajung, Kel. Telajung",
    district: "Kec. Cikarang Barat, Kab. Bekasi",
    province: "Jawa Barat",
    postalCode: "17530",
    country: "Indonesia",
  },

  contact: {
    /**
     * Format internasional TANPA tanda + dan tanpa spasi.
     * Nomor lokal 087782980769 → angka 0 di depan diganti kode negara 62.
     * Tautan wa.me hanya mau format ini; kalau ditulis "0877..." tautannya
     * mati tanpa pesan error apa pun.
     */
    whatsapp: "6287782980769",
    /** Versi yang enak dibaca manusia, tampil sebagai teks. */
    whatsappDisplay: "+62 877-8298-0769",
    email: "sales@pujijayaputra.com",
    phone: "",
  },

  /** Kosongkan ("") yang belum punya — link-nya otomatis disembunyikan. */
  social: {
    instagram: "",
    linkedin: "",
    alibaba: "",
  },

  /** Pelabuhan muat utama — muncul di tabel Incoterms & FAQ. */
  loadingPort: "Tanjung Priok, Jakarta (IDJKT)",

  /** Domain produksi, dipakai untuk metadata & sitemap. */
  /**
   * Alamat final situs. Diisi dari variabel lingkungan supaya build
   * untuk GitHub Pages memakai alamat github.io yang sebenarnya —
   * canonical dan tautan Open Graph harus menunjuk ke alamat tempat
   * situs BENAR-BENAR tinggal, bukan ke domain yang belum dipasang.
   * Begitu palmkaling.com aktif, cukup ubah variabelnya.
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://palmkaling.com",
} as const;

/**
 * ============================================================
 *  DAFTAR DATA YANG BELUM ASLI
 * ============================================================
 *  Selama nama sebuah field ada di daftar ini, situs TIDAK memajang
 *  nilainya. Yang muncul adalah penanda "( belum diisi )" berlatar
 *  kuning — supaya kamu bisa melihat sendiri di halaman mana saja
 *  datanya masih bolong, tanpa harus membaca kode.
 *
 *  CARA PAKAI: isi datanya di atas, lalu HAPUS namanya dari daftar
 *  ini. Penandanya langsung hilang dari situs.
 *
 *  Kalau daftar ini kosong, pita "DRAF" di atas halaman ikut hilang
 *  dan situs siap dipublikasikan.
 * ============================================================
 */
/**
 * Semua field yang PERNAH dipantau. Daftar ini tetap, supaya menghapus
 * satu nama dari `pendingFields` di bawah tidak membuat kode di halaman
 * lain ikut rusak. Salah ketik nama field tetap ketahuan saat build.
 */
export type TrackedField = "whatsapp" | "email" | "phone" | "siteUrl" | "postalCode";

/** Yang MASIH kosong. Hapus namanya dari sini begitu datanya diisi. */
export const pendingFields: TrackedField[] = ["email", "postalCode"];

/** Apakah field ini masih memakai data contoh? */
export function isPending(field: TrackedField): boolean {
  return pendingFields.includes(field);
}

/** Masih ada data bolong? Dipakai untuk memunculkan pita "DRAF". */
export const isDraft = pendingFields.length > 0;

export type Company = typeof company;

/** Alamat satu baris — dipakai di footer, halaman kontak, dan schema.org. */
export function fullAddress(): string {
  const a = company.address;
  /* Kode pos disembunyikan selama belum dipastikan — alamat tanpa kode pos
     masih benar, alamat dengan kode pos salah justru menyesatkan kurir. */
  const postal = isPending("postalCode") ? "" : ` ${a.postalCode}`;
  return `${a.street}, ${a.district}, ${a.province}${postal}, ${a.country}`;
}

/**
 * Membuat link WhatsApp beserta pesan awal yang sudah terisi.
 * Dipakai semua tombol WA supaya formatnya seragam.
 */
export function waLink(message: string): string {
  return `https://wa.me/${company.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
