import PublicLayout from "@/components/public-layout";
import { RegisterForm } from "@/components/auth/register-form";
import { Card } from "@/components/ui";

export default function RegisterPage() {
  return (
    <PublicLayout>
      <div className="mx-auto flex max-w-lg flex-col justify-center px-4 py-14">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Buat Akun Masyarakat</h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar untuk mulai melaporkan masalah di lingkungan Anda.
          </p>
        </div>
        <Card className="p-6">
          <RegisterForm />
        </Card>
      </div>
    </PublicLayout>
  );
}