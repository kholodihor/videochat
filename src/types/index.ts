import type { User } from "@clerk/nextjs/server";
import type Peer from "simple-peer";

// Represents a user connected via socket
export interface SocketUser {
  userId: string;
  socketId: string;
  profile: User;
}

// Represents participants in a call
export interface Participants {
  caller: SocketUser;
  callee: SocketUser;
}

// Represents an ongoing call
export interface OngoingCall {
  participants: Participants;
  isRinging: boolean;
}

// Represents data associated with a peer connection
export interface PeerData {
  peerConnection: Peer.Instance;
  participantUser: SocketUser;
  stream?: MediaStream;
}

// Represents the context shape for the SocketContext
export interface SocketContextType {
  onlineUsers: SocketUser[];
  handleCall: (user: SocketUser) => void;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  handleJoinCall: (ongoingCall: OngoingCall) => void;
  endCall: () => void;
  rejectCall: () => void;
  peer: PeerData | null;
}
