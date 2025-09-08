// src/app/admin/page.tsx
'use client'; 

import { useState, useEffect } from 'react'; 
import { supabase } from "@/app/lib/supabaseClient";
import { Guest } from "@/types";
import Link from "next/link";
import ExportButton from "@/components/ExportButton";
import ImportButton from "@/components/ImportButton";
import DeleteButton from "@/components/DeleteButton";
import ShareWhatsAppButton from "@/components/ShareWhatsAppButton";
import Modal from '@/components/Modal'; 
import GuestForm from '@/components/GuestForm'; 
import { PlusCircle, Edit, Users, UserCheck, RotateCcw } from "lucide-react";

export default function AdminPage() {
    
    const [tamu, setTamu] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [origin, setOrigin] = useState('');

    
    const fetchGuests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tamu')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Gagal mengambil data tamu:", error);
        } else {
            setTamu(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        
        setOrigin(window.location.origin);
        fetchGuests();
    }, []);

    const handleEditClick = (guest: Guest) => {
        setSelectedGuest(guest);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedGuest(null); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedGuest(null);
        fetchGuests(); 
    };

    const handleResetKehadiran = async () => {
        const isConfirmed = window.confirm(
            'Anda yakin ingin mereset status kehadiran SEMUA tamu menjadi "Belum Hadir"? Aksi ini tidak dapat dibatalkan.'
        );

        if (isConfirmed) {
            setLoading(true);
            try {
                // Update semua baris di tabel 'tamu' yang status hadirnya true
                const { error } = await supabase
                    .from('tamu')
                    .update({ hadir: false })
                    .eq('hadir', true);

                if (error) {
                    throw error;
                }

                alert('Status kehadiran semua tamu berhasil direset.');
                fetchGuests(); 
            } catch (error: any) {
                console.error("Gagal mereset kehadiran:", error);
                alert(`Terjadi kesalahan: ${error.message}`);
                setLoading(false);
            }
        }
    };

    const totalTamu = tamu.length;
    const jumlahHadir = tamu.filter(t => t.hadir).length;

    if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat data...</div>;

    return (
        <>
            <main className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header dan Statistik */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h1 className="text-4xl font-bold text-gray-800">Dashboard Admin</h1>
                        <div className="flex flex-wrap gap-4">

                            <ImportButton onImportSuccess={fetchGuests} />
                            <ExportButton data={tamu} />
                            <button
                                onClick={handleResetKehadiran}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
                            >
                                <RotateCcw size={18} /> Reset Kehadiran
                            </button>
                            <button 
                                onClick={handleAddClick} 
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                            >
                               <PlusCircle size={18} /> Tambah Tamu
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                            <Users className="w-10 h-10 text-blue-500" />
                            <div>
                                <p className="text-gray-500">Jumlah Tamu</p>
                                <p className="text-3xl font-bold">{totalTamu}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                            <UserCheck className="w-10 h-10 text-green-500" />
                            <div>
                                <p className="text-gray-500">Jumlah Hadir (Aktual)</p>
                                <p className="text-3xl font-bold">{jumlahHadir}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-700">
                                <thead className="text-xs text-gray-800 uppercase bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">No.</th>
                                        <th scope="col" className="px-6 py-3">Nama</th>
                                        <th scope="col" className="px-6 py-3">Perusahaan</th>
                                        <th scope="col" className="px-6 py-3">No. Meja</th>
                                        <th scope="col" className="px-6 py-3">Status Hadir</th>
                                        <th scope="col" className="px-6 py-3">Link Undangan</th>
                                        <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tamu.map((guest, index) => (
                                        <tr key={guest.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{index + 1}</td>
                                            <td className="px-6 py-4 font-medium">{guest.nama}</td>
                                            <td className="px-6 py-4">{guest.nama_perusahaan}</td>
                                            <td className="px-6 py-4">{guest.no_meja}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${guest.hadir ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {guest.hadir ? 'Hadir' : 'Belum Hadir'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 min-w-[300px]">
                                                <ShareWhatsAppButton
                                                    guestName={guest.nama}
                                                    url={`${origin}/invitation/${guest.slug}`}
                                                    phoneNumber={guest.no_hp}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center items-center gap-4">
                                                    <button onClick={() => handleEditClick(guest)} className="text-blue-600 hover:text-blue-800" title="Edit Tamu">
                                                        <Edit size={16} />
                                                    </button>
                                                    <DeleteButton guestId={guest.id} onDeleteSuccess={fetchGuests} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <GuestForm initialData={selectedGuest} onSuccess={handleCloseModal} />
            </Modal>
        </>
    );
}