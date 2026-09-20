import Header from "@/components/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Sistem Pelaporan Komunitas Berbasis
            Web dan GIS
          </p>
          <p>Skripsi - Program Studi Teknik Informatika</p>
        </div>
      </footer>
    </>
  );
}