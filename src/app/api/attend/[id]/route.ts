// src/app/api/attend/[id]/route.ts

import { supabase } from '@/app/lib/supabaseClient';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const guestId = params.id;
  const host = request.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  // Tujuan redirect kita adalah halaman /result yang baru
  const resultUrl = new URL(`${protocol}://${host}/result`);

  if (!guestId) {
    resultUrl.searchParams.set('status', 'error');
    resultUrl.searchParams.set('message', 'ID Tamu tidak valid.');
    return NextResponse.redirect(resultUrl);
  }

  try {
    // Cek dulu data tamu yang ada
    const { data: currentGuest, error: fetchError } = await supabase
      .from('tamu')
      .select('nama, hadir')
      .eq('id', guestId)
      .single();

    if (fetchError || !currentGuest) {
      throw new Error('Tamu tidak ditemukan.');
    }

    // Jika sudah hadir, redirect dengan status berbeda
    if (currentGuest.hadir) {
      resultUrl.searchParams.set('status', 'already_scanned');
      resultUrl.searchParams.set('nama', currentGuest.nama);
      return NextResponse.redirect(resultUrl);
    }
    
    // Jika belum hadir, baru lakukan update
    const { error: updateError } = await supabase
      .from('tamu')
      .update({ hadir: true, waktu_hadir: new Date().toISOString() })
      .eq('id', guestId);
    
    if (updateError) throw new Error(updateError.message);

    resultUrl.searchParams.set('status', 'success');
    resultUrl.searchParams.set('nama', currentGuest.nama);
    return NextResponse.redirect(resultUrl);

  } catch (err: any) {
    resultUrl.searchParams.set('status', 'error');
    resultUrl.searchParams.set('message', err.message);
    return NextResponse.redirect(resultUrl);
  }
}