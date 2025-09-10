"use client";

import { useState, useEffect } from "react";
import { useIsDesktop } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardSidebarProviderProps {
  children: React.ReactNode;
}

export const DashboardSidebarProvider = ({ children }: DashboardSidebarProviderProps) => {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(true); // 初始默认展开
  
  // 当屏幕尺寸变化时，自动调整侧边栏状态
  useEffect(() => {
    setOpen(isDesktop);
  }, [isDesktop]);
  
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      {children}
    </SidebarProvider>
  );
};