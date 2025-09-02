"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { AvatarWithLoading } from "@/components/avatar-with-loading";
import { authClient } from "@/lib/auth-client";

interface UserType {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface MobileAuthSectionProps {
  user?: UserType | null;
  navigationItems: Array<{
    href: string;
    label: string;
  }>;
}

export const MobileAuthSection = ({
  user,
  navigationItems,
}: MobileAuthSectionProps) => {
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
    <>
      {/* User info section */}
      {user && (
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <AvatarWithLoading
              src={user.image}
              alt={user.name || user.email}
              fallback={getUserInitials(user.name, user.email)}
              className="h-10 w-10"
              fallbackClassName="text-sm bg-gray-700 text-white"
            />
            <div className="flex flex-col">
              {user.name && (
                <p className="font-medium text-white">{user.name}</p>
              )}
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
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
          <SignInDialog
            trigger={
              <button className="flex items-center justify-center w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Sign In
              </button>
            }
          />
        )}
      </div>
    </>
  );
};
