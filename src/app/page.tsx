// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ScanLine, UserCog, UploadCloud } from 'lucide-react'; // <-- 1. Impor ikon baru

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-8 bg-brand-background text-brand-text-dark">
      
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={150}
        />
      </div>
      <div className="text-center max-w-full">

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-primary mb-4">YAYASAN KESEJAHTERAAN <br />KARYAWAN BANK INDONESIA</h1>

        <p className="text-md sm:text-lg text-gray-600 mb-10 lg:mb-12">
          Buku Tamu Forum Komunikasi Anak Perusahaan YKKBI
        </p> 
      </div>
      {/* Ganti div flex-col menjadi flex-wrap agar lebih rapi di layar kecil */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 w-full sm:w-auto">

        <Link 
          href="/admin" 
          className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-primary text-brand-text-light font-bold rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          <UserCog className="w-6 h-6 transition-transform group-hover:rotate-12" />
          <span>Dashboard Admin</span>
        </Link>
        <Link 
          href="/scan" 
          className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-secondary text-brand-text-light font-bold rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          <ScanLine className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          <span>Scan QR Tamu</span>
        </Link>
        <Link 
          href="/admin/upload" 
          className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
        >
          <UploadCloud className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
          <span>Upload Dokumen</span>
        </Link>

      </div>
    </main>
  );
}