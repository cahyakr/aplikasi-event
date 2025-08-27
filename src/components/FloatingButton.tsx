'use client';

import { ArrowDownCircle } from 'lucide-react';

export default function FloatingButton() {
  const handleScrollToQr = () => {
    const qrSection = document.getElementById('qr-section');
    if (qrSection) {
      qrSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={handleScrollToQr}
      className="fixed bottom-8 right-8 bg-yellow-400 text-black p-4 rounded-full shadow-lg hover:bg-yellow-300 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-300"
      title="Lihat QR Code"
    >
      <ArrowDownCircle size={32} />
    </button>
  );
}