import { waLink } from "@/config/company";

/**
 * Tombol WhatsApp. Pesan awal dikirim sebagai parameter supaya tiap
 * halaman bisa memberi konteks berbeda ("saya dari halaman Produk"),
 * yang memudahkan menebak minat calon pembeli sebelum membalas.
 */
export function WhatsAppCta({
  label,
  message,
  variant = "solid",
}: {
  label: string;
  message: string;
  variant?: "solid" | "outline";
}) {
  const styles =
    variant === "solid"
      ? "bg-sap text-palm-deep hover:bg-sap-light"
      : "border border-current text-current hover:bg-current/10";

  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`type-cta inline-flex items-center gap-2 px-5 py-3 text-sm transition-colors ${styles}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.46 1.34 4.97L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01a9.9 9.9 0 0 0 9.9-9.9A9.9 9.9 0 0 0 12.04 2Zm5.8 14.06c-.24.68-1.42 1.3-1.95 1.35-.5.05-.98.23-3.3-.69-2.78-1.1-4.55-3.94-4.69-4.13-.13-.19-1.12-1.49-1.12-2.84 0-1.35.7-2.01.95-2.29.25-.27.55-.34.73-.34l.52.01c.17.01.4-.06.62.48.24.57.8 1.97.87 2.11.07.14.11.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.23 2.23 1.37.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.19-.28.37-.23.63-.14.25.09 1.63.77 1.91.91.28.14.47.21.54.32.07.12.07.66-.17 1.34Z" />
      </svg>
      {label}
    </a>
  );
}
