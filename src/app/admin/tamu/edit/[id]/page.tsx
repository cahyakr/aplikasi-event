// src/app/admin/tamu/edit/[id]/page.tsx
import GuestForm from "@/components/GuestForm";
import { supabase } from "@/app/lib/supabaseClient";
import { Guest } from "@/types";
import Link from "next/link";

async function getGuest(id: string): Promise<Guest | null> {
    const { data, error } = await supabase
        .from('tamu')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error("Error fetching guest:", error);
        return null;
    }
    return data;
}

export default async function EditGuestPage({ params }: { params: { id: string } }) {
    const guest = await getGuest(params.id);

    if (!guest) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 text-center">
                <h1 className="text-2xl font-bold text-red-600">Tamu tidak ditemukan.</h1>
                <p className="text-gray-600 mt-2">Mungkin sudah dihapus atau terjadi kesalahan.</p>
                <Link href="/admin" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Kembali ke Dashboard
                </Link>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
            <GuestForm initialData={guest} />
        </main>
    );
}