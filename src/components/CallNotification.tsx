"use client";

import React from "react";
import { MdCall, MdCallEnd } from "react-icons/md";

import { useSocket } from "@/context/SocketContext";

import Avatar from "./Avatar";
import { Button } from "./ui/button";

function CallNotification() {
  const { ongoingCall, handleJoinCall, rejectCall } = useSocket();

  if (!ongoingCall?.isRinging)
    return;

  return (
    <div className="absolute inset-0  flex h-screen w-screen items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex min-h-[150px] min-w-[400px] flex-col items-center justify-center rounded bg-white p-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar src={ongoingCall.participants.caller.profile.imageUrl} />
          <h3 className="text-sm">{ongoingCall.participants.caller.profile.firstName || ongoingCall.participants.caller.profile.fullName}</h3>
          <p>Incoming Call</p>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => handleJoinCall(ongoingCall)} className="flex h-10 w-20 items-center justify-center bg-green-500 text-white hover:bg-green-600">
            <MdCall size={24} />
          </Button>
          <Button onClick={rejectCall} className="flex h-10 w-20 items-center justify-center bg-rose-500 text-white hover:bg-rose-600">
            <MdCallEnd size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CallNotification;
