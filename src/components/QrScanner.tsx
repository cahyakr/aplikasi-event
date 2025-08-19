// src/components/QrScanner.tsx

'use client';

import { Html5QrcodeScanner, Html5QrcodeResult } from 'html5-qrcode';
import { useEffect } from 'react';

type QrScannerProps = {
  onScanSuccess: (decodedText: string) => void; // Hapus parameter kedua
  onScanFailure: (error: string) => void;
};

const QrScanner = ({ onScanSuccess, onScanFailure }: QrScannerProps) => {

  useEffect(() => {
    const successCallback = (decodedText: string, decodedResult: Html5QrcodeResult) => {
      onScanSuccess(decodedText);
    };
    
    const errorCallback = (errorMessage: string) => {
      onScanFailure(errorMessage);
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    html5QrcodeScanner.render(successCallback, errorCallback);

    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Gagal membersihkan Html5QrcodeScanner.", error);
      });
    };
  }, [onScanSuccess, onScanFailure]); 

  return (
    <div id="reader" style={{ width: '100%', maxWidth: '500px' }}></div>
  );
};

export default QrScanner;