/**
 * Komponen ThreeUI mengimpor "three128" — alias yang menyematkan Three.js
 * pada revisi r128. Alias itu didaftarkan di package.json
 * ("three128": "npm:three@0.128.0"), tapi paket three r128 tidak membawa
 * tipe TypeScript sendiri. Deklarasi ini menyambungkannya ke @types/three
 * sehingga sumber ThreeUI tetap utuh apa adanya, tanpa perlu diedit.
 *
 * Catatan: hanya varian "glass" yang memuat Three.js, dan itu pun lewat
 * dynamic import — situs kita memakai varian "modern", jadi WebGL tidak
 * pernah ikut terunduh oleh pengunjung.
 */
declare module "three128" {
  export * from "three";
}
