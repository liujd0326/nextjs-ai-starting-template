import { MainHeader } from "@/components/headers/main-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      <main>{children}</main>
    </>
  );
}
