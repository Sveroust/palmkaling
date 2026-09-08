import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, locales } from "@/i18n/config";
import Image from "next/image";
import { Section, Container, SectionTitle, Lede, SpecTable, Card, Eyebrow, Caption } from "@/components/ui";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { PhotoGallery } from "@/components/PhotoGallery";
import { asset } from "@/config/paths";
import {
  productSpecs,
  grades,
  packingOptions,
  qualityPoints,
  evidencePhotos,
  evidenceVideos,
  techDataSheet,
} from "@/content/product-data";
import { applications } from "@/content/applications";

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

      {/* ---------- BISA DIBUAT APA ----------
          Pembeli bahan mentah sering tidak tahu batas kegunaan barangnya.
          Bagian ini menaikkan posisi dari "penjual biji rendaman" jadi
          pemasok bahan baku lima industri — dan itu yang membuka pintu ke
          pembeli farmasi serta kosmetik, yang harga per kilonya lain.

          Catatan `note` WAJIB tetap terpasang. Fotonya ilustrasi kategori
          buatan AI, bukan produk kami. Tanpa catatan itu, pembeli akan
          meminta sample toples yang tidak pernah ada, dan kepercayaan
          habis di kontak pertama. Ditaruh SEBELUM gambarnya, bukan sesudah,
          supaya terbaca lebih dulu.

          Kartunya dipesan lewat <dl> dan bukan <div>: tiap baris memang
          pasangan istilah-dan-nilai, jadi pembaca layar mengumumkannya
          sebagai pasangan, bukan dua teks yang berdiri sendiri. */}
      <Section>
        <div className="max-w-2xl">
          <Eyebrow>{t.applications.eyebrow}</Eyebrow>
          <SectionTitle>{t.applications.title}</SectionTitle>
          <Lede className="mt-4">{t.applications.intro}</Lede>
          <p className="mt-6 border-l-2 border-line-strong pl-4 text-sm leading-relaxed text-ink-faint">
            {t.applications.note}
          </p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => {
            const a = t.applications.items[app.key];
            return (
              <article key={app.key}>
                <div className="relative aspect-4/3 w-full overflow-hidden border border-line bg-paper">
                  <Image
                    src={asset(app.src)}
                    alt={a.name}
                    width={app.width}
                    height={app.height}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="type-label mt-5 text-[0.7rem] text-sap-text">{a.sector}</p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-[-0.01em]">
                  {a.name}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{a.body}</p>
                <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                  <div>
                    <dt className="type-label text-xs text-ink-faint">
                      {t.applications.marketsLabel}
                    </dt>
                    <dd className="mt-0.5 text-ink-soft">{a.markets}</dd>
                  </div>
                  <div>
                    <dt className="type-label text-xs text-ink-faint">
                      {t.applications.propertyLabel}
                    </dt>
                    <dd className="mt-0.5 text-ink-soft">{a.property}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </Section>

      {/* ---------- VIDEO FASILITAS ----------
          Tanpa autoplay dan tanpa suara otomatis: video yang menyala
          sendiri justru bikin orang menutup tab. preload="none" supaya
          5,3 MB video tidak ikut terunduh sampai pengunjung benar-benar
          menekan play.

          Pasangan wajib dari preload="none" adalah `poster`: tanpa
          unduhan, peramban tidak punya frame maupun rasio video, jadi
          kotaknya jatuh ke ukuran bawaan <video> (300x150) dan tampil
          sebagai persegi gelap kosong — mirip video rusak, padahal
          berkasnya sehat. Poster memberi gambar sekaligus rasio.

          Rasio tidak dipaksa: `width`/`height` diambil dari dimensi asli
          berkas, jadi klip tegak tetap tegak dan klip mendatar tetap
          mendatar. Yang menyesuaikan lebar kotaknya. Klip tegak dibatasi
          20rem dan ditengahkan — dibiarkan selebar kolom, satu video jadi
          menara ~950 px yang mendorong keterangannya keluar layar. */}
      <Section tone="deep">
        <div className="max-w-2xl">
          <SectionTitle>{t.videos.title}</SectionTitle>
          <Lede className="mt-4">{t.videos.intro}</Lede>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {evidenceVideos.map((video) => (
            <figure
              key={video.src}
              className={
                video.height > video.width
                  ? "mx-auto w-full max-w-80" // tegak: dibatasi, ditengahkan
                  : "w-full" // mendatar: isi penuh kolom
              }
            >
              <video
                controls
                preload="none"
                playsInline
                poster={asset(video.poster)}
                width={video.width}
                height={video.height}
                className="h-auto w-full border border-line bg-overlay"
              >
                <source src={asset(video.src)} type="video/mp4" />
              </video>
              <Caption>{t.videos[video.captionKey]}</Caption>
            </figure>
          ))}
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
