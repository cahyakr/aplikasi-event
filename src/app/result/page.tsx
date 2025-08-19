// src/app/result/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const guestName = searchParams.get('nama');
  const message = searchParams.get('message');
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Memberi sedikit jeda animasi agar tidak terasa instan
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader className="animate-spin text-white" size={64} />
          <h1 className="text-3xl font-bold mt-4 text-white">Memproses...</h1>
        </>
      );
    }

    if (status === 'success') {
      return (
        <>
          <CheckCircle className="text-green-400" size={100} />
          <h1 className="text-4xl font-bold mt-6 text-white">Kehadiran Berhasil!</h1>
          <p className="text-2xl text-gray-300 mt-2">Selamat datang,</p>
          <p className="text-3xl text-yellow-400 font-semibold mt-1">{guestName || 'Tamu'}</p>
        </>
      );
    }

    if (status === 'already_scanned') {
      return (
        <>
          <AlertTriangle className="text-yellow-400" size={100} />
          <h1 className="text-4xl font-bold mt-6 text-white">Sudah Absen!</h1>
          <p className="text-2xl text-gray-300 mt-2">Kehadiran atas nama</p>
          <p className="text-3xl text-yellow-400 font-semibold mt-1">{guestName || 'Tamu'}</p>
          <p className="text-xl text-gray-300 mt-2">telah dicatat sebelumnya.</p>
        </>
      );
    }

    return (
      <>
        <XCircle className="text-red-500" size={100} />
        <h1 className="text-4xl font-bold mt-6 text-white">Gagal!</h1>
        <p className="text-xl text-gray-300 mt-2">{message || 'Silakan coba lagi atau hubungi panitia.'}</p>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center p-4">
      <div className="bg-black p-8 sm:p-12 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col items-center">
        {renderContent()}
      </div>
    </div>
  );
}