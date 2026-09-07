import type { ReactNode } from "react";

/**
 * Potongan tata letak yang dipakai berulang. Ditaruh di satu file
 * supaya jarak antar-bagian di semua halaman konsisten — kalau mau
 * halaman lebih rapat/renggang, cukup ubah di sini.
 */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
  );
}

export function Section({
  children,
  className = "",
  tone = "paper",
}: {
  children: ReactNode;
  className?: string;
  tone?: "paper" | "deep" | "palm";
}) {
  const tones = {
    paper: "bg-paper text-ink",
    deep: "bg-paper-deep text-ink",
    /* `on-dark`, bukan `paper`: pita hijau tetap hijau di mode malam,
       jadi teksnya harus tetap terang juga. */
    palm: "bg-palm text-on-dark",
  };
  return (
    <section className={`${tones[tone]} py-16 sm:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Label kecil di atas judul — memberi konteks tanpa menambah heading. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="type-label mb-4 text-[0.7rem] text-sap-text">{children}</p>;
}

/**
 * Judul. Bobotnya mengikuti racikan:
 *   H1 → Plus Jakarta Sans Bold 700
 *   H2 → Plus Jakarta Sans Semibold 600
 * Jarak huruf dirapatkan (tracking negatif) karena Jakarta punya
 * huruf yang lebar; di ukuran hero, tracking bawaannya bikin judul
 * terlihat berjarak-jarak alih-alih satu kalimat utuh. Makin besar
 * ukurannya, makin rapat jaraknya — itu sebabnya H1 lebih rapat
 * daripada H2.
 */
export function SectionTitle({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const style =
    Tag === "h1"
      ? "text-4xl sm:text-6xl leading-[1.05] font-bold tracking-[-0.025em]"
      : "text-3xl sm:text-[2.5rem] leading-[1.14] font-semibold tracking-[-0.015em]";
  return <Tag className={`font-display ${style} ${className}`}>{children}</Tag>;
}

/**
 * Sub-judul / tagline — Plus Jakarta Sans Medium 500.
 * Satu kalimat yang berdiri di antara judul dan paragraf. Bobot 500
 * dipilih supaya terasa lebih berat dari badan teks tapi tidak
 * bersaing dengan judul di atasnya.
 */
export function Accent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`font-display text-xl font-medium leading-relaxed tracking-[-0.01em] text-ink-soft sm:text-2xl ${className}`}
    >
      {children}
    </p>
  );
}

/**
 * Keterangan foto — Inter Regular 400, diredam lewat WARNA (abu-abu),
 * bukan lewat huruf tipis. Huruf tipis di ukuran kecil kehilangan
 * ketebalan garisnya di layar biasa dan jadi susah dibaca; warna yang
 * lebih muda menurunkan bobot visual tanpa mengorbankan itu.
 */
export function Caption({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <figcaption className={`mt-2.5 text-sm leading-relaxed text-ink-soft ${className}`}>
      {children}
    </figcaption>
  );
}

export function Lede({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-2xl text-lg leading-relaxed text-ink-soft ${className}`}>{children}</p>
  );
}

/** Tabel dua kolom untuk spesifikasi. Di layar kecil jadi bertumpuk. */
export function SpecTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="border-t border-line">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid gap-1 border-b border-line py-4 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8"
        >
          <dt className="type-label text-xs text-ink-faint">{row.label}</dt>
          <dd className="text-base text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Penanda data yang belum diisi. Sengaja mencolok (kuning, garis putus-putus)
 * supaya tidak mungkin lolos tanpa sengaja ke situs yang sudah dipublikasikan.
 */
export function NotFilled({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border border-dashed border-sap bg-sap/10 px-2 py-0.5 text-sm text-sap-text">
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-line bg-paper p-6 sm:p-8 ${className}`}>{children}</div>
  );
}
