"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import {
  BarChart3,
  ChevronDown,
  FileText,
  Mail,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold text-white">SENS</span>
          <span className="text-xl font-bold text-blue-500">AI</span>
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Industry Insights
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Growth Tools
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border-white/20">
                <DropdownMenuItem asChild>
                  <Link
                    href="/resume"
                    className="text-white cursor-pointer focus:bg-white/10"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Resume Builder
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="text-white cursor-pointer focus:bg-white/10"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/interview"
                    className="text-white cursor-pointer focus:bg-white/10"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
