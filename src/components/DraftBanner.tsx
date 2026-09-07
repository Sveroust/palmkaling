import { isDraft } from "@/config/company";

/**
 * Pita "DRAF" di paling atas halaman. Muncul selama masih ada data yang
 * terdaftar di `pendingFields` (src/config/company.ts), dan HILANG SENDIRI
 * begitu daftar itu kosong.
 *
 * Tujuannya satu: mencegah situs terlanjur online dengan nomor WhatsApp
 * contoh. Situs yang live dengan nomor yang salah lebih merugikan
 * daripada situs yang belum live.
 */
export function DraftBanner({ message }: { message: string }) {
  if (!isDraft) return null;

  return (
    <div className="border-b border-sap/40 bg-sap/15 px-5 py-2 text-center text-sm text-ink sm:px-8">
      {message}
    </div>
  );
}
