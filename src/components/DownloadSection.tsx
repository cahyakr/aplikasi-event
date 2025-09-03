// src/components/DownloadSection.tsx
'use client';

import { Download } from 'lucide-react';

// Tentukan tipe props untuk menerima URL dari page.tsx
interface DownloadSectionProps {
  bukuSakuUrl?: string | null;
  agendaUrl?: string | null;
  materiUrl?: string | null;
}

const DownloadButton = ({ href, label }: { href: string, label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    download 
    className="flex items-center justify-center gap-3 w-full bg-blue-800 text-white font-bold text-center py-4 px-6 rounded-lg hover:bg-blue-900 transition-colors duration-300 shadow-lg"
  >
    <Download size={20} />
    {label}
  </a>
);

export default function DownloadSection({ bukuSakuUrl, agendaUrl, materiUrl }: DownloadSectionProps) {
  if (!bukuSakuUrl && !agendaUrl && !materiUrl) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="space-y-4 max-w-lg mx-auto">
        {bukuSakuUrl && <DownloadButton href={bukuSakuUrl} label="DOWNLOAD BUKU SAKU" />}
        {agendaUrl && <DownloadButton href={agendaUrl} label="DOWNLOAD AGENDA" />}
        {materiUrl && <DownloadButton href={materiUrl} label="DOWNLOAD MATERI" />}
      </div>
    </section>
  );
}