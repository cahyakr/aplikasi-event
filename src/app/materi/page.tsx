// src/app/materi/page.tsx
import { supabase } from "@/app/lib/supabaseClient";
import { Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Definisikan tipe data untuk materi
interface Materi {
    id: number;
    judul: string;
    deskripsi: string | null;
    file_url: string;
}

// Fungsi untuk mengambil daftar materi dari database
async function getMateriList(): Promise<Materi[]> {
    const { data, error } = await supabase
        .from('materi')
        .select('*')
        .order('urutan', { ascending: true }); // Urutkan berdasarkan kolom 'urutan'

    if (error) {
        console.error("Gagal mengambil daftar materi:", error);
        return [];
    }
    return data;
}

export default async function MateriPage() {
    const daftarMateri = await getMateriList();

    return (
        <div
            className="min-h-screen text-gray-700 font-sans"
            style={{
                backgroundImage: `
          url('/batik1.png'),    
          url('/batik2.png'), 
          linear-gradient(to bottom left, #28ABF9 0%, #FFFFFF 40%, #28ABF9 80%) 
        `,
                backgroundPosition: `
          top right,    
          bottom left  
        `,
                backgroundRepeat: `
          no-repeat,    
          no-repeat     
        `,
                backgroundSize: `
          300px auto,   
          300px auto,   
          cover         
        `,
            }}
        >
            <main className="container mx-auto px-4 py-12 max-w-3xl">
                <section className="text-center mb-12">
                    <div className=" w-32 h-32 mx-auto mb-6 flex items-center justify-center p-4">
                        <Image
                            src="/logo.png"
                            alt="Company Logo"
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary font-serif">Materi Acara</h1>
                    <p className="text-lg text-gray-700 mt-4">
                        Silakan unduh materi yang telah disediakan oleh para pembicara.
                    </p>
                </section>

                <section className="space-y-6">
                    {daftarMateri.length > 0 ? (
                        daftarMateri.map((materi) => (
                            <div key={materi.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-200">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{materi.judul}</h3>
                                    {materi.deskripsi && <p className="text-gray-600 mt-1">{materi.deskripsi}</p>}
                                </div>
                                <a
                                    href={materi.file_url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors duration-300"
                                >
                                    <Download size={20} />
                                    Unduh
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white/80 p-6 rounded-lg shadow-lg text-center">
                            <p className="text-gray-600">Materi belum tersedia saat ini. Silakan cek kembali nanti.</p>
                        </div>
                    )}
                </section>

                <div className="text-center mt-12">
                    <Link href="/" className="text-blue-800 font-bold hover:underline">
                        &larr; Kembali ke Halaman Utama
                    </Link>
                </div>
            </main>
        </div>
    );
}