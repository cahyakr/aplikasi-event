// src/components/DeleteButton.tsx
'use client';

import { supabase } from '@/app/lib/supabaseClient';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  guestId: number;
  onDeleteSuccess: () => void; 
}

export default function DeleteButton({ guestId, onDeleteSuccess }: DeleteButtonProps) {
  const handleDelete = async () => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus tamu ini?');
    if (isConfirmed) {
      const { error } = await supabase
        .from('tamu')
        .delete()
        .eq('id', guestId);

      if (error) {
        alert(`Gagal menghapus: ${error.message}`);
      } else {
        alert('Tamu berhasil dihapus.');
        
        onDeleteSuccess(); 
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-800" title="Hapus Tamu">
      <Trash2 size={16} />
    </button>
  );
}