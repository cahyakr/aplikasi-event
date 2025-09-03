'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect } from 'react';

type QrScannerProps = {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure: (error: string) => void;
};

const QrScanner = ({ onScanSuccess, onScanFailure }: QrScannerProps) => {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" }, // langsung kamera belakang
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            onScanFailure(errorMessage);
          }
        );
      } catch (err) {
        console.error("Gagal memulai scanner", err);
      }
    };

    startScanner();

    return () => {
      html5QrCode.stop().catch((err) => {
        console.error("Gagal menghentikan scanner", err);
      });
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div id="reader" style={{ width: '100%', maxWidth: '500px' }}></div>
  );
};

export default QrScanner;
