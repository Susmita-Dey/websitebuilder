"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
// import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-white/70 dark:bg-gray-900/70">
      <div className="container px-16 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-indigo-600">
          AI SiteGen
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
          >
            New Website
          </Link>
          {/* <ModeToggle /> */}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          {/* <ModeToggle /> */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-indigo-600"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/"
                  className="text-xl font-bold text-indigo-600"
                  onClick={() => setOpen(false)}
                >
                  AI SiteGen
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  New Website
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
