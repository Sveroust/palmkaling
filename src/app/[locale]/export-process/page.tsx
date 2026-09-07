import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, locales } from "@/i18n/config";
import { Section, Container, SectionTitle, Lede, SpecTable, Eyebrow } from "@/components/ui";
import { tradeTerms } from "@/content/product-data";
import { company } from "@/config/company";

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
  return { title: dict.process.title, description: dict.process.intro };
}

const STEP_KEYS = ["one", "two", "three", "four", "five", "six", "seven"] as const;

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const t = dict.process;

  const termRows = tradeTerms.map((row) => ({
    label: t.termLabels[row.key as keyof typeof t.termLabels] ?? row.key,
    value: row.value,
  }));

  return (
    <>
      <div className="border-b border-line bg-paper-deep py-14 sm:py-20">
        <Container>
          <Eyebrow>{dict.nav.process}</Eyebrow>
          <SectionTitle as="h1">{t.title}</SectionTitle>
          <Lede className="mt-5">{t.intro}</Lede>
        </Container>
      </div>

      {/* ---------- TUJUH LANGKAH ---------- */}
      <Section>
        <ol className="border-t border-line">
          {STEP_KEYS.map((key, i) => (
            <li
              key={key}
              className="grid gap-3 border-b border-line py-8 sm:grid-cols-[3rem_minmax(0,13rem)_1fr_6rem] sm:gap-8"
            >
              <span className="font-display text-sm font-semibold tabular-nums text-sap-text">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-xl font-semibold leading-snug tracking-[-0.01em]">
                {t.steps[key].name}
              </h2>
              <p className="max-w-xl leading-relaxed text-ink-soft">{t.steps[key].body}</p>
              <span className="text-sm text-ink-faint sm:text-right">{t.steps[key].duration}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------- SYARAT DAGANG ---------- */}
      <Section tone="deep">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <div>
            <SectionTitle>{t.termsTitle}</SectionTitle>
            <p className="mt-4 text-sm text-ink-faint">
              {t.portLabel}: {company.loadingPort}
            </p>
          </div>
          <SpecTable rows={termRows} />
        </div>
      </Section>

      {/* ---------- DOKUMEN ---------- */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          <SectionTitle>{t.docsTitle}</SectionTitle>
          <div>
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {t.docs.map((doc) => (
                <li key={doc} className="flex gap-3 border-b border-line pb-3 text-[0.95rem]">
                  <span aria-hidden="true" className="text-sap-text">
                    ✓
                  </span>
                  {doc}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-2xl border-l-2 border-sap pl-5 leading-relaxed text-ink-soft">
              {t.docsNote}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
