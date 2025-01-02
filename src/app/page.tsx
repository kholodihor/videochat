import CallNotification from "@/components/CallNotification";
import OnlineUsersList from "@/components/OnlineUsersList";
import VideoCall from "@/components/VideoCall";

export default function Home() {
  return (
    <div className="grid min-h-screen
    grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20
    font-[family-name:var(--font-geist-sans)]"
    >
      <OnlineUsersList />
      <CallNotification />
      <VideoCall />
    </div>
  );
}
