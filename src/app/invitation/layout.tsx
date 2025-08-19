// src/app/undangan/layout.tsx

export default function UndanganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kita hanya merender children-nya saja (yaitu page.tsx)
  // Komponen tombol kita hapus sementara untuk tes.
  return <>{children}</>;
}