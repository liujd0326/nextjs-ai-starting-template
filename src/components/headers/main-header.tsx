import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { UserMenu } from "./user-menu";

export const MainHeader = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">AI Template</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Link 
              href="/sign-in" 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};