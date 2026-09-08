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

Situs tinggal di **<https://sveroust.github.io/palmkaling/>**, disajikan
dari branch `gh-pages`.

```bash
npm run deploy
```

Satu perintah itu membangun situs lalu mendorong hasilnya ke
`gh-pages`. Perubahan biasanya terlihat dalam satu sampai dua menit
(GitHub perlu waktu menyebarkannya).

**Yang perlu dipahami:** situs yang sudah terbit TIDAK ikut berubah
hanya dengan me-refresh halaman. Refresh menampilkan versi baru
setelah `npm run deploy` selesai. Yang berubah seketika saat kamu
menyimpan berkas adalah `npm run dev` di komputer sendiri — di situlah
tempat mengedit dan melihat hasilnya.

Jadi alurnya: edit di `npm run dev` sampai puas → `git push` supaya
kodenya tersimpan → `npm run deploy` supaya tautan yang kamu bagikan
ikut berubah.

`gh-pages` diperlakukan sebagai keluaran, bukan riwayat: tiap deploy
menimpanya. Riwayat yang penting ada di `main`.

### Kalau mau deploy otomatis tiap push

Salin isi `docs/contoh-workflow-github-actions.yml` ke
`.github/workflows/deploy.yml` lewat editor web GitHub, lalu ubah
sumber Pages ke **GitHub Actions** di Settings → Pages. Sesudah itu
`npm run deploy` tidak diperlukan lagi — cukup `git push`. Berkas itu
tidak bisa didorong dari komputer ini karena token CLI-nya tidak punya
scope `workflow`.

### Kalau nanti pakai domain sendiri

Ubah `BASE` dan `SITE` di `scripts/deploy.sh` (kosongkan `BASE`), lalu
daftarkan domainnya di
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

## Lembar spesifikasi (TDS)

`public/media/technical-data-sheet.pdf` di-generate dari
`scripts/spec-sheet/spec-sheet.html`:

```bash
bash scripts/spec-sheet/render.sh
```

Jangan pernah membuatnya lewat menu Print to PDF di browser. Dialog
cetak menyisipkan header dan footer sendiri, dan versi lama kena
semuanya: tanggal cetak di kiri atas, alamat `file:///Users/...`
sumbernya di kiri bawah, nomor halaman di kanan bawah, plus baris
`Folder Reference: /Users/user/Downloads/...` di dalam kontennya.
Empat-empatnya membocorkan isi komputer ke calon pembeli. Skrip di
atas memakai `--no-pdf-header-footer`, dan di akhir ia memeriksa
hasilnya: kalau `file:///`, `/Users/`, atau `Folder Reference` masih
muncul, skripnya gagal alih-alih menghasilkan PDF yang terkirim.

Angka di lembar itu HARUS sama dengan `src/content/product-data.ts`
dan `src/config/company.ts`. Lembar spesifikasi yang berbeda dari
situsnya lebih merugikan daripada tidak punya lembar spesifikasi.

## Catatan ukuran

`public/media/` berisi sekitar 6,5 MB, sebagian besar dua video
(5,5 MB). Masih jauh di bawah batas 1 GB milik GitHub Pages, tapi karena
optimasi gambar mati, seluruh berkas foto terkirim dalam ukuran aslinya.
Kalau videonya bertambah, pindahkan ke YouTube atau Cloudflare Stream
supaya repo tetap ringan dan halaman tetap cepat.

Videonya dikompres H.264 profil Main, CRF 28, audio AAC 64 kbps mono,
dengan `-movflags +faststart` supaya bisa diputar sebelum selesai
terunduh. SSIM terhadap rekaman aslinya 0,94–0,97 alias tidak terlihat
bedanya. Yang menentukan berat halaman bukan videonya, karena
`preload="none"` menahan unduhan sampai orang menekan play: muat awal
halaman ini sekitar 830 KB, dan 0 byte video ikut terkirim.

Menambah video baru — rasio tegak maupun mendatar sama-sama boleh:

```bash
ffmpeg -i mentah.mp4 -c:v libx264 -profile:v main -level 4.0 -preset slow \
  -crf 28 -pix_fmt yuv420p -c:a aac -b:a 64k -ac 1 \
  -movflags +faststart public/media/nama.mp4
ffmpeg -ss 1 -i public/media/nama.mp4 -frames:v 1 -q:v 5 \
  public/media/nama-poster.jpg
ffprobe -v error -show_entries stream=width,height -of csv=p=0:nk=1 \
  public/media/nama.mp4
```

Lalu daftarkan di `evidenceVideos` (`src/content/product-data.ts`)
lengkap dengan `poster`, `width`, dan `height`. Poster WAJIB: tanpa itu
video tampil sebagai kotak gelap kosong.
