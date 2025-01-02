"use client";

import { useCallback, useEffect, useState } from "react";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

import { useSocket } from "@/context/SocketContext";

import { Button } from "./ui/button";
import VideoContainer from "./VideoContainer";

function VideoCall() {
  const { localStream, endCall } = useSocket();
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

  return (
    <div>
      <div className="relative mx-auto max-w-[800px]">
        {localStream && (
          <>
            <VideoContainer stream={localStream} isLocalStream={true} />
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button variant="ghost" onClick={toggleMicrophone}>{isMicOn ? <MdMicOff size={24} /> : <MdMic size={24} />}</Button>
              <Button onClick={endCall} className="bg-rose-500 px-4 text-white hover:bg-rose-600">End Call</Button>
              <Button variant="ghost" onClick={toggleCamera}>{isVideoOn ? <MdVideocamOff size={24} /> : <MdVideocam size={24} />}</Button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

export default VideoCall;
