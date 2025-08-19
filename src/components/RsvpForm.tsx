// src/components/RsvpForm.tsx

'use client';

import { useState } from 'react';
import { submitRsvp } from '../app/invitation/[id]/actions'; // Import Server Action

type Props = {
  guestId: string;
  initialRsvp: string | null;
  initialComment: string | null;
};

// Pastikan ada "export default" di sini
export default function RsvpForm({ guestId, initialRsvp, initialComment }: Props) {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(initialRsvp !== 'Belum konfirmasi');

  if (submitted) {
    return (
      <div className="text-center p-8 bg-green-900/50 rounded-lg">
        <h3 className="text-2xl font-bold text-green-400">Terima Kasih!</h3>
        <p className="text-gray-300 mt-2">Konfirmasi Anda telah kami terima.</p>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setMessage('Mengirim...'); // Feedback saat loading
    const response = await submitRsvp(formData);
    
    if (response.success) {
      setSubmitted(true);
    }
    setMessage(response.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="guestId" value={guestId} />
      
      <div>
        <label className="block text-lg font-semibold text-yellow-400 mb-2">Konfirmasi Kehadiran</label>
        <div className="flex gap-4 p-2 bg-gray-800 rounded-lg">
          <label className="flex-1 text-center cursor-pointer">
            <input type="radio" name="rsvp" value="Hadir" className="sr-only peer" required />
            <span className="block p-3 rounded-md peer-checked:bg-green-500 peer-checked:text-white transition-colors">Hadir</span>
          </label>
          <label className="flex-1 text-center cursor-pointer">
            <input type="radio" name="rsvp" value="Tidak Hadir" className="sr-only peer" />
            <span className="block p-3 rounded-md peer-checked:bg-red-500 peer-checked:text-white transition-colors">Tidak Hadir</span>
          </label>
        </div>
      </div>
      
      <div>
        <label htmlFor="komentar" className="block text-lg font-semibold text-yellow-400 mb-2">Ucapan & Doa</label>
        <textarea
          id="komentar"
          name="komentar"
          rows={4}
          defaultValue={initialComment || ''}
          placeholder="Tulis ucapan Anda di sini..."
          className="w-full bg-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        ></textarea>
      </div>

      <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-colors">
        Kirim Konfirmasi
      </button>

      {message && <p className="text-center mt-4">{message}</p>}
    </form>
  );
}