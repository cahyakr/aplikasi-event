// src/app/scan/page.tsx

'use client';

import { useState } from 'react';
import QrScanner from '@/components/QrScanner';
import { CheckCircle, XCircle, Loader, ScanLine } from 'lucide-react';
import Link from 'next/link';

type ScanResult = {
  status: 'success' | 'error';
  message: string;
  name?: string;
  tableNumber?: string | number;
};

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScanSuccess = async (decodedUrl: string) => {
    setIsLoading(true);

    try {
      // Panggil API menggunakan URL dari hasil scan
      const response = await fetch(decodedUrl);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Respon API tidak valid.');
      }

      // Tampilkan hasil sukses
      setScanResult({ status: 'success', message: 'Kehadiran Berhasil!', name: result.guestName, tableNumber: result.no_meja });

    } catch (err: any) {
      // Tampilkan hasil error
      setScanResult({ status: 'error', message: err.message || 'Gagal memproses QR Code.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanFailure = (error: string) => {
    // Bisa digunakan untuk menampilkan error minor, misal QR tidak terbaca
    console.error(error);
  };

  const resetScanner = () => {
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center p-4 text-white">
      <Link href="/" className="absolute top-4 left-4 text-gray-400 hover:text-white">
        &larr; Kembali ke Home
      </Link>

      <div className="bg-brand-black p-8 sm:p-12 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col items-center">
        {!scanResult && !isLoading && (
          <>
            <ScanLine size={64} className="text-brand-yellow mb-4" />
            <h1 className="text-3xl font-bold mb-2">Scan QR Code Tamu</h1>
            <p className="text-gray-400 mb-6">Arahkan kamera ke QR Code pada undangan tamu.</p>
            <div className="w-full border border-gray-700 rounded-lg overflow-hidden">
              <QrScanner
                onScanSuccess={handleScanSuccess}
                onScanFailure={handleScanFailure}
              />
            </div>
          </>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader className="animate-spin text-white" size={64} />
            <p className="text-xl mt-4">Memproses...</p>
          </div>
        )}

        {scanResult && !isLoading && (
          <div className="flex flex-col items-center justify-center h-64">
            {scanResult.status === 'success' ? (
              <CheckCircle className="text-green-400" size={100} />
            ) : (
              <XCircle className="text-red-500" size={100} />
            )}
            <h1 className="text-2xl font-bold mt-6">{scanResult.message}</h1>
            {scanResult.name && (
              <p className="text-3xl text-white font-semibold mt-1">{scanResult.name}</p>
            )}
            {scanResult.tableNumber && (
              <p className="text-xl text-gray-300 mt-2">
                No. Meja: {scanResult.tableNumber}
                                                
              </p>
            )}
            <button
              onClick={resetScanner}
              className="mt-8 bg-brand-yellow text-brand-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Scan Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}