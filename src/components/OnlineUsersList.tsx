"use client";

import { useUser } from "@clerk/nextjs";

import { useSocket } from "@/context/SocketContext";

import Avatar from "./Avatar";

function OnlineUsersList() {
  const { user } = useUser();
  const { onlineUsers, handleCall } = useSocket();

  console.log(onlineUsers);
  return (
    <div className="flex w-full items-center gap-4 rounded-md border-b bg-slate-200 px-2">
      {onlineUsers && onlineUsers.map((onlineUser) => {
        if (onlineUser.profile?.id === user?.id)
          return null;
        return (
          <div key={onlineUser.userId} onClick={() => handleCall(onlineUser)} className="flex h-full cursor-pointer items-center gap-2">
            <Avatar src={onlineUser.profile.imageUrl} />
            <div className="text-sm">
              {" "}
              {onlineUser.profile.fullName?.split(" ")?.[0]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OnlineUsersList;
