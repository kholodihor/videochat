'use client'

import { Container } from "./Container"
import { useRouter } from "next/navigation"
import { Video } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/clerk-react"
import { Button } from "../button"

export const Navbar = () => {
  const router = useRouter()
  const { userId } = useAuth();
  return (
    <div className="sticky top-0 z-50 border-b p-4">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => router.push("/")}>
            <Video />
            <div className="text-2xl font-bold">VideoChat</div>
          </div>

          <div className="flex items-center space-x-4">
            <UserButton />
            {!userId && <>
              <Button size='sm' variant='outline' onClick={() => router.push("/sign-in")}>Sign In</Button>
              <Button size='sm' onClick={() => router.push("/sign-up")}>Sign Up</Button>
            </>}
          </div>
        </div>
      </Container>
    </div>

  )
}