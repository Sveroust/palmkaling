#!/usr/bin/env bash
# ============================================================
#  RENDER LEMBAR SPESIFIKASI (TDS) KE PDF
# ============================================================
#  scripts/spec-sheet/spec-sheet.html
#      -> public/media/technical-data-sheet.pdf
#
#  Kenapa lewat skrip dan bukan "Print to PDF" dari menu browser:
#  dialog cetak menyisipkan header/footer sendiri — tanggal cetak,
#  alamat file:/// sumbernya, dan nomor halaman. PDF yang lama kena
#  ketiganya, jadi calon pembeli ikut membaca isi folder di komputer
#  ini. Bendera --no-pdf-header-footer di bawah yang mematikannya.
#
#  Dijalankan lewat berkas lokal (file://), bukan server: halamannya
#  satu berkas mandiri tanpa aset luar selain font Google, jadi tidak
#  ada yang perlu disajikan.
# ============================================================
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "GAGAL: Google Chrome tidak ada di $CHROME"; exit 1; }

cd "$(dirname "$0")/../.."
SRC="$PWD/scripts/spec-sheet/spec-sheet.html"
OUT="$PWD/public/media/technical-data-sheet.pdf"
[ -f "$SRC" ] || { echo "GAGAL: sumber tidak ada: $SRC"; exit 1; }

echo "==> Merender $SRC"
"$CHROME" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --no-margins \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=10000 \
  --print-to-pdf="$OUT" \
  "file://$SRC" 2>/dev/null

[ -s "$OUT" ] || { echo "GAGAL: PDF tidak terbentuk"; exit 1; }

# Jaring pengaman: kalau salah satu artefak cetak atau jalur lokal
# lolos ke hasil, lebih baik gagal di sini daripada terkirim ke pembeli.
if command -v pdftotext >/dev/null; then
  TEKS="$(pdftotext -layout "$OUT" - 2>/dev/null || true)"
  for TERLARANG in "file:///" "/Users/" "Folder Reference"; do
    if printf '%s' "$TEKS" | grep -qF "$TERLARANG"; then
      echo "GAGAL: hasil masih memuat \"$TERLARANG\""; exit 1
    fi
  done
  echo "==> Bersih: tanpa jalur lokal, tanpa artefak cetak"
fi

echo "==> Selesai: $OUT ($(printf '%.0f' "$(echo "$(stat -f%z "$OUT") / 1024" | bc -l)") KB, $(pdfinfo "$OUT" 2>/dev/null | awk '/^Pages/{print $2}') halaman)"
