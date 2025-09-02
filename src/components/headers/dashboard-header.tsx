import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl">AI Template</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium hover:text-primary"
            >
              Profile
            </Link>
            <Link
              href="/settings"
              className="text-sm font-medium hover:text-primary"
            >
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Welcome back</span>
          <button className="text-sm font-medium hover:text-primary">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
