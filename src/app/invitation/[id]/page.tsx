// src/app/invitation/[id]/page.tsx

import { supabase } from "@/app/lib/supabaseClient";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Calendar, Clock } from 'lucide-react';
import InvitationCover from "@/components/InvitationCover";
import RsvpForm from "@/components/RsvpForm";
import GuestQrCode from "@/components/GuestQrCode";

async function getGuestData(guestId: string) {
  // Ambil data baru: rsvp dan komentar
  const { data: guest } = await supabase
    .from('tamu')
    .select('id, nama, rsvp, komentar')
    .eq('id', guestId)
    .single();
  return guest;
}

export default async function InvitationPage({ params }: { params: { id: string } }) {
  const guest = await getGuestData(params.id);
  if (!guest) notFound();

  const host = (await headers()).get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const scanUrl = `${protocol}://${host}/api/attend/${guest.id}`;
  const gmapsUrl = "https://maps.app.goo.gl/NAMA_LOKASI_ANDA"; // <-- GANTI DENGAN LINK GOOGLE MAPS ANDA

  return (
    <InvitationCover guestName={guest.nama}>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          
          <section className="text-center mb-12">
            <div className="relative w-32 h-16 mx-auto mb-6">
              {/* Pastikan Anda punya logo.png di folder /public */}
              <Image src="/logo.png" alt="Company Logo" layout="fill" objectFit="contain" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 font-serif">Annual Gala Dinner 2025</h1>
            <p className="text-lg text-gray-300 mt-4">"Celebrating a Decade of Innovation"</p>
          </section>

          <section className="space-y-8 mb-16">
            <div className="bg-black p-6 rounded-lg shadow-lg flex items-center gap-4">
              <Calendar className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="font-bold text-xl">Sabtu, 16 Agustus 2025</h3>
                <p className="text-gray-400">Pukul 19:00 WIB - Selesai</p>
              </div>
            </div>
            <div className="bg-black p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="font-bold text-xl">The Ritz-Carlton Ballroom</h3>
                  <p className="text-gray-400">Jl. Jenderal Sudirman Kav. 52-53, Jakarta</p>
                </div>
              </div>
              <a href={gmapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full bg-blue-600 text-center py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Buka di Google Maps
              </a>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">Susunan Acara</h2>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex gap-4"><Clock className="w-6 h-6 text-yellow-400 mt-1" /><p><strong className="font-bold">19:00 - 19:30:</strong> Registrasi & Ramah Tamah</p></div>
              <div className="flex gap-4"><Clock className="w-6 h-6 text-yellow-400 mt-1" /><p><strong className="font-bold">19:30 - 20:00:</strong> Sambutan & Pembukaan</p></div>
              <div className="flex gap-4"><Clock className="w-6 h-6 text-yellow-400 mt-1" /><p><strong className="font-bold">20:00 - 21:00:</strong> Makan Malam & Hiburan</p></div>
              <div className="flex gap-4"><Clock className="w-6 h-6 text-yellow-400 mt-1" /><p><strong className="font-bold">21:00 - 21:30:</strong> Penyerahan Penghargaan</p></div>
            </div>
          </section>
          
          <section className="mb-16 bg-black p-8 rounded-lg shadow-lg">
             <RsvpForm guestId={guest.id} initialRsvp={guest.rsvp} initialComment={guest.komentar} />
          </section>
          
          <section id="qr-section" className="pt-12 text-center">
            <h3 className="text-3xl font-bold text-yellow-400 mb-6">Kode QR Kehadiran Anda</h3>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Mohon tunjukkan kode QR ini kepada petugas di meja registrasi.
            </p>
            <GuestQrCode scanUrl={scanUrl} />
          </section>

        </main>
      </div>
    </InvitationCover>
  );
}