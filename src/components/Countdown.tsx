'use client';

import { useState, useEffect } from 'react';

// Atur tanggal acara di sini (Tahun, Bulan-1, Tanggal, Jam)
const eventDate = new Date('2025-09-10T07:00:00');

export default function Countdown() {
  const calculateTimeLeft = () => {
    const difference = +eventDate - +new Date();
    let timeLeft = {
      hari: 0,
      jam: 0,
      menit: 0,
      detik: 0,
    };

    if (difference > 0) {
      timeLeft = {
        hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
        jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
        menit: Math.floor((difference / 1000 / 60) % 60),
        detik: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
    return (
      <div key={interval} className="text-center bg-white/20 p-2 sm:p-3 rounded-lg w-1/4 min-w-[60px]">
        <div className="text-2xl sm:text-3xl font-bold">{String(value).padStart(2, '0')}</div>
        <div className="text-xs uppercase">{interval}</div>
      </div>
    );
  });

  // Format tanggal acara
  const eventDateFormatted = eventDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Tampilan jika acara sudah lewat
  if (!Object.values(timeLeft).some(val => val > 0)) {
    return (
      <div className="text-center text-xl font-bold p-4 bg-white/20 rounded-lg">
        Acara Telah Berlangsung
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-brand-text-light">
      <h3 className="font-bold text-xl mb-1">Menuju Acara</h3>
      <p className="text-sm mb-4 opacity-90">{eventDateFormatted}</p>

      <div className="flex justify-center gap-2 sm:gap-4">
        {timerComponents}
      </div>
    </div>
  );
}
