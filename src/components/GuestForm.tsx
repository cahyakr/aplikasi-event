// src/components/GuestForm.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Guest } from '@/types'; // Kita akan buat tipe ini

interface GuestFormProps {
    initialData?: Guest | null;
    onSuccess?: () => void;
}

export default function GuestForm({ initialData, onSuccess }: GuestFormProps) {
    const router = useRouter();
    const [nama, setNama] = useState(initialData?.nama || '');
    const [companyName, setCompanyName] = useState(initialData?.nama_perusahaan || '');
    const [tableNumber, setTableNumber] = useState(initialData?.no_meja || '');
    const [phone, setPhone] = useState(initialData?.no_hp || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Cek apakah ini form untuk mengedit (jika ada initialData) atau menambah
    const isEditMode = Boolean(initialData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (!nama || !companyName || !tableNumber) {
            setError('Semua field wajib diisi.');
            setLoading(false);
            return;
        }

        if (isEditMode) {
            // Logic untuk UPDATE (Edit)
            const { error } = await supabase
                .from('tamu')
                .update({
                    nama,
                    nama_perusahaan: companyName,
                    no_meja: tableNumber,
                    no_hp: phone,
                })
                .eq('id', initialData!.id);

            if (error) setError(error.message);
            else {
                setMessage('Data tamu berhasil diperbarui!');
                if (onSuccess) {
                    setTimeout(() => onSuccess(), 1500);
                }
            }
        } else {
            // Logic untuk INSERT (Tambah Baru)
            const slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            const { error } = await supabase
                .from('tamu')
                .insert([{
                    nama,
                    nama_perusahaan: companyName,
                    no_meja: tableNumber,
                    no_hp: phone,
                    slug: `${slug}-${Date.now().toString().slice(-5)}`, // Tambah angka acak agar unik
                }]);

            if (error) setError(error.message);
            else {
                setMessage('Tamu baru berhasil ditambahkan!');
                // Kosongkan form setelah berhasil
                setNama('');
                setCompanyName('');
                setTableNumber('');
            }
        }

        setLoading(false);
        // Refresh halaman admin list untuk melihat perubahan
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{isEditMode ? 'Edit Data Tamu' : 'Tambah Tamu Baru'}</h1>

            {message && <p className="text-green-600 bg-green-100 p-3 rounded-lg">{message}</p>}
            {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}

            <div>
                <label htmlFor="nama" className="block font-bold text-gray-700 mb-2">Nama Lengkap</label>
                <input id="nama" type="text" value={nama} onChange={e => setNama(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
                <label htmlFor="companyName" className="block font-bold text-gray-700 mb-2">Nama Perusahaan</label>
                <input id="companyName" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
                <label htmlFor="tableNumber" className="block font-bold text-gray-700 mb-2">Nomor Meja</label>
                <input id="tableNumber" type="text" value={tableNumber} onChange={e => setTableNumber(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
                <label htmlFor="phone" className="block font-bold text-gray-700 mb-2">Nomor Handphone (WhatsApp)</label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold p-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambah Tamu')}
            </button>
        </form>
    );
}