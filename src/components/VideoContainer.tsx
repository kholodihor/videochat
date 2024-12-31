import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface IVideoContainerProps {
  stream: MediaStream,
  isLocalStream?: boolean,
}

const VideoContainer = ({ stream, isLocalStream }: IVideoContainerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <video className={cn("relative rounded border w-[800px]")} ref={videoRef} autoPlay playsInline muted={isLocalStream} />
  )
}

export default VideoContainer
