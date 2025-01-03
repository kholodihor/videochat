"use client";

import { useCallback, useEffect, useState } from "react";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

import { useSocket } from "@/context/SocketContext";

import { Button } from "./ui/button";
import VideoContainer from "./video-container";

function VideoCall() {
  const { localStream, endCall, ongoingCall } = useSocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      setIsMicOn(audioTrack.enabled);
      const videoTrack = localStream.getVideoTracks()[0];
      setIsVideoOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleCamera = useCallback(
    () => {
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    },
    [localStream],
  );

  const toggleMicrophone = useCallback(
    () => {
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    },
    [localStream],
  );

  if (!ongoingCall || !localStream)
    return null;

  return (
    <div>
      <div className="w-full max-w-5xl px-4">
        <div className="relative mx-auto">
          <VideoContainer stream={localStream} isLocalStream={true} />
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={toggleMicrophone}
              className="size-12 rounded-full border-2 transition-all hover:scale-105 active:scale-95"
            >
              {isMicOn ? <MdMicOff size={24} className="text-rose-500" /> : <MdMic size={24} className="text-green-500" />}
            </Button>
            <Button
              onClick={endCall}
              className="h-12 w-32 rounded-full bg-rose-500 font-medium text-white transition-all hover:scale-105 hover:bg-rose-600 active:scale-95"
            >
              End Call
            </Button>
            <Button
              variant="outline"
              onClick={toggleCamera}
              className="size-12 rounded-full border-2 transition-all hover:scale-105 active:scale-95"
            >
              {isVideoOn ? <MdVideocamOff size={24} className="text-rose-500" /> : <MdVideocam size={24} className="text-green-500" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
