// src/components/GuestQrCode.tsx

'use client';

import QRCode from "react-qr-code"; 

interface GuestQrCodeProps {
  scanUrl: string;
  size?: number; // optional
}

export default function GuestQrCode({ scanUrl, size = 256 }: GuestQrCodeProps) {
  return (
    <div
      style={{
        background: 'white',
        padding: '16px',
        display: 'inline-block',
        borderRadius: '8px',
      }}
    >
      <QRCode
        value={scanUrl}
        style={{ width: `${size}px`, height: `${size}px` }} 
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
    </div>
  );
}
