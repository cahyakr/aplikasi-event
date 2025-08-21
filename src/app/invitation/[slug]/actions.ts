// src/app/invitation/[slug]/actions.ts

'use server';

import { supabase } from "@/app/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function submitRsvp(formData: FormData) {
  const guestId = formData.get('guestId') as string;
  const guestSlug = formData.get('guestSlug') as string; 
  const rsvpStatus = formData.get('rsvp') as string;
  const comment = formData.get('komentar') as string;

  if (!guestId || !rsvpStatus || !guestSlug) {
    return { success: false, message: 'Data tidak lengkap.' };
  }

  // --- PERBAIKAN ADA DI SINI ---
  const { error } = await supabase
    .from('tamu')
    .update({ 
      rsvp: rsvpStatus, 
      komentar: comment 
    })
    .eq('id', guestId)
    .select(); // <-- TAMBAHKAN .select() INI UNTUK MENGEKSEKUSI QUERY
  // -----------------------------

  if (error) {
    console.error('Supabase error:', error);
    return { success: false, message: 'Gagal menyimpan data.' };
  }

  // Gunakan slug untuk revalidate path yang benar
  revalidatePath(`/invitation/${guestSlug}`); 
  return { success: true, message: 'Terima kasih atas konfirmasinya!' };
}