"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Caption } from "./ui";
import { asset } from "@/config/paths";

/**
 * ============================================================
 *  GALERI FOTO — BISA DIGESER, BISA DIBUKA
 * ============================================================
 *  Dua lapis:
 *
 *  1. REL (slider) di halaman. Foto berbaris ke samping dan bisa
 *     digeser: swipe di ponsel, seret dengan tetikus di desktop,
 *     atau lewat tombol panah dan strip penanda di bawahnya.
 *
 *  2. LIGHTBOX saat foto diklik. Foto tampil utuh — penting karena
 *     di rel foto dipotong jadi 4:3 supaya barisnya rapi, sedangkan
 *     foto pengukuran justru harus terlihat seluruhnya (mistarnya
 *     ada di ujung bingkai).
 *
 *  Kenapa scroll-snap bawaan browser, bukan pustaka carousel:
 *  inersia jempol di ponsel — seret cepat lalu lepas — itu yang
 *  paling sering salah kalau digeser pakai JavaScript. Browser
 *  sudah melakukannya dengan benar dan gratis. JavaScript di sini
 *  hanya menambah hal yang TIDAK dipunyai browser: seret dengan
 *  tetikus, tombol panah, dan lightbox.
 *
 *  Lightbox-nya memakai elemen <dialog> asli, bukan div bertumpuk.
 *  Dengan begitu Esc menutup, fokus keyboard terkurung di dalam,
 *  dan sisa halaman disembunyikan dari pembaca layar — tiga hal
 *  yang harus ditulis tangan (dan biasanya keliru) kalau pakai div.
 * ============================================================
 */

export type GalleryPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type GalleryLabels = {
  open: string;
  close: string;
  prev: string;
  next: string;
  /** Mengandung {n} dan {total}, mis. "Foto {n} dari {total}". */
  counter: string;
};

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Lebar satu langkah geser = lebar satu foto + jarak antar-foto. */
function slideStep(track: HTMLElement) {
  const first = track.firstElementChild as HTMLElement | null;
  if (!first) return track.clientWidth;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  return first.getBoundingClientRect().width + gap;
}

export function PhotoGallery({
  photos,
  labels,
}: {
  photos: readonly GalleryPhoto[];
  labels: GalleryLabels;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /** null = lightbox tertutup. Angka = foto yang diklik. */
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  /** Foto yang sedang dilihat DI DALAM lightbox (berubah saat di-swipe). */
  const [viewing, setViewing] = useState(0);

  const counter = (n: number) =>
    labels.counter.replace("{n}", String(n)).replace("{total}", String(photos.length));

  /* ---------------- REL DI HALAMAN ---------------- */

  const readTrack = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const step = slideStep(el);
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
    setActive(Math.max(0, Math.min(photos.length - 1, Math.round(el.scrollLeft / step))));
  }, [photos.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    readTrack();
    /* Lebar foto ikut lebar layar, jadi posisi "ujung kanan" berubah
       saat jendela diubah ukurannya — tombol panah harus tahu. */
    const ro = new ResizeObserver(readTrack);
    ro.observe(el);
    return () => ro.disconnect();
  }, [readTrack]);

  const scrollTrack = (to: number, smooth = true) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: to, behavior: smooth && !reducedMotion() ? "smooth" : "auto" });
  };

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    scrollTrack(el.scrollLeft + dir * slideStep(el));
  };

  /* ---------------- SERET DENGAN TETIKUS ----------------
     Sentuhan tidak diurus di sini — browser sudah menanganinya, dan
     ikut campur justru merusak inersianya. Yang ditambahkan hanya
     untuk tetikus, yang secara bawaan tidak bisa menyeret.

     Saat menyeret, scroll-snap DIMATIKAN sementara. Kalau tidak,
     `mandatory` akan menarik rel ke titik snap terdekat pada setiap
     pergerakan dan foto terasa meletik-letik alih-alih mengikuti
     kursor. Begitu tetikus dilepas, snap dinyalakan kembali dan
     browser sendiri yang merapikan ke foto terdekat. */
  const drag = useRef({ id: -1, startX: 0, startLeft: 0, moved: false });

  const onPointerDown = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { id: e.pointerId, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const el = trackRef.current;
    if (d.id !== e.pointerId || !el) return;

    const dx = e.clientX - d.startX;
    if (!d.moved) {
      /* Ambang 6px: gerakan lebih kecil dari ini masih dianggap klik,
         supaya tangan yang sedikit bergeser saat mengklik foto tidak
         gagal membuka lightbox. */
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      el.style.scrollSnapType = "none";
      el.setPointerCapture(e.pointerId);
    }
    el.scrollLeft = d.startLeft - dx;
  };

  const endDrag = (e: ReactPointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const el = trackRef.current;
    if (el && d.moved) el.style.scrollSnapType = "";
    d.id = -1;
    /* `moved` sengaja dibiarkan menyala: onClick foto membacanya
       sesaat kemudian untuk membedakan "habis menyeret" dari "diklik". */
  };

  /* ---------------- LIGHTBOX ---------------- */

  const openAt = (i: number) => {
    if (drag.current.moved) {
      drag.current.moved = false; // ini akhir dari seretan, bukan klik
      return;
    }
    setOpenIdx(i);
    /* `viewing` disetel di sini, bukan di dalam effect pembuka dialog:
       nilainya sudah diketahui pada saat diklik, jadi tidak ada alasan
       menunggu satu putaran render lagi hanya untuk menuliskannya. */
    setViewing(i);
  };

  const dismiss = () => setOpenIdx(null);

  /**
   * Dijalankan SETELAH <dialog> benar-benar tertutup, lewat apa pun
   * jalannya: tombol Tutup, klik di luar foto, atau Esc. Esc ditangani
   * browser dan tidak melewati handler kita sama sekali — jadi kalau
   * penyelarasan ini ditaruh di tombol Tutup, menutup dengan Esc akan
   * melempar pengunjung balik ke foto pertama.
   */
  const onClosed = () => {
    setOpenIdx(null);
    /* Halaman kembali pada foto yang terakhir dilihat, bukan pada foto
       yang tadi diklik — orang yang sudah men-swipe tiga foto di dalam
       lightbox tidak mau menemukan relnya belum bergerak. */
    const el = trackRef.current;
    if (el) scrollTrack(viewing * slideStep(el), false);
  };

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;

    if (openIdx === null) {
      if (d.open) d.close();
      return;
    }

    if (!d.open) d.showModal();

    /* Rel lightbox dilompatkan TANPA animasi ke foto yang diklik.
       Harus setelah showModal(): sebelum itu dialog masih display:none
       sehingga clientWidth-nya nol dan perhitungannya jadi salah. */
    const el = lightboxRef.current;
    if (el) {
      const before = el.style.scrollBehavior;
      el.style.scrollBehavior = "auto";
      el.scrollLeft = openIdx * el.clientWidth;
      el.style.scrollBehavior = before;
    }

    /* Halaman di belakang dikunci: <dialog> mencegah interaksi, tapi
       tidak mencegah halaman ikut ter-scroll saat orang men-swipe. */
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [openIdx]);

  const readLightbox = () => {
    const el = lightboxRef.current;
    if (!el || !el.clientWidth) return;
    setViewing(
      Math.max(0, Math.min(photos.length - 1, Math.round(el.scrollLeft / el.clientWidth)))
    );
  };

  const nudgeLightbox = (dir: 1 | -1) => {
    const el = lightboxRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * el.clientWidth,
      behavior: reducedMotion() ? "auto" : "smooth",
    });
  };

  const onLightboxKey = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nudgeLightbox(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nudgeLightbox(-1);
    }
  };

  /* Menyembunyikan bilah gulir tanpa mematikan kemampuan menggulirnya. */
  const hideScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

  return (
    <>
      {/* ---------- REL ----------
          Di ponsel rel sengaja melebar sampai tepi layar (-mx-5 px-5):
          foto yang terpotong di tepi kanan adalah petunjuk paling jelas
          bahwa barisan ini masih berlanjut. */}
      <ul
        ref={trackRef}
        onScroll={readTrack}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-1 sm:-mx-8 sm:scroll-px-8 sm:px-8 ${hideScrollbar}`}
      >
        {photos.map((photo, i) => (
          <li key={photo.src} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]">
            <figure>
              <button
                type="button"
                onClick={() => openAt(i)}
                aria-label={`${labels.open} — ${photo.alt}`}
                className="group relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden border border-line bg-paper"
              >
                <Image
                  src={asset(photo.src)}
                  alt={photo.alt}
                  fill
                  draggable={false}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 78vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                {/* Petunjuk "bisa diperbesar". Muncul saat disorot ATAU saat
                    tombolnya mendapat fokus keyboard — pengguna keyboard
                    berhak dapat petunjuk yang sama. */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center bg-on-dark/90 text-palm opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6" />
                  </svg>
                </span>
              </button>
              <Caption>{photo.alt}</Caption>
            </figure>
          </li>
        ))}
      </ul>

      {/* ---------- KEMUDI ----------
          Strip penanda di kiri, panah di kanan. Ditaruh DI BAWAH rel,
          bukan ditumpuk di atas foto: panah yang menutupi foto selalu
          menutupi bagian yang justru ingin dilihat — di sini bagian itu
          adalah mistar di tepi bingkai. */}
      <div className="mt-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-1.5">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => {
                const el = trackRef.current;
                if (el) scrollTrack(i * slideStep(el));
              }}
              aria-label={counter(i + 1)}
              aria-current={i === active ? "true" : undefined}
              className={`h-1 transition-all duration-300 ${
                i === active ? "w-8 bg-palm" : "w-4 bg-line-strong hover:bg-ink-faint"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowButton label={labels.prev} onClick={() => nudge(-1)} disabled={atStart} dir="left" />
          <ArrowButton label={labels.next} onClick={() => nudge(1)} disabled={atEnd} dir="right" />
        </div>
      </div>

      {/* ---------- LIGHTBOX ---------- */}
      <dialog
        ref={dialogRef}
        onClose={onClosed}
        onKeyDown={onLightboxKey}
        aria-labelledby="galeri-nomor"
        /* Latar dibuat PEKAT, bukan semi-tembus. Sisa 3% pun cukup untuk
           meninggalkan bayangan tulisan halaman di belakang foto — dan foto
           di sini gunanya diperiksa sampai ke garis mistarnya.

           `overlay` dipakai, BUKAN `ink`. Lightbox harus gelap di kedua
           mode; `ink` ikut berbalik jadi warna terang di mode malam dan
           lightbox-nya akan jadi kotak putih bertulisan putih. */
        className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-overlay p-0 text-on-dark backdrop:bg-overlay/80"
      >
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-on-dark/10 px-4 py-3 sm:px-6">
            <p id="galeri-nomor" aria-live="polite" className="type-label text-xs text-on-dark/55">
              {counter(viewing + 1)}
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="type-cta flex items-center gap-2 border border-on-dark/25 px-3 py-1.5 text-xs text-on-dark transition-colors hover:bg-on-dark/10"
            >
              {labels.close}
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 stroke-current stroke-2">
                <path d="M5 5l14 14M19 5 5 19" />
              </svg>
            </button>
          </div>

          {/* Rel kedua, satu foto = satu lebar layar. Karena itu swipe di
              dalam lightbox pun ditangani browser, sama seperti di rel atas. */}
          <div
            ref={lightboxRef}
            onScroll={readLightbox}
            className={`flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain ${hideScrollbar}`}
          >
            {photos.map((photo) => (
              <div
                key={photo.src}
                /* Klik di ruang kosong sekitar foto = tutup. Klik pada
                   fotonya sendiri tidak, supaya bisa diperhatikan lama
                   tanpa takut lightbox-nya keburu menutup. */
                onClick={(e) => {
                  if (e.target === e.currentTarget) dismiss();
                }}
                className="flex w-full shrink-0 snap-center items-center justify-center p-3 sm:p-8"
              >
                <Image
                  src={asset(photo.src)}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  quality={90}
                  draggable={false}
                  sizes="100vw"
                  className="h-auto max-h-full w-auto max-w-full object-contain"
                />
              </div>
            ))}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-6 border-t border-on-dark/10 px-4 py-4 sm:px-6">
            <p className="max-w-xl text-sm leading-relaxed text-on-dark/80">{photos[viewing]?.alt}</p>
            <div className="flex shrink-0 items-center gap-2">
              <ArrowButton
                label={labels.prev}
                onClick={() => nudgeLightbox(-1)}
                disabled={viewing === 0}
                dir="left"
                tone="dark"
              />
              <ArrowButton
                label={labels.next}
                onClick={() => nudgeLightbox(1)}
                disabled={viewing === photos.length - 1}
                dir="right"
                tone="dark"
              />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

function ArrowButton({
  label,
  onClick,
  disabled,
  dir,
  tone = "light",
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  dir: "left" | "right";
  tone?: "light" | "dark";
}) {
  const skin =
    tone === "light"
      ? "border-line-strong text-ink hover:enabled:border-palm-text hover:enabled:text-palm-text"
      : "border-on-dark/25 text-on-dark hover:enabled:bg-on-dark/10";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`grid h-10 w-10 place-items-center border transition-colors disabled:opacity-25 ${skin}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
        {dir === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );
}
