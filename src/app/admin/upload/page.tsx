// src/app/admin/upload/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { UploadCloud, File, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Definisikan tipe data untuk materi dari database
interface Materi {
  id: number;
  judul: string;
  deskripsi: string | null;
  file_url: string;
  urutan: number | null;
}

// Tipe data untuk file tunggal
type FileType = 'buku_saku' | 'agenda';
type FileState = { [key in FileType]?: File };
type LoadingState = { [key in FileType]?: boolean };
type MessageState = { type: 'success' | 'error'; text: string } | null;

export default function UploadPage() {
  // State untuk file tunggal (Buku Saku & Agenda)
  const [files, setFiles] = useState<FileState>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [message, setMessage] = useState<MessageState>(null);

  // State baru untuk manajemen materi
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [newMateri, setNewMateri] = useState({
    judul: '',
    deskripsi: '',
    urutan: 1,
    file: null as File | null,
  });
  const [materiLoading, setMateriLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mengambil daftar materi yang sudah ada saat halaman dimuat
  useEffect(() => {
    fetchMateriList();
  }, []);

  const fetchMateriList = async () => {
    const { data, error } = await supabase.from('materi').select('*').order('urutan');
    if (data) {
        setMateriList(data);
        // Set urutan default untuk materi baru
        setNewMateri(prev => ({ ...prev, urutan: data.length + 1 }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  // Handler untuk upload file tunggal (Buku Saku & Agenda)
  const handleSingleFileUpload = async (type: FileType) => {
    const file = files[type];
    if (!file) {
      setMessage({ type: 'error', text: 'Silakan pilih file terlebih dahulu.' });
      return;
    }

    setLoading(prev => ({ ...prev, [type]: true }));
    setMessage(null);

    try {
      const filePath = `${type}/${file.name}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('dokumen-acara')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dokumen-acara')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('acara_settings')
        .update({ [`${type}_url`]: publicUrl })
        .eq('id', 1);

      if (updateError) throw updateError;

      setMessage({ type: 'success', text: `File ${type.replace('_', ' ')} berhasil diunggah!` });
    } catch (error: any) {
      setMessage({ type: 'error', text: `Gagal mengunggah: ${error.message}` });
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Handler untuk form TAMBAH materi baru
  const handleAddMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMateri.judul || !newMateri.file) {
      setMessage({ type: 'error', text: 'Judul materi dan file wajib diisi.' });
      return;
    }
    setMateriLoading(true);
    setMessage(null);

    try {
      const file = newMateri.file;
      const filePath = `materi/${file.name}-${Date.now()}`;
      
      const { error: uploadError } = await supabase.storage.from('dokumen-acara').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('dokumen-acara').getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('materi').insert({
        judul: newMateri.judul,
        deskripsi: newMateri.deskripsi || null,
        urutan: newMateri.urutan,
        file_url: publicUrl,
      });
      if (insertError) throw insertError;

      setMessage({ type: 'success', text: 'Materi baru berhasil ditambahkan!' });
      fetchMateriList();
      setNewMateri({ judul: '', deskripsi: '', urutan: materiList.length + 2, file: null });
      if (fileInputRef.current) fileInputRef.current.value = '';


    } catch (error: any) {
      setMessage({ type: 'error', text: `Gagal menambah materi: ${error.message}` });
    } finally {
      setMateriLoading(false);
    }
  };

  // Handler untuk HAPUS materi
  const handleDeleteMateri = async (materi: Materi) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus materi "${materi.judul}"?`)) return;
    
    try {
      const { error: deleteError } = await supabase.from('materi').delete().eq('id', materi.id);
      if (deleteError) throw deleteError;

      const filePath = materi.file_url.split('/dokumen-acara/')[1];
      if(filePath) {
        await supabase.storage.from('dokumen-acara').remove([filePath]);
      }

      setMessage({ type: 'success', text: 'Materi berhasil dihapus.' });
      fetchMateriList();
    } catch (error: any) {
      setMessage({ type: 'error', text: `Gagal menghapus: ${error.message}` });
    }
  };

  // Komponen input untuk file tunggal
  const UploadInput = ({ type, label }: { type: FileType, label: string }) => (
    <div className="border border-gray-300 rounded-lg p-4">
      <label className="font-bold text-gray-700 block mb-2">{label}</label>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e, type)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={() => handleSingleFileUpload(type)}
          disabled={!files[type] || loading[type]}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading[type] ? 'Mengunggah...' : <><UploadCloud size={18} /> Unggah</>}
        </button>
      </div>
      {files[type] && <p className="text-sm text-gray-500 mt-2 flex items-center gap-2"><File size={14} /> {files[type]?.name}</p>}
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg my-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Upload Dokumen Acara</h1>
        
        {message && (
          <div className={`flex items-center gap-3 p-4 mb-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <UploadInput type="buku_saku" label="Buku Saku" />
          <UploadInput type="agenda" label="Agenda Acara" />
        </div>

        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Kelola Materi Acara</h2>
          
          <form onSubmit={handleAddMateri} className="space-y-4 border border-gray-200 p-4 rounded-lg mb-8">
            <h3 className="font-bold text-lg">Tambah Materi Baru</h3>
            <input type="text" placeholder="Judul Materi" value={newMateri.judul} onChange={e => setNewMateri(p => ({...p, judul: e.target.value}))} className="w-full p-2 border rounded" required />
            <input type="text" placeholder="Deskripsi Singkat (Opsional)" value={newMateri.deskripsi} onChange={e => setNewMateri(p => ({...p, deskripsi: e.target.value}))} className="w-full p-2 border rounded" />
            <input type="number" placeholder="Nomor Urut" value={newMateri.urutan} onChange={e => setNewMateri(p => ({...p, urutan: parseInt(e.target.value)}))} className="w-full p-2 border rounded" required />
            <input type="file" ref={fileInputRef} accept=".pdf" onChange={e => setNewMateri(p => ({...p, file: e.target.files ? e.target.files[0] : null}))} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
            <button type="submit" disabled={materiLoading} className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
              {materiLoading ? 'Menambahkan...' : <><UploadCloud size={18} /> Tambah Materi</>}
            </button>
          </form>

          <div>
            <h3 className="font-bold text-lg mb-4">Daftar Materi Terunggah</h3>
            <div className="space-y-3">
              {materiList.map(materi => (
                <div key={materi.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <span className="font-semibold text-gray-700">{materi.urutan}. {materi.judul}</span>
                  <button onClick={() => handleDeleteMateri(materi)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {materiList.length === 0 && <p className="text-gray-500 text-center">Belum ada materi yang diunggah.</p>}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/admin" className="text-blue-600 hover:underline">&larr; Kembali ke Dashboard Admin</Link>
        </div>
      </div>
    </main>
  );
}