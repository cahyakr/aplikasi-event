// src/components/ShareWhatsAppButton.tsx
'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
    guestName: string;
    url: string;
    phoneNumber?: string | null;
}

export default function ShareWhatsAppButton({ guestName, url, phoneNumber }: ShareButtonProps) {
    const handleShare = () => {
        // 1. Buat template pesan undangan
        const message = `
Yth. Bapak/Ibu ${guestName},

Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dalam acara:
*Forum Komunikasi Anak Perusahaan YKKBI*

Silakan akses undangan digital Anda melalui tautan berikut:
${url}

Atas perhatian dan kehadiran Anda, kami ucapkan terima kasih.
    `.trim(); 

        const encodedMessage = encodeURIComponent(message);

        let whatsAppUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

       
        if (phoneNumber) {
            let formattedPhone = phoneNumber.replace(/\D/g, ''); 
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '62' + formattedPhone.substring(1);
            }
            whatsAppUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
        }

        window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
    };


    return (
        <div className="flex items-center gap-2">
            <input type="text" readOnly value={url} className="w-full bg-gray-100 p-1 border rounded text-xs" />
            <button
                onClick={handleShare}
                title="Bagikan ke WhatsApp"
                className="p-1.5 text-white bg-green-500 hover:bg-green-600 rounded-md"
            >
                <Share2 size={16} />
            </button>
        </div>
    );
}