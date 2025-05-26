'use client';

import { Logo } from "./Logo";
import { SignInButton, SignUpButton, SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <div className="w-full px-12 py-16 border-b border-[#F2F2F4]">
      <div className="bg-[#F4F4F5] px-4 py-3 rounded-full inline-flex gap-4 items-center justify-between w-full">
        <Logo />
        Nomadule Todo
        <div className="relative flex gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/sign-in"/>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
                Sign up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
