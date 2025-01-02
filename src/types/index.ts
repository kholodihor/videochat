import type { User } from "@clerk/nextjs/server";
import type Peer from "simple-peer";

export interface SocketUser {
  userId: string;
  socketId: string;
  profile: User;
}

export interface OngoingCall {
  participants: Participants;
  isRinging: boolean;
}

export interface Participants {
  caller: SocketUser;
  callee: SocketUser;
}

export interface PeerData {
  peerConnection: Peer.Instance;
  stream: MediaStream | undefined;
  participantUser: SocketUser;
}
