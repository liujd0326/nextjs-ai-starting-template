"use client";

import { LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { authClient } from "@/lib/auth-client";

interface MobileMenuProps {
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  navigationItems: Array<{
    href: string;
    label: string;
  }>;
}

const MobileMenu = ({ user, navigationItems }: MobileMenuProps) => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("退出登录失败:", error);
    }
  };

  const getUserInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  return (
    <Sheet>
      <SheetTrigger className="relative h-8 w-8 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors">
        <Menu className="h-5 w-5 text-white" />
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-80 p-0 bg-gray-900 border-gray-800">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b border-gray-800">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="/logo.png"
                  alt={`${process.env.NEXT_PUBLIC_APP_NAME} Logo`}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-white font-bold text-lg">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </span>
              </div>
              <SheetClose className="rounded-md p-2 hover:bg-gray-800 transition-colors">
                <X className="h-5 w-5 text-white" />
              </SheetClose>
            </div>
          </SheetHeader>

          {/* User info section */}
          {user && (
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
                  <AvatarFallback className="text-sm bg-gray-700 text-white">
                    {getUserInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  {user.name && (
                    <p className="font-medium text-white">{user.name}</p>
                  )}
                  <p className="text-sm text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation items */}
          <div className="flex-1 py-6">
            <nav className="space-y-1 px-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-3 text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {item.label}
                  <span className="ml-auto text-gray-400">→</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Bottom section */}
          <div className="border-t border-gray-800 p-6 space-y-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center w-full px-3 py-3 text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <User className="mr-3 h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center justify-center w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { MobileMenu };