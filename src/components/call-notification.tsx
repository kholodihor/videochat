"use client";

import React from "react";
import { MdCall, MdCallEnd } from "react-icons/md";

import { useSocket } from "@/context/SocketContext";

import Avatar from "./avatar";
import { Button } from "./ui/button";

function CallNotification() {
  const { ongoingCall, handleJoinCall, rejectCall } = useSocket();

  if (!ongoingCall?.isRinging)
    return;

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex min-h-[200px] w-[90%] max-w-[400px] flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar src={ongoingCall.participants.caller.profile.imageUrl} />
            <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white bg-green-500"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {ongoingCall.participants.caller.profile.firstName || ongoingCall.participants.caller.profile.fullName}
            </h3>
            <p className="text-sm text-gray-500">Incoming Video Call</p>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <Button
            onClick={() => handleJoinCall(ongoingCall)}
            className="flex size-14 items-center justify-center rounded-full bg-green-500 text-white transition-all hover:scale-105 hover:bg-green-600 active:scale-95"
          >
            <MdCall size={28} />
          </Button>
          <Button
            onClick={rejectCall}
            className="flex size-14 items-center justify-center rounded-full bg-rose-500 text-white transition-all hover:scale-105 hover:bg-rose-600 active:scale-95"
          >
            <MdCallEnd size={28} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CallNotification;
