// src/components/RsvpForm.tsx

'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; // <-- 1. IMPORT useRouter
import { submitRsvp } from '../app/invitation/[slug]/actions';

type Props = {
  guestId: string;
  guestSlug: string;
  initialRsvp: string | null;
  initialComment: string | null;
};

export default function RsvpForm({ guestId, guestSlug, initialRsvp, initialComment }: Props) {

  console.log("--- DATA DITERIMA OLEH RSVP FORM ---");
  console.log("initialRsvp (prop):", initialRsvp);
  console.log("Tipe data:", typeof initialRsvp);
  console.log("Isi string mentah:", `"${initialRsvp}"`); // Tanda kutip bantu melihat spasi
  console.log("Panjang string (sebelum trim):", initialRsvp?.length);
  console.log("Panjang string (sesudah trim):", initialRsvp?.trim().length);
  console.log("--- Perbandingan ---");
  console.log("String pembanding:", "Belum konfirmasi");
  console.log("Panjang string pembanding:", "Belum konfirmasi".length);
  console.log("Hasil perbandingan (setelah trim):", initialRsvp?.trim() !== 'Belum konfirmasi');
  console.log("------------------------------------");
  // ---------------------
  
  const router = useRouter(); // <-- 2. PANGGIL useRouter
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // LOGIKA YANG BENAR: Tampilkan "Terima Kasih" jika status BUKAN 'Belum konfirmasi'
  if (initialRsvp?.trim() && initialRsvp?.trim() !== 'Belum konfirmasi') {
    return (
      <div className="text-center p-8 bg-green-900/50 rounded-lg">
        <h3 className="text-2xl font-bold text-green-400">Terima Kasih!</h3>
        <p className="text-gray-300 mt-2">Konfirmasi Anda telah kami terima.</p>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('Mengirim...');
    
    const formData = new FormData(event.currentTarget);
    const response = await submitRsvp(formData);
    
    if (response.success) {
      setMessage(response.message);
      formRef.current?.reset();
      
      // 3. PERINTAHKAN REFRESH SETELAH SUKSES
      // Ini akan mengambil ulang data dari server dan me-render ulang halaman
      // sehingga form akan hilang dan pesan "Terima Kasih" akan muncul.
      router.refresh();

    } else {
      setMessage(response.message || "Gagal mengirim konfirmasi.");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Tambahkan Komentar</h3>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* ... Sisa dari JSX form Anda tetap sama persis ... */}
        <input type="hidden" name="guestId" value={guestId} />
        <input type="hidden" name="guestSlug" value={guestSlug} />
        <div className="flex gap-4">
          <label className="flex-grow">
            <input type="radio" name="rsvp" value="Hadir" className="sr-only peer" required />
            <span className="cursor-pointer block w-full text-center p-3 rounded-md bg-gray-700 text-white peer-checked:bg-green-500 peer-checked:ring-2 peer-checked:ring-green-300 transition-all">
              Hadir
            </span>
          </label>
          <label className="flex-grow">
            <input type="radio" name="rsvp" value="Tidak Hadir" className="sr-only peer" />
            <span className="cursor-pointer block w-full text-center p-3 rounded-md bg-gray-700 text-white peer-checked:bg-red-500 peer-checked:ring-2 peer-checked:ring-red-300 transition-all">
              Tidak Hadir
            </span>
          </label>
        </div>
        <div>
          <textarea
            id="komentar"
            name="komentar"
            rows={4}
            placeholder="Tulis ucapan dan doa Anda di sini..."
            className="w-full bg-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim'}
        </button>
        {message && <p className="text-center text-sm mt-4">{message}</p>}
      </form>
    </div>
  );
}