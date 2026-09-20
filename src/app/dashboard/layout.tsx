import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import DashboardShell from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Force dynamic render (auth-dependent data)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell name={user.name} role={user.role}>
      {children}
    </DashboardShell>
  );
}