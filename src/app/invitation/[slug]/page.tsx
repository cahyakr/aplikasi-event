// src/app/invitation/[slug]/page.tsx

import { supabase } from "@/app/lib/supabaseClient";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Calendar, MessageSquare, Clock } from 'lucide-react';
import InvitationCover from "@/components/InvitationCover";
import RsvpForm from "@/components/RsvpForm";
import GuestQrCode from "@/components/GuestQrCode";
import LocationMap from '@/components/LocationMap';
import Countdown from '@/components/Countdown';
import DownloadSection from '@/components/DownloadSection';

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

async function getEventDetails() {
  const { data, error } = await supabase
    .from('acara_settings')
    .select('buku_saku_url, agenda_url, materi_url')
    .limit(1) // Kita hanya butuh satu baris setting
    .single();

  if (error) {
    console.error("Gagal mengambil detail acara:", error);
    return { buku_saku_url: null, agenda_url: null, materi_url: null };
  }
  return data;
}


interface PageProps {
  params: { slug: string };
}

export default async function InvitationPage({ params }: PageProps) {
  const guestSlug = params.slug;

  const guest = await getGuestData(guestSlug);
  const comments = await getComments();
  const eventDetailsRaw = await getEventDetails();
  const eventDetails = JSON.parse(JSON.stringify(eventDetailsRaw));


  if (!guest) notFound();

  const host = (await headers()).get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const scanUrl = `${protocol}://${host}/api/attend/${guest.id}`;
  const gmapsUrl = "https://maps.app.goo.gl/4xFS13Kx4MZaG8ss5";

  return (
    <InvitationCover guestName={guest.nama}>
      <div
        className="min-h-screen text-gray-700 font-sans"
        style={{
          backgroundImage: `
          url('/batik1.png'),    
          url('/batik2.png'), 
          linear-gradient(to bottom left, #28ABF9 0%, #FFFFFF 40%, #28ABF9 80%) 
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
      >        <main className="container mx-auto px-4 py-12 max-w-3xl">

          <section className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-lg w-32 h-32 mx-auto mb-6 flex items-center justify-center p-4">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary font-serif">Forum Komunikasi Anak Perusahaan YKKBI</h1>
            <p className="text-lg text-gray-700 mt-4">&ldquo;Outlook Perekonomian dan Bisnis: Meningkatkan Agility untuk Merespon Tantangan Perubahan
              Lingkungan Strategis Guna Keberlanjutan Usaha&rdquo;</p>
          </section>

          <section className="space-y-8 mb-16">
            <div className="bg-brand-primary p-6 rounded-lg shadow-lg flex items-center gap-4">
              <div className="flex-1 flex justify-center">
                <Countdown />
              </div>
            </div>
            <LocationMap />

          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-brand-primary text-center mb-8">Download dokumen acara</h2>
            <DownloadSection
              bukuSakuUrl={eventDetails.buku_saku_url}
              agendaUrl={eventDetails.agenda_url}
              materiUrl={eventDetails.materi_url}
            />
          </section>



          {/* <section className="mb-16">
            <h2 className="text-3xl font-bold text-brand-primary text-center mb-8 flex items-center justify-center gap-3">
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
                    <div key={index} className="bg-white p-5 rounded-lg shadow-md border-l-4 border-brand-primary">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-lg text-brand-primary">{comment.nama}</h4>
                        <span className={`text-xs text-white font-semibold px-3 py-1 rounded-full ${rsvpStatus.color}`}>
                          {rsvpStatus.text}
                        </span>
                      </div>
                      <p className="text-gray-900 text-sm">{comment.komentar}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-400 py-8">Belum ada ucapan. Jadilah yang pertama!</p>
              )}
            </div>
          </section> */}

          {/* <section className="mb-16 bg-black p-8 rounded-lg shadow-lg">
            <RsvpForm guestId={guest.id} guestSlug={guest.slug} initialRsvp={guest.rsvp} initialComment={guest.komentar} />
          </section> */}

          <section id="qr-section" className="pt-12 text-center">
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-6 inline-block">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Kode QR Kehadiran Anda
                </h3>
                <GuestQrCode scanUrl={scanUrl} />
              </div>
            </div>
          </section>

        </main>
      </div>
    </InvitationCover>
  );
}