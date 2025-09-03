// src/app/api/attend/[id]/route.ts
import { supabase } from '@/app/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { guestId: string } }
) {
  const guestId = params.guestId;

  if (!guestId) {
    return NextResponse.json({ success: false, message: 'ID Tamu tidak valid.' }, { status: 400 });
  }

  try {
    const { data: guest, error: findError } = await supabase
      .from('tamu')
      .select('nama, hadir')
      .eq('id', guestId)
      .single();

    if (findError || !guest) throw new Error('Tamu tidak ditemukan.');

    if (guest.hadir) {
      return NextResponse.json({ success: false, message: 'Tamu ini sudah check-in.', guestName: guest.nama }, { status: 409 });
    }

    const { error: updateError } = await supabase
      .from('tamu')
      .update({ hadir: true, waktu_hadir: new Date().toISOString() })
      .eq('id', guestId);

    if (updateError) throw new Error('Gagal memperbarui status.');
    
    return NextResponse.json({ success: true, message: 'Kehadiran Berhasil!', guestName: guest.nama });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}