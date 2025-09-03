// src/types/index.ts
export interface Guest {
  id: number;
  nama: string;
  slug: string;
  rsvp: string | null;
  komentar: string | null;
  hadir: boolean;
  nama_perusahaan: string | null;
  no_hp: string | null;
  no_meja: string | null;
  created_at: string;
  waktu_hadir: string | null;
}