# Laporan Audit File Proyek Dusun Wungurejo

Berdasarkan hasil scanning menyeluruh terhadap **315** file gambar (JPG, PNG, WEBP, GIF, dll) yang berada di dalam folder `assets` dan `Peta`, ditemukan **49 file gambar** yang **TIDAK PERNAH DIPANGGIL** di dalam seluruh kode sumber (HTML, CSS, dan JavaScript). 

File-file ini kemungkinan adalah gambar cadangan, versi lama, atau sisa dari proses rotasi gambar (terdapat akhiran `_rotated`) yang sudah tidak lagi digunakan.

## 🗑️ Daftar File Gambar yang Tidak Terpakai

Menghapus file-file ini dapat menghemat ruang penyimpanan dan mempercepat proses deployment website Anda.

### 1. Folder Assets Umum
- `assets/images/andongsili.webp`
- `assets/profilepic/FOTOBERSAMA.jpeg`
- `assets/Timwungurejo/FOTOBERSAMA2_web.jpg`

### 2. Folder Tim (Foto Anggota)
- `assets/team/DSCF4365Albet_web.png`
- `assets/team/DSCF4365Ardila_web.png`
- `assets/team/DSCF4365Dewa_web.png`
- `assets/team/DSCF4365Fadia_web.png`
- `assets/team/DSCF4365Faza_web.png`
- `assets/team/DSCF4365Ilham_web.png`
- `assets/team/DSCF4365Rara_web.png`
- `assets/team/DSCF4365Rifki_web.png`
- `assets/team/DSCF4365Tata_web.png`
- `assets/team/DSCF4365Zahra_web.png`

### 3. Folder Katalog UMKM (Gambar Duplikat & Hasil Rotasi)
Banyak dari file di bawah ini adalah file duplikat yang dihasilkan dari proses rotasi gambar di dalam sistem komputer Anda namun tidak dipanggil ke dalam HTML.

**RT 03 - Pengrajin Popor Senapan Kayu:**
- `assets/KatalogUMKM/RT03/Pengrajin_Popor_SenapanKayu/IMG_0998.JPG`
- `assets/KatalogUMKM/RT03/Pengrajin_Popor_SenapanKayu/IMG_0999.JPG`
- `assets/KatalogUMKM/RT03/Pengrajin_Popor_SenapanKayu/IMG_0998_rotated.JPG`
- `assets/KatalogUMKM/RT03/Pengrajin_Popor_SenapanKayu/IMG_0999_rotated.JPG`
- `assets/KatalogUMKM/RT03/Pengrajin_Popor_SenapanKayu/IMG_0998_rotated_2.JPG`
- `assets/KatalogUMKM/RT03/Pengrajin_Popor_SenapanKayu/IMG_0999_rotated_2.JPG`

**RT 06 - Madu TBS:**
- `assets/KatalogUMKM/RT06/Madu_TBS/IMG_0850 s.d IMG_0856.JPG` (versi original yang mungkin sudah diganti namanya)
- File dengan akhiran `_rotated.JPG`, `_rotated_2.JPG`, dan `_rotated_3.JPG` untuk seluruh koleksi foto Madu TBS (total sekitar 21 gambar sisa rotasi).

### 4. Folder Peta WebGIS
- `Peta/Peta Wungurejo WebGIS/qgis2web_.../css/images/measure-control.png`
- `Peta/Peta Wungurejo WebGIS/qgis2web_.../css/images/throbber.gif`

---
> [!TIP]
> **Rekomendasi:** Anda dapat menghapus file-file di atas (terutama gambar `_rotated` yang menumpuk di folder Madu TBS dan Popor Kayu) secara aman dari penyimpanan lokal dan repository GitHub untuk mengurangi ukuran (size) total proyek website Anda.
