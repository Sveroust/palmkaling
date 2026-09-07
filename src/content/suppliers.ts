/**
 * ============================================================
 *  JARINGAN SUPPLIER
 * ============================================================
 *  Berkas ini memuat wilayah, kapasitas, bulan panen, dan tahun mulai
 *  bermitra — itu saja.
 *
 *  ATURAN: nama perusahaan pengepul TIDAK disimpan di sini, dan tidak
 *  di berkas mana pun di dalam repositori ini. Kalau butuh menambah
 *  mitra, tambahkan wilayahnya, bukan namanya.
 *
 *  Nilai di bawah dikelola di catatan proyek, di luar repositori.
 * ============================================================
 */

export const supplyPartners = [
  {
    id: "partner-1",
    /** `regionKey` → dictionary supply.regions.<regionKey> */
    regionKey: "sukabumi",
    province: "Jawa Barat",
    capacity: "35 MT / month",
    harvestMonths: "Mar – Oct",
    since: 2024,
  },
  {
    id: "partner-2",
    regionKey: "lebak",
    province: "Banten",
    capacity: "25 MT / month",
    harvestMonths: "Apr – Nov",
    since: 2025,
  },
] as const;

/**
 * Langkah kontrol mutu. `key` → dictionary supply.qc.<key>
 * Urutannya = urutan yang tampil di halaman.
 */
export const qcSteps = ["sorting", "boiling", "grading", "packing", "inspection"] as const;
