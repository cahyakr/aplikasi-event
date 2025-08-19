// src/app/invitation/[id]/page.tsx

import { supabase } from "@/app/lib/supabaseClient";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import GuestQrCode from "@/components/GuestQrCode";

async function getGuestData(guestId: string) {
  const { data: guest, error } = await supabase
    .from('tamu')
    .select('id, nama')
    .eq('id', guestId)
    .single();
  
  if (error || !guest) {
    return null;
  }
  return guest;
}

export default async function InvitationPage({ params }: { params: { id: string } }) {
  const guest = await getGuestData(params.id);

  if (!guest) {
    notFound();
  }

  const host = (await headers()).get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const scanUrl = `${protocol}://${host}/api/attend/${guest.id}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-12 text-center">
        
        <section className="mb-24 bg-black p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <p className="text-xl text-gray-300 mb-4">Kepada Yth.</p>
          <h2 className="text-4xl font-bold text-yellow-400 mb-8">{guest.nama}</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara kami.
          </p>
        </section>
        
        <div style={{ height: '80vh' }}></div>

        <section id="qr-section" className="pt-20">
          <h3 className="text-3xl font-bold text-yellow-400 mb-6">Kode QR Kehadiran Anda</h3>
          <GuestQrCode scanUrl={scanUrl} />
        </section>

      </main>
    </div>
  );
}