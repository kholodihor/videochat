"use client";

import { useAuth } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import { Video } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../button";
import { Container } from "./Container";

export function Navbar() {
  const router = useRouter();
  const { userId } = useAuth();
  return (
    <div className="sticky top-0 z-50 border-b p-4">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex cursor-pointer items-center space-x-4" onClick={() => router.push("/")}>
            <Video />
            <div className="text-2xl font-bold">VideoChat</div>
          </div>

          <div className="flex items-center space-x-4">
            <UserButton />
            {!userId && (
              <>
                <Button size="sm" variant="outline" onClick={() => router.push("/sign-in")}>Sign In</Button>
                <Button size="sm" onClick={() => router.push("/sign-up")}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>

  );
}
