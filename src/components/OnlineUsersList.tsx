"use client";

import { useUser } from "@clerk/nextjs";

import { useSocket } from "@/context/SocketContext";

import Avatar from "./Avatar";

function OnlineUsersList() {
  const { user } = useUser();
  const { onlineUsers, handleCall } = useSocket();

  return (
    <div className="flex w-full flex-wrap items-center gap-4 rounded-lg border bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
      {onlineUsers && onlineUsers.map((onlineUser) => {
        if (onlineUser.profile?.id === user?.id)
          return null;
        return (
          <div
            key={onlineUser.userId}
            onClick={() => handleCall(onlineUser)}
            className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95"
          >
            <Avatar src={onlineUser.profile.imageUrl} />
            <div className="text-sm font-medium text-gray-700">
              {onlineUser.profile.fullName?.split(" ")?.[0]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OnlineUsersList;
