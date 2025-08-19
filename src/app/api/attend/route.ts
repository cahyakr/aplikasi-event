// src/app/api/attend/route.ts

import { supabase } from '@/app/lib/supabaseClient';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Pastikan signature fungsinya seperti ini, hanya menerima 'request'
export async function POST(request: NextRequest) {
  try {
    // Ambil data dari body request, bukan dari params
    const { nama, email, no_hp } = await request.json();

    if (!nama) {
      return NextResponse.json({ message: 'Nama tidak boleh kosong.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tamu')
      .insert([{ 
        nama, 
        email: email || null,
        no_hp: no_hp || null
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}