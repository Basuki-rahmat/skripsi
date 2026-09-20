import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { mariadbPoolConfig } from "../src/lib/mariadb";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(mariadbPoolConfig()),
});

const CATEGORIES = [
  {
    name: "Infrastruktur Jalan",
    icon: "road",
    description:
      "Kerusakan jalan, trotoar, jembatan, hingga marka dan rambu lalu lintas.",
  },
  {
    name: "Penerangan dan Listrik",
    icon: "zap",
    description:
      "Penerangan jalan umum (PJU) mati, tiang miring, hingga kabel listrik putus.",
  },
  {
    name: "Kebersihan dan Sampah",
    icon: "trash",
    description:
      "Tumpukan sampah, drainase tersumbat, hingga saluran air mampet.",
  },
  {
    name: "Bencana Alam",
    icon: "cloud-rain",
    description:
      "Banjir, tanah longsor, pohon tumbang, dan dampak bencana lainnya.",
  },
  {
    name: "Fasilitas Umum",
    icon: "bus",
    description:
      "Kerusakan fasilitas publik seperti taman, halte, taman bermain, dan MCK umum.",
  },
  {
    name: "Keamanan dan Ketertiban",
    icon: "shield",
    description:
      "Kerawanan keamanan, tiang/papan liar, hingga gangguan ketertiban lainnya.",
  },
  {
    name: "Lainnya",
    icon: "more",
    description: "Kategori pelaporan yang belum tercakup kategori lainnya.",
  },
] as const;

const REGIONS = [
  {
    name: "Palmerah",
    level: "KECAMATAN",
    province: "DKI Jakarta",
    city: "Kota Administrasi Jakarta Barat",
    district: "Palmerah",
    lat: -6.2046,
    lng: 106.7947,
  },
  {
    name: "Kebon Jeruk",
    level: "KECAMATAN",
    province: "DKI Jakarta",
    city: "Kota Administrasi Jakarta Barat",
    district: "Kebon Jeruk",
    lat: -6.185,
    lng: 106.765,
  },
  {
    name: "Grogol Petamburan",
    level: "KECAMATAN",
    province: "DKI Jakarta",
    city: "Kota Administrasi Jakarta Barat",
    district: "Grogol Petamburan",
    lat: -6.155,
    lng: 106.791,
  },
  {
    name: "Tanah Abang",
    level: "KECAMATAN",
    province: "DKI Jakarta",
    city: "Kota Administrasi Jakarta Pusat",
    district: "Tanah Abang",
    lat: -6.185,
    lng: 106.811,
  },
  {
    name: "Tambora",
    level: "KECAMATAN",
    province: "DKI Jakarta",
    city: "Kota Administrasi Jakarta Barat",
    district: "Tambora",
    lat: -6.142,
    lng: 106.805,
  },
  {
    name: "Kemanggisan",
    level: "KELURAHAN",
    province: "DKI Jakarta",
    city: "Kota Administrasi Jakarta Barat",
    district: "Palmerah",
    lat: -6.2085,
    lng: 106.798,
  },
  {
    name: "Kota Bambu",
    level: "KELURAHAN",
    province: "DKI Jakarta",
    city: "Kota Administrasi Jakarta Barat",
    district: "Palmerah",
    lat: -6.202,
    lng: 106.779,
  },
  {
    name: "Jelambar",
    level: "KELURAHAN",
    province: "DKI Jakarta",
    city: "Kota Administrasi Jakarta Barat",
    district: "Grogol Petamburan",
    lat: -6.159,
    lng: 106.779,
  },
  {
    name: "Tomang",
    level: "KELURAHAN",
    province: "DKI Jakarta",
    city: "Kota Administrasi Jakarta Barat",
    district: "Grogol Petamburan",
    lat: -6.173,
    lng: 106.79,
  },
] as const;

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const officerPassword = await bcrypt.hash("petugas123", 10);
  const citizenPassword = await bcrypt.hash("masyarakat123", 10);

  await prisma.user.upsert({
    where: { email: "admin@pelaporan.id" },
    update: {},
    create: {
      name: "Admin Sistem",
      email: "admin@pelaporan.id",
      password: adminPassword,
      role: "ADMIN",
      phone: "081200000001",
    },
  });

  await prisma.user.upsert({
    where: { email: "petugas@pelaporan.id" },
    update: {},
    create: {
      name: "Petugas Lapangan",
      email: "petugas@pelaporan.id",
      password: officerPassword,
      role: "PETUGAS",
      phone: "081200000002",
    },
  });

  await prisma.user.upsert({
    where: { email: "masyarakat@pelaporan.id" },
    update: {},
    create: {
      name: "Warga Komunitas",
      email: "masyarakat@pelaporan.id",
      password: citizenPassword,
      role: "MASYARAKAT",
      phone: "081200000003",
    },
  });

  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: { ...c },
    });
  }

  for (const r of REGIONS) {
    const exists = await prisma.region.findFirst({ where: { name: r.name } });
    if (!exists) {
      await prisma.region.create({ data: { ...r } });
    }
  }

  console.log("Seed selesai:");
  console.log("  Admin      : admin@pelaporan.id / admin123");
  console.log("  Petugas    : petugas@pelaporan.id / petugas123");
  console.log("  Masyarakat : masyarakat@pelaporan.id / masyarakat123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });