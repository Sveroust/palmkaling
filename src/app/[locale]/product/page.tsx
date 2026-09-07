import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, locales } from "@/i18n/config";
import { Section, Container, SectionTitle, Lede, SpecTable, Card, Eyebrow } from "@/components/ui";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { PhotoGallery } from "@/components/PhotoGallery";
import { asset } from "@/config/paths";
import {
  productSpecs,
  grades,
  packingOptions,
  qualityPoints,
  evidencePhotos,
  techDataSheet,
} from "@/content/product-data";

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
  return { title: dict.product.title, description: dict.product.intro };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.product;

  /* Label baris tabel diambil dari kamus, angkanya dari product-data.ts —
     jadi mengubah angka cukup sekali untuk ketiga bahasa. */
  const specRows = productSpecs.map((row) => ({
    label: t.specLabels[row.key as keyof typeof t.specLabels] ?? row.key,
    value: row.value,
  }));

  /* Keterangan foto diambil dari kamus di sini, di server, supaya galeri
     (komponen klien) tidak perlu ikut mengangkut seluruh kamus ke browser. */
  const galleryPhotos = evidencePhotos.map((photo) => ({
    src: photo.src,
    alt: t.evidence[photo.captionKey],
    width: photo.width,
    height: photo.height,
  }));

  return (
    <>
      <div className="border-b border-line bg-paper-deep py-14 sm:py-20">
        <Container>
          <Eyebrow>{dict.nav.product}</Eyebrow>
          <SectionTitle as="h1">{t.title}</SectionTitle>
          <Lede className="mt-5">{t.intro}</Lede>
        </Container>
      </div>

      <Section>
        <SectionTitle>{t.gradesTitle}</SectionTitle>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {grades.map((g) => (
            <Card key={g.key} className="flex flex-col">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.015em]">{t.grades[g.key].name}</h3>
                <span className="text-sm font-medium text-sap-text">{g.size}</span>
              </div>
              <p className="mt-4 leading-relaxed text-ink-soft">{t.grades[g.key].body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------- BUKTI TERUKUR ----------
          Foto dengan mistar ditaruh SEBELUM tabel angka. Importir melihat
          bukti dulu, baru percaya angkanya — bukan sebaliknya. */}
      <Section tone="deep">
        <div className="max-w-2xl">
          <SectionTitle>{t.evidence.title}</SectionTitle>
          <Lede className="mt-4">{t.evidence.intro}</Lede>
        </div>

        {/* Foto-foto ini dulunya kisi statis. Jadi rel yang bisa digeser
            karena jumlahnya akan terus bertambah setiap ada pengukuran
            baru — kisi memaksa halaman makin panjang, rel tidak. Klik
            salah satu foto untuk melihatnya utuh tanpa terpotong 4:3. */}
        <div className="mt-10">
          <PhotoGallery photos={galleryPhotos} labels={dict.common.gallery} />
        </div>
      </Section>

      {/* ---------- PROFIL MUTU ---------- */}
      <Section>
        <SectionTitle>{t.qualitiesTitle}</SectionTitle>
        <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {qualityPoints.map((key) => (
            <div key={key} className="border-t border-line pt-4">
              <h3 className="font-display text-lg font-semibold tracking-[-0.01em]">{t.qualities[key].name}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{t.qualities[key].body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="deep">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <div>
            <SectionTitle>{t.specsTitle}</SectionTitle>
            {/* Unduhan TDS: satu-satunya hal yang benar-benar diminta tim QC. */}
            <div className="mt-8 border border-line-strong bg-paper p-5">
              <h3 className="font-display text-lg font-semibold tracking-[-0.01em]">{t.tds.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.tds.body}</p>
              <a
                href={asset(techDataSheet)}
                target="_blank"
                rel="noopener noreferrer"
                className="type-cta mt-4 inline-block border-b border-palm-text pb-0.5 text-sm text-palm-text"
              >
                {t.tds.cta} ↓
              </a>
            </div>
          </div>
          <SpecTable rows={specRows} />
        </div>
      </Section>

      <Section>
        <SectionTitle>{t.packingTitle}</SectionTitle>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line-strong">
                <th className="type-label py-3 pr-4 text-xs text-ink-faint">
                  {t.packingTitle}
                </th>
                <th className="type-label py-3 pr-4 text-xs text-ink-faint">
                  {t.packingCols.netWeight}
                </th>
                <th className="type-label py-3 text-xs text-ink-faint">
                  {t.packingCols.perContainer}
                </th>
              </tr>
            </thead>
            <tbody>
              {packingOptions.map((p) => (
                <tr key={p.key} className="border-b border-line align-top">
                  <td className="py-5 pr-4">
                    <span className="font-display text-lg font-semibold tracking-[-0.01em]">{t.packing[p.key].name}</span>
                    <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-soft">
                      {t.packing[p.key].body}
                    </p>
                  </td>
                  <td className="py-5 pr-4 text-sm">{p.netWeight}</td>
                  <td className="py-5 text-sm">{p.perContainer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 border-l-2 border-sap bg-paper-deep px-6 py-5">
          <p className="max-w-2xl leading-relaxed text-ink-soft">{t.customNote}</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/contact`}
              className="type-cta bg-palm px-5 py-2.5 text-sm text-on-dark transition-colors hover:bg-palm-deep"
            >
              {dict.common.requestQuote}
            </Link>
            <WhatsAppCta
              label={dict.common.whatsapp}
              message="Halo, saya ingin menanyakan spesifikasi kolang-kaling (halaman Produk)."
            />
          </div>
        </div>
      </Section>
    </>
  );
}
