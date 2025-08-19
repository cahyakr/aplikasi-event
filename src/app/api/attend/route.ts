// app/api/attend/[guestId]/route.ts
import { supabase } from '@/app/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { guestId: string } }
) {
  const { guestId } = params;

  if (!guestId) {
    return NextResponse.json({ error: 'ID tamu tidak ditemukan' }, { status: 400 });
  }

  try {
    // 1. Cek dulu apakah tamu sudah hadir
    const { data: existingGuest, error: fetchError } = await supabase
      .from('tamu')
      .select('nama, hadir')
      .eq('id', guestId)
      .single();

    if (fetchError || !existingGuest) {
      return NextResponse.json({ error: 'Tamu tidak valid' }, { status: 404 });
    }

    if (existingGuest.hadir) {
      return NextResponse.json(
        { message: `${existingGuest.nama} sudah melakukan absensi sebelumnya.`, status: 'already_present', name: existingGuest.nama },
        { status: 200 }
      );
    }

    const { data, error } = await supabase
      .from('tamu')
      .update({ hadir: true, waktu_hadir: new Date().toISOString() })
      .eq('id', guestId)
      .select('nama')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: `Selamat datang, ${data.nama}!`, status: 'success', name: data.nama },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}