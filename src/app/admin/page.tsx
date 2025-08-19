// src/app/admin/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { UserPlus, Download, CheckCircle, XCircle, Trash2, Share2, Upload } from 'lucide-react';
import GuestQrCode from '@/components/GuestQrCode';

type Guest = {
  id: string;
  nama: string;
  email: string | null;
  no_hp: string | null;
  hadir: boolean;
  waktu_hadir: string | null;
  created_at: string;
};

export default function AdminPage() {
  // State untuk menyimpan daftar tamu
  const [guests, setGuests] = useState<Guest[]>([]);
  // State untuk form tambah tamu baru
  const [newGuest, setNewGuest] = useState({ nama: '', email: '', no_hp: '' });
  // State untuk status loading
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // useEffect untuk mengambil data awal dan setup realtime
  useEffect(() => {
    fetchGuests();

    const channel = supabase.channel('realtime-tamu');

    (channel as any).on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tamu' },
      (payload: any) => {
        console.log('Perubahan terdeteksi!', payload);
        fetchGuests(); // Ambil ulang data jika ada perubahan
      }
    ).subscribe();

    // Cleanup channel saat komponen di-unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fungsi untuk mengambil data tamu dari Supabase
  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from('tamu')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching guests:', error);
      alert('Gagal mengambil data tamu.');
    } else if (data) {
      setGuests(data);
    }
    setLoading(false);
  };

  // Fungsi untuk menangani penambahan tamu baru
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest.nama) return;

    const { data, error } = await supabase
      .from('tamu')
      .insert([{
        nama: newGuest.nama,
        email: newGuest.email || null,
        no_hp: newGuest.no_hp || null
      }])
      .select();

    if (error) {
      alert('Gagal menambahkan tamu: ' + error.message);
    } else if (data) {
      fetchGuests();
      setNewGuest({ nama: '', email: '', no_hp: '' }); // Reset form
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tamu ini?')) {
      const { error } = await supabase.from('tamu').delete().eq('id', id);

      if (error) {
        alert('Gagal menghapus tamu: ' + error.message);
      } else {
        console.log('Tamu berhasil dihapus, mengambil data baru...');
        fetchGuests();
      }
    }
  };

  const handleShareGuest = (guest: Guest) => {
    if (!guest.nama || !guest.id) return;

    const invitationUrl = `${window.location.origin}/invitation/${guest.id}`;
    const message = `Kepada Yth. ${guest.nama},\n\nAnda diundang ke acara kami. Silakan buka link berikut untuk melihat QR code undangan Anda:\n\n${invitationUrl}`;
    const encodedMessage = encodeURIComponent(message);
    let whatsappUrl = '';

    if (guest.no_hp) {
      // Jika ADA nomor HP, buat link langsung ke nomornya
      whatsappUrl = `https://wa.me/${guest.no_hp}?text=${encodedMessage}`;
    } else {
      // Jika TIDAK ADA, gunakan link share biasa
      whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    }

    window.open(whatsappUrl, '_blank');
  };

  // Fungsi untuk ekspor data ke file Excel
  const exportToExcel = () => {
    const dataToExport = guests.map(({ id, created_at, no_hp, ...rest }) => ({
      ...rest,
      waktu_hadir: rest.waktu_hadir ? new Date(rest.waktu_hadir).toLocaleString('id-ID') : 'Belum Hadir',
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Hadir");
    XLSX.writeFile(workbook, "Daftar_Hadir_Acara.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
          throw new Error("File Excel kosong atau format tidak sesuai.");
        }

        // Proses data JSON dan masukkan ke Supabase
        processExcelData(json);

      } catch (err) {
        console.error(err);
        alert("Gagal memproses file Excel. Pastikan formatnya benar.");
      }
    };

    reader.onerror = () => {
      alert("Gagal membaca file.");
    };

    reader.readAsBinaryString(file);
    
    e.target.value = '';
  };

  const processExcelData = async (data: any[]) => {
    const guestsToInsert = data.map(row => ({
      nama: row.Nama,          
      email: row.Email || null, 
      no_hp: row.NoHP || null  
    }));

    if (!confirm(`Anda akan menambahkan ${guestsToInsert.length} tamu baru. Lanjutkan?`)) {
      return;
    }

    // Kirim data ke Supabase
    const { error } = await supabase.from('tamu').insert(guestsToInsert);

    if (error) {
      alert("Gagal menyimpan data tamu: " + error.message);
    } else {
      alert(`${guestsToInsert.length} tamu berhasil ditambahkan!`);
      fetchGuests(); // Refresh daftar tamu
    }
  };

  // Kalkulasi jumlah tamu yang hadir dan total
  const hadirCount = guests.filter(g => g.hadir).length;
  const totalCount = guests.length;

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-brand-yellow">Dashboard Admin</h1>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="text-center bg-green-500/20 p-3 rounded-lg">
              <p className="text-2xl font-bold">{hadirCount}</p>
              <p className="text-sm">Hadir</p>
            </div>
            <div className="text-center bg-blue-500/20 p-3 rounded-lg">
              <p className="text-2xl font-bold">{totalCount}</p>
              <p className="text-sm">Total Tamu</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              <Upload size={18} />
              Upload Excel
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              <Download size={18} />
              Ekspor Excel
            </button>
          </div>
        </header>

        {/* Form Tambah Tamu */}
        <motion.div layout className="bg-brand-black p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-brand-yellow">Tambah Tamu Baru</h2>
          <form onSubmit={handleAddGuest} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nama Tamu"
              value={newGuest.nama}
              onChange={(e) => setNewGuest({ ...newGuest, nama: e.target.value })}
              className="md:col-span-1 bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              required
            />
            <input
              type="email"
              placeholder="Email (Opsional)"
              value={newGuest.email}
              onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              className="md:col-span-1 bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <input
              type="tel"
              placeholder="Nomor WA (contoh: 62812...)"
              value={newGuest.no_hp}
              onChange={(e) => setNewGuest({ ...newGuest, no_hp: e.target.value })}
              className="md:col-span-1 bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button
              type="submit"
              className="md:col-span-1 flex items-center justify-center gap-2 bg-brand-yellow hover:bg-yellow-500 text-brand-black font-bold py-2 px-6 rounded transition-colors"
            >
              <UserPlus size={18} />
              Tambah
            </button>
          </form>
        </motion.div>

        {/* Daftar Tamu */}
        <div className="bg-brand-black rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <p className="p-8 text-center">Memuat data tamu...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-4">Nama</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Waktu Hadir</th>
                    <th className="p-4 text-center">QR Code</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <motion.tbody layout>
                  {guests.map((guest) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={guest.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-4 font-semibold">{guest.nama}</td>
                      <td className="p-4">
                        {guest.hadir ? (
                          <span className="flex items-center gap-2 text-green-400 font-bold">
                            <CheckCircle size={18} /> Hadir
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-yellow-400">
                            <XCircle size={18} /> Belum Hadir
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {guest.waktu_hadir ? new Date(guest.waktu_hadir).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="p-4 flex justify-center">
                        <GuestQrCode scanUrl={`${window.location.origin}/api/attend/${guest.id}`} />
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-4">
                          <button
                            onClick={() => handleShareGuest(guest)}
                            className="text-blue-500 hover:text-blue-400"
                            title="Bagikan Undangan"
                          >
                            <Share2 size={20} />
                          </button>
                          <button onClick={() => handleDeleteGuest(guest.id)} className="text-red-500 hover:text-red-400" title="Hapus Tamu">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}