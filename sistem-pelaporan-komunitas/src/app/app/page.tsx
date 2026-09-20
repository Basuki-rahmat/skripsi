import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const HOME: Record<string, string> = {
  MASYARAKAT: "/app/masyarakat",
  PETUGAS: "/app/petugas",
  ADMIN: "/app/admin",
};

export default async function AppIndexPage() {
  const session = await auth();
  redirect(session?.user.role ? HOME[session.user.role] ?? "/" : "/login");
}