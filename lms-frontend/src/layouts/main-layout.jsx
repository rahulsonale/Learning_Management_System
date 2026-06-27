import { Outlet } from "react-router";
import Header from "@/components/ui/header";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout() {
  return (
    <div className="min-h-svh bg-background">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}
