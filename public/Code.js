// ==========================================
// KONFIGURASI ID (WAJIB DIISI SESUAI AKUN ANDA)
// ==========================================
const SPREADSHEET_ID = {
  'surat-bebas-prodi': '1Bzj7bAKEDwscB4yTBxWpL6yWTmYnUU8YafL1a-emhs8', 
  'surat-layak-munaqosah': 'ISI_ID_SPREADSHEET_LAYAK', 
}

const FOLDER_DEST_ID = {
  'surat-bebas-prodi': '1llYJFGHstGfR4RVh7j5Ib73uomiV5FEi', 
  'surat-layak-munaqosah': 'ISI_ID_FOLDER_LAYAK', 
}

const TEMPLATE_IDS = {
  'surat-bebas-prodi': '1CtN46GSZJrGRoaNEumh09P0GFVM37jcefnR74KtJZ2o', 
  'surat-layak-munaqosah': 'ISI_ID_TEMPLATE_LAYAK', 
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle("Portal Layanan Akademik")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// =======================================================
// FUNGSI GENERATOR TANGGAL FORMAT INDONESIA
// =======================================================
function formatTanggalIndonesia(timestampString) {
  // Array nama bulan dalam Bahasa Indonesia
  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const tanggalObj = new Date(timestampString);

  // Ambil komponen tanggal, bulan, dan tahun
  const tanggal = tanggalObj.getDate();
  const bulan = namaBulan[tanggalObj.getMonth()]; // getMonth() menghasilkan indeks 0-11
  const tahun = tanggalObj.getFullYear();
  
  // Format tanggal agar selalu 2 digit (misalnya 09)
  const tanggalDiformat = ('0' + tanggal).slice(-2);

  // Gabungkan semua komponen menjadi satu string
  return `${tanggalDiformat} ${bulan} ${tahun}`;
}

// =======================================================
// FUNGSI GENERATOR NOMOR SURAT DINAMIS
// =======================================================
function buatNomorSurat(kunciNomor, kodeStatis) {
  const properties = PropertiesService.getScriptProperties();
  
  // Mengambil nomor terakhir berdasarkan kunci spesifik surat. Jika belum ada, mulai dari 0.
  let nomorTerakhir = parseInt(properties.getProperty(kunciNomor) || '0');
  const nomorBaru = nomorTerakhir + 1;
  
  // Simpan nomor baru kembali ke properti
  properties.setProperty(kunciNomor, nomorBaru.toString());

  const today = new Date();
  const tahun = today.getFullYear();
  const bulan = ('0' + (today.getMonth() + 1)).slice(-2); 

  // Format akhir: No.1/D.I.1.4/PAI-01/01/2025
  const nomorSuratLengkap = `No.${nomorBaru}/${kodeStatis}/${bulan}/${tahun}`;
  
  return nomorSuratLengkap;
}

// =======================================================
// FUNGSI ROUTER (PINTU MASUK UTAMA)
// =======================================================
function prosesPembuatanSurat(payload) {
  timestamp = new Date();
  const tanggalSurat = formatTanggalIndonesia(timestamp);

  try {
    const jenisSurat = payload.jenisSurat;
    const data = payload.dataForm;

    switch(jenisSurat) {
      case 'surat-bebas-prodi':
        return buatSuratBebasProdi(data, tanggalSurat);
      // case 'surat-layak-munaqosah':
      //   return buatSuratLayak(data, tanggalSurat);
      default:
        throw new Error("Jenis surat tidak dikenali oleh sistem: " + jenisSurat);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

// =======================================================
// LOGIKA 1: SURAT BEBAS PRODI
// =======================================================
function buatSuratBebasProdi(data, tanggalSurat) {
  const spreadsheetId = SPREADSHEET_ID['surat-bebas-prodi'];
  if (!spreadsheetId) throw new Error("ID Spreadsheet untuk Surat Bebas Prodi belum diatur.");
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('test'); // Ganti nama Tab Sheet-nya
  if (!sheet) throw new Error("Tab Spreadsheet tidak ditemukan.");
  
  const templateId = TEMPLATE_IDS['surat-bebas-prodi'];
  if (!templateId) throw new Error("ID Template Surat Bebas Prodi belum diatur.");

  const folderId = FOLDER_DEST_ID['surat-bebas-prodi'];
  if (!folderId) throw new Error("ID Folder tujuan untuk Surat Bebas Prodi belum diatur.");

  // 1. GENERATE NOMOR SURAT KHUSUS BEBAS PRODI
  const KUNCI_NOMOR_BEBAS_PRODI = 'NOMOR_URUT_BEBAS_PRODI'; // Key unik agar tidak tercampur dengan surat lain
  const KODE_STATIS_BEBAS_PRODI = 'D.I.1.4/PAI-01';         // Sesuaikan kode statik kampus Anda
  
  const nomorSurat = buatNomorSurat(KUNCI_NOMOR_BEBAS_PRODI, KODE_STATIS_BEBAS_PRODI);
  
  // 2. SUSUN DATA UNTUK SPREADSHEET (15 Kolom)
  const timestamp = new Date();
  const newRow = [
    timestamp,                        // A: Timestamp
    data.nama,                        // C: NAMA
    data.nim,                         // D: NIM
    data.tgl_munaqosah,               // E: HARI/TGL MUNAQASAH
    data.nilai_ujian,                 // F: NILAI UJIAN
    data.judul_skripsi,               // G: JUDUL SKRIPSI
    data.ipk,                         // H: IPK
    data.ketua_sidang,                // I: KETUA SIDANG
    data.sekretaris_sidang,           // J: SEKRETARIS SIDANG
    data.penguji_1,                   // K: PENGUJI 1
    data.penguji_2,                   // L: PENGUJI 2
    data.pembimbing_1,                // M: PEMBIMBING 1
    data.pembimbing_2                 // N: PEMBIMBING 2
  ];
  
  sheet.appendRow(newRow);
  const lastRow = sheet.getLastRow();
  
  // 3. PROSES DOKUMEN GOOGLE DOCS
  const fileTemplate = DriveApp.getFileById(templateId);
  const folderTujuan = DriveApp.getFolderById(folderId);
  
  const namaFileBaru = `BebasProdi_${data.nim}_${data.nama}`;
  const fileBaru = fileTemplate.makeCopy(namaFileBaru, folderTujuan);
  
  const newDoc = DocumentApp.openById(fileBaru.getId());
  const body = newDoc.getBody();
  
  // REPLACE TEKS (Pastikan Template Docs memiliki Tag ini)
  body.replaceText('{{nomorSurat}}', nomorSurat);
  body.replaceText('{{nama}}', data.nama);
  body.replaceText('{{nim}}', data.nim);
  body.replaceText('{{tglMunaqosah}}', data.tgl_munaqosah);
  body.replaceText('{{nilaiUjian}}', data.nilai_ujian);
  body.replaceText('{{judulSkripsi}}', data.judul_skripsi);
  body.replaceText('{{ipk}}', data.ipk);
  body.replaceText('{{ketuaSidang}}', data.ketua_sidang);
  body.replaceText('{{sekretarisSidang}}', data.sekretaris_sidang);
  body.replaceText('{{penguji1}}', data.penguji_1);
  body.replaceText('{{penguji2}}', data.penguji_2);
  body.replaceText('{{pembimbing1}}', data.pembimbing_1);
  body.replaceText('{{pembimbing2}}', data.pembimbing_2 || '-'); 
  body.replaceText('{{tanggalSurat}}', tanggalSurat);
  
  newDoc.saveAndClose();
  const docUrl = newDoc.getUrl();
  
  // 4. SIMPAN LINK DOKUMEN KE SPREADSHEET (Kolom O / ke-15)
  sheet.getRange(lastRow, 15).setValue(docUrl); 
  
  return docUrl;
}