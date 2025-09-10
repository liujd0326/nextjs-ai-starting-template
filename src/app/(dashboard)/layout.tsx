import { headers } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardSidebarProvider } from "@/components/dashboard-sidebar-provider";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 获取 session 仅用于显示用户信息
  // 认证检查已在中间件中处理
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <DashboardSidebarProvider>
      <AppSidebar user={session?.user} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <DynamicBreadcrumb />
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </DashboardSidebarProvider>
  );
}
