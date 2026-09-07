import Link from "next/link";
import Image from "next/image";
import { company, fullAddress } from "@/config/company";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { Container } from "./ui";
import { asset } from "@/config/paths";

/** "2020–2026", atau cukup "2026" kalau tahunnya sama. */
function yearRange(): string {
  const now = new Date().getFullYear();
  return now === company.founded ? String(now) : `${company.founded}–${now}`;
}

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const href = (slug: string) => (slug ? `/${locale}/${slug}` : `/${locale}`);

  const pages = [
    { slug: "product", label: dict.nav.product },
    { slug: "supply-network", label: dict.nav.supply },
    { slug: "export-process", label: dict.nav.process },
    { slug: "contact", label: dict.nav.contact },
  ];

  return (
    <footer className="border-t border-line bg-palm-deep py-14 text-on-dark">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            {/* Footer selalu berlatar hijau tua di KEDUA mode, jadi di
                sini siluet putih dipakai tanpa syarat — tidak perlu
                ditukar per mode. */}
            <div className="flex items-center gap-3">
              <Image
                src={asset("/brand/icon-palmkaling-white.png")}
                alt=""
                width={125}
                height={144}
                className="h-9 w-auto"
              />
              <div>
                <p className="font-display text-2xl font-bold tracking-[0.05em]">
                  {company.tradeName}
                </p>
                <p className="type-label text-[0.65rem] text-sap-light">{company.tagline}</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-dark/70">
              {dict.footer.tagline}
            </p>
            {/* Badan hukumnya diletakkan di sini, bukan di header. */}
            <p className="mt-4 text-sm text-on-dark/55">
              {company.legalName} · NIB {company.nib}
            </p>
          </div>

          <div>
            <h2 className="type-label mb-4 text-xs text-sap-light">
              {dict.footer.navTitle}
            </h2>
            <ul className="space-y-2 text-sm text-on-dark/75">
              {pages.map((p) => (
                <li key={p.slug}>
                  <Link href={href(p.slug)} className="transition-colors hover:text-on-dark">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="type-label mb-4 text-xs text-sap-light">
              {dict.footer.contactTitle}
            </h2>
            <ul className="space-y-2 text-sm text-on-dark/75">
              <li>
                <a
                  href={`https://wa.me/${company.contact.whatsapp}`}
                  className="transition-colors hover:text-on-dark"
                >
                  {company.contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.contact.email}`}
                  className="transition-colors hover:text-on-dark"
                >
                  {company.contact.email}
                </a>
              </li>
              <li className="pt-2 leading-relaxed text-on-dark/60">{fullAddress()}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-on-dark/15 pt-6 text-xs text-on-dark/50 sm:flex-row sm:justify-between">
          <p>
            © {yearRange()} {company.legalName}. {dict.footer.rights}
          </p>
          <p>{dict.footer.disclaimer}</p>
        </div>
      </Container>
    </footer>
  );
}
