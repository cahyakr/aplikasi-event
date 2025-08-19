// src/components/QrScanner.tsx

'use client';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

// Tentukan tipe untuk props, agar komponen lain bisa mengirim fungsi callback
type QrScannerProps = {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure: (error: string) => void;
};

const QrScanner = ({ onScanSuccess, onScanFailure }: QrScannerProps) => {

  useEffect(() => {
    // Fungsi callback yang akan dipanggil oleh library saat scan berhasil
    const successCallback = (decodedText: string, decodedResult: any) => {
      // Kita panggil fungsi onScanSuccess dari parent dan hentikan scanner
      onScanSuccess(decodedText);
      // Tidak perlu clear manual di sini, karena komponen akan di-unmount
    };
    
    // Fungsi callback untuk error (bisa diabaikan)
    const errorCallback = (errorMessage: string) => {
      onScanFailure(errorMessage);
    };

    // Inisialisasi scanner
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader", // ID dari div tempat scanner akan muncul
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    html5QrcodeScanner.render(successCallback, errorCallback);

    // Cleanup function untuk mematikan kamera saat komponen ditutup/pindah halaman
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Gagal membersihkan Html5QrcodeScanner.", error);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Jalankan useEffect hanya sekali saat komponen pertama kali dimuat

  return (
    <div id="reader" style={{ width: '100%', maxWidth: '500px' }}></div>
  );
};

// Pastikan ada "export default" di sini
export default QrScanner;