// src/components/LocationMap.tsx
'use client';

import { MapPin } from 'lucide-react';

export default function LocationMap() {
  const locationName = "Holiday Inn Express Baruna Bali, an IHG Hotel";
  const googleMapsUrl = "https://maps.app.goo.gl/4xFS13Kx4MZaG8ss5";

  
  // PENTING: Ganti YOUR_API_KEY dengan API Key Anda dari Google Cloud
  const embedMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.1603807330694!2d115.167094!3d-8.731534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd246bf4761234f%3A0xabcd1234ef567890!2sHoliday%20Inn%20Express%20Baruna%20Bali!5e0!3m2!1sen!2sid!4v1694000000000!5m2!1sen!2sid";

  return (
    // Wrapper utama dengan latar belakang biru yang membungkus SEMUA elemen
    <div className="bg-brand-primary rounded-lg p-6 text-white shadow-lg">
      
      {/* Bagian 1: Teks Informasi Lokasi */}
      <div className="flex items-start gap-4">
        <MapPin size={32} className="mt-1 text-yellow-400 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-xl text-brand-text-light">Bali</h3>
          <p className="text-brand-text-light">{locationName}</p>
        </div>
      </div>

      {/* Bagian 2: Tombol Google Maps */}
      <a 
        href={googleMapsUrl}
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full mt-4 bg-yellow-400 text-blue-600 font-bold text-center py-3 rounded-lg hover:bg-white transition-colors duration-300"
      >
        Buka di Google Maps
      </a>
      
      {/* Bagian 3: Peta Iframe (di dalam kotak biru) */}
      <div className="mt-6 rounded-lg overflow-hidden shadow-inner">
        <iframe
          src={embedMapUrl}
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

    </div>
  );
}