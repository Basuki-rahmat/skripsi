import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami — SkripsiMentor",
};

const values = [
  {
    title: "Fokus pada Hasil",
    desc: "Kami tidak sekadar 'membimbing', tapi memastikan skripsi maju setiap minggunya.",
  },
  {
    title: "Sabar & Empati",
    desc: "Setiap mahasiswa beda kecepatannya. Kami mendampingi tanpa menghakimi.",
  },
  {
    title: "Transparan",
    desc: "Progres tercatat, pembayaran terdokumentasi, dan selalu ada notifikasi.",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-20">
      <section className="container-page py-16 text-center">
        <span className="badge bg-indigo-100 text-indigo-700">Tentang Kami</span>
        <h1 className="section-title mx-auto mt-4 max-w-2xl">
          Skripsi itu Berat, <span className="gradient-text">Tapi Tidak Sendirian</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          SkripsiMentor lahir dari pengalaman nyata melewati skripsi. Kami melihat
          banyak mahasiswa terhambat bukan karena tidak mampu, tapi karena tidak
          punya arah dan pendamping yang tepat. Di sini kami hadir — sebagai
          mentor dan pengembang sistem.
        </p>
      </section>

      <section className="container-page grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="card card-hover p-6">
            <h3 className="text-lg font-bold text-slate-900">{v.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
          </div>
        ))}
      </section>

      <section className="container-page mt-14">
        <div className="card overflow-hidden border-0 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white sm:p-10">
          <h2 className="text-2xl font-bold">Tim Kami</h2>
          <p className="mt-2 text-indigo-100">
            Mentor aktif membimbing berbagai jurusan — teknik, ekonomi, pendidikan,
            kesehatan, dan lainnya — plus developer yang membangun aplikasi web.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { name: "Tim Mentor", desc: "Lulusan S2/S1 yang berpengalaman membimbing puluhan mahasiswa." },
              { name: "Tim Developer", desc: "Membangun website, sistem pelaporan, dashboard, dan aplikasi GIS." },
              { name: "Tim Admin", desc: "Mengelola pesanan, pembayaran, dan komunikasi klien." },
              { name: "Tim Support", desc: "Respons cepat via WhatsApp, Telegram, dan email." },
            ].map((t) => (
              <div key={t.name} className="rounded-xl bg-white/10 p-4">
                <div className="font-semibold">{t.name}</div>
                <p className="mt-1 text-sm text-indigo-100">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}