import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { ReportStatus, ReportPriority } from "../src/generated/prisma/enums";
import { mariadbPoolConfig } from "../src/lib/mariadb";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(mariadbPoolConfig()),
});

const statuses: Array<{
  status: ReportStatus;
  priority: ReportPriority;
  title: string;
  description: string;
  address: string;
}> = [
  {
    status: "MENUNGGU_VERIFIKASI",
    priority: "TINGGI",
    title: "Pohon tumbang menutup akses jalan",
    description:
      "Pohon besar tumbang di tengah jalan setelah hujan deras, menghalangi akses kendaraan dan pejalan kaki.",
    address: "Jl. Kemanggisan Utama Raya, Palmerah",
  },
  {
    status: "MENUNGGU_VERIFIKASI",
    priority: "SEDANG",
    title: "Penumpukan sampah di TPS liar",
    description:
      "Sampah rumah tangga menumpuk dan tidak diangkut selama hampir seminggu, menimbulkan bau tidak sedap.",
    address: "RT 05 RW 02, Kemanggisan",
  },
  {
    status: "MENUNGGU_VERIFIKASI",
    priority: "RENDAH",
    title: "Trotoar rusak di depan sekolah",
    description:
      "Keramik trotoar pecah dan berlubang cukup besar, berbahaya bagi anak sekolah yang lalu lalang.",
    address: "Jl. Tanjung Duren Raya, Grogol Petamburan",
  },
  {
    status: "VERIFIKASI_DITOLAK",
    priority: "RENDAH",
    title: "Parkir liar di pinggir jalan",
    description:
      "Terdapat kendaraan parkir sembarangan menghalangi jalan masuk kompleks setiap sore hari.",
    address: "Jelambar Baru, Grogol Petamburan",
  },
  {
    status: "DIPROSES",
    priority: "URGENT",
    title: "Lubang jalan cukup dalam di Jl. Palmerah Barat",
    description:
      "Lubang berdiameter sekitar 70 cm dengan kedalaman 30 cm di lajur kiri, sering menyebabkan ban kendaraan pecah.",
    address: "Jl. Palmerah Barat, Palmerah",
  },
  {
    status: "DIPROSES",
    priority: "TINGGI",
    title: "Tiang lampu jalan mati total",
    description:
      "Lampu penerangan jalan sepanjang Jl. Kebon Jeruk Raya mati, jalan menjadi gelap dan rawan kecelakaan.",
    address: "Jl. Kebon Jeruk Raya, Kebon Jeruk",
  },
  {
    status: "DIPROSES",
    priority: "SEDANG",
    title: "Genangan banjir setelah hujan",
    description:
      "Genangan air setinggi 30-40 cm di pintu masuk kompleks, menyulitkan akses warga setiap kali hujan turun.",
    address: "Kota Bambu Selatan, Palmerah",
  },
  {
    status: "DIPROSES",
    priority: "SEDANG",
    title: "Kamera CCTV lingkungan tidak berfungsi",
    description:
      "Beberapa CCTV di pos kamling tidak menyala sejak bulan lalu sehingga pemantauan keamanan terhambat.",
    address: "RW 03 Tomang, Grogol Petamburan",
  },
  {
    status: "DITINDAKLANJUTI",
    priority: "TINGGI",
    title: "Jalan berlubang di Jl. Tanah Abang II",
    description:
      "Aspal di beberapa titik mulai mengelupas dan berlubang, berpotensi membahayakan pengendara roda dua.",
    address: "Jl. Tanah Abang II, Tanah Abang",
  },
  {
    status: "DITINDAKLANJUTI",
    priority: "SEDANG",
    title: "Sumur resapan warga tersumbat",
    description:
      "Sumur resapan di beberapa rumah warga tersumbat sampah sehingga air meluap ke jalan.",
    address: "Kebon Jeruk, RT 07 RW 01",
  },
  {
    status: "DITINDAKLANJUTI",
    priority: "URGENT",
    title: "Kabel listrik menjuntai berbahaya",
    description:
      "Kabel listrik terkelupas dan menjuntai rendah di area padat penduduk setelah tiang miring.",
    address: "Tambora, dekat Jl. Keadilan",
  },
  {
    status: "SELESAI",
    priority: "TINGGI",
    title: "Sampah besar di kali meluap",
    description:
      "Sampah menyumbat aliran kali kecil dan menyebabkan air meluap ke pemukiman saat hujan.",
    address: "Palmerah, bantaran Kali Sekretaris",
  },
  {
    status: "SELESAI",
    priority: "SEDANG",
    title: "Penerangan gang mati",
    description:
      "Lampu gang mati total selama lebih dari dua minggu, gang menjadi gelap dan tidak nyaman dilalui.",
    address: "Jelambar, gang Melati",
  },
  {
    status: "SELESAI",
    priority: "RENDAH",
    title: "Fasilitas toilet umum kotor",
    description:
      "Toilet umum di dekat taman tidak terawat dan tidak ada petugas kebersihan yang menjadwalkan pembersihan.",
    address: "Taman Tomang, Tanah Abang",
  },
];

async function main() {
  const exists = await prisma.report.findFirst({ where: { code: { startsWith: "DEMO-" } } });
  if (exists) {
    console.log("Data demo laporan sudah ada, dilewati.");
    return;
  }

  const masyarakat = await prisma.user.findUniqueOrThrow({ where: { email: "masyarakat@pelaporan.id" } });
  const admin = await prisma.user.findUniqueOrThrow({ where: { email: "admin@pelaporan.id" } });
  const petugas = await prisma.user.findUniqueOrThrow({ where: { email: "petugas@pelaporan.id" } });

  const categories = await prisma.category.findMany();
  const catByName = new Map(categories.map((c) => [c.name, c.id]));
  const regions = await prisma.region.findMany({ where: { level: "KECAMATAN" } });
  const regByName = new Map(regions.map((r) => [r.name, r]));

  const now = new Date();
  const daysAgo = (d: number, hourOffset = 0) => {
    const t = new Date(now.getTime() - d * 86400000);
    t.setHours(9 + (hourOffset % 10), (hourOffset * 13) % 60, 0, 0);
    return t;
  };

  const catCycle = [
    catByName.get("Infrastruktur Jalan")!,
    catByName.get("Bencana Alam")!,
    catByName.get("Kebersihan dan Sampah")!,
    catByName.get("Penerangan dan Listrik")!,
    catByName.get("Keamanan dan Ketertiban")!,
    catByName.get("Fasilitas Umum")!,
  ];
  const regCycle = Array.from(regByName.values());

  for (let i = 0; i < statuses.length; i++) {
    const s = statuses[i];
    const categoryId = catCycle[i % catCycle.length];
    const region = regCycle[i % regCycle.length];
    const createdAt = daysAgo(42 - i * 3, i);
    const code = `DEMO-${1001 + i}`;

    const verified = s.status !== "MENUNGGU_VERIFIKASI";
    const verifiedAt = verified ? new Date(createdAt.getTime() + 6 * 3600000) : null;
    const closed = s.status === "SELESAI";
    const closedAt = closed ? new Date(verifiedAt!.getTime() + (4 + (i % 4)) * 86400000) : null;

    const report = await prisma.report.create({
      data: {
        code,
        title: s.title,
        description: s.description,
        address: s.address,
        lat: region.lat + (i % 3) * 0.0011,
        lng: region.lng + ((i * 7) % 5) * 0.0013,
        status: s.status,
        priority: s.priority,
        userId: masyarakat.id,
        categoryId,
        regionId: region.id,
        createdAt,
        verifiedAt,
        verifiedById: verified ? admin.id : null,
        verificationNote: verified ? "Laporan terverifikasi sesuai lokasi yang dilaporkan." : null,
        assignedToId: verified ? petugas.id : null,
        assignedAt: verified ? verifiedAt : null,
        closedAt,
      },
    });

    if (verified) {
      await prisma.notification.create({
        data: {
          userId: masyarakat.id,
          reportId: report.id,
          message: `Laporan ${code} telah diverifikasi dan sedang diproses petugas.`,
          createdAt: verifiedAt!,
        },
      });
    }

    if (s.status === "DITINDAKLANJUTI" || s.status === "SELESAI") {
      const t1 = new Date(verifiedAt!.getTime() + 18 * 3600000);
      await prisma.followUp.create({
        data: {
          reportId: report.id,
          officerId: petugas.id,
          note: "Petugas telah turun ke lokasi dan melakukan koordinasi awal dengan perangkat wilayah sekitar.",
          statusAfter: "DITINDAKLANJUTI",
          createdAt: t1,
        },
      });
      if (s.status === "SELESAI") {
        await prisma.followUp.create({
          data: {
            reportId: report.id,
            officerId: petugas.id,
            note: "Penanganan telah selesai dilakukan di lokasi dan area dipastikan aman untuk digunakan.",
            statusAfter: "SELESAI",
            createdAt: closedAt!,
          },
        });
        await prisma.notification.create({
          data: {
            userId: masyarakat.id,
            reportId: report.id,
            message: `Laporan ${code} telah selesai ditindaklanjuti. Terima kasih atas laporannya!`,
            createdAt: closedAt!,
          },
        });
      }
    }
  }

  console.log(`Berhasil membuat ${statuses.length} laporan demo.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());