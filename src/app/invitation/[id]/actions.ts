// src/app/invitation/[id]/actions.ts

'use server'; // Tanda ini wajib untuk Server Action

import { supabase } from "@/app/lib/supabaseClient";
import { revalidatePath } from "next/cache";

// Pastikan ada kata "export" di sini
export async function submitRsvp(formData: FormData) {
  const guestId = formData.get('guestId') as string;
  const rsvpStatus = formData.get('rsvp') as string;
  const comment = formData.get('komentar') as string;

  if (!guestId || !rsvpStatus) {
    return { success: false, message: 'Data tidak lengkap.' };
  }

  const { error } = await supabase
    .from('tamu')
    .update({ 
      rsvp: rsvpStatus, 
      komentar: comment 
    })
    .eq('id', guestId);

  if (error) {
    console.error('Supabase error:', error);
    return { success: false, message: 'Gagal menyimpan data.' };
  }

  // Beritahu Next.js untuk merefresh data di halaman ini
  revalidatePath(`/invitation/${guestId}`);
  return { success: true, message: 'Terima kasih atas konfirmasinya!' };
}