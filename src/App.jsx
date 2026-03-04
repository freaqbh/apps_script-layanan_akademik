import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Home, 
  Menu, 
  X, 
  ChevronRight, 
  User, 
  LogOut, 
  Bell,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import logoKampus from './assets/logo-univ.png'; // Pastikan path ini benar sesuai struktur proyek Anda


export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [docUrl, setDocUrl] = useState(null);

  const menuSurat = [
    { 
      id: 'surat-bebas-prodi', 
      label: 'Surat Bebas Prodi', 
      icon: <FileText size={20} />,
      previewUrl: 'https://lh3.googleusercontent.com/d/1SfOmXhBjbBik5_sQh1a9nZYsLRYaocJd' // Ganti dengan URL gambar preview yang sesuai
    },
    { 
      id: 'surat-layak-munaqosah', 
      label: 'Surat Keterangan Layak Munaqosah', 
      icon: <FileText size={20} />,
      previewUrl: 'https://placehold.co/600x848/fdf4ff/701a75?text=Preview+Surat+Lulus%5Cn(Ganti+dengan+Gambar+Anda)' 
    },
    { 
      id: 'surat-tugas-dosen', 
      label: 'Surat Tugas Dosen', 
      icon: <FileText size={20} />,
      previewUrl: 'https://placehold.co/600x848/f0fdf4/14532d?text=Preview+Surat+Tugas%5Cn(Ganti+dengan+Gambar+Anda)' 
    },
    { 
      id: 'surat-aktif', 
      label: 'Surat Keterangan Aktif', 
      icon: <FileText size={20} />,
      previewUrl: 'https://lh3.googleusercontent.com/d/1SfOmXhBjbBik5_sQh1a9nZYsLRYaocJd' // Ganti dengan URL gambar preview yang sesuai
    },
  ];

  // Fungsi untuk memanggil Backend Apps Script
  const handleSubmitKeBackend = (jenisSurat, dataForm) => {
    setIsProcessing(true);
    setDocUrl(null);

    const payload = {jenisSurat, dataForm};

    if (typeof google !== 'undefined') {
      google.script.run
        .withSuccessHandler((url) => { setDocUrl(url); setIsProcessing(false); })
        .withFailureHandler((err) => { alert('error: ' + err.message); setIsProcessing(false); })
        .prosesPembuatanSurat(payload);
    }
  };

  const gantiTab = (id) => {
    setActiveTab(id);
    setDocUrl(null);
  }

  const currentSurat = menuSurat.find(m => m.id === activeTab);

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      
      {/* SIDEBAR */}
      <aside className={`
        ${isSidebarOpen ? 'w-72' : 'w-20'} 
        bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed h-full z-30 md:relative shadow-lg
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <img src={logoKampus} alt="Logo Kampus" className="w-10 h-10 object-contain drop-shadow-sm" />
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-slate-900">Portal<span className="text-blue-900"> Akademik</span></span>}
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <Home size={20} />
            {isSidebarOpen && <span>Beranda Utama</span>}
          </button>

          <div className="pt-6 pb-2 px-3">
            {isSidebarOpen && <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Layanan Surat</span>}
          </div>

          {menuSurat.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-900 font-semibold shadow-sm border border-blue-100' : 'hover:bg-slate-50 text-slate-600 border border-transparent'}`}
            >
              {item.icon}
              {isSidebarOpen && <span className="truncate text-left flex-1">{item.label}</span>}
              {isSidebarOpen && activeTab === item.id && <ChevronRight size={16} className="text-blue-500" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 border-2 border-white shadow-sm">
              <User size={20} />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">Sistem Cerdas</p>
                <p className="text-xs text-slate-400">Ver. 2.0</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* OVERLAY UNTUK MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* NAVBAR */}
        <header className="h-16 bg-blue-900 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="group p-2 hover:bg-slate-100 rounded-md transition-colors duration-200"
            >
              {isSidebarOpen ? <X size={20} className="text-yellow-400 group-hover:text-blue-900 transition-colors " /> : <Menu size={20} className="text-yellow-400 group-hover:text-blue-900 transition-colors" />}
            </button>
            <h1 className="text-lg font-semibold text-yellow-400 hidden sm:block">
              {activeTab === 'dashboard' ? 'Dashboard' : menuSurat.find(m => m.id === activeTab)?.label}
            </h1>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8"> 
          {/* --- HALAMAN BERANDA --- */}
          {activeTab === 'dashboard' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4">
              <div className="mb-10 bg-gradient-to-r from-blue-900 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-blue-200/50">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-400">Selamat Datang di Layanan Mandiri</h1>
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl leading-relaxed">
                  Pilih jenis surat di menu samping, isi data Anda, dan sistem akan membuatkan dokumen Google Docs secara otomatis dalam hitungan detik.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: <Edit3 size={24} />, color: "text-amber-600 bg-amber-100", title: "1. Isi Formulir", desc: "Lengkapi data diri sesuai dengan kebutuhan surat Anda." },
                  { icon: <Eye size={24} />, color: "text-purple-600 bg-purple-100", title: "2. Cek Pratinjau", desc: "Lihat draft surat secara langsung sebelum dokumen dibuat." },
                  { icon: <CheckCircle size={24} />, color: "text-emerald-600 bg-emerald-100", title: "3. Generate Dokumen", desc: "Sistem mencetak nomor surat dan membuat file di Google Drive." }
                ].map((step, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:scale-105 transition-transform duration-300">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${step.color}`}>
                      {step.icon}
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">{step.title}</h3>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HALAMAN FORM DAN PREVIEW GAMBAR */}
          {activeTab !== 'dashboard' && currentSurat && (
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start animate-in fade-in duration-500">
              
              {/* KOLOM KIRI: FORMULIR */}
              <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
                <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center gap-3">
                  <Edit3 className="text-blue-900" />
                  <h2 className="text-lg font-bold text-slate-800">Formulir Data</h2>
                </div>
              
                <div className="p-6 md:p-8">
                  {/* render sesuai surat yang dipilih */}
                  {activeTab === 'surat-lulus' && <FormSKLMunaqosah onSubmit={(data) => handleSubmitKeBackend('surat-lulus', data)} isProcessing={isProcessing} />}
                  {activeTab === 'surat-aktif' && <FormSuratAktif onSubmit={(data) => handleSubmitKeBackend('surat-aktif', data)} isProcessing={isProcessing} />}
                  {activeTab === 'surat-izin'  && <FormSuratIzin onSubmit={(data) => handleSubmitKeBackend('surat-izin', data)} isProcessing={isProcessing} />}

                  {docUrl && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                      <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-emerald-800 font-bold text-sm">Dokumen Siap!</p>
                        <a 
                          href={docUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-emerald-600 underline text-xs mt-1 block hover:text-emerald-800"
                        >
                          Buka Google Docs →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* KOLOM KANAN: PREVIEW SCREENSHOT */}
              <div className="lg:col-span-7 flex flex-col items-center">
                
                <div className="w-full flex items-center justify-between mb-4 px-2">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <ImageIcon size={18} className="text-slate-400" />
                    Contoh Format Dokumen
                  </h3>
                  <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium">
                    Hanya Ilustrasi
                  </span>
                </div>

                {/* Container Gambar */}
                <div className="w-full bg-white p-4 rounded-3xl shadow-md border border-slate-200 overflow-hidden group">
                  <div className="relative w-full aspect-[1/1.414] bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                    
                    <img 
                      src={currentSurat.previewUrl} 
                      alt={`Preview ${currentSurat.label}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    
                    {/* Efek gradien di atas gambar agar lebih estetik */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/10 to-transparent pointer-events-none"></div>
                  </div>
                </div>

                <p className="text-center text-slate-400 text-sm mt-6 max-w-md">
                  Dokumen asli akan disesuaikan dengan data yang Anda masukkan pada formulir di samping.
                </p>

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-KOMPONEN FORM (Dapat dibuat sekompleks apapun tanpa merusak yang lain)
// =========================================================================

function FormSKLMunaqosah({ onSubmit, isProcessing }) {
  const [form, setForm] = useState({ nama: '', nim: '', tgl_munaqosah: '', nilai_ujian: '', judul_skripsi: '' });
  
  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
  const submitData = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={submitData} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Nama</label>
          <input required name="nama" value={form.nama} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">NIM</label>
          <input required name="nim" value={form.nim} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Judul Skripsi</label>
        <textarea required name="judul_skripsi" value={form.judul_skripsi} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500"></textarea>
      </div>
      <button type="submit" disabled={isProcessing} className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
        {isProcessing ? 'Memproses...' : 'Buat SKL Munaqosah'}
      </button>
    </form>
  );
}

function FormSuratAktif({ onSubmit, isProcessing }) {
  const [form, setForm] = useState({ nama: '', nim: '', semester: '', keperluan: '' });
  
  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
  const submitData = (e) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={submitData} className="space-y-4">
      {/* Form ini berbeda bentuknya dengan form SKL */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Nama Lengkap</label>
          <input required name="nama" value={form.nama} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">NIM</label>
          <input required name="nim" value={form.nim} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Semester Aktif</label>
          <select name="semester" value={form.semester} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border rounded-xl">
             <option value="">Pilih Semester...</option>
             <option value="Ganjil">Ganjil</option>
             <option value="Genap">Genap</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Tujuan/Keperluan Pembuatan Surat</label>
        <textarea required name="keperluan" value={form.keperluan} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500"></textarea>
      </div>
      <button type="submit" disabled={isProcessing} className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all">
        {isProcessing ? 'Memproses...' : 'Buat Surat Keterangan Aktif'}
      </button>
    </form>
  );
}

function FormSuratIzin({ onSubmit, isProcessing }) {
  // Logic form ketiga...
  return <div className="text-center p-10 font-bold text-slate-400">Desain form surat Izin di sini...</div>
}