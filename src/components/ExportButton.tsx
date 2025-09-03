// src/components/ExportButton.tsx
'use client';

import { Guest } from '@/types';
import * as XLSX from 'xlsx';
import { FileDown } from 'lucide-react';

interface ExportButtonProps {
  data: Guest[];
  fileName?: string;
}

export default function ExportButton({ data, fileName = 'daftar_tamu' }: ExportButtonProps) {

  const handleExport = () => {
    // --- PERUBAHAN DIMULAI DI SINI ---
    const formattedData = data.map((guest, index) => ({
      'No.': index + 1,
      'Nama Lengkap': guest.nama,
      'Nama Perusahaan': guest.nama_perusahaan,
      'Nomor Meja': guest.no_meja,
      'Status Kehadiran': guest.hadir ? 'Hadir' : 'Belum Hadir',
      'Waktu Hadir': guest.waktu_hadir 
        ? new Date(guest.waktu_hadir).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) 
        : '-',
      'Link Undangan': `${window.location.origin}/invitation/${guest.slug}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Tamu');

    // Sesuaikan lebar kolom dengan struktur data yang baru
    worksheet['!cols'] = [
        { wch: 5 },  // No.
        { wch: 30 }, // Nama Lengkap
        { wch: 30 }, // Nama Perusahaan
        { wch: 15 }, // Nomor Meja
        { wch: 20 }, // Status Kehadiran
        { wch: 20 }, // Waktu Hadir (BARU)
        { wch: 50 }, // Link Undangan
        // Kolom Komentar dihapus
    ];

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
    >
      <FileDown size={18} />
      Ekspor ke Excel
    </button>
  );
}