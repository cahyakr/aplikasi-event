// src/app/invitation/[slug]/page.tsx

import { supabase } from "@/app/lib/supabaseClient";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Calendar, MessageSquare, Clock } from 'lucide-react';
import InvitationCover from "@/components/InvitationCover";
import RsvpForm from "@/components/RsvpForm";
import GuestQrCode from "@/components/GuestQrCode";

// Fungsi untuk mengambil data tamu spesifik
async function getGuestData(guestSlug: string) {
  const { data: guest } = await supabase
    .from('tamu')
    .select('id, nama, rsvp, komentar, slug')
    .eq('slug', guestSlug)
    .single();
  return guest;
}

// Fungsi untuk mengambil semua komentar
async function getComments() {
  const { data: comments, error } = await supabase
    .from('tamu')
    .select('nama, komentar, rsvp')
    .not('komentar', 'is', null)
    .neq('komentar', '')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Gagal mengambil komentar:", error);
    return [];
  }
  return comments;
}


interface PageProps {
  params: { slug: string };
}

export default async function InvitationPage({ params }: PageProps) {
  const guestSlug = params.slug;

  const guest = await getGuestData(guestSlug);
  const comments = await getComments();

  if (!guest) notFound();

  const host = (await headers()).get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const scanUrl = `${protocol}://${host}/api/attend/${guest.id}`;
  const gmapsUrl = "https://maps.app.goo.gl/your-link-here"; // <-- GANTI DENGAN LINK GOOGLE MAPS ANDA

  return (
    <InvitationCover guestName={guest.nama}>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <main className="container mx-auto px-4 py-12 max-w-3xl">

          <section className="text-center mb-12">
            <div className="relative w-32 h-16 mx-auto mb-6">
              <Image src="/logo.png" alt="Company Logo" layout="fill" objectFit="contain" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 font-serif">Annual Gala Dinner 2025</h1>
            <p className="text-lg text-gray-300 mt-4">&ldquo;Celebrating a Decade of Innovation&rdquo;</p>
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

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8 flex items-center justify-center gap-3">
              <MessageSquare />
              Ucapan & Doa
            </h2>
            <div className="max-w-2xl mx-auto space-y-6">
              {comments.length > 0 ? (
                comments.map((comment, index) => {
                  // Logika untuk menentukan warna badge
                  const rsvpStatus = {
                    text: comment.rsvp || '?',
                    color: 'bg-gray-500',
                  };
                  if (comment.rsvp === 'Hadir') {
                    rsvpStatus.color = 'bg-green-500';
                  } else if (comment.rsvp === 'Tidak Hadir') {
                    rsvpStatus.text = 'Tidak Hadir';
                    rsvpStatus.color = 'bg-red-500';
                  }

                  return (
                    <div key={index} className="bg-black p-5 rounded-lg shadow-md border-l-4 border-yellow-400">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-lg text-white">{comment.nama}</h4>
                        <span className={`text-xs text-white font-semibold px-3 py-1 rounded-full ${rsvpStatus.color}`}>
                          {rsvpStatus.text}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.komentar}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-400 py-8">Belum ada ucapan. Jadilah yang pertama!</p>
              )}
            </div>
          </section>

          <section className="mb-16 bg-black p-8 rounded-lg shadow-lg">
            <RsvpForm guestId={guest.id} guestSlug={guest.slug} initialRsvp={guest.rsvp} initialComment={guest.komentar} />
          </section>

          <section id="qr-section" className="pt-12 text-center">
            <h3 className="text-3xl font-bold text-yellow-400 mb-6">Kode QR Kehadiran Anda</h3>
            <GuestQrCode scanUrl={scanUrl} />
          </section>

        </main>
      </div>
    </InvitationCover>
  );
}