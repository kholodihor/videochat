"use client";

import { useUser } from "@clerk/nextjs";
import { Users } from "lucide-react";

import { useSocket } from "@/context/SocketContext";

import Avatar from "./avatar";

function OnlineUsersList() {
  const { user } = useUser();
  const { onlineUsers, handleCall } = useSocket();

  if (!onlineUsers?.length || onlineUsers.length === 1) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm">
        <Users className="size-5 text-gray-500" />
        <p className="text-sm text-gray-500">No users online</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-2">
        <Users className="size-5 text-gray-500" />
        <h3 className="font-medium text-gray-900">Online Users</h3>
        <span className="rounded-full bg-gradient-to-r from-red-800 to-indigo-800 px-2 py-0.5 text-xs font-medium text-white">
          {onlineUsers.length - 1}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onlineUsers.map((onlineUser) => {
          if (onlineUser.profile?.id === user?.id)
            return null;

          return (
            <button
              key={onlineUser.userId}
              onClick={() => handleCall(onlineUser)}
              className="group flex items-center gap-2 rounded-full bg-white px-1
              py-1.5 shadow-sm ring-1 ring-gray-200 transition-all
              hover:bg-gradient-to-r hover:from-red-800 hover:to-indigo-800
               hover:text-white hover:ring-0 active:scale-95"
            >
              <div className="relative">
                <Avatar src={onlineUser.profile.imageUrl} />
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-green-500" />
              </div>
              <span className="text-sm font-medium">
                {onlineUser.profile.fullName?.split(" ")?.[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OnlineUsersList;
