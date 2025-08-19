// src/app/api/attend/[id]/route.ts

import { supabase } from '@/app/lib/supabaseClient';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// PERHATIKAN: HANYA ADA SATU ARGUMEN, YAITU 'request'.
// Argumen '{ params }' sudah dihapus seluruhnya.
export async function GET(request: NextRequest) {
  
  // KITA MENGAMBIL ID DARI URL REQUEST, BUKAN DARI PARAMS
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const guestId = pathParts[pathParts.length - 1];

  const host = request.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const resultUrl = new URL(`${protocol}://${host}/result`);

  if (!guestId) {
    resultUrl.searchParams.set('status', 'error');
    resultUrl.searchParams.set('message', 'ID Tamu tidak valid.');
    return NextResponse.redirect(resultUrl);
  }

  try {
    const { data: currentGuest, error: fetchError } = await supabase
      .from('tamu')
      .select('nama, hadir')
      .eq('id', guestId)
      .single();

    if (fetchError || !currentGuest) {
      throw new Error('Tamu tidak ditemukan.');
    }

    if (currentGuest.hadir) {
      resultUrl.searchParams.set('status', 'already_scanned');
      resultUrl.searchParams.set('nama', currentGuest.nama);
      return NextResponse.redirect(resultUrl);
    }
    
    const { error: updateError } = await supabase
      .from('tamu')
      .update({ hadir: true, waktu_hadir: new Date().toISOString() })
      .eq('id', guestId);
    
    if (updateError) throw new Error(updateError.message);

    resultUrl.searchParams.set('status', 'success');
    resultUrl.searchParams.set('nama', currentGuest.nama);
    return NextResponse.redirect(resultUrl);

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.';
    resultUrl.searchParams.set('status', 'error');
    resultUrl.searchParams.set('message', message);
    return NextResponse.redirect(resultUrl);
  }
}