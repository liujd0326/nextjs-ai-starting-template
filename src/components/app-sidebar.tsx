"use client";

import {
  ChevronUp,
  Home,
  ImageIcon,
  LogOut,
  Palette,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOut } from "@/lib/auth-client";

const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Text to Image",
    url: "/dashboard/text-to-image",
    icon: ImageIcon,
  },
  {
    title: "Image to Image",
    url: "/dashboard/image-to-image",
    icon: Palette,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

interface AppSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const AppSidebar = ({ user }: AppSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // 用户菜单内容组件
  const UserMenuContent = () => (
    <>
      <div className="flex items-center gap-3 p-3 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
          <AvatarFallback>
            {user?.name?.slice(0, 2)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || ""}
          </p>
        </div>
      </div>

      <div className="p-1">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent rounded-md"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {state === "expanded" ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-transparent"
              >
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
                    <Image
                      src="/logo.png"
                      alt={siteConfig.name}
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="grid flex-1 text-left text-base leading-tight ml-1">
                    <span className="truncate font-bold text-foreground">
                      {siteConfig.name}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <div className="flex justify-center">
            <Link href="/" className="inline-block">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src="/logo.png"
                  alt={siteConfig.name}
                  width={20}
                  height={20}
                />
              </div>
            </Link>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu
              className={`space-y-1 ${state === "collapsed" ? "items-center px-0" : "px-4"}`}
            >
              {navigation.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={
                      state === "collapsed" ? "flex justify-center" : ""
                    }
                  >
                    {state === "collapsed" ? (
                      <Link
                        href={item.url}
                        className={`flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent transition-colors ${isActive ? "bg-accent text-accent-foreground" : ""}`}
                      >
                        <item.icon className="size-4" />
                      </Link>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="rounded-md"
                      >
                        <Link href={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.slice(0, 2)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {state === "expanded" && (
                      <>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user?.name || "User"}
                          </span>
                          <span className="truncate text-xs">
                            {user?.email || ""}
                          </span>
                        </div>
                        <ChevronUp className="ml-auto size-4" />
                      </>
                    )}
                  </SidebarMenuButton>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Account</DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 pb-4">
                    <UserMenuContent />
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.slice(0, 2)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {state === "expanded" && (
                      <>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user?.name || "User"}
                          </span>
                          <span className="truncate text-xs">
                            {user?.email || ""}
                          </span>
                        </div>
                        <ChevronUp className="ml-auto size-4" />
                      </>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 rounded-lg"
                  side="right"
                  align="end"
                  sideOffset={8}
                >
                  <UserMenuContent />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
