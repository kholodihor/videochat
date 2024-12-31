'use client'

import { useSocket } from "@/context/SocketContext";
import VideoContainer from "./VideoContainer";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

const VideoCall = () => {
  const { localStream, endCall } = useSocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true)

  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      setIsMicOn(audioTrack.enabled)
      const videoTrack = localStream.getVideoTracks()[0]
      setIsVideoOn(videoTrack.enabled)
    }
  }, [localStream])

  const toggleCamera = useCallback(
    () => {
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0]
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOn(videoTrack.enabled)
      }
    },
    [localStream],
  )

  const toggleMicrophone = useCallback(
    () => {
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0]
        audioTrack.enabled = !audioTrack.enabled
        setIsMicOn(audioTrack.enabled)
      }
    },
    [localStream],
  )

  return (
    <>
      {localStream &&
        <>
          <VideoContainer stream={localStream} isLocalStream={true} isOnCall={true} />
          <div className="flex gap-4 items-center justify-center mt-8">
            <Button variant={'ghost'} onClick={toggleMicrophone}>{isMicOn ? <MdMicOff size={24} /> : <MdMic size={24} />}</Button>
            <Button onClick={endCall} className="px-4 bg-rose-500 text-white hover:bg-rose-600">End Call</Button>
            <Button variant={'ghost'} onClick={toggleCamera}>{isVideoOn ? <MdVideocamOff size={24} /> : <MdVideocam size={24} />}</Button>
          </div>
        </>
      }
    </>
  )
}

export default VideoCall
