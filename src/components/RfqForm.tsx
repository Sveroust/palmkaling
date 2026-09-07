"use client";

import { useState } from "react";
import { company, waLink } from "@/config/company";
import type { Dictionary } from "@/i18n/getDictionary";

/**
 * ============================================================
 *  FORM PERMINTAAN PENAWARAN (RFQ)
 * ============================================================
 *  Sengaja TIDAK memakai backend. Isian dirangkai jadi satu pesan
 *  rapi, lalu dibuka di WhatsApp (atau email) milik pengguna.
 *
 *  Kenapa begitu:
 *   - tidak ada server yang bisa mati atau kena spam bot;
 *   - importir memang lebih sering membalas lewat WhatsApp;
 *   - jejak percakapan langsung ada di HP kamu, tidak nyangkut di
 *     database yang harus dibuka lewat dashboard.
 *
 *  Kalau nanti ingin lead masuk ke email/CRM otomatis, ganti fungsi
 *  `handleSubmit` di bawah agar mem-POST ke API route. Bagian lain
 *  form ini tidak perlu diubah.
 * ============================================================
 */

const INCOTERMS = ["FOB", "CFR", "CIF", "EXW"] as const;

type Field = {
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  grade: string;
  quantity: string;
  packing: string;
  port: string;
  incoterm: string;
  message: string;
};

const EMPTY: Field = {
  name: "",
  company: "",
  country: "",
  email: "",
  phone: "",
  grade: "",
  quantity: "",
  packing: "",
  port: "",
  incoterm: "FOB",
  message: "",
};

export function RfqForm({ dict }: { dict: Dictionary }) {
  const t = dict.contact.form;
  const [values, setValues] = useState<Field>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  /** Merangkai isian menjadi pesan yang enak dibaca di WhatsApp. */
  const buildMessage = () => {
    const lines = [
      "— Request for Quotation —",
      `${t.name}: ${values.name}`,
      values.company && `${t.companyName}: ${values.company}`,
      values.country && `${t.country}: ${values.country}`,
      values.email && `${t.email}: ${values.email}`,
      values.phone && `${t.whatsapp}: ${values.phone}`,
      "",
      values.grade && `${t.grade}: ${values.grade}`,
      values.quantity && `${t.quantity}: ${values.quantity}`,
      values.packing && `${t.packing}: ${values.packing}`,
      values.port && `${t.port}: ${values.port}`,
      values.incoterm && `${t.incoterm}: ${values.incoterm}`,
      values.message && `\n${values.message}`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  /** Minimal ada nama + satu cara menghubungi balik. */
  const validate = () => {
    if (!values.name.trim() || (!values.email.trim() && !values.phone.trim())) {
      setError(t.errorRequired);
      return false;
    }
    setError(null);
    return true;
  };

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    window.open(waLink(buildMessage()), "_blank", "noopener,noreferrer");
  };

  const handleEmail = () => {
    if (!validate()) return;
    const subject = `RFQ — Sugar palm fruit — ${values.company || values.name}`;
    window.location.href = `mailto:${company.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(buildMessage())}`;
  };

  const inputClass =
    "w-full border border-line bg-paper px-3 py-2.5 text-base text-ink placeholder:text-ink-faint/60 focus:border-palm-text";

  return (
    <form onSubmit={handleWhatsApp} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Labeled label={t.name} required>
          <input className={inputClass} value={values.name} onChange={set("name")} autoComplete="name" />
        </Labeled>
        <Labeled label={t.companyName}>
          <input className={inputClass} value={values.company} onChange={set("company")} autoComplete="organization" />
        </Labeled>
        <Labeled label={t.email}>
          <input type="email" className={inputClass} value={values.email} onChange={set("email")} autoComplete="email" />
        </Labeled>
        <Labeled label={t.whatsapp}>
          <input type="tel" className={inputClass} value={values.phone} onChange={set("phone")} autoComplete="tel" />
        </Labeled>
        <Labeled label={t.country}>
          <input className={inputClass} value={values.country} onChange={set("country")} autoComplete="country-name" />
        </Labeled>
        <Labeled label={t.port}>
          <input className={inputClass} value={values.port} onChange={set("port")} />
        </Labeled>
        <Labeled label={t.grade}>
          <select className={inputClass} value={values.grade} onChange={set("grade")}>
            <option value="">{t.gradeAny}</option>
            <option value="Grade A">{dict.product.grades.gradeA.name}</option>
            <option value="Grade B">{dict.product.grades.gradeB.name}</option>
          </select>
        </Labeled>
        <Labeled label={t.packing}>
          <select className={inputClass} value={values.packing} onChange={set("packing")}>
            <option value="">{t.packingAny}</option>
            <option value="HDPE drum 50 kg">{dict.product.packing.drum50.name}</option>
            <option value="HDPE drum 100 kg">{dict.product.packing.drum100.name}</option>
            <option value="Vacuum bag">{dict.product.packing.vacuum.name}</option>
          </select>
        </Labeled>
        <Labeled label={t.quantity}>
          <input className={inputClass} value={values.quantity} onChange={set("quantity")} placeholder="1 × 20ft" />
        </Labeled>
        <Labeled label={t.incoterm}>
          <select className={inputClass} value={values.incoterm} onChange={set("incoterm")}>
            {INCOTERMS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Labeled>
      </div>

      <Labeled label={t.message}>
        <textarea rows={4} className={inputClass} value={values.message} onChange={set("message")} />
      </Labeled>

      {error && (
        <p role="alert" className="border-l-2 border-sap bg-sap/10 px-3 py-2 text-sm text-ink">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          className="type-cta bg-palm px-6 py-3 text-sm text-on-dark transition-colors hover:bg-palm-deep"
        >
          {t.submit}
        </button>
        <button
          type="button"
          onClick={handleEmail}
          className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-palm-text"
        >
          {t.submitEmail}
        </button>
      </div>
    </form>
  );
}

function Labeled({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="type-label mb-1.5 block text-xs text-ink-faint">
        {label}
        {required && <span className="ml-1 text-sap-text">*</span>}
      </span>
      {children}
    </label>
  );
}
