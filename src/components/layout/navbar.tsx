"use client";

import { useAuth } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import { Video } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Container } from "./container";

export function Navbar() {
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="border-b border-gray-200/80">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Title */}
            <div
              className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-80"
              onClick={() => router.push("/")}
            >
              <div className="flex items-center justify-center rounded-xl bg-gradient-to-r from-red-800 to-indigo-800 p-2 text-white shadow-md">
                <Video className="size-5" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  VideoChat
                </span>
                <div className="hidden h-4 w-px bg-gray-300 sm:block" />
                <span className="hidden bg-gradient-to-r from-red-800 to-indigo-800 bg-clip-text text-sm font-medium text-transparent sm:block">
                  Connect with everyone in the world
                </span>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              {!userId
                ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/sign-in")}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        Sign In
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => router.push("/sign-up")}
                        className="bg-gradient-to-r from-red-800 to-indigo-800 text-white hover:from-red-700 hover:to-indigo-700"
                      >
                        Sign Up
                      </Button>
                    </>
                  )
                : (
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-px bg-gray-200" />
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "size-8 ring-2 ring-gray-200 ring-offset-2",
                          },
                        }}
                      />
                    </div>
                  )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
