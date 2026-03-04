// ==========================================
// KONFIGURASI ID (WAJIB DIISI SESUAI AKUN ANDA)
// ==========================================
const SPREADSHEET_ID = 'ISI_ID_SPREADSHEET_ANDA_DI_SINI'; 
const SHEET_NAME = 'Sheet1'; // Ganti jika nama tab/sheet Anda berbeda
const FOLDER_DEST_ID = 'ISI_ID_FOLDER_TUJUAN_SIMPAN_DOCS';

// Pemetaan ID Template Dokumen
const TEMPLATE_IDS = {
  // ID diambil dari URL dokumen yang Anda berikan:
  'surat-aktif': '1CtN46GSZJrGRoaNEumh09P0GFVM37jcefnR74KtJZ2o', 
  'surat-izin': 'ISI_ID_TEMPLATE_SURAT_IZIN_JIKA_ADA',
  'surat-rekomendasi': 'ISI_ID_TEMPLATE_REKOMENDASI_JIKA_ADA'
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle("Portal Layanan Akademik")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Fungsi Utama yang dipanggil oleh React UI
function siapkanSuratTemplate(payload) {
  try {
    const jenisSurat = payload.jenisSurat;
    const data = payload.dataMahasiswa;
    
    // ----------------------------------------------------
    // 1. SIMPAN DATA KE GOOGLE SHEETS
    // ----------------------------------------------------
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet dengan nama "${SHEET_NAME}" tidak ditemukan.`);
    }
    
    const timestamp = new Date();
    // Jika Anda menambahkan input email di React, kita gunakan data.email.
    // Jika tidak, kita coba ambil email akun Google yang sedang aktif (jika disetting run as User).
    const emailTujuan = data.email || Session.getActiveUser().getEmail(); 
    
    // Siapkan baris baru untuk di-insert ke Spreadsheet
    // Urutan kolom: [Waktu, Jenis Surat, Nama, NIM, Prodi, Keperluan, Email, Link Dokumen (diisi nanti)]
    const newRow = [
      timestamp,
      jenisSurat,
      data.nama,
      data.nim,
      data.prodi,
      data.keperluan,
      emailTujuan
    ];
    
    // Tambahkan baris baru ke paling bawah spreadsheet
    sheet.appendRow(newRow);
    const lastRow = sheet.getLastRow(); // Mendapatkan nomor baris yang baru saja ditambahkan
    
    // ----------------------------------------------------
    // 2. DUPLIKASI GOOGLE DOCS TEMPLATE
    // ----------------------------------------------------
    const templateId = TEMPLATE_IDS[jenisSurat];
    if (!templateId) {
      throw new Error(`Template untuk surat "${jenisSurat}" belum dikonfigurasi.`);
    }
    
    const fileTemplate = DriveApp.getFileById(templateId);
    const folderTujuan = DriveApp.getFolderById(FOLDER_DEST_ID);
    
    // Buat nama file spesifik agar mudah dicari di Drive
    const namaFileBaru = `Surat_${jenisSurat}_${data.nama}_${data.nim}`;
    const fileBaru = fileTemplate.makeCopy(namaFileBaru, folderTujuan);
    
    // ----------------------------------------------------
    // 3. REPLACE TEKS DI DOKUMEN BARU
    // ----------------------------------------------------
    const newDoc = DocumentApp.openById(fileBaru.getId());
    const body = newDoc.getBody();
    
    // Ganti kata kunci di template dengan data dari form UI
    // Pastikan di template dokumen Anda terdapat tag seperti {{nama}}, {{nim}}, dll.
    body.replaceText('{{nama}}', data.nama);
    body.replaceText('{{nim}}', data.nim);
    body.replaceText('{{prodi}}', data.prodi);
    body.replaceText('{{keperluan}}', data.keperluan);
    
    // Simpan perubahan dan tutup dokumen
    newDoc.saveAndClose();
    const docUrl = newDoc.getUrl();
    
    // Update kolom terakhir di Google Sheets dengan Link Dokumen yang baru jadi
    sheet.getRange(lastRow, 8).setValue(docUrl); // Angka 8 adalah kolom ke-8 (Kolom H)
    
    // ----------------------------------------------------
    // 4. KIRIM EMAIL KE PENGGUNA
    // ----------------------------------------------------
    if (emailTujuan) {
      const subjectEmail = `Layanan Akademik - Dokumen Anda Telah Selesai`;
      const bodyEmail = `Halo ${data.nama},\n\nPermintaan pembuatan dokumen Anda telah berhasil diproses oleh sistem.\n\nDetail:\n- Layanan: ${jenisSurat}\n- NIM: ${data.nim}\n\nAnda dapat mengakses atau mengunduh dokumen Anda melalui tautan berikut:\n${docUrl}\n\nTerima kasih,\nTim Layanan Akademik`;
      
      // Kirim email (Bisa juga melampirkan file PDF dengan menambahkan opsi attachment)
      MailApp.sendEmail({
        to: emailTujuan,
        subject: subjectEmail,
        body: bodyEmail
      });
    }
    
    // Kembalikan URL dokumen ke React agar bisa ditampilkan di UI
    return docUrl;
    
  } catch (error) {
    // Tangkap error dan lempar kembali ke frontend agar muncul sebagai alert
    throw new Error(error.message);
  }
}