// src/app/admin/tamu/tambah/page.tsx
import GuestForm from "@/components/GuestForm";

export default function AddGuestPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
            {/* Memanggil komponen form yang sama, TAPI tanpa properti 'initialData'.
              Inilah yang membuatnya menjadi mode 'Tambah Baru'.
            */}
            <GuestForm /> 
        </main>
    );
}