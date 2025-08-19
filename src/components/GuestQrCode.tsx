// src/components/GuestQrCode.tsx

'use client';

import QRCode from "react-qr-code"; // <-- Import dari library baru

export default function GuestQrCode({ scanUrl }: { scanUrl: string }) {
  return (
    // Library ini butuh pembungkus dengan background putih agar terlihat bagus
    <div style={{ background: 'white', padding: '16px', display: 'inline-block', borderRadius: '8px' }}>
      <QRCode
        value={scanUrl}
        size={256}
        bgColor="#FFFFFF" // Warna background
        fgColor="#000000" // Warna QR Code
      />
    </div>
  );
}