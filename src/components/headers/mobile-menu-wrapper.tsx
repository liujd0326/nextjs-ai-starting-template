"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, X } from "lucide-react";
import Image from "next/image";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";

import { MobileAuthSection } from "./mobile-auth-section";

interface MobileMenuWrapperProps {
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

export const MobileMenuWrapper = ({
  user,
  navigationItems,
}: MobileMenuWrapperProps) => {
  return (
    <Sheet>
      <SheetTrigger className="relative h-8 w-8 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors">
        <Menu className="h-5 w-5 text-gray-900" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full sm:w-80 p-0 bg-gray-900 border-gray-800"
      >
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
                  alt={`${siteConfig.name} Logo`}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-white font-bold text-lg">
                  {siteConfig.name}
                </span>
              </div>
              <SheetClose className="rounded-md p-2 hover:bg-gray-800 transition-colors">
                <X className="h-5 w-5 text-white" />
              </SheetClose>
            </div>
          </SheetHeader>

          <MobileAuthSection user={user} navigationItems={navigationItems} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
