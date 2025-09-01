import { DashboardHeader } from "@/components/headers/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader />
      <main>{children}</main>
    </>
  );
}
