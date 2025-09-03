// src/components/Modal.tsx
'use client';

import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
    >
      {/* Modal Content */}
      <div 
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam konten
        className="bg-gray-50 rounded-xl shadow-2xl z-50 w-full max-w-lg relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}