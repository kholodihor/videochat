"use client";

import CallNotification from "@/components/call-notification";
import Hero from "@/components/hero";
import OnlineUsersList from "@/components/online-users";
import VideoCall from "@/components/video-call";
import { useSocket } from "@/context/SocketContext";

export default function Home() {
  const { ongoingCall } = useSocket();

  return (
    <div className="container mx-auto flex min-h-screen flex-col gap-8">
      {ongoingCall
        ? (
            <div className="flex flex-1 items-center justify-center py-8">
              <VideoCall />
            </div>
          )
        : (
            <Hero />
          )}
      <div className="w-full pb-8">
        <OnlineUsersList />
      </div>
      <CallNotification />
    </div>
  );
}
