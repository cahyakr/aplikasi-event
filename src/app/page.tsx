// app/page.tsx
import Link from 'next/link';
import { ScanLine, UserCog } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-brand-black to-gray-900">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-brand-yellow mb-4">Absensi Acara</h1>
        <p className="text-lg text-brand-white/80 mb-12">
          Sistem absensi modern berbasis QR Code.
        </p> 
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/admin" className="group flex items-center justify-center gap-3 px-8 py-4 bg-brand-blue text-brand-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
          <UserCog className="w-6 h-6 transition-transform group-hover:rotate-12" />
          <span>Dashboard Admin</span>
        </Link>
        <Link href="/scan" className="group flex items-center justify-center gap-3 px-8 py-4 bg-brand-yellow text-brand-black font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105">
          <ScanLine className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          <span>Scan QR Tamu</span>
        </Link>
      </div>
    </main>
  );
}