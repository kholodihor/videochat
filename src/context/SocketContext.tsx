"use client";

import { useUser } from "@clerk/nextjs";
import { createContext, useContext } from "react";

import type { OngoingCall, PeerData, SocketUser } from "@/types";

import { useSocketLogic } from "./hooks/useSocketLogic";

interface SocketContextType {
  onlineUsers: SocketUser[];
  handleCall: (user: SocketUser) => void;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  handleJoinCall: (ongoingCall: OngoingCall) => void;
  endCall: () => void;
  rejectCall: () => void;
  peer: PeerData | null;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export function SocketContextProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const socketLogic = useSocketLogic(user);

  return (
    <SocketContext.Provider value={socketLogic}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
}
