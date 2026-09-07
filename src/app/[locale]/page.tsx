import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Container, Section, Eyebrow, SectionTitle, Lede, Card } from "@/components/ui";
import { WhatsAppCta } from "@/components/WhatsAppCta";
import { headlineStats, grades, packingOptions } from "@/content/product-data";
import { supplyPartners } from "@/content/suppliers";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.home;

  return (
    <>
      {/* ---------- HERO ---------- */}
      <div className="relative overflow-hidden bg-palm text-on-dark">
        {/* Latar dekoratif: lingkaran bening seperti bentuk kolang-kaling.
            aria-hidden supaya tidak dibacakan pembaca layar. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.13]">
          <svg className="absolute -right-24 -top-16 h-[34rem] w-[34rem]" viewBox="0 0 400 400">
            {[...Array(7)].map((_, i) => (
              <ellipse
                key={i}
                cx={200 + Math.sin(i * 1.7) * 70}
                cy={200 + Math.cos(i * 1.3) * 80}
                rx={38 + i * 4}
                ry={26 + i * 3}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        <Container className="relative py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="type-label mb-5 text-[0.7rem] text-sap-light">
              {t.eyebrow}
            </p>
            <SectionTitle as="h1" className="text-on-dark">
              {t.title}
            </SectionTitle>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-dark/80">{t.subtitle}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href={`/${locale}/contact`}
                className="type-cta bg-sap px-6 py-3 text-sm text-palm-deep transition-colors hover:bg-sap-light"
              >
                {dict.common.requestQuote}
              </Link>
              <Link
                href={`/${locale}/product`}
                className="type-cta border border-on-dark/35 px-6 py-3 text-sm text-on-dark transition-colors hover:bg-on-dark/10"
              >
                {dict.common.viewSpecs}
              </Link>
            </div>

            <p className="mt-6 text-sm text-on-dark/65">{t.heroNote}</p>
          </div>
        </Container>

        {/* ---------- ANGKA KUNCI ---------- */}
        <div className="relative border-t border-on-dark/15">
          <Container>
            <dl className="grid grid-cols-2 divide-on-dark/15 sm:grid-cols-4 sm:divide-x">
              {headlineStats.map((stat) => (
                <div key={stat.key} className="px-1 py-7 sm:px-6 sm:first:pl-0">
                  <dd className="type-stat text-3xl text-on-dark sm:text-4xl">
                    {stat.value}
                    {stat.unit && (
                      <span className="ml-1.5 font-sans text-base font-medium tracking-normal text-sap-light">
                        {stat.unit}
                      </span>
                    )}
                  </dd>
                  <dt className="type-label mt-1 text-xs text-on-dark/65">
                    {t.statsLabel[stat.key]}
                  </dt>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </div>

      {/* ---------- APA YANG DIKIRIM ---------- */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Eyebrow>Arenga pinnata</Eyebrow>
            <SectionTitle>{t.aboutTitle}</SectionTitle>
          </div>
          <div className="space-y-6">
            <Lede className="max-w-none">{t.aboutBody}</Lede>
            <div className="rule-dotted" />
            <div>
              <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">{t.originTitle}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{t.originBody}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- KENAPA KAMI ---------- */}
      <Section tone="deep">
        <SectionTitle>{t.valueTitle}</SectionTitle>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {(["one", "two", "three"] as const).map((k, i) => (
            <Card key={k}>
              <span className="font-display text-sm font-semibold tabular-nums text-sap-text">0{i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-[-0.01em]">
                {t.values[k].title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                {t.values[k].body}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------- RINGKASAN PRODUK ---------- */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Eyebrow>{dict.nav.product}</Eyebrow>
            <SectionTitle>{t.productTeaserTitle}</SectionTitle>
            <Lede className="mt-5">{t.productTeaserBody}</Lede>
            <Link
              href={`/${locale}/product`}
              className="type-cta mt-6 inline-block border-b border-palm-text pb-0.5 text-sm text-palm-text"
            >
              {dict.common.seeAll} →
            </Link>
          </div>

          <div className="space-y-3">
            {grades.map((g) => (
              <div
                key={g.key}
                className="flex items-baseline justify-between gap-4 border-b border-line pb-3"
              >
                <span className="font-display text-lg font-semibold tracking-[-0.01em]">
                  {dict.product.grades[g.key].name}
                </span>
                <span className="text-sm text-ink-faint">{g.size}</span>
              </div>
            ))}
            {packingOptions.map((p) => (
              <div
                key={p.key}
                className="flex items-baseline justify-between gap-4 border-b border-line pb-3"
              >
                <span className="text-[0.95rem] text-ink-soft">
                  {dict.product.packing[p.key].name}
                </span>
                <span className="text-sm text-ink-faint">{p.netWeight}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- JARINGAN PASOKAN ---------- */}
      <Section tone="deep">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{dict.nav.supply}</Eyebrow>
            <SectionTitle>{dict.supply.partnersTitle}</SectionTitle>
          </div>
          <Link
            href={`/${locale}/supply-network`}
            className="type-cta border-b border-palm-text pb-0.5 text-sm text-palm-text"
          >
            {dict.common.seeAll} →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {supplyPartners.map((p) => (
            <Card key={p.id}>
              <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">
                {dict.supply.regions[p.regionKey]}
              </h3>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label={dict.supply.partnerCols.capacity} value={p.capacity} />
                <Row label={dict.supply.partnerCols.harvest} value={p.harvestMonths} />
                <Row label={dict.supply.partnerCols.since} value={String(p.since)} />
              </dl>
            </Card>
          ))}
        </div>
      </Section>

      {/* ---------- AJAKAN KONTAK ---------- */}
      <div className="bg-palm-deep py-16 text-on-dark sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <SectionTitle className="text-on-dark">{t.ctaTitle}</SectionTitle>
              <p className="mt-4 max-w-xl leading-relaxed text-on-dark/75">{t.ctaBody}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/contact`}
                className="type-cta bg-on-dark px-6 py-3 text-sm text-palm-deep transition-colors hover:bg-on-dark/85"
              >
                {dict.common.requestQuote}
              </Link>
              <WhatsAppCta
                label={dict.common.whatsapp}
                message="Halo, saya tertarik dengan kolang-kaling untuk ekspor."
                variant="outline"
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-2">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}
