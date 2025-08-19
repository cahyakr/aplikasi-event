// src/components/InvitationCover.tsx

'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

type Props = {
  guestName: string;
  children: React.ReactNode;
};

// Pastikan ada "export default" di sini
export default function InvitationCover({ guestName, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
      <p className="text-lg text-gray-400 mb-4">You are cordially invited</p>
      <h1 className="text-4xl font-serif text-yellow-400 font-bold mb-8">Annual Gala Dinner 2025</h1>
      
      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-xl text-gray-300 mb-2">Kepada Yth.</p>
        <p className="text-3xl font-bold text-yellow-400">{guestName}</p>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="mt-12 flex items-center gap-3 bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
      >
        <Mail size={20} />
        Buka Undangan
      </button>
    </div>
  );
}