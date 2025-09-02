import { Footer } from "@/components/footer";
import { MainHeader } from "@/components/headers/main-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1 pt-[74px]">{children}</main>
      <Footer />
    </div>
  );
}
