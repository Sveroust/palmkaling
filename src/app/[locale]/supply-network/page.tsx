import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, locales } from "@/i18n/config";
import { Section, Container, SectionTitle, Lede, Card, Eyebrow, Caption } from "@/components/ui";
import { supplyPartners, qcSteps } from "@/content/suppliers";
import { evidenceVideos } from "@/content/product-data";
import { asset } from "@/config/paths";

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
  return { title: dict.supply.title, description: dict.supply.intro };
}

export default async function SupplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.supply;

  return (
    <>
      <div className="border-b border-line bg-paper-deep py-14 sm:py-20">
        <Container>
          <Eyebrow>{dict.nav.supply}</Eyebrow>
          <SectionTitle as="h1">{t.title}</SectionTitle>
          <Lede className="mt-5">{t.intro}</Lede>
        </Container>
      </div>

      <Section>
        <SectionTitle>{t.partnersTitle}</SectionTitle>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {supplyPartners.map((p) => (
            <Card key={p.id}>
              <h3 className="font-display text-2xl font-semibold tracking-[-0.015em]">{t.regions[p.regionKey]}</h3>
              <p className="mt-1 text-sm text-ink-faint">{p.province}</p>
              <dl className="mt-6 space-y-3 text-sm">
                {[
                  [t.partnerCols.capacity, p.capacity],
                  [t.partnerCols.harvest, p.harvestMonths],
                  [t.partnerCols.since, String(p.since)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-line pb-2">
                    <dt className="text-ink-faint">{label}</dt>
                    <dd className="text-right font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------- KONTROL MUTU ---------- */}
      <Section tone="deep">
        <div className="max-w-2xl">
          <SectionTitle>{t.qcTitle}</SectionTitle>
          <Lede className="mt-4">{t.qcIntro}</Lede>
        </div>

        <ol className="mt-12 space-y-0 border-t border-line">
          {qcSteps.map((step, i) => (
            <li
              key={step}
              className="grid gap-3 border-b border-line py-7 sm:grid-cols-[3rem_minmax(0,14rem)_1fr] sm:gap-8"
            >
              <span className="font-display text-sm font-semibold tabular-nums text-sap-text">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-semibold leading-snug tracking-[-0.01em]">{t.qc[step].name}</h3>
              <p className="max-w-xl leading-relaxed text-ink-soft">{t.qc[step].body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------- VIDEO FASILITAS ----------
          Tanpa autoplay dan tanpa suara otomatis: video yang menyala sendiri
          justru bikin orang menutup tab. preload="none" supaya 5,3 MB video
          tidak ikut terunduh sampai pengunjung benar-benar menekan play.

          Pasangan wajib dari preload="none" adalah `poster`: tanpa unduhan,
          peramban tidak punya frame maupun rasio video, jadi kotaknya jatuh
          ke ukuran bawaan <video> (300x150) dan tampil sebagai persegi gelap
          kosong — mirip video rusak, padahal berkasnya sehat. Poster memberi
          gambar sekaligus rasio, dengan biaya ~24 KB.

          Rasio tidak dipaksa: `width`/`height` diambil dari dimensi asli
          berkas, jadi klip tegak tetap tegak dan klip mendatar tetap
          mendatar. Yang menyesuaikan adalah lebar kotaknya. Klip tegak
          dibatasi 20rem dan ditaruh di tengah — dibiarkan selebar kolom,
          satu video jadi menara ~950 px yang mendorong keterangannya keluar
          layar. Klip mendatar tidak punya masalah itu, jadi isi penuh kolom. */}
      <Section>
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

      <Section tone="deep">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <SectionTitle>{t.traceTitle}</SectionTitle>
          <Lede className="max-w-none">{t.traceBody}</Lede>
        </div>
      </Section>
    </>
  );
}
