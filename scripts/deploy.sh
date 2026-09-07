#!/usr/bin/env bash
# ============================================================
#  DEPLOY KE GITHUB PAGES
# ============================================================
#  Membangun situs statis lalu mendorong isi out/ ke branch
#  gh-pages, yang disajikan GitHub Pages sebagai
#  https://sveroust.github.io/palmkaling/
#
#  Kenapa branch, bukan GitHub Actions: token CLI di komputer ini
#  tidak punya scope "workflow", jadi berkas Actions tidak bisa
#  didorong dari sini. Efek sampingnya justru enak — deploy jadi
#  satu perintah dan langsung jadi, tanpa menunggu CI.
#
#  gh-pages diperlakukan sebagai keluaran, BUKAN riwayat: tiap
#  deploy menimpanya dengan satu commit baru (push -f). Riwayat
#  yang penting ada di main.
# ============================================================
set -euo pipefail

REPO="https://github.com/Sveroust/palmkaling.git"
BASE="/palmkaling"
SITE="https://sveroust.github.io/palmkaling"

# Skrip ini tinggal di scripts/, jadi naik satu tingkat ke akar proyek.
cd "$(dirname "$0")/.."

echo "==> Membangun (basePath ${BASE})"
NEXT_PUBLIC_BASE_PATH="$BASE" NEXT_PUBLIC_SITE_URL="$SITE" npx next build

# Jekyll membuang folder berawalan "_", yang akan menghapus /_next
# dan membuat seluruh CSS serta JavaScript situs hilang tanpa error.
test -f out/.nojekyll || { echo "GAGAL: out/.nojekyll hilang"; exit 1; }

echo "==> Mendorong out/ ke branch gh-pages"
rm -rf out/.git
git -C out init -q -b gh-pages
git -C out add -A
git -C out -c user.name="Sveroust" -c user.email="kthoriq7@gmail.com" \
  commit -q -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git -C out push -q -f "$REPO" gh-pages:gh-pages
rm -rf out/.git

echo "==> Selesai. Situs: ${SITE}/"
echo "    Perubahan biasanya terlihat dalam 1-2 menit."
