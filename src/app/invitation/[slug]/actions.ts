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

  
  const { error } = await supabase
    .from('tamu')
    .update({ 
      rsvp: rsvpStatus, 
      komentar: comment 
    })
    .eq('id', guestId)
    .select(); 

  if (error) {
    console.error('Supabase error:', error);
    return { success: false, message: 'Gagal menyimpan data.' };
  }

  revalidatePath(`/invitation/${guestSlug}`); 
  return { success: true, message: 'Terima kasih atas konfirmasinya!' };
}