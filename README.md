# PALMKALING — Situs Ekspor Kolang-Kaling

Situs B2B tiga bahasa (Indonesia / Inggris / Korea) untuk menjaring
inquiry importir kolang-kaling (*Arenga pinnata* / sugar palm fruit).
Next.js 16 + TypeScript + Tailwind v4, diterbitkan sebagai situs statis
di GitHub Pages.

**PALMKALING** adalah merek dagangnya; badan hukumnya **CV Puji Jaya
Putra**, yang tampil di footer dan halaman Kontak — tempat tim due
diligence memang mencarinya.


---

## Menjalankan di komputer sendiri

```bash
npm install     # sekali saja
npm run dev     # buka http://localhost:3000
```

Simpan berkas apa pun, halaman di browser langsung ikut berubah. Ini cara
paling cepat melihat hasil editanmu — tidak perlu deploy dulu.

Untuk menguji versi produksi — dan ini bukan formalitas, karena versi
statis berperilaku berbeda dari `npm run dev`:

```bash
NEXT_PUBLIC_BASE_PATH=/palmkaling npm run build
npx serve out            # lalu buka http://localhost:3000/palmkaling/
```

`npm start` TIDAK dipakai di proyek ini. Karena `output: "export"`,
`next build` menulis berkas statis ke `out/` dan tidak ada server yang
perlu dijalankan.

Kenapa `NEXT_PUBLIC_BASE_PATH` perlu disebut saat menguji: di GitHub
Pages situs tinggal di `/palmkaling`, bukan di akar domain. Alamat aset
yang lupa diberi awalan hanya kelihatan salah pada build yang memakai
awalan itu — di `npm run dev` semuanya tampak normal.

## Halaman yang ada

| URL | Isi |
|---|---|
| `/id` `/en` `/ko` | Beranda |
| `…/product` | Spesifikasi, foto pengukuran, unduhan TDS |
| `…/supply-network` | Wilayah pasokan, kontrol mutu, video fasilitas |
| `…/export-process` | 7 langkah order, syarat dagang, dokumen |
| `…/contact` | Form penawaran (RFQ) |

Membuka `/` saja akan diarahkan sesuai bahasa browser pengunjung, lewat
`public/index.html`.

Perlu diketahui: sebelumnya pengalihan ini dikerjakan di sisi server oleh
`src/proxy.ts`, yang membaca header `Accept-Language`. GitHub Pages tidak
menjalankan kode server, jadi Next menolak `proxy.ts` bersama
`output: "export"` dan pengalihannya pindah ke browser. Konsekuensinya
ada satu langkah pengalihan yang terlihat sekejap. Kalau situs ini nanti
dipindahkan ke host yang menjalankan Node.js, `proxy.ts` layak
dihidupkan kembali.

## Mau ubah apa, buka file mana

| Mau ubah | File |
|---|---|
| Nomor WA, email, alamat, NIB | `src/config/company.ts` |
| Spesifikasi, kemasan, MOQ, kapasitas | `src/content/product-data.ts` |
| Wilayah & kapasitas supplier | `src/content/suppliers.ts` |
| Teks Indonesia | `src/i18n/dictionaries/id.json` |
| Teks Inggris | `src/i18n/dictionaries/en.json` |
| Teks Korea | `src/i18n/dictionaries/ko.json` |
| Warna & font | `src/app/globals.css` |
| Foto & video | `public/media/` |
| Data yang belum diisi | `src/config/company.ts` → `pendingFields` |
| Gerakan menu (dock) | `src/components/ProximityDock.tsx` |
| Bobot huruf per elemen | `src/app/globals.css` → `@utility type-*` |
| Palet mode malam | `src/app/globals.css` → `--d-*` |
| Logo | `public/brand/` |
| Galeri foto yang bisa digeser | `src/components/PhotoGallery.tsx` |

Menambah bahasa keempat (mis. Arab): tambahkan kodenya di
`src/i18n/config.ts`, lalu salin `en.json` jadi `ar.json`. Tidak ada file
lain yang perlu disentuh.

**Aturan penting:** jangan menulis nomor telepon atau email langsung di
dalam komponen. Ambil selalu dari `company.ts`, supaya satu kali edit
berlaku untuk seluruh situs.

## Deploy

Situs terbit otomatis ke **<https://sveroust.github.io/palmkaling/>**
setiap kali ada push ke `main`, lewat `.github/workflows/deploy.yml`.

```bash
git add -A
git commit -m "pesan"
git push
```

Lalu tunggu. Build berjalan sekitar satu sampai dua menit; kemajuannya
bisa dilihat di tab **Actions** repositori. **Halaman tidak berubah
begitu di-refresh** — refresh baru menampilkan versi baru setelah build
selesai. Kalau ingin melihat hasil editan seketika, pakai
`npm run dev` di komputer sendiri; itu memang tempatnya.

### Kalau nanti pakai domain sendiri

Kosongkan `NEXT_PUBLIC_BASE_PATH` dan sesuaikan `NEXT_PUBLIC_SITE_URL`
di `.github/workflows/deploy.yml`, lalu daftarkan domainnya di
**Settings → Pages → Custom domain**. Tidak ada kode yang perlu diubah —
awalan alamat memang sengaja dibuat lewat variabel lingkungan supaya
pindah domain tidak menyentuh satu berkas sumber pun.

### Harga memilih GitHub Pages

Dua hal hilang dibanding host yang menjalankan Node.js, dan keduanya
disengaja, bukan kelalaian:

1. **Deteksi bahasa sisi server** — lihat catatan di bagian daftar
   halaman di atas.
2. **Optimasi gambar** — `next/image` butuh server, jadi
   `images.unoptimized` dinyalakan. Foto dikirim apa adanya, tanpa WebP
   dan tanpa penyesuaian ukuran per layar. Ini paling terasa di galeri
   foto pengukuran ketika dibuka dari ponsel.

## Pita "Draf"

Selama masih ada nama field di `pendingFields` (`src/config/company.ts`),
setiap halaman menampilkan pita kuning "Draf" dan field yang bersangkutan
muncul sebagai **( belum diisi )**.

Isi datanya → hapus namanya dari `pendingFields` → penandanya hilang.
Kalau daftarnya kosong, pita "Draf" ikut hilang dan situs siap terbit.

## Catatan ukuran

`public/media/` berisi sekitar 9,7 MB, sebagian besar dua video
(8,6 MB). Masih jauh di bawah batas 1 GB milik GitHub Pages, tapi karena
optimasi gambar mati, seluruh berkas foto terkirim dalam ukuran aslinya.
Kalau videonya bertambah, pindahkan ke YouTube atau Cloudflare Stream
supaya repo tetap ringan dan halaman tetap cepat.
