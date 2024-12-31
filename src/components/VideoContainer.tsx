import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface IVideoContainerProps {
  stream: MediaStream,
  isLocalStream?: boolean,
  isOnCall?: boolean
}

const VideoContainer = ({ stream, isLocalStream, isOnCall }: IVideoContainerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  console.log(isLocalStream, isOnCall)
  return (
    <video className={cn("relative rounded border w-[800px]", isLocalStream && isOnCall && "w-[200px] h-auto absolute border-2 border-white")} ref={videoRef} autoPlay playsInline muted={isLocalStream} />
  )
}

export default VideoContainer
