'use client';

import { OngoingCall, PeerData, SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { SignalData } from 'simple-peer'
import { toast } from 'sonner';

interface SocketContextType {
  onlineUsers: SocketUser[];
  handleCall: (user: SocketUser) => void
  ongoingCall: OngoingCall | null
  localStream: MediaStream | null
  handleJoinCall: (ongoingCall: OngoingCall) => void
  endCall: () => void
  rejectCall: () => void
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser()
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[]>([]);
  const [ongoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<PeerData | null>(null)

  const currentSocketUser = onlineUsers.find((onlineUser) => onlineUser.userId === user?.id);

  const getMediaStream = useCallback(async (faceMode?: string) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevice = devices.filter((device) => device.kind === "videoinput");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          frameRate: { min: 16, ideal: 30, max: 30 },
          facingMode: videoDevice.length > 0 ? faceMode : undefined
        },
      });

      setLocalStream(stream)
      return stream
    } catch (error) {
      console.log('failed to get media stream', error)
      setLocalStream(null)
      return null
    }
  }, [])

  const createPeer = useCallback((stream: MediaStream, initiator: boolean) => {
    const iceServers: RTCIceServer[] = [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302'
        ],
      }
    ]
    const peer = new Peer({
      stream,
      initiator,
      trickle: false,
      config: {
        iceServers
      }
    })

    return peer
  }, []);

  const endCall = useCallback(() => {
    if (!socket || !ongoingCall) return;

    if (peer?.peerConnection) {
      peer.peerConnection.destroy();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Notify other participants that the call has ended
    socket.emit('call-ended', ongoingCall);
    toast.info('Call ended');

    setPeer(null);
    setLocalStream(null);
    setOngoingCall(null);
  }, [peer, localStream, socket, ongoingCall]);

  const rejectCall = useCallback(() => {
    if (!socket || !ongoingCall) return;

    // Notify the caller that the call was rejected
    socket.emit('call-rejected', ongoingCall);
    toast.info('Call rejected');
    setOngoingCall(null);
  }, [socket, ongoingCall]);

  const handleCall = useCallback(async (user: SocketUser) => {
    if (!currentSocketUser || !user || !socket) {
      console.error('Missing required data for call:', { currentSocketUser, user, socket: !!socket })
      return
    }

    const stream = await getMediaStream()
    if (!stream) {
      console.error('Failed to get media stream in handleCall')
      return
    }

    const participants = { caller: currentSocketUser, callee: user }
    setOngoingCall({ participants, isRinging: false })

    socket.emit("call-user", participants)

    const newPeer = createPeer(stream, true);
    setPeer({
      peerConnection: newPeer,
      participantUser: user,
      stream: undefined
    });

    newPeer.on('signal', (signal) => {
      socket.emit('webrtc:signal', {
        sdp: signal,
        ongoingCall: { participants },
        isCaller: true
      });
    });
  }, [socket, currentSocketUser, getMediaStream, createPeer])

  const handleJoinCall = useCallback(async (ongoingCall: OngoingCall) => {
    if (!socket || !currentSocketUser) {
      console.error('Missing required data for joining call:', { socket: !!socket, currentSocketUser })
      return
    }

    setOngoingCall((prev) => {
      if (prev) {
        return { ...prev, isRinging: false }
      }
      return prev
    })

    const stream = await getMediaStream()
    if (!stream) {
      console.error('Failed to get media stream in handleJoinCall')
      return
    }

    const newPeer = createPeer(stream, false);
    setPeer({
      peerConnection: newPeer,
      participantUser: ongoingCall.participants.caller,
      stream: undefined
    });

    newPeer.on('signal', (signal) => {
      socket.emit('webrtc:signal', {
        sdp: signal,
        ongoingCall,
        isCaller: false
      });
    });

  }, [socket, currentSocketUser, getMediaStream, createPeer]);

  const completePeerConnection = useCallback((data: { sdp: SignalData, ongoingCall: OngoingCall, isCaller: boolean }) => {
    if (!peer?.peerConnection) {
      console.error('No peer connection available');
      return;
    }

    peer.peerConnection.signal(data.sdp);
  }, [peer]);

  const onIncomingCall = useCallback((callData: OngoingCall) => {
    setOngoingCall(callData);
  }, [])

  useEffect(() => {
    if (!user?.id) return;

    const socket = io("https://videochat-d8hh.onrender.com", {
      query: {
        userId: user.id
      }
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [user?.id])

  useEffect(() => {
    if (!socket) return;

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onCallRejected() {
      if (ongoingCall?.participants.caller.userId === currentSocketUser?.userId) {
        setOngoingCall(null);
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }
        setLocalStream(null);
        toast.error('Call was rejected');
      }
    }

    function onCallEnded() {
      setOngoingCall(null);
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      setLocalStream(null);
      if (peer?.peerConnection) {
        peer.peerConnection.destroy();
      }
      setPeer(null);
      toast.info('Call was ended by the other participant');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('call-rejected', onCallRejected);
    socket.on('call-ended', onCallEnded);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('call-rejected', onCallRejected);
      socket.off('call-ended', onCallEnded);
    }
  }, [socket, currentSocketUser, localStream, peer, ongoingCall])

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("new-user-joined", user);
    socket.on("online-users", (users: SocketUser[]) => {
      setOnlineUsers(users);
    })

    return () => {
      socket.off("online-users", (res) => {
        setOnlineUsers(res)
      });
    }
  }, [socket, isConnected, user])

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("call-user", onIncomingCall)
    socket.on("join-call", (data: { callData: OngoingCall, user: SocketUser }) => {
      setOngoingCall(data.callData)
    })

    socket.on('webrtc:signal', completePeerConnection);

    return () => {
      socket.off("call-user", onIncomingCall)
      socket.off("join-call")
      socket.off('webrtc:signal')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, onIncomingCall, peer])

  return (
    <SocketContext.Provider value={{
      onlineUsers,
      handleCall,
      ongoingCall,
      localStream,
      handleJoinCall,
      endCall,
      rejectCall
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }
  return context;
}