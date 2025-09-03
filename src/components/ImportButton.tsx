// src/components/ImportButton.tsx
'use client';

import { supabase } from '@/app/lib/supabaseClient';
// 'useRouter' tidak lagi diperlukan
import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { FileUp } from 'lucide-react';

// 1. Definisikan tipe untuk baris Excel
type ExcelRow = {
  'Nama Lengkap': string;
  'Nama Perusahaan'?: string;
  'Nomor Meja'?: string | number;
  'Nomor HP'?: string | number;
};

// 2. Tambahkan prop baru: onImportSuccess
interface ImportButtonProps {
  onImportSuccess: () => void;
}

export default function ImportButton({ onImportSuccess }: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) throw new Error("File Excel kosong atau format tidak sesuai.");

        const newGuests = json.map(row => {
          const nama = row['Nama Lengkap'];
          if (!nama) return null;
          
          const slug = slugify(nama);
          return {
            nama: nama,
            nama_perusahaan: row['Nama Perusahaan'] || null,
            no_meja: String(row['Nomor Meja'] || ''),
            no_hp: row['Nomor HP'] ? String(row['Nomor HP']) : null,
            slug: `${slug}-${Date.now().toString().slice(-5)}`,
          };
        }).filter(Boolean);

        if (newGuests.length > 0) {
          if (!window.confirm(`Anda akan menambahkan ${newGuests.length} tamu baru. Lanjutkan?`)) return;

          const { error } = await supabase.from('tamu').insert(newGuests as any);
          if (error) throw error;
          
          alert(`${newGuests.length} tamu berhasil diimpor!`);
          // 3. Panggil fungsi callback setelah berhasil, bukan router.refresh()
          onImportSuccess();
        } else {
          alert('Tidak ada data tamu yang valid untuk diimpor.');
        }
      } catch (error: any) {
        alert(`Gagal mengimpor: ${error.message}\n\nPastikan nama kolom di Excel Anda sudah benar.`);
      }
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xlsx, .xls, .csv"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700"
      >
        <FileUp size={18} />
        Impor dari Excel
      </button>
    </>
  );
}