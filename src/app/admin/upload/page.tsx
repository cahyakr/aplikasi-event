// src/app/admin/upload/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { UploadCloud, File, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

type FileType = 'buku_saku' | 'agenda' | 'materi';
type FileState = {
  [key in FileType]?: File;
};
type LoadingState = {
  [key in FileType]?: boolean;
};
type MessageState = {
  type: 'success' | 'error';
  text: string;
} | null;

export default function UploadPage() {
  const [files, setFiles] = useState<FileState>({});
  const [loading, setLoading] = useState<LoadingState>({});
  const [message, setMessage] = useState<MessageState>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const handleUpload = async (type: FileType) => {
    const file = files[type];
    if (!file) {
      setMessage({ type: 'error', text: 'Silakan pilih file terlebih dahulu.' });
      return;
    }

    setLoading(prev => ({ ...prev, [type]: true }));
    setMessage(null);

    try {
      // 1. Upload file ke Supabase Storage
      const filePath = `${type}/${file.name}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('dokumen-acara') // Pastikan nama bucket sudah benar
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Dapatkan URL publik dari file yang di-upload
      const { data: { publicUrl } } = supabase.storage
        .from('dokumen-acara')
        .getPublicUrl(filePath);

      // 3. Update URL di tabel 'acara_settings'
      // Asumsi hanya ada 1 baris di tabel settings dengan id = 1
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
          onClick={() => handleUpload(type)}
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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
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
          <UploadInput type="materi" label="Materi" />
        </div>
        <div className="mt-8 text-center">
            <Link href="/admin" className="text-blue-600 hover:underline">
                &larr; Kembali ke Dashboard Admin
            </Link>
        </div>
      </div>
    </main>
  );
}