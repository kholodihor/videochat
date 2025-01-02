"use client";

import { SocketContextProvider } from "@/context/SocketContext";

function SocketProvider({ children }: { children: React.ReactNode }) {
  return <SocketContextProvider>{children}</SocketContextProvider>;
}

export default SocketProvider;
