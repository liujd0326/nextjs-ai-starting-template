"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// 路由名称映射
const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  generations: "Generation History",
  subscription: "Subscription Management",
  pricing: "Pricing",
  create: "Create",
  profile: "Profile",
  settings: "Settings",
};

// 获取路由的显示名称
const getRouteName = (segment: string): string => {
  return routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
};

export const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  
  // 解析路径段
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // 如果是根路径 /dashboard，显示 Dashboard > Overview
  if (pathSegments.length === 1 && pathSegments[0] === "dashboard") {
    return (
      <Breadcrumb className="ml-2">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // 构建面包屑项
  const breadcrumbItems = [];
  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    const routeName = getRouteName(segment);

    if (index === 0 && segment === "dashboard") {
      // Dashboard 作为根节点
      if (!isLast) {
        breadcrumbItems.push(
          <BreadcrumbItem key={segment} className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
        breadcrumbItems.push(
          <BreadcrumbSeparator key={`sep-${segment}`} className="hidden md:block" />
        );
      }
    } else if (isLast) {
      // 最后一个段作为当前页面
      breadcrumbItems.push(
        <BreadcrumbItem key={segment}>
          <BreadcrumbPage>{routeName}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      // 中间段作为链接
      breadcrumbItems.push(
        <BreadcrumbItem key={segment}>
          <BreadcrumbLink asChild>
            <Link href={currentPath}>{routeName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
      breadcrumbItems.push(
        <BreadcrumbSeparator key={`sep-${segment}`} />
      );
    }
  });

  return (
    <Breadcrumb className="ml-2">
      <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
    </Breadcrumb>
  );
};