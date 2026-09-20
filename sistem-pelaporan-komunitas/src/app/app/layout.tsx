import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AppShell from "@/components/app/sidebar";

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <AppShell>{children}</AppShell>;
}