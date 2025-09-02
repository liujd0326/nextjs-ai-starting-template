import Link from "next/link";

export function SimpleHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">AI Template</span>
        </Link>
      </div>
    </header>
  );
}
