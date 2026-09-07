import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, locales } from "@/i18n/config";
import { Container, SectionTitle, Lede, Eyebrow, NotFilled } from "@/components/ui";
import { RfqForm } from "@/components/RfqForm";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { company, fullAddress, isPending } from "@/config/company";

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
  return { title: dict.contact.title, description: dict.contact.intro };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.contact;

  /* Dua blok terpisah dengan alasan berbeda.
     - "Kontak langsung": cara menghubungi. Data yang belum asli TETAP
       ditampilkan barisnya, tapi isinya diganti penanda ( belum diisi )
       supaya kelihatan mana yang masih bolong.
     - "Perusahaan": identitas hukum. Hanya nama, NIB, dan alamat.
       NPWP dan KTP sengaja tidak ada di sini — lihat catatan di
       src/config/company.ts. */
  const contactRows = [
    { label: t.labels.whatsapp, value: company.contact.whatsappDisplay, pending: isPending("whatsapp") },
    { label: t.labels.email, value: company.contact.email, pending: isPending("email") },
    { label: t.labels.website, value: company.siteUrl.replace(/^https?:\/\//, ""), pending: isPending("siteUrl") },
    { label: t.labels.hours, value: t.hours, pending: false },
  ];

  const companyRows = [
    { label: t.labels.legal, value: company.legalName, pending: false },
    { label: t.labels.nib, value: company.nib, pending: false },
    { label: t.labels.address, value: fullAddress(), pending: false },
  ];

  return (
    <>
      <div className="border-b border-line bg-paper-deep py-14 sm:py-20">
        <Container>
          <Eyebrow>{dict.nav.contact}</Eyebrow>
          <SectionTitle as="h1">{t.title}</SectionTitle>
          <Lede className="mt-5">{t.intro}</Lede>
        </Container>
      </div>

      <Container className="py-16 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <RfqForm dict={dict} />

          <aside className="lg:border-l lg:border-line lg:pl-12">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.015em]">{t.directTitle}</h2>

            <DetailList rows={contactRows} notFilled={dict.common.notFilled} />

            <h2 className="mt-10 font-display text-2xl font-semibold tracking-[-0.015em]">{t.companyTitle}</h2>
            <DetailList rows={companyRows} notFilled={dict.common.notFilled} />

            <div className="mt-8">
              <WhatsAppCta
                label={dict.common.whatsapp}
                message="Halo, saya ingin meminta penawaran kolang-kaling."
              />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-ink-faint">{t.responseNote}</p>
          </aside>
        </div>
      </Container>
    </>
  );
}

/** Daftar label + nilai. Nilai yang belum asli diganti penanda mencolok. */
function DetailList({
  rows,
  notFilled,
}: {
  rows: { label: string; value: string; pending: boolean }[];
  notFilled: string;
}) {
  return (
    <dl className="mt-6 space-y-4 border-t border-line pt-5">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="type-label text-xs text-ink-faint">
            {row.label}
          </dt>
          <dd className="mt-1 text-[0.95rem] leading-relaxed text-ink">
            {row.pending ? <NotFilled>{notFilled}</NotFilled> : row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
