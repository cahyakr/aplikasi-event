// src/components/InvitationCover.tsx

'use client';

import { useState } from 'react';
import Image from "next/image";
import { Mail } from 'lucide-react';

type Props = {
  guestName: string;
  noMeja: string;
  children: React.ReactNode;
};

export default function InvitationCover({ guestName, noMeja, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen text-gray-700 font-sans flex flex-col items-center justify-center text-center p-4"
      style={{
        backgroundImage: `
          url('/batik1.png'),    
          url('/batik2.png'), 
          linear-gradient(to bottom left, #FFFFFF 0%, #28ABF9 40%) 
        `,
        backgroundPosition: `
          top right,    
          bottom left  
        `,
        backgroundRepeat: `
          no-repeat,    
          no-repeat     
        `,
        backgroundSize: `
          300px auto,   
          300px auto,   
          cover         
        `,
      }}
    >
      <div className=" w-32 h-32 mx-auto mb-6 flex items-center justify-center p-4">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
      <p className="text-lg text-gray mb-4">Tanpa mengurangi rasa hormat, Kami Mengundang dalam acara</p>
      <h1 className="text-4xl font-serif text-brand-primary font-bold mb-8">Forum Komunikasi Anak Perusahaan YKKBI</h1>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-xl text-gray mb-2">Kepada Yth.</p>
        <p className="text-3xl font-bold text-brand-primary mb-2">{guestName}</p>
        <p className="text-2xl font-bold text-grey mb-2">Nomor Meja : {noMeja}</p>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="mt-12 flex items-center gap-3 bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
      >
        <Mail size={20} />
        Buka Undangan
      </button>
    </div>
  );
}