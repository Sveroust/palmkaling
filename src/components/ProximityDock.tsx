"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * ============================================================
 *  DOCK YANG MEMBESAR SAAT DIDEKATI KURSOR
 * ============================================================
 *  Gerakannya meniru AnimatedTopDock (varian "modern") dari ThreeUI:
 *  tiap menu membesar dan turun sedikit seiring kursor mendekat, dengan
 *  pegas (spring) yang meredam, bukan transisi CSS biasa.
 *
 *  Kenapa ditulis ulang dan bukan memakai komponennya langsung:
 *  komponen ThreeUI adalah panggung demo yang berdiri sendiri — nama
 *  merek "Lumina" dan menunya ditulis mati di dalam kodenya, tidak ada
 *  props untuk menggantinya. Memakainya apa adanya berarti situs tiga
 *  bahasa ini punya menu berbahasa Inggris permanen. Sumber aslinya
 *  tetap tersimpan utuh di src/shaders/ sebagai rujukan.
 *
 *  Nilai konstanta di bawah disamakan dengan konfigurasi yang diminta.
 * ============================================================
 */

const OPTIONS = {
  /** Radius pengaruh kursor, dalam piksel. Makin besar, makin banyak menu ikut bergerak. */
  proximity: 122,
  /** Kekuatan pegas. Makin besar makin cepat menyusul target. */
  spring: 0.19,
  /** Peredam. Makin kecil makin cepat berhenti; 1 = tidak pernah berhenti. */
  damping: 0.7,
  /** Tambahan lebar maksimum satu menu, piksel. */
  widthGrowth: 17,
  /** Tambahan tinggi maksimum satu menu, piksel. */
  heightGrowth: 16,
  /** Seberapa jauh menu turun saat membesar, piksel. */
  drop: 3.5,
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

type ItemState = {
  el: HTMLElement;
  baseWidth: number;
  baseHeight: number;
  value: number;
  velocity: number;
  target: number;
};

export function ProximityDock({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)");

    const items: ItemState[] = Array.from(
      root.querySelectorAll<HTMLElement>("[data-dock-item]")
    ).map((el) => ({ el, baseWidth: 0, baseHeight: 0, value: 0, velocity: 0, target: 0 }));
    if (items.length === 0) return;

    let enabled = false;
    let dirty = false;
    let pointerInside = false;
    let frame = 0;

    /* Dimatikan untuk layar sentuh, layar sempit, dan pengguna yang
       mematikan animasi di setelan sistemnya. Di layar sentuh tidak ada
       kursor untuk didekati, jadi efeknya hanya bikin menu goyang. */
    const canAnimate = () =>
      !reduced.matches && finePointer.matches && window.innerWidth > 600;

    /** Mencatat ukuran istirahat tiap menu, lalu mengunci lebar keseluruhan. */
    const measure = () => {
      enabled = canAnimate();
      root.style.width = "";
      for (const it of items) {
        it.el.style.width = "";
        it.el.style.height = "";
        it.el.style.transform = "";
      }
      for (const it of items) {
        const rect = it.el.getBoundingClientRect();
        it.baseWidth = rect.width;
        it.baseHeight = rect.height;
        it.value = 0;
        it.velocity = 0;
        it.target = 0;
      }
      /* Lebar bilah dipatok pada ukuran istirahat DITAMBAH satu jatah
         pertumbuhan. Dua alasan:
         1. Tanpa dipatok, menu yang membesar ikut melebarkan bilah, yang
            menggeser logo dan tombol — lalu pengukuran berikutnya membaca
            ukuran baru itu dan pegasnya membatalkan dirinya sendiri.
         2. Kalau dipatok pas ukuran istirahat, menu yang melebar justru
            menggencet tetangganya sampai lebarnya tidak berubah sama
            sekali. Jatah tambahan inilah yang dipakai saat satu menu tumbuh.
         Hanya satu menu yang pernah mencapai pertumbuhan penuh dalam satu
         waktu, jadi satu jatah sudah cukup. */
      if (enabled) {
        const rest = root.getBoundingClientRect().width;
        root.style.width = `${(rest + OPTIONS.widthGrowth).toFixed(2)}px`;
      }
      dirty = false;
      pointerInside = false;
    };

    /** Menghitung seberapa "dekat" kursor ke pusat tiap menu. */
    const setTargets = (clientX: number) => {
      if (!enabled) return;
      for (const it of items) {
        const rect = it.el.getBoundingClientRect();
        const center = rect.left + rect.width * 0.5;
        const nearness = clamp(1 - Math.abs(clientX - center) / OPTIONS.proximity, 0, 1);
        /* smoothstep: bikin awal dan akhir gerakan melandai, jadi menu tidak
           "menyentak" tepat saat kursor menyeberangi tepi radius. */
        it.target = nearness * nearness * (3 - 2 * nearness);
      }
      pointerInside = true;
      dirty = true;
    };

    const reset = () => {
      pointerInside = false;
      dirty = true;
      for (const it of items) it.target = 0;
    };

    const applyLayout = () => {
      for (const it of items) {
        const v = clamp(it.value, 0, 1.08);
        /* Menu pendek tidak boleh melar sebanyak menu panjang, kalau tidak
           kata "Kontak" akan tampak menggembung dibanding "Jaringan Pasokan". */
        const extraW = Math.min(OPTIONS.widthGrowth, it.baseWidth * 0.24);
        it.el.style.width = `${(it.baseWidth + extraW * v).toFixed(2)}px`;
        it.el.style.height = `${(it.baseHeight + OPTIONS.heightGrowth * v).toFixed(2)}px`;
        it.el.style.transform = `translateY(${(v * OPTIONS.drop).toFixed(2)}px)`;
      }
    };

    /* Integrasi pegas: kecepatan ditarik ke arah target, lalu diredam.
       Ini yang membuat gerakannya terasa punya bobot, bukan seperti
       transition CSS yang selalu sama lamanya. */
    const draw = () => {
      if (enabled && dirty) {
        let moving = false;
        for (const it of items) {
          it.velocity += (it.target - it.value) * OPTIONS.spring;
          it.velocity *= OPTIONS.damping;
          it.value += it.velocity;
          if (Math.abs(it.target - it.value) < 0.001 && Math.abs(it.velocity) < 0.001) {
            it.value = it.target;
            it.velocity = 0;
          } else {
            moving = true;
          }
        }
        applyLayout();
        if (!moving) dirty = false;
      }
      frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (e: PointerEvent) => setTargets(e.clientX);
    const onWindowMove = (e: PointerEvent) => {
      if (!pointerInside) return;
      const r = root.getBoundingClientRect();
      /* Batas bawah dilonggarkan karena menu yang membesar menonjol
         melewati tepi bilah — tanpa ini dock mengendur padahal kursor
         masih berada di atas menu yang sedang membesar. */
      const bottom = r.bottom + OPTIONS.heightGrowth + OPTIONS.drop;
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > bottom) {
        reset();
      }
    };

    /* Navigasi keyboard: menu yang mendapat fokus ikut membesar, dan
       tetangganya sedikit — supaya pengguna keyboard melihat posisi yang
       sama dengan yang dilihat pengguna mouse. */
    const onFocusIn = (e: FocusEvent) => {
      if (!enabled) return;
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-dock-item]");
      if (!target) return;
      const index = items.findIndex((it) => it.el === target);
      if (index < 0) return;
      items.forEach((it, i) => {
        it.target = i === index ? 1 : Math.abs(i - index) === 1 ? 0.24 : 0;
      });
      dirty = true;
    };

    measure();
    frame = requestAnimationFrame(draw);

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", reset);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", reset);
    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("resize", measure);
    reduced.addEventListener("change", measure);
    finePointer.addEventListener("change", measure);

    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", reset);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", reset);
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", measure);
      finePointer.removeEventListener("change", measure);
      root.style.width = "";
      for (const it of items) {
        it.el.style.width = "";
        it.el.style.height = "";
        it.el.style.transform = "";
      }
    };
  }, []);

  return (
    <nav ref={rootRef} className={className} aria-label={label}>
      {children}
    </nav>
  );
}
