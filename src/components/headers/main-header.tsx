import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { siteConfig } from "@/config/site";
import { auth } from "@/lib/auth";

import { MobileMenuWrapper } from "./mobile-menu-wrapper";
import { UserMenu } from "./user-menu";

const navigationItems = [
  { href: "/create", label: "Create" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const MainHeader = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1380px] mx-auto px-4 flex h-[74px] items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt={`${siteConfig.name} Logo`}
              width={38}
              height={38}
            />
            <span className="font-semibold text-xl text-gray-900">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-black text-base font-semibold hover:bg-teal-50 hover:text-black transition-all duration-200 px-3 py-2 rounded-md"
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
                  <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-600/30 hover:scale-[1.02]">
                    Sign In
                  </button>
                }
              />
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <MobileMenuWrapper
              user={session?.user}
              navigationItems={navigationItems}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
