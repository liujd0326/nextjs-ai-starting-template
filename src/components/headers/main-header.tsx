import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { siteConfig } from "@/config/site";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { MobileMenu } from "./mobile-menu";
import { UserMenu } from "./user-menu";

const navigationItems = [
  { href: "/features", label: "Features" },
  { href: "/solutions", label: "Solutions" },
  { href: "/for-teams", label: "For Teams" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export const MainHeader = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800">
      <div className="max-w-[1380px] mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt={`${siteConfig.name} Logo`}
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-xl text-white">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white text-sm font-medium hover:text-white/80 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <SignInDialog
                trigger={
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    Sign In
                  </button>
                }
              />
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <MobileMenu
              user={session?.user}
              navigationItems={navigationItems}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
